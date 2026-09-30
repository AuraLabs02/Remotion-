import React from 'react';
import {AbsoluteFill, Img, random, staticFile} from 'remotion';
import {BRAND} from '../config/channel';
import {HEIGHT, WIDTH} from '../config/timing';
import {clamp} from '../lib/motion';

/** Deep stage background: drifting colour glows, perspective grid and bokeh. */
export const Backdrop: React.FC<{
  frame: number;
  grid?: number;
  glow?: number;
  palette?: [string, string, string];
  base?: string;
}> = ({frame, grid = 1, glow = 1, palette = [BRAND.blue, BRAND.violet, BRAND.cyan], base = '#04050b'}) => {
  const t = frame / 30;
  const g1x = 25 + Math.sin(t * 0.35) * 8;
  const g1y = 30 + Math.cos(t * 0.3) * 6;
  const g2x = 78 + Math.cos(t * 0.28) * 7;
  const g2y = 70 + Math.sin(t * 0.33) * 6;
  const g3x = 55 + Math.sin(t * 0.2 + 1) * 10;
  return (
    <AbsoluteFill style={{background: base, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          opacity: glow,
          background: [
            `radial-gradient(ellipse 45% 55% at ${g1x}% ${g1y}%, ${palette[0]}40 0%, ${palette[0]}00 70%)`,
            `radial-gradient(ellipse 40% 50% at ${g2x}% ${g2y}%, ${palette[1]}3a 0%, ${palette[1]}00 70%)`,
            `radial-gradient(ellipse 30% 30% at ${g3x}% 105%, ${palette[2]}30 0%, ${palette[2]}00 70%)`,
          ].join(', '),
        }}
      />
      {grid > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: -WIDTH,
            width: WIDTH * 3,
            top: HEIGHT * 0.52,
            height: HEIGHT * 1.4,
            transformOrigin: '50% 0%',
            transform: 'perspective(700px) rotateX(74deg)',
            opacity: 0.55 * grid,
            backgroundImage: `linear-gradient(${palette[0]}55 1.5px, transparent 1.5px), linear-gradient(90deg, ${palette[0]}55 1.5px, transparent 1.5px)`,
            backgroundSize: '90px 90px',
            backgroundPosition: `0px ${(frame * 2.2) % 90}px`,
            WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          }}
        />
      ) : null}
      <Bokeh frame={frame} count={22} seed="stage" color={palette[2]} />
    </AbsoluteFill>
  );
};

export const Bokeh: React.FC<{frame: number; count: number; seed: string; color?: string; opacity?: number}> = ({
  frame,
  count,
  seed,
  color = BRAND.cyan,
  opacity = 1,
}) => (
  <AbsoluteFill style={{opacity}}>
    {Array.from({length: count}).map((_, i) => {
      const r = (k: string) => random(`${seed}-${i}-${k}`);
      const size = 6 + r('s') * 38;
      const speed = 0.15 + r('v') * 0.5;
      const x = r('x') * WIDTH + Math.sin(frame * 0.01 * (1 + r('w')) + i) * 30;
      const y = (((r('y') * (HEIGHT + 200) - frame * speed) % (HEIGHT + 200)) + HEIGHT + 200) % (HEIGHT + 200) - 100;
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.03 * (0.5 + r('t')) + i));
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: size,
            height: size,
            borderRadius: '50%',
            background: i % 4 === 0 ? '#ffffff' : color,
            opacity: (0.08 + r('o') * 0.22) * tw,
            filter: `blur(${size > 28 ? 6 : 2}px)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

/** Film grain (tiled noise, re-positioned every frame) + vignette. */
export const Finish: React.FC<{frame: number; grain?: number; vignette?: number}> = ({frame, grain = 0.055, vignette = 0.55}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignette}) 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        opacity: grain,
        mixBlendMode: 'overlay',
        backgroundImage: `url(${staticFile('fx/grain.png')})`,
        backgroundRepeat: 'repeat',
        backgroundPosition: `${Math.floor(random(`gx${frame}`) * 256)}px ${Math.floor(random(`gy${frame}`) * 256)}px`,
      }}
    />
    {/* preloads the tile so Remotion waits for it */}
    <Img src={staticFile('fx/grain.png')} style={{position: 'absolute', width: 1, height: 1, opacity: 0}} />
  </AbsoluteFill>
);

export const Flash: React.FC<{frame: number; at: number; dur?: number; color?: string; peak?: number}> = ({
  frame,
  at,
  dur = 10,
  color = '#fff',
  peak = 1,
}) => {
  const t = frame - at;
  if (t < -2 || t > dur) return null;
  const o = t < 0 ? (t + 2) / 2 : Math.pow(1 - t / dur, 2);
  return <AbsoluteFill style={{background: color, opacity: clamp(o) * peak, pointerEvents: 'none'}} />;
};
