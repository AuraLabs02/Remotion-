import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {theme} from '../theme';

export const Scene1Intro: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneOut = interpolate(f, [130, 160], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const titleIn   = spring({frame: f - 8,  fps, config: {damping: 22, stiffness: 60}});
  const subIn     = spring({frame: f - 48, fps, config: {damping: 22, stiffness: 80}});
  const badgeIn   = spring({frame: f - 72, fps, config: {damping: 22, stiffness: 80}});
  const tagIn     = spring({frame: f - 92, fps, config: {damping: 22, stiffness: 80}});
  const pillsIn   = interpolate(f, [90, 120], [0, 1], {extrapolateRight: 'clamp'});
  const nodesIn   = interpolate(f, [30, 65], [0, 1], {extrapolateRight: 'clamp'});
  const linesIn   = interpolate(f, [70, 100], [0, 1], {extrapolateRight: 'clamp'});

  const pulse     = Math.sin(f * 0.06) * 0.5 + 0.5;
  const bgRotate  = f * 0.15;
  const bgRotate2 = -f * 0.10;

  // Corner node data
  const nodeData = [
    {cx: 160, cy: 195,  r: 50, color: theme.accent.blue,   label: 'CLIENT', delay: 30},
    {cx: 1760, cy: 195, r: 50, color: theme.accent.purple, label: 'SERVER', delay: 45},
    {cx: 160, cy: 885,  r: 50, color: theme.accent.green,  label: 'DB',     delay: 55},
    {cx: 1760, cy: 885, r: 50, color: theme.accent.orange, label: 'API',    delay: 65},
  ];

  // HTTP method pills at bottom
  const pills = [
    {x: 200,  text: 'GET',    sub: 'Retrieve data',    color: theme.accent.blue},
    {x: 510,  text: 'POST',   sub: 'Create resource',  color: theme.accent.green},
    {x: 820,  text: 'PUT',    sub: 'Update resource',  color: theme.accent.amber},
    {x: 1130, text: 'DELETE', sub: 'Remove resource',  color: theme.accent.red},
    {x: 1440, text: 'PATCH',  sub: 'Partial update',   color: theme.accent.purple},
    {x: 1690, text: '←200',   sub: 'Success response', color: theme.accent.cyan},
  ];

  return (
    <g opacity={sceneOut}>
      <defs>
        {/* Clean white-blue gradient bg */}
        <radialGradient id="s1-hero-bg" cx="50%" cy="45%" r="55%">
          <stop offset="0%"   stopColor="#EEF4FF" stopOpacity="1"/>
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1"/>
        </radialGradient>
        {/* Soft corner glows – no blob */}
        <radialGradient id="s1-glow-tl" cx="0%"   cy="0%"   r="55%">
          <stop offset="0%"   stopColor={theme.accent.blue}   stopOpacity="0.07"/>
          <stop offset="100%" stopColor={theme.accent.blue}   stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="s1-glow-br" cx="100%" cy="100%" r="55%">
          <stop offset="0%"   stopColor={theme.accent.purple} stopOpacity="0.06"/>
          <stop offset="100%" stopColor={theme.accent.purple} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="s1-title-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={theme.accent.blue}/>
          <stop offset="100%" stopColor={theme.accent.purple}/>
        </linearGradient>
        <linearGradient id="s1-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={theme.accent.blue}   stopOpacity="0"/>
          <stop offset="25%"  stopColor={theme.accent.blue}   stopOpacity="1"/>
          <stop offset="75%"  stopColor={theme.accent.purple} stopOpacity="1"/>
          <stop offset="100%" stopColor={theme.accent.purple} stopOpacity="0"/>
        </linearGradient>
        <pattern id="s1-dotgrid" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="24" r="1.4" fill={theme.accent.blue} opacity="0.09"/>
        </pattern>
        <filter id="s1-soft">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
      </defs>

      {/* BG */}
      <rect width={1920} height={1080} fill="url(#s1-hero-bg)"/>
      <rect width={1920} height={1080} fill="url(#s1-glow-tl)"/>
      <rect width={1920} height={1080} fill="url(#s1-glow-br)"/>
      <rect width={1920} height={1080} fill="url(#s1-dotgrid)"/>

      {/* Rotating dashed rings – centered on canvas, subtle */}
      <g transform={`translate(960,540) rotate(${bgRotate})`} opacity={0.055}>
        {[280,420,560,700].map((r,i)=>(
          <circle key={i} cx={0} cy={0} r={r} fill="none"
            stroke={i%2===0?theme.accent.blue:theme.accent.purple}
            strokeWidth={1.5} strokeDasharray={`${16+i*6} ${12+i*4}`}/>
        ))}
      </g>
      <g transform={`translate(960,540) rotate(${bgRotate2})`} opacity={0.03}>
        {[350,490,630].map((r,i)=>(
          <circle key={i} cx={0} cy={0} r={r} fill="none"
            stroke={theme.accent.purple} strokeWidth={1} strokeDasharray="8 20"/>
        ))}
      </g>

      {/* Corner nodes */}
      {nodeData.map((nd,i)=>{
        const ni = spring({frame: f - nd.delay, fps, config:{damping:18,stiffness:90}});
        const floatY = Math.sin(f*0.04+i*1.2)*8;
        return (
          <g key={i} opacity={ni} transform={`translate(0,${floatY})`}>
            <circle cx={nd.cx} cy={nd.cy} r={nd.r+18} fill={nd.color} opacity={0.07}/>
            <circle cx={nd.cx} cy={nd.cy} r={nd.r}
              fill="#FFFFFF" stroke={nd.color} strokeWidth={2.5}
              style={{filter:'drop-shadow(0 4px 14px rgba(0,0,0,0.10))'}}/>
            <text x={nd.cx} y={nd.cy} textAnchor="middle" dominantBaseline="middle"
              fontSize={13} fontFamily="system-ui,sans-serif" fontWeight="800"
              fill={nd.color} letterSpacing={1.5}>{nd.label}</text>
          </g>
        );
      })}

      {/* Connecting lines corner→center */}
      <g opacity={linesIn * 0.22}>
        {[[160,195],[1760,195],[160,885],[1760,885]].map(([x,y],i)=>(
          <line key={i} x1={x} y1={y} x2={960} y2={540}
            stroke={i%2===0?theme.accent.blue:theme.accent.purple}
            strokeWidth={1} strokeDasharray="5 10"/>
        ))}
      </g>

      {/* ── HERO TITLE – centered at y=510 ── */}
      <g transform={`translate(960,510) scale(${titleIn})`} opacity={titleIn}>
        {/* "HOW" eyebrow */}
        <text x={0} y={-130} textAnchor="middle" dominantBaseline="middle"
          fontSize={36} fontFamily="system-ui,sans-serif" fontWeight="700"
          fill={theme.text.muted} letterSpacing={12}>
          H O W
        </text>
        {/* Giant "API" */}
        <text x={0} y={-32} textAnchor="middle" dominantBaseline="middle"
          fontSize={170} fontFamily="system-ui,-apple-system,sans-serif" fontWeight="900"
          fill="url(#s1-title-grad)" letterSpacing={-6}>
          API
        </text>
        {/* "WORKS" */}
        <text x={0} y={98} textAnchor="middle" dominantBaseline="middle"
          fontSize={70} fontFamily="system-ui,sans-serif" fontWeight="800"
          fill={theme.text.primary} letterSpacing={22}>
          WORKS
        </text>
      </g>

      {/* Animated underline */}
      {f > 20 && (
        <rect
          x={960 - interpolate(f,[20,50],[0,320],{extrapolateRight:'clamp'})}
          y={640}
          width={interpolate(f,[20,50],[0,640],{extrapolateRight:'clamp'})}
          height={4} rx={2}
          fill="url(#s1-line-grad)"/>
      )}

      {/* Subtitle */}
      <g opacity={subIn} transform={`translate(0,${(1-subIn)*28})`}>
        <text x={960} y={692} textAnchor="middle"
          fontSize={26} fontFamily="system-ui,sans-serif" fontWeight="400"
          fill={theme.text.secondary} letterSpacing={3}>
          Application Programming Interface — Explained Visually
        </text>
      </g>

      {/* Badge */}
      <g opacity={badgeIn} transform={`translate(0,${(1-badgeIn)*18})`}>
        <rect x={810} y={738} width={300} height={42} rx={21}
          fill={theme.accent.blue} opacity={0.09}/>
        <rect x={810} y={738} width={300} height={42} rx={21}
          fill="none" stroke={theme.accent.blue} strokeWidth={1.5} opacity={0.35}/>
        <circle cx={840} cy={759} r={6} fill={theme.accent.green} opacity={0.9}/>
        <text x={960} y={759} textAnchor="middle" dominantBaseline="middle"
          fontSize={14} fontFamily="system-ui,sans-serif" fontWeight="700"
          fill={theme.accent.blue} letterSpacing={3}>
          PROFESSIONAL MOTION GUIDE
        </text>
      </g>

      {/* Tagline */}
      <g opacity={tagIn} transform={`translate(0,${(1-tagIn)*14})`}>
        <text x={960} y={826} textAnchor="middle"
          fontSize={17} fontFamily="system-ui,sans-serif" fontWeight="400"
          fill={theme.text.muted} letterSpacing={2}>
          60 Seconds · 6 Scenes · Industry-Level
        </text>
      </g>

      {/* ── HTTP Method pills row ── */}
      <g opacity={pillsIn}>
        {pills.map((p,i)=>{
          const pw = 220;
          const floatY = Math.sin(f*0.05+i*0.8)*6;
          return (
            <g key={i} transform={`translate(0,${floatY})`}>
              <rect x={p.x} y={900} width={pw} height={62} rx={14}
                fill="#FFFFFF" stroke={p.color} strokeWidth={1.5}
                style={{filter:'drop-shadow(0 2px 10px rgba(0,0,0,0.07))'}}/>
              <rect x={p.x} y={900} width={pw} height={5} rx={3} fill={p.color}/>
              <text x={p.x+pw/2} y={924} textAnchor="middle"
                fontSize={16} fontFamily="system-ui,sans-serif" fontWeight="800"
                fill={p.color} letterSpacing={2}>{p.text}</text>
              <text x={p.x+pw/2} y={946} textAnchor="middle"
                fontSize={12} fontFamily="system-ui,sans-serif" fill={theme.text.muted}>{p.sub}</text>
            </g>
          );
        })}
      </g>

      {/* Floating code chip decorations */}
      {[
        {x:310,  y:490, text:'GET /api/data',           color:theme.accent.blue,   delay:88},
        {x:1610, y:468, text:'200 OK',                   color:theme.accent.green,  delay:95},
        {x:270,  y:600, text:'Authorization: Bearer...', color:theme.accent.purple, delay:102},
        {x:1590, y:595, text:'{"status":"success"}',     color:theme.accent.orange, delay:109},
      ].map((chip,i)=>{
        const ci = spring({frame:f-chip.delay, fps, config:{damping:20,stiffness:100}});
        const tw = chip.text.length*7.2+28;
        const fy = Math.sin(f*0.05+i*1.4)*7;
        return (
          <g key={i} opacity={ci*0.82} transform={`translate(${chip.x-tw/2},${chip.y+fy})`}>
            <rect x={0} y={-13} width={tw} height={26} rx={13}
              fill="#FFFFFF" stroke={chip.color} strokeWidth={1.5}
              style={{filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.08))'}}/>
            <text x={tw/2} y={1} textAnchor="middle" dominantBaseline="middle"
              fontSize={11} fontFamily="'SF Mono','Fira Code',monospace" fontWeight="500"
              fill={chip.color}>{chip.text}</text>
          </g>
        );
      })}
    </g>
  );
};
