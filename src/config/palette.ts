// Colour helpers + the reel's brand palette.
//
// Defaults are the stand-in palette. When src/config/live.json carries a
// `palette` (extracted from the real channel logo by scripts/fetch_brand.py),
// every accent, glow, gradient, badge and background re-themes from it.

type RGB = [number, number, number];

const parse = (hex: string): RGB => {
  const v = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16)) as RGB;
};

const toHex = (rgb: number[]) =>
  '#' + rgb.map((c) => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0')).join('');

export const mixHex = (a: string, b: string, t: number) => {
  const pa = parse(a);
  const pb = parse(b);
  return toHex(pa.map((c, i) => c + (pb[i] - c) * t));
};

export const alpha = (hex: string, a: number) => {
  const [r, g, b] = parse(hex);
  return `rgba(${r},${g},${b},${a})`;
};

export type Palette = {
  cyan: string;
  sky: string;
  blue: string;
  indigo: string;
  violet: string;
  pink: string;
  light: string;
  deep: string;
  night: string;
  gradient: string;
  gradientSoft: string;
  gradientHover: string;
};

const finish = (p: Omit<Palette, 'gradient' | 'gradientSoft' | 'gradientHover'>): Palette => ({
  ...p,
  gradient: `linear-gradient(135deg, ${p.cyan} 0%, ${p.blue} 48%, ${p.violet} 100%)`,
  gradientSoft: `linear-gradient(135deg, ${alpha(p.cyan, 0.9)} 0%, ${alpha(p.blue, 0.9)} 50%, ${alpha(p.violet, 0.9)} 100%)`,
  gradientHover: `linear-gradient(135deg, ${mixHex(p.cyan, '#ffffff', 0.25)} 0%, ${mixHex(p.blue, '#ffffff', 0.2)} 50%, ${mixHex(
    p.violet,
    '#ffffff',
    0.2,
  )} 100%)`,
});

export const DEFAULT_PALETTE = finish({
  cyan: '#22d3ee',
  sky: '#38bdf8',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  pink: '#ec4899',
  light: '#94c5ff',
  deep: '#070b1d',
  night: '#0b1130',
});

/** Build a full palette from 3–4 accent colours taken from the real logo. */
export const paletteFrom = (accents: string[]): Palette => {
  const [a, b, c, d] = accents;
  const third = c ?? mixHex(b, '#ff4fa0', 0.35);
  return finish({
    cyan: a,
    sky: mixHex(a, '#ffffff', 0.12),
    blue: b,
    indigo: mixHex(b, third, 0.5),
    violet: third,
    pink: d ?? mixHex(third, '#ff3d7f', 0.45),
    light: mixHex(b, '#ffffff', 0.55),
    deep: mixHex(b, '#03040a', 0.93),
    night: mixHex(b, '#03040a', 0.86),
  });
};
