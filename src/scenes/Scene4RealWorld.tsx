import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {theme} from '../theme';

export const Scene4RealWorld: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn  = interpolate(f, [0,20],    [0,1], {extrapolateRight:'clamp'});
  const sceneOut = interpolate(f, [270,298],  [1,0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const opacity  = Math.min(sceneIn, sceneOut);
  const titleIn  = spring({frame:f-5, fps, config:{damping:22,stiffness:80}});

  const apis = [
    {
      icon:'🌤️', name:'Weather API',   company:'OpenWeatherMap',
      endpoint:'GET /weather?q=London', method:'GET',
      response:'"temp": 18, "sky": "cloudy"',
      color:theme.accent.blue,   tag:'REST',
      usecase:'Weather apps · Travel sites · IoT',
    },
    {
      icon:'💳', name:'Payments API',  company:'Stripe',
      endpoint:'POST /v1/payment_intents', method:'POST',
      response:'"id": "pi_xyz", "status": "succeeded"',
      color:theme.accent.purple, tag:'REST',
      usecase:'E-commerce · SaaS billing · Marketplaces',
    },
    {
      icon:'📍', name:'Maps API',      company:'Google Maps',
      endpoint:'GET /maps/geocode/json', method:'GET',
      response:'"lat": 51.50, "lng": -0.12',
      color:theme.accent.green,  tag:'REST',
      usecase:'Navigation · Delivery · Real estate',
    },
    {
      icon:'🤖', name:'Claude AI API', company:'Anthropic',
      endpoint:'POST /v1/messages', method:'POST',
      response:'"content": [{"text": "Hello!"}]',
      color:theme.accent.orange, tag:'REST',
      usecase:'Chatbots · Code assist · Summarisation',
    },
    {
      icon:'📱', name:'Auth API',      company:'Auth0 / Firebase',
      endpoint:'POST /oauth/token', method:'POST',
      response:'"access_token": "eyJhb..."',
      color:theme.accent.cyan,   tag:'OAuth',
      usecase:'Login flows · SSO · Secure sessions',
    },
    {
      icon:'📦', name:'Shipping API',  company:'FedEx / UPS',
      endpoint:'GET /track/{id}', method:'GET',
      response:'"status": "In Transit"',
      color:theme.accent.amber,  tag:'REST',
      usecase:'E-commerce · Logistics · Warehousing',
    },
  ];

  // Taller cards to fill vertical space
  const cols=3, cw=570, ch=215, gx=38, gy=24;
  const totalW = cols*cw+(cols-1)*gx;
  const sx = (1920-totalW)/2;
  const sy = 215;

  // Stats appear earlier – f>130
  const statsIn = interpolate(f, [130,165], [0,1], {extrapolateRight:'clamp'});

  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id="s4-bg" cx="50%" cy="40%" r="65%">
          <stop offset="0%"   stopColor="#F8F9FF"/>
          <stop offset="100%" stopColor="#FFFFFF"/>
        </radialGradient>
        <pattern id="s4-grid" width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M 56 0 L 0 0 0 56" fill="none" stroke={theme.border.light} strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width={1920} height={1080} fill="url(#s4-bg)"/>
      <rect width={1920} height={1080} fill="url(#s4-grid)" opacity={0.5}/>

      {/* Title */}
      <g opacity={titleIn} transform={`translate(0,${(1-titleIn)*-20})`}>
        <text x={960} y={72} textAnchor="middle" fontSize={13}
          fontFamily="system-ui" fontWeight="700" fill={theme.accent.orange} letterSpacing={6}>
          SCENE 03 — EXAMPLES
        </text>
        <text x={960} y={136} textAnchor="middle" fontSize={64}
          fontFamily="system-ui" fontWeight="800" fill={theme.text.primary}>
          APIs Power Everything
        </text>
        <text x={960} y={178} textAnchor="middle" fontSize={22}
          fontFamily="system-ui" fontWeight="400" fill={theme.text.secondary}>
          From weather to payments — every modern app uses APIs
        </text>
        <rect x={880} y={192} width={160} height={3} rx={2} fill={theme.accent.orange} opacity={0.5}/>
      </g>

      {/* API cards */}
      {apis.map((api,i)=>{
        const col=i%cols, row=Math.floor(i/cols);
        const cx=sx+col*(cw+gx), cy2=sy+row*(ch+gy);
        const cardIn=spring({frame:f-(22+i*13), fps, config:{damping:18,stiffness:90}});
        const detailIn=interpolate(f,[62+i*13,96+i*13],[0,1],{extrapolateRight:'clamp'});
        const floatY=Math.sin(f*0.04+i*0.9)*5;
        return (
          <g key={i} opacity={cardIn} transform={`translate(0,${floatY})`}>
            {/* Shadow */}
            <rect x={cx+3} y={cy2+5} width={cw} height={ch} rx={16}
              fill={api.color} opacity={0.07}/>
            {/* Card */}
            <rect x={cx} y={cy2} width={cw} height={ch} rx={16}
              fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}/>
            {/* Color top strip */}
            <rect x={cx} y={cy2} width={cw} height={5} rx={3} fill={api.color}/>
            {/* Method badge */}
            <rect x={cx+cw-82} y={cy2+16} width={66} height={22} rx={11}
              fill={api.color} opacity={0.12}/>
            <text x={cx+cw-49} y={cy2+27} textAnchor="middle" dominantBaseline="middle"
              fontSize={11} fontFamily="system-ui" fontWeight="700"
              fill={api.color} letterSpacing={1}>{api.method}</text>
            {/* Icon */}
            <circle cx={cx+40} cy={cy2+55} r={24} fill={api.color} opacity={0.10}/>
            <text x={cx+40} y={cy2+55} textAnchor="middle" dominantBaseline="middle" fontSize={28}>{api.icon}</text>
            {/* Header */}
            <text x={cx+76} y={cy2+42} fontSize={19}
              fontFamily="system-ui" fontWeight="800" fill={theme.text.primary}>{api.name}</text>
            <text x={cx+76} y={cy2+64} fontSize={13}
              fontFamily="system-ui" fill={theme.text.muted}>{api.company}</text>
            {/* Divider */}
            <line x1={cx+20} y1={cy2+84} x2={cx+cw-20} y2={cy2+84}
              stroke={theme.border.light} strokeWidth={1}/>
            {/* Details */}
            <g opacity={detailIn}>
              <rect x={cx+18} y={cy2+96} width={cw-36} height={26} rx={7} fill={theme.bg.code}/>
              <text x={cx+30} y={cy2+110} dominantBaseline="middle"
                fontSize={12} fontFamily="'SF Mono',monospace" fontWeight="500" fill={api.color}>
                {api.endpoint}
              </text>
              <text x={cx+20} y={cy2+140} fontSize={12}
                fontFamily="'SF Mono',monospace" fill={theme.text.secondary}>
                ← {'{ '+api.response+' }'}
              </text>
              <text x={cx+20} y={cy2+170} fontSize={12}
                fontFamily="system-ui" fill={theme.text.muted} fontStyle="italic">
                {api.usecase}
              </text>
            </g>
            {/* Tag pill */}
            <rect x={cx+18} y={cy2+16} width={40} height={20} rx={10}
              fill={api.color} opacity={0.12}/>
            <text x={cx+38} y={cy2+27} textAnchor="middle" dominantBaseline="middle"
              fontSize={10} fontFamily="system-ui" fontWeight="700" fill={api.color}>{api.tag}</text>
          </g>
        );
      })}

      {/* Stats row – appear at f>130 */}
      <g opacity={statsIn} transform={`translate(0,${(1-statsIn)*18})`}>
        {[
          {val:'13,000+', label:'Public APIs available', color:theme.accent.blue},
          {val:'83%',     label:'Apps depend on APIs',   color:theme.accent.purple},
          {val:'4.5B+',   label:'API calls per day',     color:theme.accent.green},
          {val:'~120ms',  label:'Avg response time',     color:theme.accent.orange},
        ].map((stat,i)=>(
          <g key={i}>
            <rect x={100+i*435} y={935} width={390} height={90} rx={14}
              fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
              style={{filter:'drop-shadow(0 2px 10px rgba(0,0,0,0.06))'}}/>
            <rect x={100+i*435} y={935} width={5} height={90} rx={3} fill={stat.color}/>
            <text x={124+i*435} y={972} fontSize={34}
              fontFamily="system-ui" fontWeight="900" fill={stat.color}>{stat.val}</text>
            <text x={124+i*435} y={1004} fontSize={14}
              fontFamily="system-ui" fill={theme.text.muted}>{stat.label}</text>
          </g>
        ))}
      </g>
    </g>
  );
};
