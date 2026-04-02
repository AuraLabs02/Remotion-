import { continueRender, delayRender, staticFile } from 'remotion';

// Font loading for Remotion
// Uses system fonts as fallback - no external font loading needed
// Inter and JetBrains Mono are available as system fonts in most environments

export const FONT_FAMILY = {
  display: "'Inter', 'SF Pro Display', 'Segoe UI', system-ui, -apple-system, sans-serif",
  body: "'Inter', 'SF Pro Text', 'Segoe UI', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
};

export const FONT_WEIGHT = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};
