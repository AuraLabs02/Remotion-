import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const Scene5Types: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn = interpolate(f, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const sceneOut = interpolate(f, [270, 300], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(sceneIn, sceneOut);

  const titleOpacity = interpolate(f, [0, 25], [0, 1], {extrapolateRight: 'clamp'});

  const types = [
    {
      name: 'REST API',
      subtitle: 'Representational State Transfer',
      icon: '🔄',
      color: '#00d4ff',
      pros: ['Simple & Stateless', 'HTTP Methods', 'JSON/XML format', 'Widely supported'],
      example: 'GET /users/123\nPOST /posts\nDELETE /item/5',
      badge: 'MOST POPULAR',
      badgeColor: '#00d4ff',
    },
    {
      name: 'GraphQL',
      subtitle: 'Query Language for APIs',
      icon: '⬡',
      color: '#7b2fff',
      pros: ['Ask for what you need', 'Single endpoint', 'Strongly typed', 'Real-time subscriptions'],
      example: 'query {\n  user(id: 123) {\n    name, email\n  }\n}',
      badge: 'FLEXIBLE',
      badgeColor: '#7b2fff',
    },
    {
      name: 'WebSocket',
      subtitle: 'Full-Duplex Communication',
      icon: '⚡',
      color: '#00ff88',
      pros: ['Real-time bidirectional', 'Low latency', 'Persistent connection', 'Push notifications'],
      example: 'ws.connect(url)\nws.onmessage(data)\nws.send("ping")',
      badge: 'REAL-TIME',
      badgeColor: '#00ff88',
    },
    {
      name: 'gRPC',
      subtitle: 'Remote Procedure Calls',
      icon: '🚀',
      color: '#ffb347',
      pros: ['Protocol Buffers', 'Ultra fast', 'Type safe', 'Microservices'],
      example: 'service UserService {\n  rpc GetUser\n  (UserReq) returns (User)\n}',
      badge: 'ULTRA FAST',
      badgeColor: '#ffb347',
    },
  ];

  const cardWidth = 400;
  const cardHeight = 380;
  const startX = 70;
  const startY = 190;
  const gapX = 430;

  return (
    <g opacity={opacity}>
      {/* Title */}
      <g opacity={titleOpacity}>
        <text x={960} y={70} textAnchor="middle" fontSize={18} fontFamily="Arial" fontWeight="600" fill="#7b2fff" letterSpacing={6}>
          TYPES OF APIS
        </text>
        <text
          x={960}
          y={130}
          textAnchor="middle"
          fontSize={52}
          fontFamily="'Arial Black', sans-serif"
          fontWeight="900"
          fill="#ffffff"
          style={{filter: 'drop-shadow(0 0 20px #7b2fff)'}}
        >
          Choose Your Protocol
        </text>
        <rect x={710} y={150} width={500} height={2} rx={1} fill="url(#types-grad)" opacity={0.8} />
        <defs>
          <linearGradient id="types-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#7b2fff" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </g>

      {/* Type cards */}
      {types.map((type, i) => {
        const cardIn = spring({frame: f - (20 + i * 18), fps, config: {damping: 14, stiffness: 90}});
        const detailsIn = interpolate(f, [60 + i * 18, 100 + i * 18], [0, 1], {extrapolateRight: 'clamp'});
        const cx = startX + i * gapX;
        const cy = startY;
        const float = Math.sin(f * 0.04 + i * 0.8) * 6;

        // Animated line indicator (like a waveform for active type)
        const isHighlighted = Math.floor(f / 90) % 4 === i;
        const waveOpacity = isHighlighted ? 0.8 : 0.3;

        return (
          <g key={i} opacity={cardIn} transform={`translate(0, ${float})`}>
            {/* Card glow */}
            <rect
              x={cx - 4}
              y={cy - 4}
              width={cardWidth + 8}
              height={cardHeight + 8}
              rx={18}
              fill={type.color}
              opacity={isHighlighted ? 0.12 : 0.04}
            />

            {/* Card body */}
            <rect
              x={cx}
              y={cy}
              width={cardWidth}
              height={cardHeight}
              rx={14}
              fill="#080e1c"
              stroke={type.color}
              strokeWidth={isHighlighted ? 2.5 : 1.5}
            />

            {/* Top gradient bar */}
            <defs>
              <linearGradient id={`card-top-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={type.color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={type.color} stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <rect x={cx} y={cy} width={cardWidth} height={6} rx={3} fill={`url(#card-top-${i})`} />

            {/* Badge */}
            <rect
              x={cx + cardWidth - 110}
              y={cy + 15}
              width={100}
              height={24}
              rx={12}
              fill={`${type.color}25`}
              stroke={type.color}
              strokeWidth={1}
            />
            <text x={cx + cardWidth - 60} y={cy + 28} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontFamily="'Arial Black', sans-serif" fontWeight="800" fill={type.color} letterSpacing={1}>
              {type.badge}
            </text>

            {/* Icon */}
            <text x={cx + 40} y={cy + 55} textAnchor="middle" dominantBaseline="middle" fontSize={40}>
              {type.icon}
            </text>

            {/* Name */}
            <text x={cx + 75} y={cy + 38} textAnchor="start" fontSize={22} fontFamily="'Arial Black', sans-serif" fontWeight="900" fill={type.color} letterSpacing={1}>
              {type.name}
            </text>
            <text x={cx + 75} y={cy + 60} textAnchor="start" fontSize={11} fontFamily="Arial, sans-serif" fill="#6688aa">
              {type.subtitle}
            </text>

            {/* Divider */}
            <rect x={cx + 20} y={cy + 80} width={cardWidth - 40} height={1} fill={type.color} opacity={0.2} />

            {/* Features list */}
            <g opacity={detailsIn}>
              {type.pros.map((pro, pi) => (
                <g key={pi}>
                  <circle cx={cx + 30} cy={cy + 108 + pi * 32} r={4} fill={type.color} opacity={0.8} />
                  <text x={cx + 46} y={cy + 113 + pi * 32} fontSize={14} fontFamily="Arial, sans-serif" fill="#c0d0e0">
                    {pro}
                  </text>
                </g>
              ))}

              {/* Code example */}
              <rect x={cx + 16} y={cy + 242} width={cardWidth - 32} height={112} rx={8} fill="#050a14" stroke={`${type.color}40`} strokeWidth={1} />
              <text x={cx + 26} y={cy + 260} fontSize={10} fontFamily="'Courier New', monospace" fill={type.color} fontWeight="bold" opacity={0.6}>
                example
              </text>
              {type.example.split('\n').map((line, li) => (
                <text key={li} x={cx + 26} y={cy + 278 + li * 18} fontSize={11} fontFamily="'Courier New', monospace" fill="#a0c8e0">
                  {line}
                </text>
              ))}
            </g>

            {/* Waveform activity indicator */}
            {Array.from({length: 8}).map((_, wi) => {
              const wh = 6 + Math.sin(f * 0.15 + i + wi * 0.8) * 14;
              return (
                <rect
                  key={wi}
                  x={cx + 20 + wi * 16}
                  y={cy + cardHeight - 20 - wh / 2}
                  width={10}
                  height={wh}
                  rx={3}
                  fill={type.color}
                  opacity={waveOpacity * 0.6}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
};
