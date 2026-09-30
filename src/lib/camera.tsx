import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {HEIGHT, WIDTH} from '../config/timing';
import {clamp, EASE, type Ease, lerp, wobble} from './motion';

// A small virtual camera for CSS 3D worlds. Keys describe where the camera
// looks (x, y, z in world px), how far it is zoomed and how it is rotated.
// Motion blur is derived from the camera's own screen-space velocity.

export type CamState = {
  x: number;
  y: number;
  z: number;
  zoom: number;
  rx: number;
  ry: number;
  rz: number;
  persp: number;
};

export type CamKey = Partial<CamState> & {t: number; ease?: Ease; cut?: boolean};

type ResolvedKey = CamState & {t: number; ease?: Ease; cut?: boolean};

const DEFAULTS: CamState = {x: 0, y: 0, z: 0, zoom: 1, rx: 0, ry: 0, rz: 0, persp: 2400};

const resolve = (keys: CamKey[]): ResolvedKey[] => {
  let prev: CamState = DEFAULTS;
  return keys.map((k) => {
    const next: CamState = {...prev};
    (Object.keys(DEFAULTS) as (keyof CamState)[]).forEach((p) => {
      if (k[p] !== undefined) next[p] = k[p] as number;
    });
    prev = next;
    return {...next, t: k.t, ease: k.ease, cut: k.cut};
  });
};

const lerpState = (a: CamState, b: CamState, t: number): CamState => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  z: lerp(a.z, b.z, t),
  // zoom interpolates geometrically so pushes feel constant-speed
  zoom: Math.exp(lerp(Math.log(a.zoom), Math.log(b.zoom), t)),
  rx: lerp(a.rx, b.rx, t),
  ry: lerp(a.ry, b.ry, t),
  rz: lerp(a.rz, b.rz, t),
  persp: lerp(a.persp, b.persp, t),
});

export const camAt = (keys: ResolvedKey[], f: number): CamState => {
  if (f <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const n = keys[i + 1];
    if (f < n.t) {
      if (n.cut) return a;
      const p = (n.ease ?? EASE.inOut)(clamp((f - a.t) / (n.t - a.t)));
      return lerpState(a, n, p);
    }
  }
  return keys[keys.length - 1];
};

export const useCamera = (keys: CamKey[]) => {
  const resolved = useMemo(() => resolve(keys), [keys]);
  return (f: number) => camAt(resolved, f);
};

type CameraProps = {
  keys: CamKey[];
  id: string;
  children: React.ReactNode;
  /** Hand-held drift strength (world px at zoom 1). */
  handheld?: number;
  motionBlur?: number;
  /** Extra screen shake in px, added on top (e.g. impacts). */
  shakeX?: number;
  shakeY?: number;
  style?: React.CSSProperties;
  /** Override the frame used to evaluate keys (e.g. absolute frame). */
  frame?: number;
};

export const Camera: React.FC<CameraProps> = ({
  keys,
  id,
  children,
  handheld = 1,
  motionBlur = 1,
  shakeX = 0,
  shakeY = 0,
  style,
  frame: frameOverride,
}) => {
  const localFrame = useCurrentFrame();
  const frame = frameOverride ?? localFrame;
  const at = useCamera(keys);
  const c = at(frame);
  const p = at(frame - 1);

  const hx = handheld * wobble(frame, 1.3) * 6;
  const hy = handheld * wobble(frame, 7.1) * 4;
  const hr = handheld * wobble(frame, 3.7) * 0.25;

  // screen-space velocity (px/frame) of the look-at point + rotation sweep
  const vx = (c.x - p.x) * c.zoom + (c.ry - p.ry) * 8 * c.zoom + (c.rz - p.rz) * 5;
  const vy = (c.y - p.y) * c.zoom - (c.rx - p.rx) * 8 * c.zoom;
  // only fast moves smear: slow and medium moves stay crisp and readable
  const smear = (v: number) => motionBlur * Math.min(28, Math.max(0, Math.abs(v) - 10) * 0.16);
  const bx = smear(vx);
  const by = smear(vy);
  const blurOn = bx > 0.6 || by > 0.6;
  const filterId = `mb-${id}`;

  const transform = [
    `translate(${shakeX}px, ${shakeY}px)`,
    `perspective(${c.persp}px)`,
    `rotateX(${c.rx}deg)`,
    `rotateY(${c.ry}deg)`,
    `rotateZ(${c.rz + hr}deg)`,
    `scale3d(${c.zoom}, ${c.zoom}, ${c.zoom})`,
    `translate3d(${-c.x - hx}px, ${-c.y - hy}px, ${-c.z}px)`,
  ].join(' ');

  return (
    <AbsoluteFill style={style}>
      {blurOn ? (
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <defs>
            <filter
              id={filterId}
              x={-40}
              y={-40}
              width={WIDTH + 80}
              height={HEIGHT + 80}
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} edgeMode="duplicate" />
            </filter>
          </defs>
        </svg>
      ) : null}
      <AbsoluteFill style={{filter: blurOn ? `url(#${filterId})` : undefined}}>
        <div
          style={{
            position: 'absolute',
            left: WIDTH / 2,
            top: HEIGHT / 2,
            width: 0,
            height: 0,
            transformStyle: 'preserve-3d',
            transform,
          }}
        >
          {children}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

type PlaceProps = {
  x?: number;
  y?: number;
  z?: number;
  rx?: number;
  ry?: number;
  rz?: number;
  scale?: number;
  w: number;
  h: number;
  /** Anchor: 'center' (default) places the box centre at x,y; 'topleft' its corner. */
  anchor?: 'center' | 'topleft';
  flat?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** Positions a w×h box in world space. */
export const Place: React.FC<PlaceProps> = ({
  x = 0,
  y = 0,
  z = 0,
  rx = 0,
  ry = 0,
  rz = 0,
  scale = 1,
  w,
  h,
  anchor = 'center',
  flat = false,
  style,
  children,
}) => {
  const ox = anchor === 'center' ? -w / 2 : 0;
  const oy = anchor === 'center' ? -h / 2 : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: w,
        height: h,
        transformStyle: flat ? 'flat' : 'preserve-3d',
        transformOrigin: anchor === 'center' ? '50% 50%' : '0 0',
        transform: `translate3d(${x + ox}px, ${y + oy}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
