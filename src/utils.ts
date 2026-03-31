// Easing functions
export const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const easeOutElastic = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

export const easeOutBounce = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

export const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const clamp = (val: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, val));

// Interpolate with easing
export const interpolateWithEasing = (
  frame: number,
  startFrame: number,
  endFrame: number,
  from: number,
  to: number,
  easing: (t: number) => number = easeOutExpo
): number => {
  if (frame <= startFrame) return from;
  if (frame >= endFrame) return to;
  const t = (frame - startFrame) / (endFrame - startFrame);
  return from + (to - from) * easing(t);
};

// Typewriter effect - returns how many characters to show
export const typewriter = (
  frame: number,
  startFrame: number,
  text: string,
  charsPerFrame: number = 0.8
): number => {
  if (frame <= startFrame) return 0;
  const elapsed = frame - startFrame;
  return Math.min(Math.floor(elapsed * charsPerFrame), text.length);
};

// SVG path draw-on progress (0 to 1)
export const drawPath = (
  frame: number,
  startFrame: number,
  duration: number,
  easing: (t: number) => number = easeOutExpo
): number => {
  if (frame <= startFrame) return 0;
  if (frame >= startFrame + duration) return 1;
  const t = (frame - startFrame) / duration;
  return easing(t);
};

// Stagger delay calculator
export const stagger = (index: number, baseDelay: number, staggerAmount: number): number => {
  return baseDelay + index * staggerAmount;
};

// Smooth step (for morph transitions)
export const smoothStep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

// Pulse animation (returns 0 to 1)
export const pulse = (frame: number, speed: number = 0.06, offset: number = 0): number => {
  return Math.sin(frame * speed + offset) * 0.5 + 0.5;
};

// Format large numbers
export const formatBigNumber = (n: number): string => {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toLocaleString();
};
