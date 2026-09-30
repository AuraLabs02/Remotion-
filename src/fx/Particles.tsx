import React from 'react';
import {random} from 'remotion';
import {BRAND} from '../config/channel';
import {clamp, EASE} from '../lib/motion';

const CONFETTI_COLORS = [BRAND.cyan, BRAND.blue, BRAND.violet, BRAND.pink, '#ffffff', '#fbbf24', '#ff3b3b'];

/** Deterministic confetti burst with drag, gravity and 3D flutter. */
export const Confetti: React.FC<{
  frame: number;
  start: number;
  x: number;
  y: number;
  count?: number;
  seed?: string;
  power?: number;
  /** Direction (deg, 0 = right, -90 = up) and spread (deg). */
  angle?: number;
  spread?: number;
  gravity?: number;
  life?: number;
  size?: number;
  colors?: string[];
}> = ({
  frame,
  start,
  x,
  y,
  count = 120,
  seed = 'c',
  power = 38,
  angle = -90,
  spread = 360,
  gravity = 0.9,
  life = 90,
  size = 1,
  colors = CONFETTI_COLORS,
}) => {
  const t = frame - start;
  if (t < 0 || t > life) return null;
  const drag = 0.075;
  const decay = (1 - Math.exp(-drag * t)) / drag;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0}}>
      {Array.from({length: count}).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const a = ((angle + (r('a') - 0.5) * spread) * Math.PI) / 180;
        const v = power * (0.35 + 0.65 * Math.pow(r('v'), 0.7));
        const px = x + Math.cos(a) * v * decay + Math.sin(t * 0.15 + i) * 6 * (t / life);
        const py = y + Math.sin(a) * v * decay + gravity * t * t * 0.09 * (0.6 + r('g') * 0.8);
        const kind = r('k');
        const w = (kind < 0.55 ? 9 : kind < 0.8 ? 7 : 4) * size * (0.7 + r('s') * 0.6);
        const h = (kind < 0.55 ? 15 : kind < 0.8 ? 7 : 22) * size * (0.7 + r('s') * 0.6);
        const fade = clamp((life - t) / 20);
        const pop = clamp(t / 3);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: w,
              height: h,
              marginLeft: -w / 2,
              marginTop: -h / 2,
              borderRadius: kind > 0.55 && kind < 0.8 ? '50%' : 2,
              background: colors[Math.floor(r('c') * colors.length)],
              opacity: fade * pop,
              transform: `rotate(${r('r') * 360 + t * (r('w') - 0.5) * 30}deg) rotateX(${t * (8 + r('x') * 14)}deg) rotateY(${t * r('y') * 10}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};

/** Expanding ring. */
export const Shockwave: React.FC<{
  frame: number;
  start: number;
  x: number;
  y: number;
  from?: number;
  to?: number;
  dur?: number;
  color?: string;
  width?: number;
}> = ({frame, start, x, y, from = 20, to = 700, dur = 22, color = '#ffffff', width = 10}) => {
  const t = (frame - start) / dur;
  if (t < 0 || t > 1) return null;
  const e = EASE.out(t);
  const r = from + (to - from) * e;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        border: `${Math.max(0.5, width * (1 - t))}px solid ${color}`,
        opacity: 1 - t,
        boxShadow: `0 0 ${30 * (1 - t)}px ${color}, inset 0 0 ${30 * (1 - t)}px ${color}`,
      }}
    />
  );
};

/** Rotating god-rays centred on (x, y). */
export const Rays: React.FC<{frame: number; x: number; y: number; size?: number; opacity?: number; color?: string; count?: number}> = ({
  frame,
  x,
  y,
  size = 2200,
  opacity = 1,
  color = 'rgba(120,160,255,0.35)',
  count = 18,
}) => {
  const step = 360 / count;
  const stops: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = i * step;
    stops.push(`${color} ${a}deg ${a + step * 0.28}deg`, `rgba(0,0,0,0) ${a + step * 0.28}deg ${a + step}deg`);
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        opacity,
        background: `conic-gradient(from ${frame * 0.6}deg, ${stops.join(', ')})`,
        WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0) 62%)',
        maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0) 62%)',
      }}
    />
  );
};

export const Star4: React.FC<{size: number; color?: string; style?: React.CSSProperties}> = ({size, color = '#fff', style}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{display: 'block', overflow: 'visible', ...style}}>
    <path d="M12 0C12.9 7.2 16.8 11.1 24 12 16.8 12.9 12.9 16.8 12 24 11.1 16.8 7.2 12.9 0 12 7.2 11.1 11.1 7.2 12 0z" fill={color} />
  </svg>
);

/** Twinkling 4-point stars scattered in a ring around (x, y). */
export const Sparkles: React.FC<{
  frame: number;
  start: number;
  x: number;
  y: number;
  radius?: number;
  count?: number;
  seed?: string;
  life?: number;
  size?: number;
  color?: string;
}> = ({frame, start, x, y, radius = 160, count = 14, seed = 's', life = 40, size = 22, color = '#fff'}) => {
  const t = frame - start;
  if (t < 0 || t > life + 20) return null;
  return (
    <div style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: count}).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const delay = r('d') * life * 0.5;
        const lt = (t - delay) / (life * 0.6);
        if (lt < 0 || lt > 1) return null;
        const a = r('a') * Math.PI * 2;
        const d = radius * (0.45 + r('r') * 0.75) * (0.8 + lt * 0.35);
        const s = size * (0.4 + r('s') * 0.9) * Math.sin(lt * Math.PI);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.cos(a) * d - s / 2,
              top: y + Math.sin(a) * d - s / 2,
              transform: `rotate(${lt * 90 * (r('w') > 0.5 ? 1 : -1)}deg)`,
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          >
            <Star4 size={s} color={i % 3 === 0 ? BRAND.cyan : color} />
          </div>
        );
      })}
    </div>
  );
};
