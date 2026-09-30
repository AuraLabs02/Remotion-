import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BRAND} from '../config/channel';
import {b} from '../config/timing';
import {Sparkles} from '../fx/Particles';
import {Backdrop} from '../fx/Stage';
import {Camera, type CamKey, Place} from '../lib/camera';
import {clamp, EASE, kf} from '../lib/motion';
import {FONT} from '../theme/tokens';
import {BadgeLadder, CHAT_PANEL, LADDER, LiveChat, MembersShelf, SHELF} from '../ui/MemberUI';

// 0:28–0:34 · perks in action: live chat → members-only unlock → loyalty badges.

const OFFSET = b(56);

const CHAT = {x: -980, y: 0, z: -60, ry: 16};
const SHELF_P = {x: 0, y: -20, z: 0};
const LADDER_P = {x: 900, y: 0, z: -60, ry: -16};

const CAM: CamKey[] = [
  {t: b(56), x: 700, y: 0, zoom: 1.0, rx: 4, ry: -14, rz: 2, persp: 2200},
  {t: b(56) + 12, x: CHAT.x + 30, y: 70, zoom: 1.66, rx: 4, ry: -11, rz: 0, ease: EASE.out},
  {t: b(61.8), x: CHAT.x + 20, y: 170, zoom: 1.95, rx: 2, ry: -12, rz: -0.5, ease: EASE.inOut},
  {t: b(62.6), x: SHELF_P.x, y: SHELF_P.y, zoom: 1.4, rx: 6, ry: 0, rz: 0, ease: EASE.whip},
  {t: b(64.9), x: SHELF_P.x, y: SHELF_P.y + 10, zoom: 1.5, rx: 3, ry: 3, ease: EASE.inOut},
  {t: b(65.6), x: LADDER_P.x - 20, y: 10, zoom: 1.7, rx: 4, ry: 11, rz: 0, ease: EASE.whip},
  {t: b(67.3), x: LADDER_P.x - 20, y: 20, zoom: 1.82, rx: 2, ry: 9, ease: EASE.inOut},
  {t: b(68), x: 200, y: 0, zoom: 0.55, rx: 14, ry: 2, rz: 0, ease: EASE.in},
];

const LABELS = [
  {t: b(56.6), end: b(62.3), text: 'Your name in green + loyalty badge in live chat'},
  {t: b(62.8), end: b(65.5), text: 'Members-only videos, unlocked'},
  {t: b(65.8), end: b(68), text: 'Badges level up the longer you stay'},
];

export const Perks: React.FC = () => {
  const f = useCurrentFrame() + OFFSET;
  const revealed = kf(
    f,
    [b(56), b(57.4), b(57.9), b(58.6), b(59.1), b(59.7), b(60.2), b(60.6), b(61.1), b(61.4), b(61.8)],
    [3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8],
    EASE.out,
  );
  const highlight = kf(f, [b(57.5), b(58), b(60.5)], [0, 1, 0]);
  const unlock = [0, 1, 2].map((i) => clamp((f - b(63.2 + i * 0.5)) / 14));
  const shelfAppear = clamp((f - b(56)) / 30);
  const ladder = kf(f, [b(66), b(67.4)], [0.2, 3.2], EASE.inOut);

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Backdrop frame={f} grid={0.7} palette={[BRAND.blue, '#10b981', BRAND.violet]} />
      <Camera keys={CAM} id="perks" frame={f} handheld={1.2}>
        <Place x={CHAT.x} y={CHAT.y} z={CHAT.z} ry={CHAT.ry} w={CHAT_PANEL.w} h={CHAT_PANEL.h} flat>
          <LiveChat revealed={revealed} frame={f} highlight={highlight} />
        </Place>
        <Place x={SHELF_P.x} y={SHELF_P.y} z={SHELF_P.z} w={SHELF.w} h={SHELF.h} flat>
          <MembersShelf unlock={unlock} appear={shelfAppear} />
          {[0, 1, 2].map((i) => (
            <Sparkles key={i} frame={f} start={b(63.2 + i * 0.5) + 6} x={30 + 145 + i * 306} y={96 + 82} radius={110} count={10} seed={`un${i}`} size={18} life={24} />
          ))}
        </Place>
        <Place x={LADDER_P.x} y={LADDER_P.y} z={LADDER_P.z} ry={LADDER_P.ry} w={LADDER.w} h={LADDER.h} flat>
          <BadgeLadder progress={ladder} frame={f} />
        </Place>
      </Camera>
      {LABELS.map((l) => {
        const o = kf(f, [l.t, l.t + 8, l.end - 6, l.end], [0, 1, 1, 0]);
        if (o <= 0) return null;
        return (
          <div
            key={l.text}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 62,
              display: 'flex',
              justifyContent: 'center',
              opacity: o,
              transform: `translateY(${(1 - EASE.out(o)) * -16}px)`,
            }}
          >
            <div
              style={{
                padding: '10px 22px',
                borderRadius: 40,
                background: 'rgba(8,10,24,0.78)',
                border: '1px solid rgba(255,255,255,0.14)',
                fontFamily: FONT.mono,
                fontWeight: 700,
                fontSize: 21,
                letterSpacing: 1.5,
                color: '#fff',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              }}
            >
              <span style={{color: BRAND.cyan}}>●</span> {l.text}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
