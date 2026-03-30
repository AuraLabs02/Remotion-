import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {ParticleField} from '../components/ParticleField';

export const Scene6Outro: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn = interpolate(f, [0, 30], [0, 1], {extrapolateRight: 'clamp'});

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.08);
  const pulse2 = 0.5 + 0.5 * Math.sin(f * 0.06 + 1);

  const titleIn = spring({frame: f - 10, fps, config: {damping: 12, stiffness: 80}});
  const sub1In = spring({frame: f - 35, fps, config: {damping: 14, stiffness: 100}});
  const sub2In = spring({frame: f - 55, fps, config: {damping: 14, stiffness: 100}});
  const sub3In = spring({frame: f - 75, fps, config: {damping: 14, stiffness: 100}});

  // Summary points
  const summaryPoints = [
    {icon: '🔗', text: 'APIs connect software systems', color: '#00d4ff'},
    {icon: '📡', text: 'Request → Response cycle', color: '#7b2fff'},
    {icon: '🌐', text: 'REST, GraphQL, WebSocket & gRPC', color: '#00ff88'},
    {icon: '⚡', text: 'Power billions of apps daily', color: '#ffb347'},
  ];

  // Explosion of particles from center on load
  const explosionOpacity = interpolate(f, [0, 15], [1, 0], {extrapolateRight: 'clamp'});

  // Final fade
  const finalFade = interpolate(f, [160, 180], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <g opacity={Math.min(sceneIn, finalFade)}>
      <ParticleField opacity={0.5} />

      {/* Background radial gradient */}
      <defs>
        <radialGradient id="outro-radial" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1a0a3e" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#050714" stopOpacity="0" />
        </radialGradient>
        <filter id="outro-glow">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx={960} cy={540} rx={800} ry={500} fill="url(#outro-radial)" />

      {/* Animated circuit lines */}
      {Array.from({length: 10}).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2 + f * 0.005;
        const r1 = 200;
        const r2 = 450;
        const x1 = 960 + Math.cos(angle) * r1;
        const y1 = 540 + Math.sin(angle) * r1;
        const x2 = 960 + Math.cos(angle) * r2;
        const y2 = 540 + Math.sin(angle) * r2;
        const lineProgress = interpolate(f, [i * 3, i * 3 + 40], [0, 1], {extrapolateRight: 'clamp'});
        const currentX2 = x1 + (x2 - x1) * lineProgress;
        const currentY2 = y1 + (y2 - y1) * lineProgress;
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y1}
              x2={currentX2}
              y2={currentY2}
              stroke={['#00d4ff', '#7b2fff', '#00ff88', '#ffb347', '#ff6b6b'][i % 5]}
              strokeWidth={1}
              opacity={0.3}
            />
            {lineProgress >= 1 && (
              <circle cx={x2} cy={y2} r={4} fill={['#00d4ff', '#7b2fff', '#00ff88', '#ffb347', '#ff6b6b'][i % 5]} opacity={0.7 + 0.3 * pulse} />
            )}
          </g>
        );
      })}

      {/* Center concentric rings */}
      {[80, 130, 180].map((r, i) => (
        <circle
          key={i}
          cx={960}
          cy={440}
          r={r * titleIn}
          fill="none"
          stroke={['#00d4ff', '#7b2fff', '#7b2fff'][i]}
          strokeWidth={1.5}
          strokeDasharray={`${12 + i * 4} ${8 + i * 3}`}
          opacity={0.2 + 0.1 * pulse}
          transform={`rotate(${f * (0.5 + i * 0.3) * (i % 2 === 0 ? 1 : -1)}, 960, 440)`}
        />
      ))}

      {/* Main title */}
      <g transform={`translate(960, 440) scale(${titleIn})`} opacity={titleIn}>
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={96}
          fontFamily="'Arial Black', Impact, sans-serif"
          fontWeight="900"
          letterSpacing={6}
          style={{filter: `drop-shadow(0 0 ${20 + 10 * pulse}px #00d4ff) drop-shadow(0 0 ${40 + 15 * pulse2}px #7b2fff)`}}
        >
          <tspan fill="#ffffff">NOW YOU </tspan>
          <tspan fill="#00d4ff">KNOW</tspan>
        </text>
        <text
          x={0}
          y={72}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={26}
          fontFamily="Arial, sans-serif"
          fontWeight="300"
          fill="#8899aa"
          letterSpacing={6}
        >
          HOW APIs WORK
        </text>
      </g>

      {/* Underline */}
      {f > 20 && (
        <rect
          x={960 - interpolate(f, [20, 45], [0, 220], {extrapolateRight: 'clamp'})}
          y={490}
          width={interpolate(f, [20, 45], [0, 440], {extrapolateRight: 'clamp'})}
          height={2}
          rx={1}
          fill="url(#outro-line-grad)"
        />
      )}
      <defs>
        <linearGradient id="outro-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7b2fff" />
          <stop offset="50%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#7b2fff" />
        </linearGradient>
      </defs>

      {/* Summary points */}
      <g>
        {summaryPoints.map((point, i) => {
          const springs = [sub1In, sub2In, sub3In, interpolate(f, [95, 120], [0, 1], {extrapolateRight: 'clamp'})];
          const si = springs[i];
          return (
            <g key={i} opacity={si} transform={`translate(0, ${(1 - si) * 30})`}>
              <rect
                x={560}
                y={530 + i * 70}
                width={800}
                height={54}
                rx={10}
                fill={`${point.color}12`}
                stroke={point.color}
                strokeWidth={1.5}
                opacity={0.8}
              />
              <text x={600} y={557 + i * 70} dominantBaseline="middle" fontSize={26}>
                {point.icon}
              </text>
              <text
                x={650}
                y={558 + i * 70}
                dominantBaseline="middle"
                fontSize={20}
                fontFamily="Arial, sans-serif"
                fontWeight="600"
                fill="#ddeeff"
              >
                {point.text}
              </text>
              {/* Colored dot indicator */}
              <circle cx={1310} cy={557 + i * 70} r={8} fill={point.color} opacity={0.8 + 0.2 * Math.sin(f * 0.1 + i)} />
            </g>
          );
        })}
      </g>

      {/* Bottom brand */}
      {f > 110 && (
        <g opacity={interpolate(f, [110, 140], [0, 1], {extrapolateRight: 'clamp'})}>
          <text
            x={960}
            y={1010}
            textAnchor="middle"
            fontSize={16}
            fontFamily="Arial, sans-serif"
            fill="#3a4a5a"
            letterSpacing={4}
          >
            MOTION GRAPHICS · BUILT WITH REMOTION
          </text>
        </g>
      )}
    </g>
  );
};
