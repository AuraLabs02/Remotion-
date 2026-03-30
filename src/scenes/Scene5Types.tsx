import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {theme} from '../theme';

export const Scene5Types: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn  = interpolate(f, [0,20],    [0,1], {extrapolateRight:'clamp'});
  const sceneOut = interpolate(f, [270,298],  [1,0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const opacity  = Math.min(sceneIn, sceneOut);
  const titleIn  = spring({frame:f-5, fps, config:{damping:22,stiffness:80}});

  const types = [
    {
      name:'REST API', subtitle:'Representational State Transfer',
      icon:'🔄', color:theme.accent.blue,   badge:'MOST POPULAR', badgeBg:'#EEF5FF',
      features:['Stateless communication','HTTP methods (GET/POST/PUT/DELETE)','JSON or XML responses','Simple & widely supported'],
      code:['GET  /users/123','POST /orders','PUT  /user/42','DEL  /session'],
      usage:'~80% of all public APIs',
    },
    {
      name:'GraphQL', subtitle:'Query Language for APIs',
      icon:'⬡', color:theme.accent.purple,  badge:'FLEXIBLE',     badgeBg:'#F3EEFF',
      features:['Ask exactly for what you need','Single endpoint, typed schema','Real-time subscriptions','Eliminates over-fetching'],
      code:['query {','  user(id: "1") {','    name','    email','  }','}'],
      usage:'Facebook, GitHub, Shopify',
    },
    {
      name:'WebSocket', subtitle:'Full-Duplex Real-Time',
      icon:'⚡', color:theme.accent.green,   badge:'REAL-TIME',    badgeBg:'#EAFAF4',
      features:['Persistent bi-directional','Ultra-low latency (<10ms)','Server push without polling','Chat, trading, live gaming'],
      code:['ws.connect(url)','ws.on("message", fn)','ws.send({ ping: true })','// Server → Client push'],
      usage:'Slack, Binance, multiplayer',
    },
    {
      name:'gRPC', subtitle:'Remote Procedure Call',
      icon:'🚀', color:theme.accent.orange,  badge:'ULTRA FAST',   badgeBg:'#FFF4EE',
      features:['Protocol Buffers (binary)','10× faster than REST','Strongly typed contracts','Microservice-to-microservice'],
      code:['service UserSvc {','  rpc GetUser','    (Request)','    returns (User);','}'],
      usage:'Google, Netflix, Uber',
    },
  ];

  // Taller cards (ch=535) starting at y=205 → fills to y=740
  const cw=425, ch=535;
  const totalW = types.length*cw+(types.length-1)*28;
  const sx = (1920-totalW)/2;
  const sy = 205;

  const highlighted = Math.floor(f/80)%4;

  // Comparison bar at bottom
  const barIn = interpolate(f,[180,210],[0,1],{extrapolateRight:'clamp'});

  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id="s5-bg" cx="50%" cy="40%" r="65%">
          <stop offset="0%"   stopColor="#F9F6FF"/>
          <stop offset="100%" stopColor="#FFFFFF"/>
        </radialGradient>
        <pattern id="s5-dots" width="44" height="44" patternUnits="userSpaceOnUse">
          <circle cx="22" cy="22" r="1.2" fill={theme.accent.purple} opacity="0.07"/>
        </pattern>
      </defs>
      <rect width={1920} height={1080} fill="url(#s5-bg)"/>
      <rect width={1920} height={1080} fill="url(#s5-dots)"/>

      {/* Title */}
      <g opacity={titleIn} transform={`translate(0,${(1-titleIn)*-20})`}>
        <text x={960} y={72} textAnchor="middle" fontSize={13}
          fontFamily="system-ui" fontWeight="700" fill={theme.accent.purple} letterSpacing={6}>
          SCENE 04 — TYPES
        </text>
        <text x={960} y={136} textAnchor="middle" fontSize={64}
          fontFamily="system-ui" fontWeight="800" fill={theme.text.primary}>
          Choose Your Protocol
        </text>
        <text x={960} y={178} textAnchor="middle" fontSize={22}
          fontFamily="system-ui" fontWeight="400" fill={theme.text.secondary}>
          REST, GraphQL, WebSocket, gRPC — each built for different needs
        </text>
        <rect x={880} y={192} width={160} height={3} rx={2} fill={theme.accent.purple} opacity={0.5}/>
      </g>

      {/* Cards */}
      {types.map((t,i)=>{
        const cx=sx+i*(cw+28);
        const cardIn=spring({frame:f-(20+i*16), fps, config:{damping:18,stiffness:90}});
        const detailIn=interpolate(f,[58+i*16,96+i*16],[0,1],{extrapolateRight:'clamp'});
        const isHigh=highlighted===i;
        const floatY=Math.sin(f*0.04+i*1.1)*6;
        const pulse=0.5+0.5*Math.sin(f*0.08+i);

        const bars=Array.from({length:10}).map((_,bi)=>({
          h:8+Math.sin(f*0.12+i+bi*0.7)*(isHigh?18:6),
        }));

        return (
          <g key={i} opacity={cardIn} transform={`translate(0,${floatY})`}>
            {isHigh && (
              <rect x={cx-5} y={sy-5} width={cw+10} height={ch+10} rx={22}
                fill={t.color} opacity={0.07+0.03*pulse}/>
            )}
            {/* Shadow */}
            <rect x={cx+2} y={sy+6} width={cw} height={ch} rx={18}
              fill={t.color} opacity={0.07}/>
            {/* Card */}
            <rect x={cx} y={sy} width={cw} height={ch} rx={18}
              fill="#FFFFFF"
              stroke={isHigh?t.color:theme.border.light}
              strokeWidth={isHigh?2.5:1.5}/>
            {/* Top gradient strip */}
            <defs>
              <linearGradient id={`s5-top-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor={t.color} stopOpacity="0.85"/>
                <stop offset="100%" stopColor={t.color} stopOpacity="0.20"/>
              </linearGradient>
            </defs>
            <rect x={cx} y={sy} width={cw} height={5} rx={3} fill={`url(#s5-top-${i})`}/>

            {/* Badge */}
            <rect x={cx+cw-112} y={sy+16} width={98} height={22} rx={11}
              fill={t.badgeBg}/>
            <text x={cx+cw-63} y={sy+27} textAnchor="middle" dominantBaseline="middle"
              fontSize={10} fontFamily="system-ui" fontWeight="700"
              fill={t.color} letterSpacing={1}>{t.badge}</text>

            {/* Icon */}
            <circle cx={cx+40} cy={sy+57} r={28} fill={t.color} opacity={0.09}/>
            <text x={cx+40} y={sy+57} textAnchor="middle" dominantBaseline="middle" fontSize={34}>{t.icon}</text>

            {/* Header */}
            <text x={cx+80} y={sy+44} fontSize={21}
              fontFamily="system-ui" fontWeight="800" fill={theme.text.primary}>{t.name}</text>
            <text x={cx+80} y={sy+66} fontSize={12}
              fontFamily="system-ui" fill={theme.text.muted}>{t.subtitle}</text>

            {/* Divider */}
            <line x1={cx+20} y1={sy+86} x2={cx+cw-20} y2={sy+86}
              stroke={theme.border.light} strokeWidth={1}/>

            {/* Features */}
            <g opacity={detailIn}>
              {t.features.map((feat,fi)=>(
                <g key={fi}>
                  <circle cx={cx+34} cy={sy+110+fi*33} r={5}
                    fill={t.color} opacity={0.7}/>
                  <text x={cx+50} y={sy+115+fi*33} dominantBaseline="middle"
                    fontSize={14} fontFamily="system-ui" fill={theme.text.secondary}>{feat}</text>
                </g>
              ))}

              {/* Code block */}
              <rect x={cx+18} y={sy+250} width={cw-36} height={t.code.length*22+20} rx={10}
                fill={theme.bg.code} stroke={theme.border.light} strokeWidth={1}/>
              <text x={cx+32} y={sy+268} fontSize={11}
                fontFamily="system-ui" fontWeight="600" fill={t.color} opacity={0.5}>example</text>
              {t.code.map((line,li)=>(
                <text key={li} x={cx+32} y={sy+286+li*22} fontSize={13}
                  fontFamily="'SF Mono','Fira Code',monospace" fill={t.color}
                  opacity={0.85}>{line}</text>
              ))}

              {/* Usage */}
              <text x={cx+20} y={sy+ch-50} fontSize={12}
                fontFamily="system-ui" fill={theme.text.muted} fontStyle="italic">
                Used by: {t.usage}
              </text>
            </g>

            {/* Waveform activity bars */}
            {bars.map((bar,bi)=>(
              <rect key={bi}
                x={cx+18+bi*18} y={sy+ch-22-bar.h/2}
                width={12} height={bar.h} rx={4}
                fill={t.color} opacity={isHigh?0.55:0.20}/>
            ))}
          </g>
        );
      })}

      {/* Comparison table at bottom */}
      <g opacity={barIn} transform={`translate(0,${(1-barIn)*16})`}>
        <rect x={60} y={758} width={1800} height={54} rx={12}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
          style={{filter:'drop-shadow(0 2px 10px rgba(0,0,0,0.05))'}}/>
        {/* Headers */}
        {['', 'Complexity', 'Speed', 'Best For', 'Real-Time'].map((h,i)=>(
          <text key={i} x={[90,380,640,900,1380][i]} y={786}
            textAnchor={i===0?'start':'middle'} dominantBaseline="middle"
            fontSize={12} fontFamily="system-ui" fontWeight="700"
            fill={theme.text.muted} letterSpacing={2}>{h}</text>
        ))}
        {/* Protocol rows */}
        {types.map((t,i)=>{
          const vals=[
            ['Low','High','CRUD / standard APIs','No'],
            ['Medium','High','Complex nested data','Yes (subscriptions)'],
            ['Low','Very High','Chat / live data','Yes (native)'],
            ['High','Ultra','Microservices','Streaming'],
          ][i];
          return (
            <g key={i}>
              <rect x={[86,340,600,860,1340][0]} y={798+i*28} width={8} height={18} rx={4} fill={t.color}/>
              <text x={102} y={807+i*28} dominantBaseline="middle"
                fontSize={12} fontFamily="system-ui" fontWeight="700" fill={t.color}>{t.name}</text>
              {vals.map((v,vi)=>(
                <text key={vi} x={[380,640,900,1380][vi]} y={807+i*28}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={12} fontFamily="system-ui" fill={theme.text.secondary}>{v}</text>
              ))}
            </g>
          );
        })}
      </g>
    </g>
  );
};
