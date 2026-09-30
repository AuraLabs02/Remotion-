import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BRAND, CHANNEL} from '../config/channel';
import {b, HEIGHT, WIDTH} from '../config/timing';
import {Backdrop} from '../fx/Stage';
import {Shockwave, Sparkles} from '../fx/Particles';
import {SplitText} from '../fx/Type';
import {clamp, EASE, kf, lerp, shake, springAt, SPRING} from '../lib/motion';
import {FONT} from '../theme/tokens';
import {YouTubeIcon} from '../ui/Brand';
import {Cursor, cursorAt} from '../ui/Cursor';

// 0:00–0:04 · "ONE CLICK." → click → "BECOME A MEMBER" → dive into the play button.

const CX = WIDTH / 2;
const CY = HEIGHT / 2;

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const fps = 30;

  const lineW = kf(f, [2, 16, 26, 36], [0, 1180, 1180, 0], EASE.out);
  const lineO = kf(f, [2, 6, 30, 38], [0, 1, 1, 0]);

  // cursor flies to the full stop of "ONE CLICK."
  const cur = cursorAt(
    [
      {t: 24, x: 1640, y: 1000},
      {t: 42, x: 1492, y: 584, ease: EASE.outSoft},
      {t: 49, x: 1492, y: 584},
      {t: 62, x: 1560, y: 720, ease: EASE.inOut},
    ],
    f,
  );
  const press = kf(f, [b(3) - 3, b(3), b(3) + 5], [0, 1, 0]);
  const clickRing = clamp((f - b(3)) / 14);

  // "MEMBER" slam + fill wipe
  const slam = springAt(f, fps, b(4), SPRING.pop);
  const fill = EASE.inOut(clamp((f - b(5)) / 14));
  const glint = clamp((f - b(5) - 8) / 16);
  const memberOut = EASE.in(clamp((f - b(6) + 2) / 9));

  // play button pop + dive
  const icon = springAt(f, fps, b(6) + 5, SPRING.bouncy);
  const dive = EASE.in(clamp((f - b(7)) / (b(8) - b(7))));
  const iconScale = icon * lerp(1, 48, dive * dive);
  const redCover = clamp((dive - 0.72) / 0.2);

  const shk = shake(f, b(4), 16, 0.22) + shake(f, b(3), 7, 0.3);
  const push = lerp(1, 1.06, clamp(f / b(3))) * lerp(1, 1.12, EASE.in(clamp((f - b(3)) / 12)));

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{opacity: EASE.out(clamp(f / 14)), transform: `scale(${1 + dive * 0.3})`}}>
        <Backdrop frame={f} grid={0.8} glow={0.9} />
      </AbsoluteFill>

      <AbsoluteFill style={{transform: `translate(${shk}px, ${shk * 0.6}px)`}}>
        {/* light line */}
        <div
          style={{
            position: 'absolute',
            left: CX - lineW / 2,
            top: CY + 88,
            width: lineW,
            height: 3,
            borderRadius: 2,
            opacity: lineO,
            background: `linear-gradient(90deg, rgba(34,211,238,0), ${BRAND.cyan}, #fff, ${BRAND.violet}, rgba(139,92,246,0))`,
            boxShadow: `0 0 24px ${BRAND.cyan}, 0 0 60px ${BRAND.blue}`,
          }}
        />

        {/* ONE CLICK. */}
        {f < b(4) ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: CY - 120,
              display: 'flex',
              justifyContent: 'center',
              transform: `scale(${push})`,
            }}
          >
            <SplitText
              text="ONE CLICK."
              frame={f}
              start={b(1) - 4}
              stagger={1.2}
              dur={12}
              mode="rise"
              exit={{start: b(3) + 1, dur: 13, mode: 'explode', stagger: 0.5}}
              seed="oneclick"
              style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 200, letterSpacing: -9, color: '#fff'}}
              charStyle={(i) => (i === 9 ? {color: BRAND.cyan, textShadow: `0 0 ${30 + press * 40}px ${BRAND.cyan}`} : undefined)}
            />
          </div>
        ) : null}
        <Shockwave frame={f} start={b(3)} x={1494} y={CY + 42} to={900} dur={20} color={BRAND.cyan} width={12} />
        <Sparkles frame={f} start={b(3)} x={1494} y={CY + 42} radius={220} count={16} seed="hk" life={30} />

        {/* BECOME A MEMBER */}
        {f >= b(4) - 1 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: CY - 190,
              textAlign: 'center',
              transform: `scale(${lerp(1.5, 1, slam) * (1 - memberOut * 0.35)}) translateY(${-memberOut * 320}px)`,
              opacity: clamp(slam * 3) * (1 - memberOut),
              filter: memberOut > 0 ? `blur(${memberOut * 16}px)` : undefined,
            }}
          >
            <div
              style={{
                fontFamily: FONT.mono,
                fontWeight: 700,
                fontSize: 34,
                letterSpacing: 22,
                color: 'rgba(255,255,255,0.8)',
                marginBottom: 6,
                marginLeft: 22,
              }}
            >
              BECOME A
            </div>
            <div style={{position: 'relative', display: 'inline-block'}}>
              <div
                style={{
                  fontFamily: FONT.display,
                  fontWeight: 900,
                  fontSize: 290,
                  lineHeight: 1,
                  letterSpacing: -12,
                  color: 'transparent',
                  WebkitTextStroke: '3px rgba(255,255,255,0.95)',
                }}
              >
                MEMBER
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  fontFamily: FONT.display,
                  fontWeight: 900,
                  fontSize: 290,
                  lineHeight: 1,
                  letterSpacing: -12,
                  color: 'transparent',
                  backgroundImage: `linear-gradient(100deg, ${BRAND.cyan} 0%, ${BRAND.blue} 45%, ${BRAND.violet} 75%, ${BRAND.pink} 100%)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  clipPath: `inset(0 ${100 - fill * 100}% 0 0)`,
                  filter: `drop-shadow(0 0 30px rgba(59,130,246,0.55))`,
                }}
              >
                MEMBER
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  fontFamily: FONT.display,
                  fontWeight: 900,
                  fontSize: 290,
                  lineHeight: 1,
                  letterSpacing: -12,
                  color: 'transparent',
                  backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0) ${glint * 140 - 30}%, rgba(255,255,255,0.95) ${glint * 140 - 15}%, rgba(255,255,255,0) ${glint * 140}%)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  opacity: glint > 0 && glint < 1 ? 1 : 0,
                }}
              >
                MEMBER
              </div>
            </div>
          </div>
        ) : null}
        <Shockwave frame={f} start={b(4)} x={CX} y={CY} from={100} to={1300} dur={24} color="rgba(255,255,255,0.8)" width={6} />

        {/* YouTube play button */}
        {f >= b(6) ? (
          <div
            style={{
              position: 'absolute',
              left: CX,
              top: CY + 20,
              transform: `translate(-50%, -50%) scale(${iconScale})`,
              filter: `drop-shadow(0 0 ${40 * (1 - dive)}px rgba(255,0,0,0.7))`,
            }}
          >
            <YouTubeIcon height={120} />
          </div>
        ) : null}
        {f >= b(6) + 4 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: CY + 118,
              textAlign: 'center',
              fontFamily: FONT.mono,
              fontSize: 24,
              letterSpacing: 8,
              color: 'rgba(255,255,255,0.85)',
              opacity: EASE.out(clamp((f - b(6) - 4) / 10)) * (1 - clamp(dive * 3)),
            }}
          >
            {CHANNEL.name.toUpperCase()} <span style={{color: BRAND.cyan}}>×</span> YOUTUBE MEMBERSHIPS
          </div>
        ) : null}

        {f > 20 && f < b(4) + 10 ? (
          <Cursor x={cur.x} y={cur.y} press={press} click={clickRing > 0 && clickRing < 1 ? clickRing : undefined} opacity={clamp((b(4) + 10 - f) / 8)} scale={1.5} />
        ) : null}
      </AbsoluteFill>

      <AbsoluteFill style={{background: '#ff0000', opacity: redCover}} />
    </AbsoluteFill>
  );
};
