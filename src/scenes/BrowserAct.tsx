import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {BRAND, CHANNEL} from '../config/channel';
import {b, HEIGHT, WIDTH} from '../config/timing';
import {Confetti, Sparkles} from '../fx/Particles';
import {Backdrop} from '../fx/Stage';
import {Camera, type CamKey, Place, useCamera} from '../lib/camera';
import {clamp, EASE, kf, lerp, shake, springAt, SPRING} from '../lib/motion';
import {FONT, YT} from '../theme/tokens';
import {cardRect, ChannelPage, joinRect} from '../ui/ChannelPage';
import {BUY, CARD_SLOT, CHECKOUT, CheckoutDialog, PaymentCard} from '../ui/Checkout';
import {ClickRing, Cursor, cursorAt} from '../ui/Cursor';
import {JOIN, JoinDialog} from '../ui/JoinDialog';
import {BROWSER_BAR_H, BrowserFrame, VIEWPORT} from '../ui/YouTubeChrome';

// 0:04–0:22 · one continuous camera move through the real YouTube flow:
// channel page → Subscribe → Join → choose a level → checkout → success → build-up.

const OFFSET = b(8);

/** page (viewport) coords → world coords */
const P = (x: number, y: number) => ({x: x - VIEWPORT.w / 2, y: y - (VIEWPORT.h + BROWSER_BAR_H) / 2 + BROWSER_BAR_H});

const VIEW_C = P(VIEWPORT.w / 2, VIEWPORT.h / 2); // dialogs centre here
const JOIN_TL = {x: VIEW_C.x - JOIN.w / 2, y: VIEW_C.y - JOIN.h / 2};
const CHK_TL = {x: VIEW_C.x - CHECKOUT.w / 2, y: VIEW_C.y - CHECKOUT.h / 2};
const BUY_C = {x: CHK_TL.x + BUY.x + BUY.w / 2, y: CHK_TL.y + BUY.y + BUY.h / 2};
const SLOT_C = {x: CHK_TL.x + CARD_SLOT.x + CARD_SLOT.w / 2, y: CHK_TL.y + CARD_SLOT.y + CARD_SLOT.h / 2};

const JOIN_BTN = joinRect(1);
const JOIN_BTN_C = P(JOIN_BTN.x + JOIN_BTN.w / 2, JOIN_BTN.y + JOIN_BTN.h / 2);
const SUB_C = P(464 + 49, 430);
const PRO_CARD_C = {x: JOIN_TL.x + 316 + 134, y: JOIN_TL.y + 214 + 110};
const PRO_JOIN_C = {x: JOIN_TL.x + 316 + 134, y: JOIN_TL.y + 214 + 148};

export const T = {
  load: b(8) + 4,
  subClick: b(13),
  joinClick: b(17),
  open: b(17) + 2,
  explode: b(19),
  tierHover: b(23),
  tierClick: b(26),
  swap: b(26.8),
  checkoutIn: b(27),
  cardFly: b(29.3),
  cardLand: b(31.9),
  buyClick: b(35),
  success: b(38),
  build: b(40),
  end: b(44),
};

const LOGO = P(86, 28);

const CAM: CamKey[] = [
  {t: b(8), x: LOGO.x, y: LOGO.y, zoom: 3.4, rx: 0, ry: 0, rz: -4, persp: 2400},
  {t: b(8) + 7, x: LOGO.x, y: LOGO.y, zoom: 3.1, rz: -3, ease: EASE.linear},
  {t: b(8) + 40, x: -20, y: -20, zoom: 0.72, rx: 19, ry: -24, rz: 3, ease: EASE.inOutStrong},
  {t: b(10.4), x: -40, y: -10, zoom: 0.78, rx: 16, ry: -19, rz: 2.2, ease: EASE.linear},
  {t: b(12.2), x: -150, y: -40, zoom: 1.45, rx: 8, ry: -10, rz: 1, ease: EASE.inOut},
  {t: b(13.6), x: -170, y: -22, zoom: 1.55, rx: 6, ry: -8, rz: 0.5, ease: EASE.linear},
  {t: b(15.4), x: JOIN_BTN_C.x, y: JOIN_BTN_C.y, zoom: 2.7, rx: 0, ry: 0, rz: 0, ease: EASE.inOut},
  {t: b(17), x: JOIN_BTN_C.x, y: JOIN_BTN_C.y, zoom: 2.95, ease: EASE.linear},
  {t: b(18.3), x: VIEW_C.x, y: VIEW_C.y, zoom: 1.05, rx: 4, ry: 6, rz: 0, ease: EASE.out},
  {t: b(19.2), x: 0, y: VIEW_C.y + 10, zoom: 1.0, rx: 6, ry: 4, ease: EASE.inOut},
  {t: b(21.6), x: 0, y: VIEW_C.y + 30, zoom: 0.9, rx: 20, ry: -22, rz: -2, ease: EASE.inOut},
  {t: b(23), x: 0, y: PRO_CARD_C.y - 20, zoom: 1.25, rx: 10, ry: -8, rz: -1, ease: EASE.inOut},
  {t: b(25.2), x: PRO_JOIN_C.x, y: PRO_JOIN_C.y - 30, zoom: 1.75, rx: 3, ry: -2, rz: 0, ease: EASE.inOut},
  {t: b(26.2), x: PRO_JOIN_C.x, y: PRO_JOIN_C.y - 30, zoom: 1.85, ease: EASE.linear},
  {t: b(26.9), x: 80, y: 40, zoom: 1.35, rx: 0, ry: 34, rz: 5, ease: EASE.in},
  {t: b(27.7), x: VIEW_C.x, y: VIEW_C.y, zoom: 1.38, rx: 8, ry: -8, rz: -2, ease: EASE.out},
  {t: b(29.3), x: VIEW_C.x, y: VIEW_C.y, zoom: 1.3, rx: 10, ry: 12, rz: 0, ease: EASE.inOut},
  {t: b(31.9), x: SLOT_C.x + 150, y: SLOT_C.y, zoom: 1.9, rx: 2, ry: 4, rz: 0, ease: EASE.inOut},
  {t: b(33.4), x: 0, y: BUY_C.y - 40, zoom: 1.7, rx: 4, ry: -4, ease: EASE.inOut},
  {t: b(35), x: BUY_C.x, y: BUY_C.y, zoom: 2.0, rx: 0, ry: 0, ease: EASE.inOut},
  {t: b(38), x: BUY_C.x, y: BUY_C.y, zoom: 2.25, rx: 2, ry: -2, ease: EASE.linear},
  {t: b(40), x: BUY_C.x, y: BUY_C.y - 20, zoom: 1.65, rx: 6, ry: 8, rz: 2, ease: EASE.outSoft},
  {t: b(43.4), x: BUY_C.x, y: BUY_C.y, zoom: 5.5, rx: 0, ry: 0, rz: -9, ease: EASE.inSoft},
  {t: b(44), x: BUY_C.x, y: BUY_C.y, zoom: 9, rz: -14, ease: EASE.in},
];

// cursor path (world coords) — arrives early, holds through each click
const CURSOR = [
  {t: b(10.4), ...P(1330, 880)},
  {t: b(12.6), ...SUB_C, ease: EASE.outSoft},
  {t: b(13.25), ...SUB_C},
  {t: b(14.1), ...P(580, 480)},
  {t: b(15.5), ...JOIN_BTN_C, ease: EASE.inOut},
  {t: b(17.2), ...JOIN_BTN_C},
  {t: b(17.8), x: JOIN_BTN_C.x + 40, y: JOIN_BTN_C.y + 80},
  {t: b(21.8), x: 380, y: 360},
  {t: b(23.4), x: PRO_CARD_C.x + 40, y: PRO_CARD_C.y + 30, ease: EASE.outSoft},
  {t: b(25.3), x: PRO_JOIN_C.x + 10, y: PRO_JOIN_C.y, ease: EASE.inOut},
  {t: b(26.25), x: PRO_JOIN_C.x + 10, y: PRO_JOIN_C.y},
  {t: b(26.9), x: PRO_JOIN_C.x + 50, y: PRO_JOIN_C.y + 60},
  {t: b(31.8), x: 360, y: 330},
  {t: b(34.4), x: BUY_C.x + 30, y: BUY_C.y, ease: EASE.outSoft},
  {t: b(35.3), x: BUY_C.x + 30, y: BUY_C.y},
  {t: b(36.4), x: BUY_C.x + 110, y: BUY_C.y + 80},
];

export const BrowserAct: React.FC = () => {
  const f = useCurrentFrame() + OFFSET;
  const fps = 30;
  const cam = useCamera(CAM);

  // ── channel page state
  const load = clamp((f - T.load) / 36);
  const subHover = kf(f, [b(12.4), b(12.8), b(13.3), b(13.8)], [0, 1, 1, 0]);
  const subPress = kf(f, [T.subClick - 3, T.subClick, T.subClick + 5], [0, 1, 0]);
  const subRipple = clamp((f - T.subClick) / 16);
  const subscribed = EASE.inOut(clamp((f - T.subClick - 2) / 9));
  const joinHover = kf(f, [b(15.2), b(15.6), b(17.2), b(17.5)], [0, 1, 1, 0]);
  const joinPress = kf(f, [T.joinClick - 3, T.joinClick, T.joinClick + 5], [0, 1, 0]);
  const joinRipple = clamp((f - T.joinClick) / 16);
  const joinGlint = clamp((f - b(15.7)) / 16);
  const spotlight = kf(f, [b(14.4), b(15.8), T.open, T.open + 8], [0, 1, 1, 0]);
  // thumbnail hover follows the real cursor path (smoothed over the last frames)
  const cardUnder = (ff: number) => {
    if (ff < b(10.4) || ff > b(13)) return -1;
    const c = cursorAt(CURSOR, ff);
    const px = c.x + VIEWPORT.w / 2;
    const py = c.y - BROWSER_BAR_H + (VIEWPORT.h + BROWSER_BAR_H) / 2;
    for (let i = 0; i < 8; i++) {
      const r = cardRect(i);
      if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h + 90) return i;
    }
    return -1;
  };
  const hoverCard = cardUnder(f);
  const cardHover = hoverCard < 0 ? 0 : [0, 1, 2, 3].filter((k) => cardUnder(f - k) === hoverCard).length / 4;
  const toast = kf(f, [T.subClick + 6, T.subClick + 14, b(16.5), b(17)], [0, 1, 1, 0]);

  // ── join dialog
  const morph = EASE.out(clamp((f - T.open) / 17));
  const scrim = kf(f, [T.open, T.open + 12], [0, 0.62]);
  const joinAppear = clamp((f - T.open - 4) / 30);
  const explode = kf(f, [T.explode, b(21), b(23), b(25)], [0, 1, 1, 0.3], EASE.inOut);
  const perkSweep = kf(f, [b(19.6), b(22.8)], [-1, 3.6], EASE.linear);
  const tierHover = kf(f, [b(23.2), b(23.7)], [0, 1]);
  const tierSelect = kf(f, [b(24.6), b(25.4)], [0, 1]);
  const tierPress = kf(f, [T.tierClick - 3, T.tierClick, T.tierClick + 5], [0, 1, 0]);
  const tierRipple = clamp((f - T.tierClick) / 16);
  const joinOut = clamp((f - T.swap) / 4);
  const clipTop = lerp(JOIN_BTN_C.y - JOIN_TL.y - JOIN_BTN.h / 2, 0, morph);
  const clipLeft = lerp(JOIN_BTN_C.x - JOIN_TL.x - JOIN_BTN.w / 2, 0, morph);
  const clipW = lerp(JOIN_BTN.w, JOIN.w, morph);
  const clipH = lerp(JOIN_BTN.h, JOIN.h, morph);

  // ── checkout
  const chkIn = springAt(f, fps, T.checkoutIn, SPRING.snap);
  const chkAppear = clamp((f - T.checkoutIn) / 30);
  const cardP = clamp((f - T.cardFly) / (T.cardLand - T.cardFly));
  const cardIn = clamp((f - T.cardLand) / 4);
  const rowFlash = kf(f, [T.cardLand, T.cardLand + 3, T.cardLand + 18], [0, 1, 0]);
  const buyHover = kf(f, [b(34.2), b(34.6), b(35.2), b(35.4)], [0, 1, 1, 0]);
  const buyPress = kf(f, [T.buyClick - 3, T.buyClick, T.buyClick + 5], [0, 1, 0]);
  const buyRipple = clamp((f - T.buyClick) / 14);
  const buyMorph = clamp((f - T.buyClick - 2) / 12);
  const success = clamp((f - T.success) / 22);
  const priceTick = kf(f, [T.checkoutIn + 12, T.checkoutIn + 36], [0, 1], EASE.out);

  // ── build-up
  const build = clamp((f - T.build) / (T.end - T.build - 4));
  const charge = EASE.in(build);

  // ── cursor
  const cur = cursorAt(CURSOR, f);
  const curVisible =
    f >= b(10.4) && f < b(17.6) ? 1 : f >= b(21.8) && f < b(26.8) ? 1 : f >= b(31.8) && f < b(36.6) ? 1 : 0;
  const curFade = Math.min(
    kf(f, [b(10.4), b(10.8)], [0, 1]),
    f < b(19) ? kf(f, [b(17.2), b(17.6)], [1, 0]) : f < b(28) ? Math.min(kf(f, [b(21.8), b(22.2)], [0, 1]), kf(f, [b(26.4), b(26.8)], [1, 0])) : Math.min(kf(f, [b(31.8), b(32.2)], [0, 1]), kf(f, [b(36.2), b(36.6)], [1, 0])),
  );
  const hand = Math.max(subHover, joinHover, tierHover * (f < b(26.5) ? 1 : 0), buyHover);
  const curPress = Math.max(subPress, joinPress, tierPress, buyPress);
  const clickAt = [T.subClick, T.joinClick, T.tierClick, T.buyClick].find((c) => f >= c && f < c + 14);
  const curZ = f < b(18) ? 2 : f < b(28) ? 150 : 40;

  const bgShift = kf(f, [b(8), b(44)], [0, -140], EASE.linear);
  const shk = shake(f, T.success, 6, 0.2) + (build > 0 ? Math.sin(f * 1.7) * charge * 7 : 0);

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `translateX(${bgShift}px) scale(1.1)`}}>
        <Backdrop frame={f} grid={0.9} glow={1 - charge * 0.6} />
      </AbsoluteFill>

      <Camera keys={CAM} id="browser" frame={f} shakeX={shk} shakeY={shk * 0.5} handheld={1 - charge}>
        {/* browser */}
        <Place w={VIEWPORT.w} h={VIEWPORT.h + BROWSER_BAR_H} flat>
          <BrowserFrame url={`www.${CHANNEL.url}/videos`} title={`${CHANNEL.name} - YouTube`} glow={kf(f, [b(8), b(10), b(12)], [0, 1, 0])}>
            <ChannelPage
              frame={f}
              load={load}
              subscribed={subscribed}
              subHover={subHover}
              subPress={subPress}
              subRipple={subRipple > 0 && subRipple < 1 ? subRipple : undefined}
              joinHover={joinHover}
              joinPress={joinPress}
              joinRipple={joinRipple > 0 && joinRipple < 1 ? joinRipple : undefined}
              joinGlint={joinGlint}
              joinOpacity={f >= T.open ? 0 : 1}
              hoverCard={hoverCard}
              cardHover={cardHover}
              spotlight={spotlight}
            />
            {toast > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 24,
                  bottom: 24 + (1 - EASE.out(toast)) * -60,
                  background: '#f1f1f1',
                  color: '#0f0f0f',
                  fontFamily: FONT.ui,
                  fontSize: 14,
                  borderRadius: 8,
                  padding: '14px 18px',
                  opacity: toast,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}
              >
                Subscription added
              </div>
            ) : null}
            <div style={{position: 'absolute', inset: 0, background: '#000', opacity: scrim + (build > 0 ? charge * 0.3 : 0)}} />
          </BrowserFrame>
        </Place>

        {/* join dialog (grows out of the Join button) */}
        {f >= T.open && f < T.swap + 6 ? (
          <Place
            x={JOIN_TL.x}
            y={JOIN_TL.y}
            z={3}
            w={JOIN.w}
            h={JOIN.h}
            anchor="topleft"
            style={{
              opacity: 1 - joinOut,
              clipPath:
                morph < 1
                  ? `inset(${clipTop}px ${JOIN.w - clipLeft - clipW}px ${JOIN.h - clipTop - clipH}px ${clipLeft}px round ${lerp(18, 16, morph)}px)`
                  : undefined,
            }}
          >
            <JoinDialog
              frame={f}
              appear={joinAppear}
              explode={explode}
              perkSweep={perkSweep}
              hoverTier={1}
              hover={tierHover}
              selected={1}
              select={tierSelect}
              press={tierPress}
              ripple={tierRipple > 0 && tierRipple < 1 ? tierRipple : undefined}
            />
          </Place>
        ) : null}

        {/* checkout */}
        {f >= T.checkoutIn ? (
          <Place
            x={VIEW_C.x}
            y={VIEW_C.y}
            z={3}
            w={CHECKOUT.w}
            h={CHECKOUT.h}
            scale={lerp(0.85, 1, chkIn)}
            rx={(1 - chkIn) * 20}
            style={{opacity: clamp(chkIn * 2)}}
          >
            <CheckoutDialog
              appear={chkAppear}
              cardIn={cardIn}
              rowFlash={rowFlash}
              buyHover={buyHover}
              buyPress={buyPress}
              buyRipple={buyRipple > 0 && buyRipple < 1 ? buyRipple : undefined}
              morph={buyMorph}
              spin={f - T.buyClick}
              success={success}
              priceTick={priceTick}
            />
          </Place>
        ) : null}

        {/* flying payment card */}
        {f >= T.cardFly && f < T.cardLand + 1 ? (
          <FlyingCard p={cardP} />
        ) : null}

        {/* success burst */}
        <Place x={BUY_C.x} y={BUY_C.y} z={20} w={0} h={0}>
          <Confetti frame={f} start={T.success + 1} x={0} y={0} count={70} power={34} seed="buy" size={0.6} life={60} gravity={0.7} />
          <Sparkles frame={f} start={T.success} x={0} y={0} radius={90} count={12} seed="buyspark" size={16} life={36} />
        </Place>

        {/* build-up: darkness, charge ring, converging sparks */}
        {build > 0 ? (
          <Place x={BUY_C.x} y={BUY_C.y} z={10} w={0} h={0}>
            <div
              style={{
                position: 'absolute',
                left: -3000,
                top: -3000,
                width: 6000,
                height: 6000,
                background: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 30px, rgba(0,0,0,${0.92 * EASE.out(build)}) ${lerp(700, 150, EASE.inOut(build))}px)`,
              }}
            />
            <ChargeRing progress={build} frame={f} />
          </Place>
        ) : null}

        {curVisible ? (
          <Place x={0} y={0} z={curZ} w={0} h={0}>
            <Cursor
              x={cur.x}
              y={cur.y}
              hand={hand}
              press={curPress}
              opacity={curFade}
            />
            {clickAt !== undefined ? (
              <ClickRing x={cursorAt(CURSOR, clickAt).x} y={cursorAt(CURSOR, clickAt).y} p={(f - clickAt) / 14} />
            ) : null}
          </Place>
        ) : null}
      </Camera>

      {/* red iris out of the hook */}
      {f < b(8) + 14 ? (
        <AbsoluteFill
          style={{
            background: '#ff0000',
            WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent ${EASE.outSoft(clamp((f - b(8) - 1) / 11)) * 1400}px, black ${EASE.outSoft(clamp((f - b(8) - 1) / 11)) * 1400 + 2}px)`,
            maskImage: `radial-gradient(circle at 50% 50%, transparent ${EASE.outSoft(clamp((f - b(8) - 1) / 11)) * 1400}px, black ${EASE.outSoft(clamp((f - b(8) - 1) / 11)) * 1400 + 2}px)`,
          }}
        />
      ) : null}

      {build > 0 ? <BuildText progress={build} frame={f} /> : null}
      {f >= b(43) ? <SuccessDisc f={f} zoom={cam(f).zoom} rz={cam(f).rz} /> : null}
    </AbsoluteFill>
  );
};

/** Crisp screen-space stand-in for the success button during the final punch-in. */
const SuccessDisc: React.FC<{f: number; zoom: number; rz: number}> = ({f, zoom, rz}) => {
  const grow = lerp(1, 7, EASE.in(clamp((f - b(43.5)) / (b(44) - b(43.5)))));
  const d = 48 * zoom * grow;
  const ring = (d / 48) * 46;
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const fadeIn = clamp((f - b(43)) / 4);
  return (
    <AbsoluteFill style={{opacity: fadeIn}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) ${ring + 10}px, rgba(0,0,0,0.95) ${ring * 1.9 + 40}px)`,
        }}
      />
      <svg
        width={ring * 2 + 40}
        height={ring * 2 + 40}
        viewBox={`${-ring - 20} ${-ring - 20} ${ring * 2 + 40} ${ring * 2 + 40}`}
        style={{position: 'absolute', left: cx - ring - 20, top: cy - ring - 20, overflow: 'visible'}}
      >
        <defs>
          <linearGradient id="disc-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={BRAND.cyan} />
            <stop offset="0.5" stopColor={BRAND.blue} />
            <stop offset="1" stopColor={BRAND.violet} />
          </linearGradient>
        </defs>
        <circle r={ring} fill="none" stroke="url(#disc-g)" strokeWidth={(5 * d) / 48} style={{filter: `drop-shadow(0 0 ${d / 6}px ${BRAND.cyan})`}} />
        <circle r={d / 2} fill="#2ba640" style={{filter: `drop-shadow(0 0 ${d / 5}px rgba(43,166,64,0.8))`}} />
        <path
          d="M-10 0.5l6.5 6.5L10-6.5"
          transform={`rotate(${rz}) scale(${d / 48})`}
          fill="none"
          stroke="#fff"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </AbsoluteFill>
  );
};

const FlyingCard: React.FC<{p: number}> = ({p}) => {
  const e = EASE.inOut(p);
  const from = {x: 760, y: -420, z: 650};
  const x = lerp(from.x, SLOT_C.x, e);
  const y = lerp(from.y, SLOT_C.y, e) - Math.sin(p * Math.PI) * 120;
  const z = lerp(from.z, 6, EASE.inSoft(p));
  const s = Math.exp(lerp(Math.log(1.25), Math.log(CARD_SLOT.w / 360), EASE.inSoft(p)));
  const ry = lerp(-430, 0, EASE.out(p));
  const rx = lerp(45, 0, e);
  const rz = lerp(28, 0, e);
  return (
    <Place x={x} y={y} z={z} w={360} h={360 / 1.586} rx={rx} ry={ry} rz={rz} scale={s} flat>
      <PaymentCard w={360} sheen={p} />
    </Place>
  );
};

const ChargeRing: React.FC<{progress: number; frame: number}> = ({progress, frame}) => {
  const r = 46;
  const c = 2 * Math.PI * r;
  const p = EASE.inOut(progress);
  return (
    <>
      <svg width={140} height={140} viewBox="0 0 140 140" style={{position: 'absolute', left: -70, top: -70, overflow: 'visible'}}>
        <defs>
          <linearGradient id="charge-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={BRAND.cyan} />
            <stop offset="0.5" stopColor={BRAND.blue} />
            <stop offset="1" stopColor={BRAND.violet} />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="url(#charge-g)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
          transform="rotate(-90 70 70)"
          style={{filter: `drop-shadow(0 0 ${6 + p * 10}px ${BRAND.cyan})`}}
        />
      </svg>
      {Array.from({length: 22}).map((_, i) => {
        const speed = 0.035 + p * 0.07;
        const ph = (random(`chg${i}`) + frame * speed) % 1;
        const a = random(`cha${i}`) * Math.PI * 2 + frame * 0.01;
        const d = lerp(520, 60, EASE.in(ph));
        const len = 20 + EASE.in(ph) * 50;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: Math.cos(a) * d,
              top: Math.sin(a) * d,
              width: len,
              height: 2.5,
              marginTop: -1.25,
              borderRadius: 2,
              transformOrigin: '0 50%',
              transform: `rotate(${(a * 180) / Math.PI + 180}deg)`,
              background: `linear-gradient(90deg, rgba(255,255,255,0.95), ${i % 2 ? BRAND.cyan : BRAND.violet}00)`,
              opacity: Math.sin(ph * Math.PI) * clamp(progress * 3),
            }}
          />
        );
      })}
    </>
  );
};

const BuildText: React.FC<{progress: number; frame: number}> = ({progress, frame}) => {
  const pct = Math.min(100, Math.floor(EASE.inOut(progress) * 100));
  const o = clamp(progress * 5) * (1 - clamp((progress - 0.93) * 14));
  const jitter = progress > 0.7 ? (random(`bt${frame}`) - 0.5) * 6 * progress : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: WIDTH,
        top: HEIGHT - 250,
        textAlign: 'center',
        fontFamily: FONT.mono,
        color: '#fff',
        opacity: o,
        transform: `translateX(${jitter}px)`,
      }}
    >
      <div style={{fontSize: 20, letterSpacing: 10, opacity: 0.8}}>UNLOCKING MEMBERSHIP</div>
      <div style={{fontSize: 64, fontWeight: 700, letterSpacing: 4, marginTop: 6, color: YT.text, textShadow: `0 0 24px ${BRAND.cyan}`}}>
        {String(pct).padStart(2, '0')}%
      </div>
    </div>
  );
};
