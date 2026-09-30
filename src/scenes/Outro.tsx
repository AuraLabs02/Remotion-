import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BRAND, CHANNEL, TIERS, SELECTED_TIER} from '../config/channel';
import {b, WIDTH} from '../config/timing';
import {Confetti, Rays, Shockwave, Sparkles} from '../fx/Particles';
import {Backdrop, Bokeh, Flash} from '../fx/Stage';
import {SplitText, Typewriter} from '../fx/Type';
import {Camera, type CamKey, Place} from '../lib/camera';
import {clamp, EASE, kf, lerp, springAt, SPRING} from '../lib/motion';
import {FONT} from '../theme/tokens';
import {ChannelAvatar, MemberBadge} from '../ui/Brand';
import {Pill} from '../ui/Button';
import {ChannelPage} from '../ui/ChannelPage';
import {CHECKOUT, CheckoutDialog} from '../ui/Checkout';
import {ClickRing, Cursor, cursorAt} from '../ui/Cursor';
import {JOIN, JoinDialog} from '../ui/JoinDialog';
import {CHAT_PANEL, LiveChat, WELCOME, WelcomeDialog} from '../ui/MemberUI';
import {BROWSER_BAR_H, BrowserFrame, VIEWPORT} from '../ui/YouTubeChrome';

// 0:34–0:40 · the whole flow at a glance → end card.

const OFFSET = b(68);
const T = {
  endCard: b(72),
  click: b(75.5),
  fade: b(79),
};

type Screen = {label: string; w: number; h: number; s: number; render: (f: number) => React.ReactNode};

const SCREENS: Screen[] = [
  {
    label: '01  DISCOVER',
    w: VIEWPORT.w,
    h: VIEWPORT.h + BROWSER_BAR_H,
    s: 0.6,
    render: (f) => (
      <BrowserFrame url={`www.${CHANNEL.url}/videos`} title={`${CHANNEL.name} - YouTube`}>
        <ChannelPage frame={f} load={1} subscribed={1} />
      </BrowserFrame>
    ),
  },
  {label: '02  CHOOSE', w: JOIN.w, h: JOIN.h, s: 0.95, render: (f) => <JoinDialog frame={f} appear={1} selected={1} select={1} />},
  {
    label: '03  CHECKOUT',
    w: CHECKOUT.w,
    h: CHECKOUT.h,
    s: 1.05,
    render: () => <CheckoutDialog appear={1} cardIn={1} morph={1} success={1} />,
  },
  {label: '04  WELCOME', w: WELCOME.w, h: WELCOME.h, s: 1, render: (f) => <WelcomeDialog appear={1} frame={f} />},
  {label: '05  PERKS', w: CHAT_PANEL.w, h: CHAT_PANEL.h, s: 0.86, render: (f) => <LiveChat revealed={8} frame={f} />},
];

const GAP = 150;
const widths = SCREENS.map((s) => s.w * s.s);
const total = widths.reduce((a, c) => a + c, 0) + GAP * (SCREENS.length - 1);
const centers = widths.map((w, i) => -total / 2 + widths.slice(0, i).reduce((a, c) => a + c, 0) + GAP * i + w / 2);

const CAM: CamKey[] = [
  {t: b(68), x: centers[3], y: 20, zoom: 0.78, rx: 6, ry: -20, rz: 2, persp: 2600},
  {t: b(71.4), x: 0, y: 70, zoom: 0.37, rx: 18, ry: 5, rz: -1, ease: EASE.inOut},
  {t: b(72), x: 0, y: 40, zoom: 2.4, rx: 0, ry: 0, rz: 0, ease: EASE.in},
];

export const Outro: React.FC = () => {
  const f = useCurrentFrame() + OFFSET;
  const fps = 30;
  const tier = TIERS[SELECTED_TIER];
  const overview = f < T.endCard;
  const pulseT = clamp((f - b(69)) / (b(71.6) - b(69)));

  // end card
  const av = springAt(f, fps, T.endCard + 1, SPRING.bouncy);
  const btns = springAt(f, fps, T.endCard + 16, SPRING.pop);
  const tag = EASE.out(clamp((f - T.endCard - 26) / 14));
  const cur = cursorAt(
    [
      {t: b(73.6), x: 1500, y: 1000},
      {t: b(75.1), x: 1046, y: 692, ease: EASE.outSoft},
      {t: b(76.2), x: 1046, y: 692},
      {t: b(77.2), x: 1190, y: 800, ease: EASE.inOut},
    ],
    f,
  );
  const joinHover = kf(f, [b(74.8), b(75.2)], [0, 1]);
  const joinPress = kf(f, [T.click - 3, T.click, T.click + 5], [0, 1, 0]);
  const joined = EASE.inOut(clamp((f - T.click - 2) / 10));
  const fadeOut = clamp((f - T.fade) / (b(80) - T.fade));
  const ringRot = (f - T.endCard) * 2.4;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {overview ? (
        <>
          <Backdrop frame={f} grid={1} />
          <Camera keys={CAM} id="outro" frame={f} handheld={0.6}>
            {SCREENS.map((s, i) => {
              const a = EASE.out(clamp((f - b(68) + 6 - i * 2) / 12));
              const x = centers[i];
              const z = -Math.abs(i - 2) * 160;
              const ry = (2 - i) * -6;
              return (
                <React.Fragment key={s.label}>
                  <Place x={x} y={(1 - a) * 120} z={z} ry={ry} w={s.w} h={s.h} scale={s.s} flat style={{opacity: a}}>
                    {s.render(f)}
                  </Place>
                  <Place x={x} y={380} z={z} ry={ry} w={700} h={80} style={{opacity: a}}>
                    <div style={{textAlign: 'center', fontFamily: FONT.mono, fontWeight: 700, fontSize: 54, letterSpacing: 6, color: '#fff'}}>
                      <span style={{color: BRAND.cyan}}>{s.label.slice(0, 2)}</span>
                      {s.label.slice(2)}
                    </div>
                  </Place>
                </React.Fragment>
              );
            })}
            <Place x={0} y={320} z={-20} w={total + 400} h={40}>
              <svg width={total + 400} height={40} style={{overflow: 'visible'}}>
                <defs>
                  <linearGradient id="flow-g" x1="0" x2="1">
                    <stop offset="0" stopColor={BRAND.cyan} />
                    <stop offset="0.5" stopColor={BRAND.blue} />
                    <stop offset="1" stopColor={BRAND.violet} />
                  </linearGradient>
                </defs>
                <line x1={200} x2={total + 200} y1={20} y2={20} stroke="rgba(255,255,255,0.15)" strokeWidth={6} />
                <line x1={200} x2={200 + total * EASE.inOut(pulseT)} y1={20} y2={20} stroke="url(#flow-g)" strokeWidth={6} />
                <circle cx={200 + total * EASE.inOut(pulseT)} cy={20} r={18} fill="#fff" style={{filter: `drop-shadow(0 0 20px ${BRAND.cyan})`}} />
                {centers.map((c, i) => (
                  <circle
                    key={i}
                    cx={c + total / 2 + 200}
                    cy={20}
                    r={14}
                    fill={EASE.inOut(pulseT) * total >= c + total / 2 ? BRAND.cyan : '#2a2f45'}
                    stroke="#fff"
                    strokeWidth={4}
                  />
                ))}
              </svg>
            </Place>
          </Camera>
        </>
      ) : (
        <>
          <Backdrop frame={f} grid={0.6} glow={1.2} />
          <Rays frame={f} x={WIDTH / 2} y={330} opacity={0.45} color="rgba(120,150,255,0.22)" />
          <Bokeh frame={f} count={18} seed="end" color={BRAND.cyan} />
          <AbsoluteFill style={{alignItems: 'center'}}>
            <div style={{position: 'absolute', top: 330 - 118, left: WIDTH / 2 - 118, width: 236, height: 236, transform: `scale(${av})`}}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: `conic-gradient(from ${ringRot}deg, ${BRAND.cyan}, ${BRAND.blue}, ${BRAND.violet}, ${BRAND.pink}, ${BRAND.cyan})`,
                  boxShadow: `0 0 60px rgba(59,130,246,0.6)`,
                }}
              />
              <ChannelAvatar size={220} style={{position: 'absolute', left: 8, top: 8, boxShadow: '0 0 0 6px #070b1d'}} />
              <div
                style={{
                  position: 'absolute',
                  right: -4,
                  bottom: 2,
                  transform: `scale(${EASE.outBack(clamp((f - T.click - 4) / 12))})`,
                  borderRadius: 16,
                  background: '#070b1d',
                  padding: 5,
                }}
              >
                <MemberBadge size={56} level={tier.level} id="endbadge" />
              </div>
            </div>
            <div style={{position: 'absolute', top: 470, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
              <SplitText
                text={CHANNEL.name}
                frame={f}
                start={T.endCard + 4}
                stagger={1.4}
                dur={14}
                mode="rise"
                style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 112, letterSpacing: -4, color: '#fff'}}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                top: 604,
                left: 0,
                right: 0,
                textAlign: 'center',
                fontFamily: FONT.mono,
                fontSize: 26,
                letterSpacing: 2,
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              <Typewriter text={`${CHANNEL.handle}  ·  ${CHANNEL.url}`} frame={f} start={T.endCard + 12} cps={2.2} />
            </div>
            <div
              style={{
                position: 'absolute',
                top: 660,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: 18,
                transform: `scale(${btns})`,
              }}
            >
              <Pill label="Subscribed" icon="bell" variant="tonal" height={64} fontSize={24} padX={28} />
              <div style={{position: 'relative'}}>
                <div
                  style={{
                    position: 'absolute',
                    inset: -6,
                    borderRadius: 40,
                    background: BRAND.gradient,
                    filter: `blur(${14 + joinHover * 8}px)`,
                    opacity: 0.55 + joinHover * 0.3,
                  }}
                />
                <Pill
                  label={joined > 0.5 ? `${tier.name} member` : 'Join'}
                  icon={joined > 0.5 ? 'check' : undefined}
                  variant="brand"
                  height={64}
                  fontSize={24}
                  padX={34}
                  width={lerp(126, 300, joined)}
                  hover={joinHover}
                  press={joinPress}
                  ripple={clamp((f - T.click) / 16) > 0 && clamp((f - T.click) / 16) < 1 ? clamp((f - T.click) / 16) : undefined}
                />
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                top: 790,
                left: 0,
                right: 0,
                textAlign: 'center',
                fontFamily: FONT.display,
                fontWeight: 800,
                fontSize: 42,
                letterSpacing: -0.5,
                opacity: tag,
                transform: `translateY(${(1 - tag) * 24}px)`,
              }}
            >
              <span style={{color: '#fff'}}>Become a member. </span>
              <span
                style={{
                  backgroundImage: BRAND.gradient,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Unlock everything.
              </span>
            </div>
          </AbsoluteFill>
          <Shockwave frame={f} start={T.endCard} x={WIDTH / 2} y={330} from={80} to={1200} dur={24} color="rgba(255,255,255,0.85)" width={10} />
          <Confetti frame={f} start={T.click + 2} x={1046} y={692} count={90} power={40} seed="endc" life={80} size={0.8} />
          <Sparkles frame={f} start={T.click} x={1046} y={692} radius={180} count={16} seed="endsp" life={36} />
          {f >= b(73.6) && f < b(77.6) ? (
            <>
              <Cursor x={cur.x} y={cur.y} hand={joinHover} press={joinPress} opacity={kf(f, [b(73.6), b(74), b(77.2), b(77.6)], [0, 1, 1, 0])} scale={1.3} />
              <ClickRing x={1046} y={692} p={(f - T.click) / 14} />
            </>
          ) : null}
          <Flash frame={f} at={T.endCard} dur={12} color="#dfe8ff" peak={0.9} />
        </>
      )}
      <AbsoluteFill style={{background: '#000', opacity: fadeOut}} />
    </AbsoluteFill>
  );
};
