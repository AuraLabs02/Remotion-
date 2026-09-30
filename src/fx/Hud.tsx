import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BRAND, CHANNEL} from '../config/channel';
import {b, FPS, HEIGHT, SCENES, WIDTH} from '../config/timing';
import {clamp, EASE} from '../lib/motion';
import {FONT} from '../theme/tokens';
import {Typewriter} from './Type';

const CHAPTERS: {from: number; to: number; label: string}[] = [
  {from: SCENES.channel[0], to: SCENES.channel[1], label: '01 — DISCOVER'},
  {from: SCENES.join[0], to: SCENES.join[1], label: '02 — CHOOSE A LEVEL'},
  {from: SCENES.checkout[0], to: SCENES.buildup[1], label: '03 — CHECKOUT'},
  {from: SCENES.drop[0], to: SCENES.drop[1], label: '04 — WELCOME'},
  {from: SCENES.perks[0], to: SCENES.perks[1], label: '05 — MEMBER PERKS'},
];

const timecode = (f: number) => {
  const s = Math.floor(f / FPS);
  const ff = f % FPS;
  const p = (n: number) => String(n).padStart(2, '0');
  return `00:00:${p(s)}:${p(ff)}`;
};

const Bracket: React.FC<{x: number; y: number; sx: number; sy: number; o: number}> = ({x, y, sx, sy, o}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 26, height: 26, transform: `scale(${sx}, ${sy})`, transformOrigin: '0 0', opacity: o}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 26, height: 2, background: '#fff'}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 2, height: 26, background: '#fff'}} />
  </div>
);

/** Showreel HUD: frame brackets, labels, chapter and running timecode. */
export const Hud: React.FC<{frame: number}> = ({frame}) => {
  const intro = EASE.out(clamp((frame - 6) / 20));
  const out = 1 - clamp((frame - b(78)) / 20);
  const o = intro * out * 0.55;
  const m = 44;
  const chapter = CHAPTERS.find((c) => frame >= b(c.from) && frame < b(c.to));
  const ch = chapter ? clamp((frame - b(chapter.from)) / (b(chapter.to) - b(chapter.from))) : 0;
  const chIn = chapter ? EASE.out(clamp((frame - b(chapter.from)) / 10)) : 0;
  const chOut = chapter ? 1 - clamp((frame - (b(chapter.to) - 8)) / 8) : 0;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', fontFamily: FONT.mono, color: '#fff'}}>
      <Bracket x={m} y={m} sx={1} sy={1} o={o} />
      <Bracket x={WIDTH - m} y={m} sx={-1} sy={1} o={o} />
      <Bracket x={m} y={HEIGHT - m} sx={1} sy={-1} o={o} />
      <Bracket x={WIDTH - m} y={HEIGHT - m} sx={-1} sy={-1} o={o} />
      <div style={{position: 'absolute', left: m + 40, top: m + 4, fontSize: 15, letterSpacing: 2.5, opacity: o * 1.4}}>
        {CHANNEL.name.toUpperCase()} <span style={{color: BRAND.cyan}}>/</span> MEMBERSHIP FLOW
      </div>
      <div style={{position: 'absolute', right: m + 40, top: m + 4, fontSize: 15, letterSpacing: 2.5, opacity: o * 1.4, textAlign: 'right'}}>
        UI MOTION REEL <span style={{color: BRAND.cyan}}>’26</span>
      </div>
      <div style={{position: 'absolute', right: m + 40, bottom: m + 2, fontSize: 15, letterSpacing: 2, opacity: o * 1.4}}>
        <span style={{color: '#ff4040'}}>●</span> {timecode(frame)} <span style={{opacity: 0.6}}>· 30 FPS</span>
      </div>
      {chapter ? (
        <div
          key={chapter.label}
          style={{
            position: 'absolute',
            left: m + 40,
            bottom: m + 2,
            opacity: chIn * chOut * 0.95,
            transform: `translateY(${(1 - chIn) * 14}px)`,
          }}
        >
          <div style={{fontSize: 17, letterSpacing: 3, fontWeight: 700}}>
            <Typewriter text={chapter.label} frame={frame} start={b(chapter.from)} cps={1.6} caret={false} />
          </div>
          <div style={{width: 220, height: 2, background: 'rgba(255,255,255,0.18)', marginTop: 10}}>
            <div style={{width: `${ch * 100}%`, height: 2, background: BRAND.cyan, boxShadow: `0 0 8px ${BRAND.cyan}`}} />
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
