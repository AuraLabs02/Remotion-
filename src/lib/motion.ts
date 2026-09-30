import {Easing, spring, type SpringConfig} from 'remotion';

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mix = lerp;

export type Ease = (t: number) => number;

export const EASE = {
  linear: ((t: number) => t) as Ease,
  out: Easing.bezier(0.16, 1, 0.3, 1),
  outSoft: Easing.bezier(0.22, 1, 0.36, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  inSoft: Easing.bezier(0.55, 0, 1, 0.45),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  inOutStrong: Easing.bezier(0.83, 0, 0.17, 1),
  whip: Easing.bezier(0.87, 0, 0.13, 1),
  smooth: Easing.bezier(0.45, 0, 0.55, 1),
  outBack: Easing.bezier(0.34, 1.56, 0.64, 1),
  outBackSoft: Easing.bezier(0.3, 1.3, 0.6, 1),
};

/** 0→1 progress of `frame` through [start, start + dur], eased. */
export const prog = (frame: number, start: number, dur: number, ease: Ease = EASE.inOut) =>
  ease(clamp((frame - start) / Math.max(1, dur)));

/** Map frame through keyframes (clamped) with one easing for every segment. */
export const kf = (frame: number, input: number[], output: number[], ease: Ease = EASE.inOut) => {
  if (frame <= input[0]) return output[0];
  for (let i = 0; i < input.length - 1; i++) {
    if (frame < input[i + 1]) {
      const t = ease((frame - input[i]) / (input[i + 1] - input[i]));
      return lerp(output[i], output[i + 1], t);
    }
  }
  return output[output.length - 1];
};

export const SPRING = {
  snap: {damping: 22, stiffness: 240, mass: 0.7},
  pop: {damping: 11, stiffness: 240, mass: 0.6},
  bouncy: {damping: 9, stiffness: 150, mass: 0.8},
  soft: {damping: 24, stiffness: 90, mass: 1},
  heavy: {damping: 16, stiffness: 80, mass: 1.6},
} satisfies Record<string, Partial<SpringConfig>>;

export const springAt = (
  frame: number,
  fps: number,
  start: number,
  config: Partial<SpringConfig> = SPRING.snap,
  durationInFrames?: number,
) =>
  spring({
    frame: frame - start,
    fps,
    config,
    durationInFrames,
  });

/** Fade window: 0 before start, ramps in, holds, ramps out after end. */
export const windowed = (frame: number, start: number, end: number, fadeIn = 6, fadeOut = 6) =>
  Math.min(clamp((frame - start) / Math.max(1, fadeIn)), clamp((end - frame) / Math.max(1, fadeOut)));

/** Organic low-frequency wobble for hand-held camera & floating UI. */
export const wobble = (frame: number, seed: number, speed = 1) =>
  Math.sin(frame * 0.041 * speed + seed * 1.7) * 0.55 +
  Math.sin(frame * 0.019 * speed + seed * 4.1) * 0.3 +
  Math.sin(frame * 0.087 * speed + seed * 0.9) * 0.15;

/** Decaying oscillation used for impact shakes. */
export const shake = (frame: number, start: number, amp: number, decay = 0.18, freq = 1.9) => {
  const t = frame - start;
  if (t < 0) return 0;
  return amp * Math.exp(-t * decay) * Math.sin(t * freq);
};
