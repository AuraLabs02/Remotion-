import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BRAND, CHANNEL, TIERS, SELECTED_TIER} from '../config/channel';
import {b, FRAMES_PER_BEAT, HEIGHT, WIDTH} from '../config/timing';
import {Confetti, Rays, Shockwave, Sparkles} from '../fx/Particles';
import {Bokeh, Flash} from '../fx/Stage';
import {SplitText} from '../fx/Type';
import {alpha, mixHex} from '../config/palette';
import {clamp, EASE, kf, lerp, shake, springAt, SPRING} from '../lib/motion';
import {FONT} from '../theme/tokens';
import {MemberBadge} from '../ui/Brand';
import {ClickRing, Cursor, cursorAt} from '../ui/Cursor';
import {Icon, type IconName} from '../ui/Icon';
import {WELCOME, WelcomeDialog} from '../ui/MemberUI';

// 0:22–0:28 · the drop: badge reveal, confetti, orbiting perks → YouTube welcome dialog.

const OFFSET = b(44);
const CX = WIDTH / 2;
const BADGE_Y = 380;

const CHIPS: {label: string; icon: IconName; color: string}[] = [
  {label: 'Loyalty badges', icon: 'badge', color: BRAND.cyan},
  {label: 'Custom emoji', icon: 'emoji', color: BRAND.sky},
  {label: 'Members-only videos', icon: 'video', color: BRAND.violet},
  {label: 'Early access', icon: 'bolt', color: '#fbbf24'},
  {label: 'Live Q&A', icon: 'star', color: BRAND.pink},
  {label: 'Source code', icon: 'code', color: '#4ade80'},
];

const T = {
  hit: b(44),
  title: b(44) + 10,
  chips: b(46),
  toDialog: b(51),
  land: b(52.2),
  gotIt: b(55),
  out: b(55.3),
};

// dialog geometry (screen space, dialog shown at 1.45×)
const DS = 1.45;
const DLG = {x: CX - WELCOME.w / 2, y: HEIGHT / 2 - WELCOME.h / 2 + 10};
const inDialog = (px: number, py: number) => ({
  x: CX + (px - WELCOME.w / 2) * DS,
  y: DLG.y + WELCOME.h / 2 + (py - WELCOME.h / 2) * DS,
});
const BADGE_SLOT = inDialog(339, 173);
const GOT_IT = inDialog(WELCOME.w - 32 - 52, WELCOME.h - 26 - 20);

export const Drop: React.FC = () => {
  const f = useCurrentFrame() + OFFSET;
  const fps = 30;
  const tier = TIERS[SELECTED_TIER];

  const beat = ((f - T.hit) % FRAMES_PER_BEAT) / FRAMES_PER_BEAT;
  const pulse = f >= T.hit ? Math.exp(-beat * 5) : 0;

  const flip = springAt(f, fps, T.hit, {damping: 13, stiffness: 70, mass: 1});
  const pop = springAt(f, fps, T.hit, SPRING.bouncy);
  const toDlg = EASE.inOut(clamp((f - T.toDialog) / (T.land - T.toDialog)));
  const celebration = 1 - EASE.inOut(clamp((f - T.toDialog) / 16));
  const dlgIn = springAt(f, fps, T.toDialog + 4, SPRING.snap);
  const dlgAppear = clamp((f - T.toDialog - 4) / 30);
  const dlgOut = EASE.in(clamp((f - T.out) / 10));

  // badge path: centre stage → welcome dialog slot
  const bx = lerp(CX, BADGE_SLOT.x, toDlg);
  const by = lerp(BADGE_Y, BADGE_SLOT.y, toDlg) - Math.sin(toDlg * Math.PI) * 80;
  const bsize = lerp(300, 40 * DS, EASE.inOut(toDlg));
  const bry = lerp(-900, 0, flip) + toDlg * 360;
  const shine = clamp((f - T.hit - 26) / 18);

  const shk = shake(f, T.hit, 22, 0.16) + shake(f, T.land, 6, 0.3);
  const cur = cursorAt(
    [
      {t: b(53.6), x: GOT_IT.x + 260, y: GOT_IT.y + 200},
      {t: b(54.7), x: GOT_IT.x + 6, y: GOT_IT.y + 4, ease: EASE.outSoft},
      {t: b(55.4), x: GOT_IT.x + 6, y: GOT_IT.y + 4},
    ],
    f,
  );
  const gotHover = kf(f, [b(54.4), b(54.8)], [0, 1]);
  const gotPress = kf(f, [T.gotIt - 3, T.gotIt, T.gotIt + 5], [0, 1, 0]);

  return (
    <AbsoluteFill style={{background: BRAND.deep, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${shk}px, ${shk * 0.7}px)`}}>
        {/* stage */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 60% 55% at 50% 38%, ${alpha(BRAND.blue, 0.45 + pulse * 0.15)} 0%, ${alpha(BRAND.indigo, 0.18)} 45%, ${alpha(BRAND.deep, 0)} 75%), radial-gradient(ellipse 50% 40% at 50% 100%, ${alpha(BRAND.violet, 0.35)} 0%, ${alpha(BRAND.violet, 0)} 70%), ${BRAND.deep}`,
          }}
        />
        <Rays frame={f} x={CX} y={BADGE_Y} opacity={(0.55 + pulse * 0.25) * lerp(0.35, 1, celebration)} color={alpha(BRAND.light, 0.28)} />
        <Bokeh frame={f} count={26} seed="drop" color={BRAND.violet} opacity={0.9} />

        <AbsoluteFill
          style={{
            opacity: celebration,
            transform: `scale(${lerp(0.82, 1, celebration)})`,
            filter: celebration < 1 ? `blur(${(1 - celebration) * 14}px)` : undefined,
          }}
        >
          {/* badge glow */}
          <div
            style={{
              position: 'absolute',
              left: CX - 320,
              top: BADGE_Y - 320,
              width: 640,
              height: 640,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(BRAND.indigo, 0.55 + pulse * 0.3)} 0%, ${alpha(BRAND.cyan, 0.15)} 40%, rgba(0,0,0,0) 70%)`,
              transform: `scale(${pop * (1 + pulse * 0.06)})`,
            }}
          />
          {/* title */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 612, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div
              style={{
                fontFamily: FONT.mono,
                fontWeight: 700,
                fontSize: 28,
                letterSpacing: 16,
                color: 'rgba(255,255,255,0.85)',
                opacity: EASE.out(clamp((f - T.title) / 10)),
                transform: `translateY(${(1 - EASE.out(clamp((f - T.title) / 10))) * 20}px)`,
                marginLeft: 16,
              }}
            >
              WELCOME TO THE
            </div>
            <SplitText
              text={CHANNEL.name.toUpperCase()}
              frame={f}
              start={T.title + 3}
              stagger={1.6}
              dur={16}
              mode="pop"
              style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 150, letterSpacing: -6, marginTop: 4}}
              charStyle={() => ({
                backgroundImage: `linear-gradient(180deg, #ffffff 30%, ${mixHex(BRAND.light, '#ffffff', 0.4)} 100%)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                filter: `drop-shadow(0 8px 30px ${alpha(BRAND.blue, 0.55)})`,
              })}
            />
            <div
              style={{
                marginTop: 10,
                padding: '12px 26px',
                borderRadius: 40,
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontFamily: FONT.display,
                fontWeight: 800,
                fontSize: 26,
                letterSpacing: 3,
                color: '#fff',
                opacity: EASE.out(clamp((f - T.title - 22) / 10)),
                transform: `scale(${lerp(0.7, 1, EASE.outBack(clamp((f - T.title - 22) / 12)))})`,
              }}
            >
              <MemberBadge size={34} level={tier.level} id="dropchip" />
              {tier.name.toUpperCase()} MEMBER
            </div>
          </div>
          <PerkOrbit f={f} layer="back" />
        </AbsoluteFill>

        <Confetti frame={f} start={T.hit + 1} x={CX} y={BADGE_Y} count={150} power={52} seed="drop-c" life={100} />
        <Confetti frame={f} start={T.hit + 4} x={80} y={HEIGHT + 20} count={90} power={70} angle={-62} spread={34} seed="drop-l" life={110} gravity={1.1} />
        <Confetti frame={f} start={T.hit + 4} x={WIDTH - 80} y={HEIGHT + 20} count={90} power={70} angle={-118} spread={34} seed="drop-r" life={110} gravity={1.1} />
        {[260, 760, 1160, 1660].map((x, i) => (
          <Confetti key={x} frame={f} start={T.toDialog + i * 3} x={x} y={-40} count={34} power={12} angle={90} spread={70} seed={`rain${i}`} life={120} gravity={0.35} size={0.9} />
        ))}
        <Shockwave frame={f} start={T.hit} x={CX} y={BADGE_Y} from={60} to={1500} dur={26} color="rgba(255,255,255,0.9)" width={16} />
        <Shockwave frame={f} start={T.hit + 5} x={CX} y={BADGE_Y} from={40} to={900} dur={24} color={BRAND.cyan} width={8} />

        {/* welcome dialog */}
        {f >= T.toDialog + 2 ? (
          <div
            style={{
              position: 'absolute',
              left: DLG.x,
              top: DLG.y,
              width: WELCOME.w,
              height: WELCOME.h,
              opacity: clamp(dlgIn * 2) * (1 - dlgOut),
              transform: `perspective(1600px) rotateX(${(1 - dlgIn) * 24 + dlgOut * -10}deg) rotateY(${lerp(-8, 5, clamp((f - T.toDialog) / 90))}deg) scale(${DS * lerp(0.8, 1, dlgIn) * (1 - dlgOut * 0.2)}) translateY(${dlgOut * -40}px)`,
              filter: dlgOut > 0 ? `blur(${dlgOut * 10}px)` : undefined,
            }}
          >
            <WelcomeDialog appear={dlgAppear} badgeIn={f >= T.land ? 1 : 0} frame={f} gotItHover={gotHover} gotItPress={gotPress} />
            <Sparkles frame={f} start={T.land} x={339} y={173} radius={70} count={10} seed="land" size={16} life={26} />
          </div>
        ) : null}

        {/* the badge itself (3D flip, then flies into the dialog) */}
        {f < T.land ? (
          <div
            style={{
              position: 'absolute',
              left: bx - bsize / 2,
              top: by - bsize / 2,
              width: bsize,
              height: bsize,
              transform: `perspective(1200px) rotateY(${bry}deg) scale(${pop})`,
              transformStyle: 'preserve-3d',
            }}
          >
            {[6, 5, 4, 3, 2, 1].map((k) => (
              <div key={k} style={{position: 'absolute', inset: 0, transform: `translateZ(${-k * (bsize / 100)}px)`, filter: 'brightness(0.35)'}}>
                <MemberBadge size={bsize} level={tier.level} id={`x${k}`} />
              </div>
            ))}
            <div style={{position: 'absolute', inset: 0, filter: `drop-shadow(0 0 ${30 + pulse * 30}px ${alpha(BRAND.indigo, 0.9)})`}}>
              <MemberBadge size={bsize} level={tier.level} id="hero" shine={shine > 0 && shine < 1 ? shine : undefined} />
            </div>
          </div>
        ) : null}
        <Sparkles frame={f} start={T.hit + 8} x={CX} y={BADGE_Y} radius={250} count={18} seed="dropsp" size={26} life={50} />
        <AbsoluteFill
          style={{
            opacity: celebration,
            transform: `scale(${lerp(0.82, 1, celebration)})`,
            filter: celebration < 1 ? `blur(${(1 - celebration) * 14}px)` : undefined,
          }}
        >
          <PerkOrbit f={f} layer="front" />
        </AbsoluteFill>

        {f >= b(53.6) && f < T.out + 10 ? (
          <>
            <Cursor x={cur.x} y={cur.y} hand={gotHover} press={gotPress} opacity={kf(f, [b(53.6), b(54), T.out + 4, T.out + 10], [0, 1, 1, 0])} />
            <ClickRing x={GOT_IT.x + 6} y={GOT_IT.y + 4} p={(f - T.gotIt) / 14} />
          </>
        ) : null}
      </AbsoluteFill>
      <Flash frame={f} at={T.hit} dur={16} />
    </AbsoluteFill>
  );
};

const PerkOrbit: React.FC<{f: number; layer: 'back' | 'front'}> = ({f, layer}) => {
  const R = 520;
  return (
    <div style={{position: 'absolute', left: CX, top: BADGE_Y, width: 0, height: 0}}>
      {CHIPS.map((c, i) => {
        const appear = EASE.outBack(clamp((f - T.chips - i * 5) / 12));
        if (appear <= 0) return null;
        const a = (i / CHIPS.length) * Math.PI * 2 + (f - T.chips) * 0.018 - Math.PI / 2;
        const depth = Math.sin(a); // -1 back … 1 front
        if ((layer === 'front') !== depth > 0) return null;
        const x = Math.cos(a) * R * appear;
        const y = depth * 110 - 10;
        const s = (0.84 + depth * 0.2) * appear;
        return (
          <div
            key={c.label}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${s})`,
              zIndex: Math.round(depth * 10) + 20,
              opacity: 0.45 + (depth + 1) * 0.275,
              filter: depth < -0.2 ? `blur(${(-depth - 0.2) * 5}px)` : undefined,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 20px 12px 14px',
                borderRadius: 30,
                background: 'rgba(15,18,40,0.82)',
                border: `1.5px solid ${c.color}88`,
                boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 24px ${c.color}44`,
                fontFamily: FONT.ui,
                fontWeight: 500,
                fontSize: 26,
                color: '#fff',
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{width: 32, height: 32, borderRadius: 16, background: `${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon name={c.icon} size={20} color={c.color} />
              </div>
              {c.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
