import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const Scene4RealWorld: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn = interpolate(f, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const sceneOut = interpolate(f, [270, 300], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(sceneIn, sceneOut);

  const titleOpacity = interpolate(f, [0, 25], [0, 1], {extrapolateRight: 'clamp'});

  // Real world API examples - animated cards
  const examples = [
    {
      icon: '🌤️', name: 'Weather API', company: 'OpenWeather',
      endpoint: 'GET /weather?city=NYC',
      response: '{ "temp": 72, "sky": "sunny" }',
      color: '#00d4ff', usecase: 'Weather apps, travel sites',
    },
    {
      icon: '💳', name: 'Payment API', company: 'Stripe',
      endpoint: 'POST /v1/charges',
      response: '{ "id": "ch_xyz", "paid": true }',
      color: '#7b2fff', usecase: 'E-commerce, subscriptions',
    },
    {
      icon: '📍', name: 'Maps API', company: 'Google Maps',
      endpoint: 'GET /maps/geocode',
      response: '{ "lat": 40.71, "lng": -74.01 }',
      color: '#00ff88', usecase: 'Navigation, delivery apps',
    },
    {
      icon: '🤖', name: 'AI API', company: 'Claude / OpenAI',
      endpoint: 'POST /v1/messages',
      response: '{ "content": "Hello!" }',
      color: '#ffb347', usecase: 'Chatbots, automation',
    },
  ];

  // Network diagram center
  const centerX = 960;
  const centerY = 510;
  const orbitRadius = 310;

  // Center "YOUR APP" pulse
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.08);

  // Rotating orbit connections
  const orbitAngle = f * 0.4;

  const cardPositions = [
    {angle: -45, x: centerX - 340, y: centerY - 240},
    {angle: 45, x: centerX + 260, y: centerY - 240},
    {angle: -135, x: centerX - 340, y: centerY + 160},
    {angle: 135, x: centerX + 260, y: centerY + 160},
  ];

  return (
    <g opacity={opacity}>
      {/* Title */}
      <g opacity={titleOpacity}>
        <text x={960} y={70} textAnchor="middle" fontSize={18} fontFamily="Arial" fontWeight="600" fill="#00d4ff" letterSpacing={6}>
          REAL WORLD EXAMPLES
        </text>
        <text
          x={960}
          y={125}
          textAnchor="middle"
          fontSize={52}
          fontFamily="'Arial Black', sans-serif"
          fontWeight="900"
          fill="#ffffff"
          style={{filter: 'drop-shadow(0 0 20px #00d4ff)'}}
        >
          APIs Power Everything
        </text>
        <rect x={710} y={146} width={500} height={2} rx={1} fill="url(#rw-grad)" opacity={0.8} />
        <defs>
          <linearGradient id="rw-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </g>

      {/* Center node - YOUR APP */}
      <g>
        <circle cx={centerX} cy={centerY} r={120 + 10 * pulse} fill="#7b2fff" opacity={0.05} />
        <circle cx={centerX} cy={centerY} r={90 + 5 * pulse} fill="#7b2fff" opacity={0.1} />
        <circle
          cx={centerX}
          cy={centerY}
          r={75}
          fill="#0d1a2e"
          stroke="#7b2fff"
          strokeWidth={3}
        />
        {/* Rotating dash ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={88}
          fill="none"
          stroke="#7b2fff"
          strokeWidth={1.5}
          strokeDasharray="10 6"
          opacity={0.4}
          transform={`rotate(${orbitAngle}, ${centerX}, ${centerY})`}
        />
        <text x={centerX} y={centerY - 12} textAnchor="middle" dominantBaseline="middle" fontSize={36}>📱</text>
        <text x={centerX} y={centerY + 28} textAnchor="middle" fontSize={15} fontFamily="'Arial Black', sans-serif" fontWeight="800" fill="#7b2fff" letterSpacing={2}>
          YOUR APP
        </text>
      </g>

      {/* API Example Cards with connections */}
      {examples.map((ex, i) => {
        const pos = cardPositions[i];
        const cardIn = spring({frame: f - (30 + i * 20), fps, config: {damping: 14, stiffness: 90}});
        const detailsOpacity = interpolate(f, [80 + i * 20, 110 + i * 20], [0, 1], {extrapolateRight: 'clamp'});

        // Connection line from center to card
        const cardCenterX = pos.x + 200;
        const cardCenterY = pos.y + 75;
        const dx = cardCenterX - centerX;
        const dy = cardCenterY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const lineStartX = centerX + (dx / dist) * 78;
        const lineStartY = centerY + (dy / dist) * 78;
        const lineEndX = cardCenterX - (dx / dist) * 5;
        const lineEndY = cardCenterY - (dy / dist) * 5;

        // Animated dot on connection
        const dotT = (f * 0.015 + i * 0.25) % 1;
        const dotX = lineStartX + (lineEndX - lineStartX) * dotT;
        const dotY = lineStartY + (lineEndY - lineStartY) * dotT;

        return (
          <g key={i} opacity={cardIn}>
            {/* Connection line */}
            <line
              x1={lineStartX}
              y1={lineStartY}
              x2={lineEndX}
              y2={lineEndY}
              stroke={ex.color}
              strokeWidth={1.5}
              strokeDasharray="6 4"
              opacity={0.4}
            />
            {/* Animated dot */}
            <circle cx={dotX} cy={dotY} r={5} fill={ex.color} opacity={0.85} />
            <circle cx={dotX} cy={dotY} r={10} fill={ex.color} opacity={0.2} />

            {/* Card */}
            <rect
              x={pos.x}
              y={pos.y}
              width={390}
              height={150}
              rx={14}
              fill="#0a0f1e"
              stroke={ex.color}
              strokeWidth={2}
            />
            {/* Top accent */}
            <rect x={pos.x} y={pos.y} width={390} height={5} rx={3} fill={ex.color} opacity={0.7} />

            {/* Icon + Name */}
            <text x={pos.x + 22} y={pos.y + 45} fontSize={30} dominantBaseline="middle">{ex.icon}</text>
            <text x={pos.x + 65} y={pos.y + 32} fontSize={18} fontFamily="'Arial Black', sans-serif" fontWeight="800" fill={ex.color} letterSpacing={1}>
              {ex.name}
            </text>
            <text x={pos.x + 66} y={pos.y + 54} fontSize={12} fontFamily="Arial, sans-serif" fill="#6688aa">
              {ex.company}
            </text>

            {/* Details */}
            <g opacity={detailsOpacity}>
              <rect x={pos.x + 16} y={pos.y + 75} width={360} height={24} rx={6} fill={`${ex.color}18`} />
              <text x={pos.x + 26} y={pos.y + 89} dominantBaseline="middle" fontSize={11} fontFamily="'Courier New', monospace" fill={ex.color} fontWeight="bold">
                {ex.endpoint}
              </text>
              <text x={pos.x + 26} y={pos.y + 112} fontSize={10} fontFamily="'Courier New', monospace" fill="#8899aa">
                ← {ex.response}
              </text>
              <text x={pos.x + 26} y={pos.y + 133} fontSize={11} fontFamily="Arial, sans-serif" fill="#6688aa" fontStyle="italic">
                Used by: {ex.usecase}
              </text>
            </g>
          </g>
        );
      })}

      {/* Stats at bottom */}
      {f > 180 && (
        <g opacity={interpolate(f, [180, 210], [0, 1], {extrapolateRight: 'clamp'})}>
          {[
            {val: '13,000+', label: 'Public APIs'},
            {val: '83%', label: 'Apps use APIs'},
            {val: '4.5B', label: 'API calls/day'},
          ].map((stat, i) => (
            <g key={i}>
              <rect x={480 + i * 360} y={850} width={300} height={80} rx={12} fill={`#0a0f1e`} stroke={['#00d4ff', '#7b2fff', '#00ff88'][i]} strokeWidth={1.5} />
              <text x={480 + i * 360 + 150} y={879} textAnchor="middle" fontSize={30} fontFamily="'Arial Black', sans-serif" fontWeight="900" fill={['#00d4ff', '#7b2fff', '#00ff88'][i]}>
                {stat.val}
              </text>
              <text x={480 + i * 360 + 150} y={906} textAnchor="middle" fontSize={13} fontFamily="Arial, sans-serif" fill="#8899aa" letterSpacing={2}>
                {stat.label}
              </text>
            </g>
          ))}
        </g>
      )}
    </g>
  );
};
