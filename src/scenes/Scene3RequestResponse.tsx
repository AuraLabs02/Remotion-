import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {theme} from '../theme';

export const Scene3RequestResponse: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn  = interpolate(f, [0,20],    [0,1], {extrapolateRight:'clamp'});
  const sceneOut = interpolate(f, [300,328],  [1,0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const opacity  = Math.min(sceneIn, sceneOut);
  const titleIn  = spring({frame:f-5, fps, config:{damping:22,stiffness:80}});

  // Pipeline nodes – moved down to cy=460
  const nodes = [
    {x:100,  y:440, label:'CLIENT',  sub:'Web App',  color:theme.accent.blue,   icon:'💻'},
    {x:420,  y:440, label:'DNS',     sub:'Resolve',  color:theme.accent.cyan,   icon:'🌐'},
    {x:740,  y:440, label:'HTTP',    sub:'Request',  color:theme.accent.purple, icon:'📡'},
    {x:1060, y:440, label:'GATEWAY', sub:'API GW',   color:theme.accent.amber,  icon:'🔗'},
    {x:1380, y:440, label:'SERVER',  sub:'Backend',  color:theme.accent.orange, icon:'⚙️'},
    {x:1700, y:440, label:'DATABASE',sub:'Storage',  color:theme.accent.green,  icon:'🗄️'},
  ];

  const reqP = interpolate(f, [50,180],  [0,5], {extrapolateRight:'clamp'});
  const resP = interpolate(f, [195,300], [0,5], {extrapolateRight:'clamp'});

  const reqCodeIn = interpolate(f, [55,90],   [0,1], {extrapolateRight:'clamp'});
  const resCodeIn = interpolate(f, [195,230], [0,1], {extrapolateRight:'clamp'});
  const latencyIn = interpolate(f, [270,298], [0,1], {extrapolateRight:'clamp'});

  // Latency step breakdown appears at f>220
  const timelineIn = interpolate(f, [225,258], [0,1], {extrapolateRight:'clamp'});

  const hw=82, hh=70;
  const hexPts = (cx:number,cy:number,w:number,h:number) =>
    `${cx},${cy-h} ${cx+w*0.866},${cy-h*0.5} ${cx+w*0.866},${cy+h*0.5} ${cx},${cy+h} ${cx-w*0.866},${cy+h*0.5} ${cx-w*0.866},${cy-h*0.5}`;

  const NodeHex = ({node,index}:{node:typeof nodes[0];index:number}) => {
    const ni = spring({frame:f-(10+index*14), fps, config:{damping:18,stiffness:90}});
    const isActive = (reqP>index-0.4)||(resP>(4.6-index));
    const pulse = 0.5+0.5*Math.sin(f*0.10+index);
    return (
      <g opacity={ni}>
        <polygon points={hexPts(node.x,node.y+7,hw,hh)} fill={node.color} opacity={0.07}/>
        {isActive && (
          <polygon points={hexPts(node.x,node.y,hw+8,hh+6)} fill="none"
            stroke={node.color} strokeWidth={2.5} opacity={0.28+0.14*pulse}/>
        )}
        <polygon points={hexPts(node.x,node.y,hw,hh)}
          fill="#FFFFFF" stroke={node.color} strokeWidth={isActive?2.5:1.8}/>
        <text x={node.x} y={node.y-12} textAnchor="middle" dominantBaseline="middle" fontSize={28}>{node.icon}</text>
        <text x={node.x} y={node.y+22} textAnchor="middle"
          fontSize={10} fontFamily="system-ui" fontWeight="800"
          fill={node.color} letterSpacing={1.5}>{node.label}</text>
        <text x={node.x} y={node.y+98} textAnchor="middle"
          fontSize={13} fontFamily="system-ui" fill={theme.text.muted}>{node.sub}</text>
        {isActive && (
          <circle cx={node.x+68} cy={node.y-54} r={6}
            fill={theme.accent.green} opacity={0.8+0.2*Math.sin(f*0.2)}/>
        )}
      </g>
    );
  };

  const Packet = ({progress,isResponse}:{progress:number;isResponse:boolean}) => {
    if (progress<=0||progress>=5) return null;
    const seg = Math.floor(progress), t = progress-seg;
    const from = isResponse ? nodes[5-seg] : nodes[seg];
    const to   = isResponse ? nodes[4-seg] : nodes[seg+1];
    if (!from||!to) return null;
    const yOff  = isResponse ? 54 : -54;
    const x     = from.x+(to.x-from.x)*t;
    const y     = from.y+yOff;
    const color = isResponse ? theme.accent.green : theme.accent.blue;
    const lbl   = isResponse ? 'RES' : 'REQ';
    return (
      <g>
        <circle cx={x} cy={y} r={22} fill={color} opacity={0.08}/>
        <circle cx={x} cy={y} r={14} fill={color} opacity={0.15}/>
        <rect x={x-27} y={y-13} width={54} height={26} rx={8}
          fill={color} style={{filter:`drop-shadow(0 2px 8px ${color}50)`}}/>
        <rect x={x-20} y={y-9} width={40} height={8} rx={4} fill="rgba(255,255,255,0.35)"/>
        <text x={x} y={y+1} textAnchor="middle" dominantBaseline="middle"
          fontSize={10} fontFamily="system-ui" fontWeight="800" fill="#FFFFFF" letterSpacing={1}>{lbl}</text>
      </g>
    );
  };

  // Latency timeline steps
  const latencySteps = [
    {label:'DNS lookup',   ms:'~15ms', color:theme.accent.cyan},
    {label:'TCP connect',  ms:'~20ms', color:theme.accent.blue},
    {label:'TLS handshake',ms:'~30ms', color:theme.accent.purple},
    {label:'API process',  ms:'~40ms', color:theme.accent.amber},
    {label:'DB query',     ms:'~10ms', color:theme.accent.green},
    {label:'Response back',ms:'~5ms',  color:theme.accent.orange},
  ];

  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id="s3-bg" cx="50%" cy="40%" r="65%">
          <stop offset="0%"   stopColor="#F5F7FF"/>
          <stop offset="100%" stopColor="#FFFFFF"/>
        </radialGradient>
        <pattern id="s3-dots" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1.2" fill={theme.accent.blue} opacity="0.07"/>
        </pattern>
      </defs>
      <rect width={1920} height={1080} fill="url(#s3-bg)"/>
      <rect width={1920} height={1080} fill="url(#s3-dots)"/>

      {/* Title */}
      <g opacity={titleIn} transform={`translate(0,${(1-titleIn)*-20})`}>
        <text x={960} y={72} textAnchor="middle" fontSize={13}
          fontFamily="system-ui" fontWeight="700" fill={theme.accent.purple} letterSpacing={6}>
          SCENE 02 — PIPELINE
        </text>
        <text x={960} y={136} textAnchor="middle" fontSize={64}
          fontFamily="system-ui" fontWeight="800" fill={theme.text.primary}>
          Inside the Request Pipeline
        </text>
        <text x={960} y={178} textAnchor="middle" fontSize={22}
          fontFamily="system-ui" fontWeight="400" fill={theme.text.secondary}>
          Every API call travels through these layers in milliseconds
        </text>
        <rect x={880} y={192} width={160} height={3} rx={2} fill={theme.accent.purple} opacity={0.5}/>
      </g>

      {/* Flow direction labels */}
      {f>48 && (
        <g opacity={interpolate(f,[48,72],[0,1],{extrapolateRight:'clamp'})}>
          <text x={960} y={364} textAnchor="middle" fontSize={11}
            fontFamily="system-ui" fontWeight="700" fill={theme.accent.blue} letterSpacing={4}>
            REQUEST →
          </text>
          <text x={960} y={522} textAnchor="middle" fontSize={11}
            fontFamily="system-ui" fontWeight="700" fill={theme.accent.green} letterSpacing={4}>
            ← RESPONSE
          </text>
        </g>
      )}

      {/* Track lines */}
      {nodes.slice(0,-1).map((node,i)=>{
        const next = nodes[i+1];
        return (
          <g key={i}>
            <line x1={node.x+72} y1={node.y-38} x2={next.x-72} y2={next.y-38}
              stroke={reqP>i ? theme.accent.blue : theme.border.light}
              strokeWidth={reqP>i?2:1.5} strokeDasharray="6 4"
              opacity={reqP>i?0.55:0.35}/>
            <line x1={node.x+72} y1={node.y+38} x2={next.x-72} y2={next.y+38}
              stroke={resP>(4-i) ? theme.accent.green : theme.border.light}
              strokeWidth={resP>(4-i)?2:1.5} strokeDasharray="6 4"
              opacity={resP>(4-i)?0.55:0.35}/>
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node,i)=><NodeHex key={i} node={node} index={i}/>)}

      {/* Packets */}
      <Packet progress={reqP} isResponse={false}/>
      <Packet progress={resP} isResponse={true}/>

      {/* Code panels */}
      <g opacity={reqCodeIn}>
        <rect x={22} y={585} width={460} height={238} rx={14}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
          style={{filter:'drop-shadow(0 4px 16px rgba(29,111,232,0.09))'}}/>
        <rect x={22} y={585} width={460} height={42} rx={14}
          fill={theme.accent.blue} opacity={0.07}/>
        <rect x={22} y={615} width={460} height={12} fill={theme.accent.blue} opacity={0.07}/>
        <circle cx={50} cy={607} r={7} fill={theme.accent.blue} opacity={0.6}/>
        <text x={66} y={607} dominantBaseline="middle"
          fontSize={13} fontFamily="system-ui" fontWeight="700" fill={theme.accent.blue}>
          HTTP REQUEST
        </text>
        {[
          {k:'GET',     v:' /api/v2/weather?city=NYC', kc:theme.accent.purple},
          {k:'Host:',   v:' api.openweather.com',       kc:theme.accent.blue},
          {k:'Auth:',   v:' Bearer eyJhbGci...',        kc:theme.accent.blue},
          {k:'Accept:', v:' application/json',          kc:theme.accent.blue},
          {k:'Cache:',  v:' no-cache',                  kc:theme.accent.blue},
          {k:'Version:',v:' HTTP/2.0',                  kc:theme.accent.cyan},
        ].map((row,ri)=>(
          <g key={ri}>
            <text x={44} y={640+ri*30} fontSize={13}
              fontFamily="'SF Mono','Fira Code',monospace" fontWeight="700" fill={row.kc}>{row.k}</text>
            <text x={44+row.k.length*9} y={640+ri*30} fontSize={13}
              fontFamily="'SF Mono',monospace" fill={theme.text.secondary}>{row.v}</text>
          </g>
        ))}
      </g>

      <g opacity={resCodeIn}>
        <rect x={1438} y={585} width={460} height={238} rx={14}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
          style={{filter:'drop-shadow(0 4px 16px rgba(5,150,105,0.09))'}}/>
        <rect x={1438} y={585} width={460} height={42} rx={14}
          fill={theme.accent.green} opacity={0.07}/>
        <rect x={1438} y={615} width={460} height={12} fill={theme.accent.green} opacity={0.07}/>
        <circle cx={1466} cy={607} r={7} fill={theme.accent.green} opacity={0.6}/>
        <text x={1482} y={607} dominantBaseline="middle"
          fontSize={13} fontFamily="system-ui" fontWeight="700" fill={theme.accent.green}>
          HTTP RESPONSE
        </text>
        {[
          {k:'200 OK',         v:'',                     kc:theme.accent.green},
          {k:'Content-Type:',  v:' application/json',    kc:theme.accent.blue},
          {k:'X-Response-Time:',v:' 120ms',              kc:theme.accent.cyan},
          {k:'{',              v:'',                     kc:theme.text.muted},
          {k:'  "temp":',      v:' "72°F",',             kc:theme.accent.purple},
          {k:'  "city":',      v:' "New York"',          kc:theme.accent.purple},
        ].map((row,ri)=>(
          <g key={ri}>
            <text x={1458} y={640+ri*30} fontSize={13}
              fontFamily="'SF Mono',monospace" fontWeight="700" fill={row.kc}>{row.k}</text>
            <text x={1458+row.k.length*9} y={640+ri*30} fontSize={13}
              fontFamily="'SF Mono',monospace" fill={theme.text.secondary}>{row.v}</text>
          </g>
        ))}
      </g>

      {/* Latency breakdown timeline */}
      <g opacity={timelineIn} transform={`translate(0,${(1-timelineIn)*20})`}>
        <text x={960} y={858} textAnchor="middle"
          fontSize={13} fontFamily="system-ui" fontWeight="700"
          fill={theme.text.muted} letterSpacing={4}>
          LATENCY BREAKDOWN
        </text>
        {latencySteps.map((step,i)=>{
          const sw = 240, sh = 36;
          const sx = 90+i*(sw+18);
          return (
            <g key={i}>
              <rect x={sx} y={872} width={sw} height={sh} rx={10}
                fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
                style={{filter:'drop-shadow(0 1px 8px rgba(0,0,0,0.06))'}}/>
              <rect x={sx} y={872} width={5} height={sh} rx={3} fill={step.color}/>
              <text x={sx+18} y={884} fontSize={12}
                fontFamily="system-ui" fontWeight="700" fill={step.color}>{step.ms}</text>
              <text x={sx+18} y={900} fontSize={11}
                fontFamily="system-ui" fill={theme.text.muted}>{step.label}</text>
            </g>
          );
        })}
      </g>

      {/* Total latency badge */}
      <g opacity={latencyIn} transform={`translate(0,${(1-latencyIn)*14})`}>
        <rect x={640} y={924} width={640} height={60} rx={30}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={2}
          style={{filter:'drop-shadow(0 4px 16px rgba(29,111,232,0.11))'}}/>
        <circle cx={692} cy={954} r={12} fill={theme.accent.green} opacity={0.18}/>
        <circle cx={692} cy={954} r={7}  fill={theme.accent.green}/>
        <text x={716} y={954} dominantBaseline="middle"
          fontSize={20} fontFamily="system-ui" fontWeight="700" fill={theme.text.primary}>
          Round trip complete —
        </text>
        <text x={998} y={954} dominantBaseline="middle"
          fontSize={20} fontFamily="system-ui" fontWeight="800" fill={theme.accent.blue}>
          {' ~'}120ms avg
        </text>
      </g>
    </g>
  );
};
