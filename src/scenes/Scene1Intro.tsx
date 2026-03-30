import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {ParticleField} from '../components/ParticleField';

export const Scene1Intro: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  // Title animation
  const titleScale = spring({frame: f - 10, fps, config: {damping: 12, stiffness: 80}});
  const titleOpacity = interpolate(f, [10, 40], [0, 1], {extrapolateRight: 'clamp'});

  // Subtitle slide up
  const subtitleY = interpolate(f, [40, 70], [50, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const subtitleOpacity = interpolate(f, [40, 70], [0, 1], {extrapolateRight: 'clamp'});

  // Tagline
  const tagOpacity = interpolate(f, [70, 100], [0, 1], {extrapolateRight: 'clamp'});

  // Fade out at end
  const sceneOpacity = interpolate(f, [120, 150], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Rotating ring
  const ringRotation = f * 1.2;

  // Pulse for center glow
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.1);
  const pulse2 = 0.5 + 0.5 * Math.sin(f * 0.07 + 1);

  return (
    <g opacity={sceneOpacity}>
      <ParticleField opacity={0.7} />

      {/* Background gradient rings */}
      <defs>
        <radialGradient id="bg-radial" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1a0a3e" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#050714" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7b2fff" stopOpacity={0.3 + 0.2 * pulse} />
          <stop offset="100%" stopColor="#7b2fff" stopOpacity="0" />
        </radialGradient>
        <filter id="strong-glow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="text-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Center glow */}
      <ellipse cx={960} cy={540} rx={600} ry={400} fill="url(#glow-center)" />

      {/* Animated rings */}
      {[280, 360, 440, 520].map((r, i) => {
        const rot = ringRotation * (i % 2 === 0 ? 1 : -1) * (0.5 + i * 0.15);
        const opacity = 0.15 + i * 0.05 + 0.05 * Math.sin(f * 0.06 + i);
        return (
          <g key={i} transform={`translate(960, 540) rotate(${rot})`}>
            <ellipse
              cx={0}
              cy={0}
              rx={r}
              ry={r * 0.35}
              fill="none"
              stroke={i % 2 === 0 ? '#00d4ff' : '#7b2fff'}
              strokeWidth={1.5}
              strokeDasharray={`${10 + i * 5} ${20 + i * 8}`}
              opacity={opacity}
            />
          </g>
        );
      })}

      {/* Orbiting dots */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const a = (angle + f * (1 + i * 0.1)) * (Math.PI / 180);
        const rx = 350;
        const ry = 130;
        const x = 960 + Math.cos(a) * rx;
        const y = 540 + Math.sin(a) * ry;
        const dotPulse = 0.5 + 0.5 * Math.sin(f * 0.1 + i);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={8 * dotPulse} fill="#00d4ff" opacity={0.4 * dotPulse} />
            <circle cx={x} cy={y} r={4} fill="#00d4ff" opacity={0.9} />
          </g>
        );
      })}

      {/* Main title */}
      <g transform={`translate(960, 480) scale(${titleScale})`} opacity={titleOpacity}>
        {/* Shadow/glow layer */}
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={130}
          fontFamily="'Arial Black', Impact, sans-serif"
          fontWeight="900"
          fill="#00d4ff"
          opacity={0.15 + 0.1 * pulse}
          letterSpacing={8}
          filter="url(#strong-glow)"
        >
          HOW API WORKS
        </text>
        {/* Main text */}
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={130}
          fontFamily="'Arial Black', Impact, sans-serif"
          fontWeight="900"
          letterSpacing={8}
          style={{
            filter: 'drop-shadow(0 0 30px #00d4ff) drop-shadow(0 0 60px #7b2fff)',
          }}
        >
          <tspan fill="#ffffff">HOW </tspan>
          <tspan fill="#00d4ff">API</tspan>
          <tspan fill="#ffffff"> WORKS</tspan>
        </text>
      </g>

      {/* Animated underline */}
      {f > 35 && (
        <rect
          x={960 - interpolate(f, [35, 60], [0, 380], {extrapolateRight: 'clamp'})}
          y={560}
          width={interpolate(f, [35, 60], [0, 760], {extrapolateRight: 'clamp'})}
          height={3}
          fill="url(#line-gradient)"
          rx={2}
        />
      )}
      <defs>
        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7b2fff" />
          <stop offset="50%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#7b2fff" />
        </linearGradient>
      </defs>

      {/* Subtitle */}
      <g transform={`translate(0, ${subtitleY})`} opacity={subtitleOpacity}>
        <text
          x={960}
          y={635}
          textAnchor="middle"
          fontSize={32}
          fontFamily="'Arial', sans-serif"
          fontWeight="300"
          fill="#a0b4d0"
          letterSpacing={8}
        >
          APPLICATION PROGRAMMING INTERFACE
        </text>
      </g>

      {/* Tagline */}
      <g opacity={tagOpacity}>
        <rect x={760} y={700} width={400} height={50} rx={25} fill="none" stroke="#7b2fff" strokeWidth={1.5} opacity={0.6} />
        <text
          x={960}
          y={726}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={18}
          fontFamily="'Arial', sans-serif"
          fontWeight="600"
          fill="#7b2fff"
          letterSpacing={4}
        >
          THE INVISIBLE SUPERPOWER
        </text>
      </g>

      {/* Floating code fragments */}
      {['GET /api/data', 'POST /users', '200 OK', '{"status":"ok"}', 'REST | GraphQL', 'HTTP/2'].map((code, i) => {
        const baseX = [200, 1600, 150, 1700, 250, 1650][i];
        const baseY = [200, 200, 800, 800, 500, 500][i];
        const floatY = baseY + Math.sin(f * 0.03 + i * 1.1) * 15;
        const codeOpacity = interpolate(f, [60 + i * 10, 90 + i * 10], [0, 1], {extrapolateRight: 'clamp'}) * 0.6;
        return (
          <text
            key={i}
            x={baseX}
            y={floatY}
            textAnchor="middle"
            fontSize={14}
            fontFamily="'Courier New', monospace"
            fill="#00d4ff"
            opacity={codeOpacity}
            letterSpacing={1}
          >
            {code}
          </text>
        );
      })}
    </g>
  );
};
