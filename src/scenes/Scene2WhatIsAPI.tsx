import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {theme} from '../theme';

export const Scene2WhatIsAPI: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn  = interpolate(f, [0,20],    [0,1], {extrapolateRight:'clamp'});
  const sceneOut = interpolate(f, [240,268],  [1,0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const opacity  = Math.min(sceneIn, sceneOut);

  const titleIn  = spring({frame:f-5,  fps, config:{damping:22,stiffness:80}});
  const clientIn = spring({frame:f-22, fps, config:{damping:18,stiffness:80}});
  const apiIn    = spring({frame:f-48, fps, config:{damping:18,stiffness:80}});
  const serverIn = spring({frame:f-72, fps, config:{damping:18,stiffness:80}});

  // Arrow draw progress
  const a1P = interpolate(f, [88, 125],  [0,1], {extrapolateRight:'clamp'});
  const a2P = interpolate(f, [125,160],  [0,1], {extrapolateRight:'clamp'});
  const a3P = interpolate(f, [160,195],  [0,1], {extrapolateRight:'clamp'});
  const a4P = interpolate(f, [195,230],  [0,1], {extrapolateRight:'clamp'});

  const bubblesIn = interpolate(f, [155,185], [0,1], {extrapolateRight:'clamp'});
  const defIn     = interpolate(f, [192,222], [0,1], {extrapolateRight:'clamp'});

  // Node layout – larger cards, better vertical position
  const cw = 270, ch = 195;
  const cy  = 540;  // pushed down from 500
  const clientX = 265, apiX = 960, serverX = 1655;

  // Float – used for visual only, NOT for arrow y calcs (fix double-float issue)
  const floatA = Math.sin(f*0.045+0) * 8;
  const floatB = Math.sin(f*0.045+1) * 8;
  const floatC = Math.sin(f*0.045+2) * 8;

  // Arrow track y – static, no float
  const reqY  = cy - 28;
  const resY  = cy + 28;

  const NodeCard = ({
    cx, scale, color, icon, label, sub, floatOffset,
  }: {
    cx:number; scale:number; color:string;
    icon:string; label:string; sub:string; floatOffset:number;
  }) => (
    <g opacity={scale} transform={`translate(${cx-cw/2},${cy-ch/2+floatOffset})`}>
      {/* Shadow */}
      <rect x={3} y={7} width={cw} height={ch} rx={18} fill={color} opacity={0.10}/>
      {/* Card */}
      <rect x={0} y={0} width={cw} height={ch} rx={18}
        fill="#FFFFFF" stroke={color} strokeWidth={2}/>
      {/* Top strip */}
      <rect x={0} y={0} width={cw} height={5} rx={3} fill={color}/>
      {/* Icon bg */}
      <circle cx={cw/2} cy={72} r={34} fill={color} opacity={0.08}/>
      <circle cx={cw/2} cy={72} r={24} fill={color} opacity={0.12}/>
      <text x={cw/2} y={72} textAnchor="middle" dominantBaseline="middle" fontSize={32}>{icon}</text>
      {/* Label */}
      <text x={cw/2} y={120} textAnchor="middle"
        fontSize={17} fontFamily="system-ui,sans-serif" fontWeight="800"
        fill={color} letterSpacing={2}>{label}</text>
      <text x={cw/2} y={146} textAnchor="middle"
        fontSize={13} fontFamily="system-ui,sans-serif" fill={theme.text.muted}>{sub}</text>
      {/* Pulse dot */}
      <circle cx={cw-22} cy={22} r={6} fill={color} opacity={0.5+0.3*Math.sin(f*0.08)}/>
    </g>
  );

  const Arrow = ({
    x1,x2,y,progress,color,label,above,
  }:{x1:number;x2:number;y:number;progress:number;color:string;label:string;above:boolean}) => {
    if (progress<=0) return null;
    const ex = x1+(x2-x1)*Math.min(progress,1);
    const midX = (x1+x2)/2;
    const labelY = above ? y-30 : y+24;
    return (
      <g>
        {/* Track */}
        <line x1={x1} y1={y} x2={x2} y2={y}
          stroke={theme.border.light} strokeWidth={2}/>
        {/* Live line */}
        <line x1={x1} y1={y} x2={ex} y2={y}
          stroke={color} strokeWidth={2.5} strokeLinecap="round"/>
        {/* Moving dot halo */}
        <circle cx={ex} cy={y} r={14} fill={color} opacity={0.12}/>
        <circle cx={ex} cy={y} r={6}  fill={color}/>
        {/* Arrowhead */}
        {progress>=1 && (
          <polygon
            points={`${x2+11},${y} ${x2-5},${y-7} ${x2-5},${y+7}`}
            fill={color}/>
        )}
        {/* Label pill */}
        {progress>=0.5 && (
          <g opacity={interpolate(progress,[0.5,1],[0,1])}>
            <rect x={midX-62} y={labelY-13} width={124} height={26} rx={13}
              fill={color} opacity={0.10}/>
            <text x={midX} y={labelY} textAnchor="middle" dominantBaseline="middle"
              fontSize={12} fontFamily="'SF Mono',monospace" fontWeight="700"
              fill={color}>{label}</text>
          </g>
        )}
      </g>
    );
  };

  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id="s2-bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor="#F0F5FF"/>
          <stop offset="100%" stopColor="#FFFFFF"/>
        </radialGradient>
        <pattern id="s2-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke={theme.border.light} strokeWidth="0.8"/>
        </pattern>
      </defs>

      <rect width={1920} height={1080} fill="url(#s2-bg)"/>
      <rect width={1920} height={1080} fill="url(#s2-grid)" opacity={0.55}/>

      {/* Title */}
      <g opacity={titleIn} transform={`translate(0,${(1-titleIn)*-22})`}>
        <text x={960} y={72} textAnchor="middle"
          fontSize={13} fontFamily="system-ui,sans-serif" fontWeight="700"
          fill={theme.accent.purple} letterSpacing={6}>
          SCENE 01 — CONCEPT
        </text>
        <text x={960} y={138} textAnchor="middle"
          fontSize={66} fontFamily="system-ui,sans-serif" fontWeight="800"
          fill={theme.text.primary}>
          The Restaurant Analogy
        </text>
        <text x={960} y={182} textAnchor="middle"
          fontSize={22} fontFamily="system-ui,sans-serif" fontWeight="400"
          fill={theme.text.secondary}>
          APIs act as a bridge — the waiter between you and the kitchen
        </text>
        <rect x={860} y={196} width={200} height={3} rx={2} fill={theme.accent.purple} opacity={0.45}/>
      </g>

      {/* Nodes */}
      <NodeCard cx={clientX} scale={clientIn} color={theme.accent.blue}
        icon="👤" label="CLIENT" sub="Your App / Browser" floatOffset={floatA}/>
      <NodeCard cx={apiX}    scale={apiIn}    color={theme.accent.purple}
        icon="🔗" label="API"    sub="The Bridge / Waiter"  floatOffset={floatB}/>
      <NodeCard cx={serverX} scale={serverIn} color={theme.accent.green}
        icon="🗄️" label="SERVER" sub="Backend + Database"  floatOffset={floatC}/>

      {/* Arrows – static y positions */}
      <Arrow x1={clientX+cw/2} x2={apiX-cw/2}   y={reqY} progress={a1P}
        color={theme.accent.blue}   label="① request"    above={true}/>
      <Arrow x1={apiX+cw/2}   x2={serverX-cw/2} y={reqY} progress={a2P}
        color={theme.accent.purple} label="② fetch data"  above={true}/>
      <Arrow x1={serverX-cw/2} x2={apiX+cw/2}   y={resY} progress={a3P}
        color={theme.accent.green}  label="③ response"   above={false}/>
      <Arrow x1={apiX-cw/2}   x2={clientX+cw/2} y={resY} progress={a4P}
        color={theme.accent.orange} label="④ result"     above={false}/>

      {/* Analogy speech bubbles */}
      <g opacity={bubblesIn}>
        {[
          {x:clientX, text:'"I want weather data"',    color:theme.accent.blue},
          {x:apiX,    text:'"GET /weather?city=NYC"',  color:theme.accent.purple},
          {x:serverX, text:'{ "temp": "72°F" }',       color:theme.accent.green},
        ].map((b,i)=>{
          const tw = b.text.length*7.4+28;
          return (
            <g key={i}>
              <rect x={b.x-tw/2} y={cy+ch/2+24} width={tw} height={32} rx={16}
                fill={b.color} opacity={0.1} stroke={b.color} strokeWidth={1.5}/>
              <text x={b.x} y={cy+ch/2+41} textAnchor="middle" dominantBaseline="middle"
                fontSize={13} fontFamily="'SF Mono','Fira Code',monospace" fontWeight="500"
                fill={b.color}>{b.text}</text>
            </g>
          );
        })}
      </g>

      {/* Definition callout */}
      <g opacity={defIn} transform={`translate(0,${(1-defIn)*18})`}>
        <rect x={360} y={770} width={1200} height={108} rx={16}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
          style={{filter:'drop-shadow(0 4px 20px rgba(29,111,232,0.09))'}}/>
        <rect x={360} y={770} width={5} height={108} rx={3} fill={theme.accent.blue}/>
        {/* Icon */}
        <circle cx={408} cy={824} r={22} fill={theme.accent.blue} opacity={0.10}/>
        <text x={408} y={824} textAnchor="middle" dominantBaseline="middle" fontSize={22}>💡</text>
        <text x={444} y={805} fontSize={16}
          fontFamily="system-ui,sans-serif" fontWeight="700" fill={theme.text.primary}>
          Definition
        </text>
        <text x={444} y={833} fontSize={17}
          fontFamily="system-ui,sans-serif" fontWeight="400" fill={theme.text.secondary}>
          An API is a
          <tspan fontWeight="700" fill={theme.accent.blue}> defined contract </tspan>
          that lets different software systems
          <tspan fontWeight="700" fill={theme.accent.purple}> communicate and exchange data</tspan>.
        </text>
        <text x={444} y={860} fontSize={15}
          fontFamily="system-ui,sans-serif" fill={theme.text.muted}>
          Think of it as a menu in a restaurant — it tells you what you can order and how to ask for it.
        </text>
      </g>

      {/* Step number badges */}
      {f > 90 && (
        <g opacity={interpolate(f,[90,115],[0,1],{extrapolateRight:'clamp'})}>
          {[
            {x:clientX+cw/2+55, y:reqY-18, n:'1', c:theme.accent.blue},
            {x:apiX+cw/2+55,    y:reqY-18, n:'2', c:theme.accent.purple},
            {x:serverX-cw/2-55, y:resY+18, n:'3', c:theme.accent.green},
            {x:apiX-cw/2-55,    y:resY+18, n:'4', c:theme.accent.orange},
          ].map((s,i)=>(
            <g key={i}>
              <circle cx={s.x} cy={s.y} r={14} fill={s.c} opacity={0.15}/>
              <text x={s.x} y={s.y} textAnchor="middle" dominantBaseline="middle"
                fontSize={12} fontFamily="system-ui" fontWeight="800" fill={s.c}>{s.n}</text>
            </g>
          ))}
        </g>
      )}
    </g>
  );
};
