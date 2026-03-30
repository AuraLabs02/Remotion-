import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {theme} from '../theme';

export const Scene6Outro: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn  = interpolate(f, [0,28],    [0,1], {extrapolateRight:'clamp'});
  // No final fade — stay full until very end
  const titleIn  = spring({frame:f-10, fps, config:{damping:22,stiffness:65}});
  const sub1In   = spring({frame:f-38, fps, config:{damping:22,stiffness:80}});
  const sub2In   = spring({frame:f-56, fps, config:{damping:22,stiffness:80}});
  const sub3In   = spring({frame:f-74, fps, config:{damping:22,stiffness:80}});
  const sub4In   = spring({frame:f-92, fps, config:{damping:22,stiffness:80}});
  const ctaIn    = spring({frame:f-116, fps, config:{damping:22,stiffness:80}});
  const brandIn  = interpolate(f, [140,170], [0,1], {extrapolateRight:'clamp'});

  const bgRotate = f*0.07;
  const pulse    = Math.sin(f*0.06)*0.5+0.5;

  const summaryItems = [
    {icon:'🔗', title:'APIs are Contracts',  desc:'Defined rules for how software systems talk to each other',      color:theme.accent.blue,   si:sub1In},
    {icon:'📡', title:'Request & Response',  desc:'Client sends a request; server processes and replies with data',  color:theme.accent.purple, si:sub2In},
    {icon:'🌐', title:'Multiple Protocols',  desc:'REST, GraphQL, WebSocket & gRPC — each for different use cases',  color:theme.accent.green,  si:sub3In},
    {icon:'⚡', title:'Powers Everything',   desc:'Weather, payments, maps, AI — all powered by APIs every day',     color:theme.accent.orange, si:sub4In},
  ];

  // Animated counter that counts up in the sustained period
  const callsCount = Math.floor(interpolate(f, [140, 260], [0, 4500000000], {extrapolateRight:'clamp'}));
  const formatBig  = (n:number) => n >= 1e9 ? `${(n/1e9).toFixed(1)}B` : n >= 1e6 ? `${(n/1e6).toFixed(0)}M` : `${n.toLocaleString()}`;

  // Pulse rings animation
  const ringScale = 0.8 + 0.2*Math.sin(f*0.04);

  return (
    <g opacity={sceneIn}>
      <defs>
        <radialGradient id="s6-bg" cx="50%" cy="45%" r="65%">
          <stop offset="0%"   stopColor="#EEF4FF"/>
          <stop offset="100%" stopColor="#FFFFFF"/>
        </radialGradient>
        <radialGradient id="s6-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={theme.accent.blue} stopOpacity={0.05+0.02*pulse}/>
          <stop offset="100%" stopColor={theme.accent.blue} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="s6-title-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={theme.accent.blue}/>
          <stop offset="100%" stopColor={theme.accent.purple}/>
        </linearGradient>
        <linearGradient id="s6-bar-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={theme.accent.blue}/>
          <stop offset="50%"  stopColor={theme.accent.purple}/>
          <stop offset="100%" stopColor={theme.accent.green}/>
        </linearGradient>
        <pattern id="s6-dots" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="24" r="1.3" fill={theme.accent.blue} opacity="0.07"/>
        </pattern>
      </defs>

      <rect width={1920} height={1080} fill="url(#s6-bg)"/>
      <rect width={1920} height={1080} fill="url(#s6-dots)"/>
      <ellipse cx={960} cy={360} rx={960} ry={480} fill="url(#s6-glow)"/>

      {/* Subtle rotating rings */}
      <g transform={`translate(960,320) rotate(${bgRotate})`} opacity={0.045}>
        {[200,310,420,530].map((r,i)=>(
          <circle key={i} cx={0} cy={0} r={r*ringScale} fill="none"
            stroke={i%2===0?theme.accent.blue:theme.accent.purple}
            strokeWidth={1.5} strokeDasharray={`${14+i*4} ${10+i*3}`}/>
        ))}
      </g>

      {/* ── Hero title: tight two-line stack ── */}
      <g transform={`translate(960,285) scale(${titleIn})`} opacity={titleIn}>
        {/* "NOW YOU" line */}
        <text x={0} y={-35} textAnchor="middle" dominantBaseline="middle"
          fontSize={96} fontFamily="system-ui,-apple-system,sans-serif" fontWeight="900"
          fill={theme.text.primary} letterSpacing={-2}>
          NOW YOU
        </text>
        {/* "KNOW" gradient */}
        <text x={0} y={78} textAnchor="middle" dominantBaseline="middle"
          fontSize={136} fontFamily="system-ui,-apple-system,sans-serif" fontWeight="900"
          fill="url(#s6-title-grad)" letterSpacing={-5}>
          KNOW
        </text>
      </g>

      {/* Subtitle + underline */}
      {f>20 && (
        <g opacity={interpolate(f,[20,44],[0,1],{extrapolateRight:'clamp'})}>
          <text x={960} y={454} textAnchor="middle"
            fontSize={22} fontFamily="system-ui,sans-serif" fontWeight="500"
            fill={theme.text.secondary} letterSpacing={5}>
            HOW APIs WORK — VISUALLY EXPLAINED
          </text>
          <rect
            x={960-interpolate(f,[25,52],[0,270],{extrapolateRight:'clamp'})}
            y={474}
            width={interpolate(f,[25,52],[0,540],{extrapolateRight:'clamp'})}
            height={3} rx={2}
            fill="url(#s6-bar-grad)"/>
        </g>
      )}

      {/* ── Summary cards – wider (1200px) ── */}
      {summaryItems.map((item,i)=>{
        const cw=1200, ch=72;
        const cx=(1920-cw)/2;
        const cy=498+i*(ch+14);
        return (
          <g key={i} opacity={item.si} transform={`translate(0,${(1-item.si)*22})`}>
            {/* Card shadow */}
            <rect x={cx+2} y={cy+4} width={cw} height={ch} rx={14}
              fill={item.color} opacity={0.05}/>
            {/* Card */}
            <rect x={cx} y={cy} width={cw} height={ch} rx={14}
              fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}/>
            {/* Left colour bar */}
            <rect x={cx} y={cy} width={5} height={ch} rx={3} fill={item.color}/>
            {/* Icon */}
            <circle cx={cx+52} cy={cy+ch/2} r={24} fill={item.color} opacity={0.09}/>
            <text x={cx+52} y={cy+ch/2} textAnchor="middle" dominantBaseline="middle"
              fontSize={28}>{item.icon}</text>
            {/* Text */}
            <text x={cx+92} y={cy+26} fontSize={19}
              fontFamily="system-ui,sans-serif" fontWeight="700" fill={theme.text.primary}>
              {item.title}
            </text>
            <text x={cx+92} y={cy+51} fontSize={14}
              fontFamily="system-ui,sans-serif" fill={theme.text.muted}>
              {item.desc}
            </text>
            {/* Check */}
            <circle cx={cx+cw-38} cy={cy+ch/2} r={15}
              fill={item.color} opacity={0.12}/>
            <text x={cx+cw-38} y={cy+ch/2} textAnchor="middle" dominantBaseline="middle"
              fontSize={16} fill={item.color} fontWeight="800">✓</text>
          </g>
        );
      })}

      {/* ── CTA card ── */}
      <g opacity={ctaIn} transform={`translate(0,${(1-ctaIn)*18})`}>
        <rect x={360} y={808} width={1200} height={90} rx={20}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={2}
          style={{filter:'drop-shadow(0 4px 24px rgba(29,111,232,0.12))'}}/>
        <rect x={360} y={808} width={5} height={90} rx={3} fill="url(#s6-bar-grad)"/>
        <text x={960} y={843} textAnchor="middle"
          fontSize={20} fontFamily="system-ui,sans-serif" fontWeight="700"
          fill={theme.text.primary}>
          Build something great with APIs
        </text>
        <text x={960} y={874} textAnchor="middle"
          fontSize={15} fontFamily="system-ui,sans-serif" fill={theme.text.muted}>
          Start with REST · Explore GraphQL · Go real-time with WebSockets · Scale with gRPC
        </text>
      </g>

      {/* ── Live API calls counter (animated) ── */}
      {f>138 && (
        <g opacity={interpolate(f,[138,165],[0,1],{extrapolateRight:'clamp'})}>
          <rect x={360} y={912} width={560} height={68} rx={14}
            fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
            style={{filter:'drop-shadow(0 2px 10px rgba(0,0,0,0.06))'}}/>
          <circle cx={395} cy={946} r={8} fill={theme.accent.green}
            opacity={0.7+0.3*Math.sin(f*0.15)}/>
          <text x={414} y={946} dominantBaseline="middle"
            fontSize={14} fontFamily="system-ui" fontWeight="600" fill={theme.text.secondary}>
            API calls made today:
          </text>
          <text x={640} y={946} textAnchor="middle" dominantBaseline="middle"
            fontSize={24} fontFamily="system-ui" fontWeight="900" fill={theme.accent.blue}>
            {formatBig(callsCount)}
          </text>

          {/* Pulse rate bars */}
          <rect x={1000} y={912} width={520} height={68} rx={14}
            fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
            style={{filter:'drop-shadow(0 2px 10px rgba(0,0,0,0.06))'}}/>
          {Array.from({length:18}).map((_,bi)=>{
            const bh = 12+Math.sin(f*0.14+bi*0.55)*16;
            return (
              <rect key={bi}
                x={1020+bi*24} y={946-bh/2}
                width={16} height={bh} rx={4}
                fill={theme.accent.blue}
                opacity={0.25+0.35*((bi%3===0)?1:0.5)}/>
            );
          })}
          <text x={1260} y={976} textAnchor="middle"
            fontSize={11} fontFamily="system-ui" fill={theme.text.muted} letterSpacing={2}>
            LIVE PULSE
          </text>
        </g>
      )}

      {/* Brand footer */}
      <g opacity={brandIn}>
        <line x1={760} y1={1008} x2={1160} y2={1008}
          stroke={theme.border.light} strokeWidth={1}/>
        <text x={960} y={1038} textAnchor="middle"
          fontSize={13} fontFamily="system-ui,sans-serif" fontWeight="500"
          fill={theme.text.muted} letterSpacing={3}>
          MOTION GRAPHICS · BUILT WITH REMOTION · 1920×1080 · 30FPS
        </text>
      </g>

      {/* Floating corner accents */}
      {[
        {x:110,  y:175,  color:theme.accent.blue,   delay:48},
        {x:1810, y:185,  color:theme.accent.purple,  delay:58},
        {x:100,  y:912,  color:theme.accent.green,   delay:68},
        {x:1820, y:905,  color:theme.accent.orange,  delay:78},
      ].map((dot,i)=>{
        const di = spring({frame:f-dot.delay, fps, config:{damping:18,stiffness:90}});
        const fy = Math.sin(f*0.04+i)*12;
        return (
          <g key={i} opacity={di*0.45} transform={`translate(0,${fy})`}>
            <circle cx={dot.x} cy={dot.y} r={30} fill={dot.color} opacity={0.10}/>
            <circle cx={dot.x} cy={dot.y} r={18} fill={dot.color} opacity={0.18}/>
            <circle cx={dot.x} cy={dot.y} r={6}  fill={dot.color} opacity={0.65}/>
          </g>
        );
      })}
    </g>
  );
};
