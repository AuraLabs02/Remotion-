import React from 'react';
import {random} from 'remotion';
import {clamp, EASE, lerp} from '../lib/motion';

type Mode = 'rise' | 'pop' | 'blur' | 'drop';
type Exit = {start: number; dur?: number; mode: 'explode' | 'rise' | 'fade' | 'fall'; stagger?: number};

/** Per-character kinetic typography. Each glyph animates with its own offset. */
export const SplitText: React.FC<{
  text: string;
  frame: number;
  start: number;
  dur?: number;
  stagger?: number;
  mode?: Mode;
  exit?: Exit;
  style?: React.CSSProperties;
  charStyle?: (i: number, ch: string) => React.CSSProperties | undefined;
  seed?: string;
}> = ({text, frame, start, dur = 14, stagger = 1.4, mode = 'rise', exit, style, charStyle, seed = 'st'}) => {
  const chars = Array.from(text);
  return (
    <div style={{display: 'flex', whiteSpace: 'pre', ...style}}>
      {chars.map((ch, i) => {
        const p = clamp((frame - start - i * stagger) / dur);
        const e = mode === 'pop' ? EASE.outBack(p) : EASE.out(p);
        let transform = '';
        let opacity = 1;
        let filter: string | undefined;
        if (mode === 'rise') {
          transform = `translateY(${(1 - e) * 105}%)`;
        } else if (mode === 'drop') {
          transform = `translateY(${(e - 1) * 105}%)`;
        } else if (mode === 'pop') {
          transform = `scale(${lerp(0.2, 1, e)}) translateY(${(1 - e) * 30}%)`;
          opacity = clamp(p * 3);
        } else {
          transform = `scale(${lerp(1.4, 1, e)})`;
          opacity = p;
          filter = `blur(${(1 - e) * 18}px)`;
        }
        if (exit) {
          const q = clamp((frame - exit.start - i * (exit.stagger ?? 0.8)) / (exit.dur ?? 12));
          if (q > 0) {
            const eq = exit.mode === 'explode' ? EASE.out(q) : EASE.in(q);
            const r = (k: string) => random(`${seed}-${i}-${k}`) - 0.5;
            if (exit.mode === 'explode') {
              transform += ` translate(${r('x') * 900 * eq}px, ${r('y') * 700 * eq}px) rotate(${r('r') * 220 * eq}deg) scale(${1 + eq * 1.4})`;
              opacity *= 1 - eq;
              filter = `blur(${eq * 14}px)`;
            } else if (exit.mode === 'rise') {
              transform += ` translateY(${-eq * 110}%)`;
            } else if (exit.mode === 'fall') {
              transform += ` translateY(${eq * 120}%) rotate(${r('r') * 40 * eq}deg)`;
              opacity *= 1 - eq;
            } else {
              opacity *= 1 - eq;
            }
          }
        }
        const exiting = exit ? frame >= exit.start + i * (exit.stagger ?? 0.8) : false;
        // letters that fly/blur away must not be clipped by their mask box
        const clip = (mode === 'rise' || mode === 'drop' || exit?.mode === 'rise') && !(exiting && exit?.mode !== 'rise');
        return (
          <span key={i} style={{display: 'inline-block', overflow: clip ? 'hidden' : 'visible', lineHeight: 1.08, paddingBottom: clip ? '0.04em' : 0}}>
            <span style={{display: 'inline-block', transform, opacity, filter, ...charStyle?.(i, ch)}}>{ch}</span>
          </span>
        );
      })}
    </div>
  );
};

/** Typewriter reveal with blinking caret. */
export const Typewriter: React.FC<{text: string; frame: number; start: number; cps?: number; caret?: boolean; style?: React.CSSProperties}> = ({
  text,
  frame,
  start,
  cps = 1.4,
  caret = true,
  style,
}) => {
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - start) * cps)));
  const done = n >= text.length;
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <span style={{whiteSpace: 'pre', ...style}}>
      {text.slice(0, n)}
      {caret && (!done || blink) && frame >= start ? <span style={{opacity: 0.9}}>▍</span> : null}
    </span>
  );
};
