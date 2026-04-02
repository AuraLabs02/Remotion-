import { spring, interpolate, SpringConfig } from 'remotion';

// Spring presets
export const SPRING_SMOOTH: SpringConfig = { damping: 22, stiffness: 80, mass: 1 };
export const SPRING_BOUNCY: SpringConfig = { damping: 12, stiffness: 100, mass: 0.8 };
export const SPRING_SNAPPY: SpringConfig = { damping: 18, stiffness: 120, mass: 0.6 };
export const SPRING_GENTLE: SpringConfig = { damping: 26, stiffness: 60, mass: 1.2 };
export const SPRING_ELASTIC: SpringConfig = { damping: 8, stiffness: 80, mass: 0.5 };

// Easing functions
export const easeOutExpo = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const easeOutElastic = (t: number): number => {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
};

export const easeOutBounce = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// Helper: clamp value
export const clamp = (val: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, val));

// Helper: linear interpolation
export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * clamp(t, 0, 1);

// Helper: spring entrance with delay
export const springIn = (
  frame: number,
  fps: number,
  delay: number = 0,
  config: SpringConfig = SPRING_SMOOTH
): number =>
  spring({ frame: Math.max(0, frame - delay), fps, config, durationInFrames: 40 });

// Helper: fade in over frame range
export const fadeIn = (
  frame: number,
  start: number,
  duration: number = 20
): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// Helper: fade out over frame range
export const fadeOut = (
  frame: number,
  start: number,
  duration: number = 20
): number =>
  interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// Helper: slide in from direction
export const slideIn = (
  frame: number,
  start: number,
  duration: number = 25,
  distance: number = 60
): { opacity: number; y: number } => {
  const progress = fadeIn(frame, start, duration);
  return {
    opacity: progress,
    y: (1 - easeOutExpo(progress)) * distance,
  };
};

// Helper: typewriter character count
export const typewriter = (
  frame: number,
  start: number,
  text: string,
  charsPerFrame: number = 1.5
): number => {
  const elapsed = Math.max(0, frame - start);
  return Math.min(Math.floor(elapsed * charsPerFrame), text.length);
};

// Helper: stagger delay for array items
export const staggerDelay = (index: number, baseDelay: number = 8): number =>
  index * baseDelay;

// Helper: floating animation
export const float = (
  frame: number,
  amplitude: number = 6,
  speed: number = 0.04,
  offset: number = 0
): number => Math.sin(frame * speed + offset) * amplitude;

// Helper: pulse animation (0 to 1)
export const pulse = (
  frame: number,
  speed: number = 0.06,
  offset: number = 0
): number => 0.5 + 0.5 * Math.sin(frame * speed + offset);

// Helper: draw-on effect for SVG paths (strokeDashoffset)
export const drawOn = (
  frame: number,
  start: number,
  duration: number,
  pathLength: number
): number => {
  const progress = fadeIn(frame, start, duration);
  return pathLength * (1 - easeOutExpo(progress));
};

// Helper: scale spring entrance
export const scaleIn = (
  frame: number,
  fps: number,
  delay: number = 0,
  config: SpringConfig = SPRING_BOUNCY
): number =>
  spring({ frame: Math.max(0, frame - delay), fps, config, durationInFrames: 35 });

// Helper: scene visibility
export const sceneOpacity = (
  frame: number,
  sceneStart: number,
  sceneEnd: number,
  fadeFrames: number = 30
): number => {
  const fadeInVal = interpolate(
    frame,
    [sceneStart, sceneStart + fadeFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const fadeOutVal = interpolate(
    frame,
    [sceneEnd - fadeFrames, sceneEnd],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return Math.min(fadeInVal, fadeOutVal);
};
