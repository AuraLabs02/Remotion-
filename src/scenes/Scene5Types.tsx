import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {drawPath, easeOutExpo, typewriter, pulse} from '../utils';

export const Scene5Types: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn = interpolate(f, [0, 22], [0, 1], {extrapolateRight: 'clamp'});
  const sceneOut = interpolate(f, [270, 298], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(sceneIn, sceneOut);
  const titleIn = spring({frame: f - 5, fps, config: {damping: 22, stiffness: 80}});
  const p = pulse(f, 0.06);

  // Card shell
  const cardW = 1300, cardH = 420;
  const cardX = (1920 - cardW) / 2, cardY = 230;

  // Protocol phases - sequential focus
  // REST: f=20-85, GraphQL: f=75-140, WebSocket: f=130-195, gRPC: f=185-250
  const protocols = [
    {
      name: 'REST API', subtitle: 'Representational State Transfer',
      badge: 'MOST POPULAR', color: theme.accent.blue, badgeBg: '#EEF5FF',
      features: ['Stateless HTTP communication', 'GET / POST / PUT / DELETE methods', 'JSON responses, widely supported'],
      code: 'GET  /users/123\nPOST /orders\nPUT  /user/42',
      startF: 20, endF: 85,
    },
    {
      name: 'GraphQL', subtitle: 'Query Language for APIs',
      badge: 'FLEXIBLE', color: theme.accent.purple, badgeBg: '#F3EEFF',
      features: ['Ask exactly what you need', 'Single endpoint, typed schema', 'Eliminates over-fetching'],
      code: 'query {\n  user(id: "1") {\n    name, email\n  }\n}',
      startF: 75, endF: 140,
    },
    {
      name: 'WebSocket', subtitle: 'Full-Duplex Real-Time',
      badge: 'REAL-TIME', color: theme.accent.green, badgeBg: '#EAFAF4',
      features: ['Persistent bi-directional channel', 'Ultra-low latency (<10ms)', 'Chat, trading, live gaming'],
      code: 'ws.connect(url)\nws.on("message", fn)\nws.send({ ping: true })',
      startF: 130, endF: 195,
    },
    {
      name: 'gRPC', subtitle: 'Remote Procedure Call',
      badge: 'ULTRA FAST', color: theme.accent.orange, badgeBg: '#FFF4EE',
      features: ['Protocol Buffers (binary)', '10x faster than REST', 'Microservice-to-microservice'],
      code: 'service UserSvc {\n  rpc GetUser(Req)\n  returns (User);\n}',
      startF: 185, endF: 250,
    },
  ];

  // Comparison row (f=240-280)
  const compIn = spring({frame: f - 240, fps, config: {damping: 20, stiffness: 70}});

  // CRUD arrows for REST diagram
  const crudMethods = [
    {name: 'GET', color: theme.accent.blue, angle: -45},
    {name: 'POST', color: theme.accent.green, angle: -15},
    {name: 'PUT', color: theme.accent.amber, angle: 15},
    {name: 'DELETE', color: theme.accent.red, angle: 45},
  ];

  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id="s5-bg" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#F9F6FF" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </radialGradient>
        <pattern id="s5-dots" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="24" r="1.3" fill={theme.accent.purple} opacity="0.06" />
        </pattern>
      </defs>

      <rect width={1920} height={1080} fill="url(#s5-bg)" />
      <rect width={1920} height={1080} fill="url(#s5-dots)" />

      {/* Title */}
      <g opacity={titleIn} transform={`translate(0,${(1 - titleIn) * -20})`}>
        <text x={960} y={68} textAnchor="middle" fontSize={16}
          fontFamily={theme.font.body} fontWeight="700" fill={theme.accent.purple} letterSpacing={6}>
          SCENE 04 — PROTOCOLS
        </text>
        <text x={960} y={138} textAnchor="middle" fontSize={64}
          fontFamily={theme.font.display} fontWeight="800" fill={theme.text.primary}>
          Choose Your Protocol
        </text>
        <text x={960} y={182} textAnchor="middle" fontSize={24}
          fontFamily={theme.font.body} fontWeight="400" fill={theme.text.secondary}>
          REST, GraphQL, WebSocket, gRPC — each built for different needs
        </text>
        <rect x={880} y={198} width={160} height={3} rx={2} fill={theme.accent.purple} opacity={0.5} />
      </g>

      {/* Sequential protocol cards */}
      {protocols.map((proto, pi) => {
        const pIn = spring({frame: f - proto.startF, fps, config: {damping: 16, stiffness: 90}});
        const pOut = interpolate(f, [proto.endF - 10, proto.endF], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const vis = Math.min(pIn, pOut);
        if (vis <= 0.01) return null;

        // Color morph for card border
        const borderColor = proto.color;

        // Diagram area (left side of card)
        const diagCx = cardX + 200, diagCy = cardY + 220;

        return (
          <g key={pi} opacity={vis} transform={`translate(${(1 - pIn) * 60},0)`}>
            {/* Card shadow */}
            <rect x={cardX + 3} y={cardY + 5} width={cardW} height={cardH} rx={20}
              fill={borderColor} opacity={0.06} />
            {/* Card */}
            <rect x={cardX} y={cardY} width={cardW} height={cardH} rx={20}
              fill="#FFFFFF" stroke={borderColor} strokeWidth={2.5} />
            <rect x={cardX} y={cardY} width={cardW} height={6} rx={3} fill={borderColor} />

            {/* Badge */}
            <rect x={cardX + cardW - 160} y={cardY + 18} width={140} height={28} rx={14}
              fill={proto.badgeBg} />
            <text x={cardX + cardW - 90} y={cardY + 32} textAnchor="middle" dominantBaseline="middle"
              fontSize={13} fontFamily={theme.font.body} fontWeight="700"
              fill={borderColor} letterSpacing={1}>{proto.badge}</text>

            {/* Animated diagram - different per protocol - SCALED UP */}
            {pi === 0 && (
              // REST: CRUD arrows radiating from center - larger
              <g>
                <circle cx={diagCx} cy={diagCy} r={55} fill={borderColor} opacity={0.08} />
                <circle cx={diagCx} cy={diagCy} r={42} fill="#FFFFFF" stroke={borderColor} strokeWidth={2.5} />
                <text x={diagCx} y={diagCy} textAnchor="middle" dominantBaseline="middle"
                  fontSize={18} fontFamily={theme.font.body} fontWeight="800" fill={borderColor}>API</text>
                {crudMethods.map((method, mi) => {
                  const arrowP = drawPath(f, proto.startF + 12 + mi * 7, 20, easeOutExpo);
                  const rad = method.angle * Math.PI / 180;
                  const endX = diagCx + Math.cos(rad) * 150 * arrowP;
                  const endY = diagCy + Math.sin(rad) * 85 * arrowP;
                  const labelX = diagCx + Math.cos(rad) * 175;
                  const labelY = diagCy + Math.sin(rad) * 95;
                  return (
                    <g key={mi}>
                      <line x1={diagCx + Math.cos(rad) * 46} y1={diagCy + Math.sin(rad) * 46}
                        x2={endX} y2={endY}
                        stroke={method.color} strokeWidth={3} strokeLinecap="round" />
                      {arrowP > 0.7 && (
                        <g opacity={interpolate(arrowP, [0.7, 1], [0, 1])}>
                          <rect x={labelX - 28} y={labelY - 12} width={56} height={24} rx={8}
                            fill={method.color} opacity={0.12} />
                          <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle"
                            fontSize={16} fontFamily={theme.font.mono} fontWeight="700" fill={method.color}>
                            {method.name}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            )}

            {pi === 1 && (
              // GraphQL: Tree diagram - SCALED UP
              <g>
                {/* Root */}
                <circle cx={diagCx} cy={diagCy - 80} r={36} fill={borderColor} opacity={0.10} />
                <circle cx={diagCx} cy={diagCy - 80} r={28} fill="#FFFFFF" stroke={borderColor} strokeWidth={2.5} />
                <text x={diagCx} y={diagCy - 80} textAnchor="middle" dominantBaseline="middle"
                  fontSize={15} fontFamily={theme.font.mono} fontWeight="700" fill={borderColor}>query</text>
                {/* Branches */}
                {[{x: -80, label: 'user'}, {x: 80, label: 'posts'}].map((branch, bi) => {
                  const bP = drawPath(f, proto.startF + 15 + bi * 10, 18, easeOutExpo);
                  return (
                    <g key={bi}>
                      <line x1={diagCx} y1={diagCy - 52}
                        x2={diagCx + branch.x * bP} y2={(diagCy + 10) * bP + (diagCy - 52) * (1 - bP)}
                        stroke={borderColor} strokeWidth={2.5} opacity={0.5} />
                      {bP > 0.5 && (
                        <>
                          <circle cx={diagCx + branch.x} cy={diagCy + 10} r={26}
                            fill="#FFFFFF" stroke={borderColor} strokeWidth={2} />
                          <text x={diagCx + branch.x} y={diagCy + 10} textAnchor="middle" dominantBaseline="middle"
                            fontSize={14} fontFamily={theme.font.mono} fontWeight="600" fill={borderColor}>
                            {branch.label}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
                {/* Leaves */}
                {[{px: -80, x: -115, y: 80, label: 'name'}, {px: -80, x: -45, y: 80, label: 'email'}].map((leaf, li) => {
                  const lP = drawPath(f, proto.startF + 30 + li * 8, 15, easeOutExpo);
                  return (
                    <g key={li} opacity={lP}>
                      <line x1={diagCx + leaf.px} y1={diagCy + 36}
                        x2={diagCx + leaf.x} y2={diagCy + leaf.y}
                        stroke={borderColor} strokeWidth={2} opacity={0.4} />
                      <rect x={diagCx + leaf.x - 32} y={diagCy + leaf.y - 13} width={64} height={26} rx={8}
                        fill={borderColor} opacity={0.10} />
                      <text x={diagCx + leaf.x} y={diagCy + leaf.y} textAnchor="middle" dominantBaseline="middle"
                        fontSize={13} fontFamily={theme.font.mono} fontWeight="600" fill={borderColor}>
                        {leaf.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {pi === 2 && (
              // WebSocket: Bidirectional pulses - SCALED UP
              <g>
                <circle cx={diagCx - 90} cy={diagCy} r={36} fill="#FFFFFF" stroke={borderColor} strokeWidth={2.5} />
                <text x={diagCx - 90} y={diagCy} textAnchor="middle" dominantBaseline="middle"
                  fontSize={26}>👤</text>
                <circle cx={diagCx + 90} cy={diagCy} r={36} fill="#FFFFFF" stroke={borderColor} strokeWidth={2.5} />
                <text x={diagCx + 90} y={diagCy} textAnchor="middle" dominantBaseline="middle"
                  fontSize={26}>🗄️</text>
                {/* Persistent line */}
                <line x1={diagCx - 52} y1={diagCy} x2={diagCx + 52} y2={diagCy}
                  stroke={borderColor} strokeWidth={3} />
                {/* Bidirectional pulses */}
                {[0, 1, 2, 3].map(pi2 => {
                  const pxR = ((f * 2.5 + pi2 * 26) % 104) - 52 + diagCx;
                  const pxL = diagCx - ((f * 2.5 + pi2 * 26 + 52) % 104) + 52;
                  return (
                    <g key={pi2}>
                      <circle cx={pxR} cy={diagCy - 8} r={6} fill={borderColor} opacity={0.65} />
                      <circle cx={pxL} cy={diagCy + 8} r={5} fill={theme.accent.cyan} opacity={0.55} />
                    </g>
                  );
                })}
                <text x={diagCx} y={diagCy + 55} textAnchor="middle"
                  fontSize={14} fontFamily={theme.font.mono} fontWeight="700"
                  fill={borderColor} letterSpacing={3}>REAL-TIME</text>
              </g>
            )}

            {pi === 3 && (
              // gRPC: Binary stream - SCALED UP
              <g>
                <rect x={diagCx - 75} y={diagCy + 45} width={150} height={42} rx={10}
                  fill={borderColor} opacity={0.12} />
                <text x={diagCx} y={diagCy + 66} textAnchor="middle" dominantBaseline="middle"
                  fontSize={16} fontFamily={theme.font.mono} fontWeight="700" fill={borderColor}>protobuf</text>
                <rect x={diagCx - 65} y={diagCy - 90} width={130} height={42} rx={10}
                  fill={borderColor} opacity={0.12} />
                <text x={diagCx} y={diagCy - 69} textAnchor="middle" dominantBaseline="middle"
                  fontSize={16} fontFamily={theme.font.mono} fontWeight="700" fill={borderColor}>service</text>
                {/* Binary stream - larger */}
                {Array.from({length: 9}).map((_, bi) => {
                  const by = diagCy + 30 - ((f * 1.4 + bi * 14) % 100);
                  const bit = ((bi + Math.floor(f * 0.12)) % 2).toString();
                  return (
                    <text key={bi} x={diagCx - 30 + (bi % 3) * 30} y={by}
                      textAnchor="middle" fontSize={18} fontFamily={theme.font.mono}
                      fill={borderColor} opacity={0.25 + 0.25 * Math.sin(f * 0.1 + bi)}>
                      {bit}
                    </text>
                  );
                })}
                <line x1={diagCx} y1={diagCy - 46} x2={diagCx} y2={diagCy + 42}
                  stroke={borderColor} strokeWidth={2.5} strokeDasharray="5 5" opacity={0.35} />
              </g>
            )}

            {/* Right side: Protocol details */}
            <text x={cardX + 440} y={cardY + 56} fontSize={42}
              fontFamily={theme.font.display} fontWeight="800" fill={theme.text.primary}>
              {proto.name}
            </text>
            <text x={cardX + 440} y={cardY + 88} fontSize={20}
              fontFamily={theme.font.body} fill={theme.text.muted}>{proto.subtitle}</text>

            {/* Features with animated checks */}
            {proto.features.map((feat, fi) => {
              const checkP = spring({frame: f - (proto.startF + 20 + fi * 10), fps, config: {damping: 14, stiffness: 100}});
              return (
                <g key={fi} opacity={checkP}>
                  <circle cx={cardX + 452} cy={cardY + 130 + fi * 38} r={10}
                    fill={borderColor} opacity={0.12} />
                  <text x={cardX + 452} y={cardY + 130 + fi * 38} textAnchor="middle" dominantBaseline="middle"
                    fontSize={12} fontWeight="800" fill={borderColor}>✓</text>
                  <text x={cardX + 475} y={cardY + 135 + fi * 38} dominantBaseline="middle"
                    fontSize={18} fontFamily={theme.font.body} fill={theme.text.secondary}>{feat}</text>
                </g>
              );
            })}

            {/* Code block */}
            <rect x={cardX + 440} y={cardY + 262} width={780} height={120} rx={12}
              fill={theme.bg.code} stroke={theme.border.light} strokeWidth={1} />
            {proto.code.split('\n').map((line, li) => {
              const lineChars = typewriter(f, proto.startF + 15 + li * 6, line, 2.0);
              return (
                <text key={li} x={cardX + 460} y={cardY + 290 + li * 26} dominantBaseline="middle"
                  fontSize={16} fontFamily={theme.font.mono} fontWeight="500" fill={borderColor} opacity={0.85}>
                  {line.slice(0, lineChars)}
                </text>
              );
            })}
          </g>
        );
      })}

      {/* Comparison summary row */}
      <g opacity={compIn} transform={`translate(0,${(1 - compIn) * 20})`}>
        {protocols.map((proto, i) => {
          const cw = 420, ch = 80;
          const cx = 80 + i * (cw + 20);
          const delay = spring({frame: f - (242 + i * 8), fps, config: {damping: 14, stiffness: 100}});
          const keys = ['~80% of public APIs', 'Facebook, GitHub', 'Slack, Binance', 'Google, Netflix'];
          return (
            <g key={i} opacity={delay} transform={`translate(${(1 - delay) * -40},0)`}>
              <rect x={cx} y={680} width={cw} height={ch} rx={14}
                fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
                style={{filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.05))'}} />
              <rect x={cx} y={680} width={6} height={ch} rx={3} fill={proto.color} />
              <text x={cx + 24} y={710} fontSize={20}
                fontFamily={theme.font.body} fontWeight="700" fill={proto.color}>{proto.name}</text>
              <text x={cx + 24} y={738} fontSize={16}
                fontFamily={theme.font.body} fill={theme.text.muted}>{keys[i]}</text>
            </g>
          );
        })}
      </g>
    </g>
  );
};
