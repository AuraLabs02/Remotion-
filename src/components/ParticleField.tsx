import React from 'react';
import {useCurrentFrame} from 'remotion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
  drift: number;
}

const COLORS = ['#00d4ff', '#7b2fff', '#ff6b6b', '#00ff88', '#ffb347'];

const generateParticles = (count: number, seed: number): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const s = (seed * 9301 + i * 49297 + 233995) % 233280;
    const r = s / 233280;
    const s2 = (s * 9301 + 49297 + 233995) % 233280;
    const r2 = s2 / 233280;
    const s3 = (s2 * 9301 + 49297 + 233995) % 233280;
    const r3 = s3 / 233280;
    const s4 = (s3 * 9301 + 49297 + 233995) % 233280;
    const r4 = s4 / 233280;
    const s5 = (s4 * 9301 + 49297 + 233995) % 233280;
    const r5 = s5 / 233280;
    const s6 = (s5 * 9301 + 49297 + 233995) % 233280;
    const r6 = s6 / 233280;
    particles.push({
      x: r * 1920,
      y: r2 * 1080,
      size: 1 + r3 * 3,
      speed: 0.3 + r4 * 0.7,
      opacity: 0.2 + r5 * 0.6,
      color: COLORS[Math.floor(r6 * COLORS.length)],
      drift: (r3 - 0.5) * 0.5,
    });
  }
  return particles;
};

const PARTICLES = generateParticles(80, 42);

export const ParticleField: React.FC<{opacity?: number}> = ({opacity = 1}) => {
  const frame = useCurrentFrame();

  return (
    <svg
      width={1920}
      height={1080}
      style={{position: 'absolute', top: 0, left: 0, opacity}}
    >
      {PARTICLES.map((p, i) => {
        const y = ((p.y + frame * p.speed) % 1100) - 10;
        const x = p.x + Math.sin(frame * 0.02 + i) * 20 * p.drift;
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.05 + i * 1.3);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={p.size * (0.8 + 0.2 * pulse)}
            fill={p.color}
            opacity={p.opacity * pulse * opacity}
          />
        );
      })}
    </svg>
  );
};
