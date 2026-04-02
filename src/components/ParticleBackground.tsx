import React from 'react';
import { useCurrentFrame } from 'remotion';
import { theme } from '../design/theme';

interface ParticleBackgroundProps {
  count?: number;
  color?: string;
  maxSize?: number;
  speed?: number;
  opacity?: number;
  width?: number;
  height?: number;
}

// Pseudo-random number generator (seeded for consistency across frames)
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  count = 60,
  color = theme.colors.primary.light,
  maxSize = 5,
  speed = 0.5,
  opacity = 0.12,
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();

  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: seededRandom(i * 3 + 1) * width,
      y: seededRandom(i * 3 + 2) * height,
      size: 1 + seededRandom(i * 3 + 3) * maxSize,
      speedX: (seededRandom(i * 5 + 4) - 0.5) * speed,
      speedY: (seededRandom(i * 5 + 5) - 0.5) * speed * 0.6,
      phase: seededRandom(i * 7 + 6) * Math.PI * 2,
      pulseSpeed: 0.02 + seededRandom(i * 11 + 7) * 0.04,
    }));
  }, [count, width, height, maxSize, speed]);

  return (
    <g>
      {particles.map((p, i) => {
        const px = (p.x + frame * p.speedX + Math.sin(frame * 0.01 + p.phase) * 20) % width;
        const py = (p.y + frame * p.speedY + Math.cos(frame * 0.008 + p.phase) * 15) % height;
        const pOpacity = opacity * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(frame * p.pulseSpeed + p.phase)));

        return (
          <circle
            key={i}
            cx={px < 0 ? px + width : px}
            cy={py < 0 ? py + height : py}
            r={p.size}
            fill={color}
            opacity={pOpacity}
          />
        );
      })}
    </g>
  );
};
