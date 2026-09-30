import React from 'react';
import {clamp, EASE, type Ease, lerp} from '../lib/motion';

export type CursorKey = {t: number; x: number; y: number; ease?: Ease};

/** Position along cursor keys with a gentle arc between points (hand-drawn feel). */
export const cursorAt = (keys: CursorKey[], f: number) => {
  if (f <= keys[0].t) return {x: keys[0].x, y: keys[0].y};
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const n = keys[i + 1];
    if (f < n.t) {
      const p = (n.ease ?? EASE.inOut)(clamp((f - a.t) / (n.t - a.t)));
      const dx = n.x - a.x;
      const dy = n.y - a.y;
      // perpendicular bow, proportional to travel distance
      const bow = Math.sin(p * Math.PI) * Math.min(80, Math.hypot(dx, dy) * 0.12);
      const len = Math.hypot(dx, dy) || 1;
      return {x: lerp(a.x, n.x, p) + (-dy / len) * bow, y: lerp(a.y, n.y, p) + (dx / len) * bow};
    }
  }
  const last = keys[keys.length - 1];
  return {x: last.x, y: last.y};
};

/** Desktop pointer: arrow, or hand when hovering something clickable. */
export const Cursor: React.FC<{
  x: number;
  y: number;
  hand?: number;
  press?: number;
  opacity?: number;
  scale?: number;
  /** 0→1 click ring. */
  click?: number;
}> = ({x, y, hand = 0, press = 0, opacity = 1, scale = 1, click}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 0,
      height: 0,
      opacity,
      pointerEvents: 'none',
      zIndex: 50,
    }}
  >
    {click !== undefined && click > 0 && click < 1 ? (
      <div
        style={{
          position: 'absolute',
          left: -40,
          top: -40,
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: `${3 * (1 - click) + 0.5}px solid rgba(255,255,255,${0.9 * (1 - click)})`,
          transform: `scale(${0.2 + EASE.out(click) * 1.1})`,
          boxShadow: `0 0 ${20 * (1 - click)}px rgba(62,166,255,${0.8 * (1 - click)})`,
        }}
      />
    ) : null}
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `scale(${scale * (1 - press * 0.18)})`,
        transformOrigin: '0 0',
        filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.55))',
      }}
    >
      <svg viewBox="0 0 28 28" width={30} height={30} style={{position: 'absolute', left: -6, top: -3, opacity: 1 - clamp(hand)}}>
        <path
          d="M6 3.2v19.1l4.9-4.6 3.2 7.2 3.4-1.5-3.1-7h6.9z"
          fill="#fff"
          stroke="#111"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <svg viewBox="0 0 32 32" width={32} height={32} style={{position: 'absolute', left: -11, top: -2, opacity: clamp(hand)}}>
        <path
          d="M11.2 3.3c1.2 0 2.2 1 2.2 2.2v8.2h.3v-2.1c0-1.2 1-2.1 2.2-2.1s2.2 1 2.2 2.1v2.1h.3v-1.2c0-1.2 1-2.1 2.2-2.1s2.2 1 2.2 2.1v1.6h.3c0-1.1.9-1.9 2-1.9s2 .9 2 2v6.1c0 4.5-3.5 8.1-8 8.1h-2.2c-2.4 0-4.6-1.1-6.1-3.1l-5.5-7.3c-.7-1-.5-2.3.5-3 .9-.6 2.2-.5 2.9.4l1.3 1.6V5.5c0-1.2 1-2.2 2.2-2.2z"
          fill="#fff"
          stroke="#111"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M16 22v4M19.5 22v4M23 22v4" stroke="#111" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>
  </div>
);

/** Click feedback ring, anchored where the click happened. */
export const ClickRing: React.FC<{x: number; y: number; p: number; color?: string}> = ({x, y, p, color = 'rgba(62,166,255,0.9)'}) =>
  p > 0 && p < 1 ? (
    <div
      style={{
        position: 'absolute',
        left: x - 40,
        top: y - 40,
        width: 80,
        height: 80,
        borderRadius: '50%',
        border: `${3 * (1 - p) + 0.5}px solid rgba(255,255,255,${0.9 * (1 - p)})`,
        transform: `scale(${0.2 + EASE.out(p) * 1.1})`,
        boxShadow: `0 0 ${20 * (1 - p)}px ${color}`,
        opacity: 1 - p * 0.3,
        pointerEvents: 'none',
      }}
    />
  ) : null;
