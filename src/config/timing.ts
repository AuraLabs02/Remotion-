// Global timing. Everything is authored in musical beats so picture and
// soundtrack stay locked together (120 BPM → one beat = 0.5s).

export const FPS = 30;
export const BPM = 120;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const FRAMES_PER_BEAT = (FPS * 60) / BPM; // 15

/** Beats → frames. Accepts fractional beats. */
export const b = (beats: number) => Math.round(beats * FRAMES_PER_BEAT);

/** Scene boundaries, in beats. */
export const SCENES = {
  hook: [0, 8],
  channel: [8, 17],
  join: [17, 28],
  checkout: [28, 40],
  buildup: [40, 44],
  drop: [44, 56],
  perks: [56, 68],
  outro: [68, 80],
} as const;

export const TOTAL_BEATS = 80;
export const DURATION = b(TOTAL_BEATS); // 1200 frames = 40s

/** The whole checkout world (channel → join → checkout → build-up) is one continuous shot. */
export const BROWSER_ACT: [number, number] = [SCENES.channel[0], SCENES.buildup[1]];
