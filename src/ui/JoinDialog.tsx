import React from 'react';
import {BRAND, CHANNEL, TIERS} from '../config/channel';
import {alpha} from '../config/palette';
import {clamp, EASE} from '../lib/motion';
import {FONT, YT} from '../theme/tokens';
import {ChannelAvatar, ChannelBanner, MemberBadge} from './Brand';
import {Pill} from './Button';
import {Icon} from './Icon';

export const JOIN = {w: 900, h: 600};
export const tierRect = (i: number) => ({x: 32 + i * 284, y: 214, w: 268, h: 300});
export const tierJoinRect = (i: number) => {
  const t = tierRect(i);
  return {x: t.x + 20, y: t.y + 130, w: t.w - 40, h: 36};
};

type JoinDialogProps = {
  /** 0→1 entrance of dialog contents (staggered internally). */
  appear: number;
  /** 0→1 lifts tier cards off the dialog surface (3D exploded view). */
  explode?: number;
  hoverTier?: number;
  hover?: number;
  selected?: number;
  select?: number;
  press?: number;
  ripple?: number;
  /** Continuous 0→n index sweeping a highlight down each perk list. */
  perkSweep?: number;
  frame: number;
};

const TierCard: React.FC<{
  i: number;
  appear: number;
  hover: number;
  select: number;
  press: number;
  ripple?: number;
  perkSweep: number;
  frame: number;
}> = ({i, appear, hover, select, press, ripple, perkSweep, frame}) => {
  const t = TIERS[i];
  const r = tierRect(i);
  const a = EASE.out(clamp(appear));
  const glow = Math.max(hover * 0.6, select);
  const angle = (frame * 4) % 360;
  return (
    <div
      style={{
        position: 'absolute',
        left: r.x,
        top: r.y,
        width: r.w,
        height: r.h,
        transformStyle: 'preserve-3d',
        opacity: a,
        transform: `translate3d(0, ${(1 - a) * 40}px, ${hover * 24 + select * 16}px) rotateX(${(1 - a) * -25}deg) scale(${1 + hover * 0.02 - press * 0.02})`,
      }}
    >
      {/* rotating gradient rim for the highlighted tier */}
      <div
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 14,
          opacity: glow,
          background: `conic-gradient(from ${angle}deg, ${BRAND.cyan}, ${BRAND.blue}, ${BRAND.violet}, ${BRAND.pink}, ${BRAND.cyan})`,
          boxShadow: `0 0 ${40 * glow}px ${alpha(BRAND.indigo, 0.55 * glow)}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 12,
          background: '#2a2a2a',
          border: `1px solid rgba(255,255,255,${0.1 * (1 - glow)})`,
          boxShadow: `0 ${10 + hover * 24}px ${30 + hover * 30}px rgba(0,0,0,${0.35 + hover * 0.2}), 0 0 0 1px rgba(255,255,255,0.04)`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 20% 0%, ${alpha(BRAND.blue, 0.22 * glow)} 0%, ${alpha(BRAND.blue, 0)} 60%)`,
          }}
        />
        {t.popular ? (
          <div
            style={{
              position: 'absolute',
              right: 14,
              top: 16,
              padding: '3px 8px',
              borderRadius: 6,
              background: BRAND.gradient,
              color: '#fff',
              fontFamily: FONT.ui,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.4,
            }}
          >
            MOST POPULAR
          </div>
        ) : null}
        <div style={{position: 'absolute', left: 20, top: 20}}>
          <MemberBadge size={40} level={t.level} id={`tier${i}`} />
        </div>
        <div style={{position: 'absolute', left: 72, top: 20, fontFamily: FONT.ui}}>
          <div style={{fontSize: 16, fontWeight: 500, color: YT.text, lineHeight: '22px'}}>{t.name}</div>
          <div style={{fontSize: 12, color: YT.text2, lineHeight: '18px'}}>Level {i + 1}</div>
        </div>
        <div style={{position: 'absolute', left: 20, top: 78, display: 'flex', alignItems: 'baseline', gap: 4}}>
          <span style={{fontFamily: FONT.ui, fontSize: 30, fontWeight: 700, color: YT.text, letterSpacing: -0.5}}>
            {t.price}
          </span>
          <span style={{fontFamily: FONT.ui, fontSize: 14, color: YT.text2}}>/month</span>
        </div>
        <div style={{position: 'absolute', left: 20, top: 130}}>
          <Pill label="Join" variant="cta" width={r.w - 40} hover={hover} press={press} ripple={ripple} />
        </div>
        <div style={{position: 'absolute', left: 20, right: 20, top: 186, height: 1, background: YT.divider}} />
        <div style={{position: 'absolute', left: 20, right: 16, top: 200}}>
          {t.perks.map((perk, j) => {
            const lit = clamp(1 - Math.abs(perkSweep - (j + i * 0.35)) * 1.2);
            const shown = EASE.out(clamp(appear * 3 - 1.2 - j * 0.25));
            return (
              <div
                key={perk}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  height: 28,
                  opacity: shown,
                  transform: `translateX(${(1 - shown) * 12}px)`,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    background: lit > 0.05 ? `rgba(62,166,255,${0.25 + lit * 0.75})` : 'rgba(62,166,255,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `scale(${1 + lit * 0.25})`,
                    boxShadow: lit > 0.05 ? `0 0 ${14 * lit}px rgba(62,166,255,${lit})` : undefined,
                  }}
                >
                  <Icon name="check" size={13} color={lit > 0.5 ? '#0f0f0f' : YT.cta} />
                </div>
                <span
                  style={{
                    fontFamily: FONT.ui,
                    fontSize: 13,
                    color: lit > 0.1 ? `rgba(241,241,241,${0.7 + lit * 0.3})` : YT.text2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {perk}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const JoinDialog: React.FC<JoinDialogProps> = ({
  appear,
  explode = 0,
  hoverTier = -1,
  hover = 0,
  selected = -1,
  select = 0,
  press = 0,
  ripple,
  perkSweep = -5,
  frame,
}) => {
  const head = EASE.out(clamp(appear * 2.2));
  return (
    <div style={{position: 'relative', width: JOIN.w, height: JOIN.h, transformStyle: 'preserve-3d'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 16,
          background: YT.raised,
          boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      />
      <div style={{position: 'absolute', left: 0, top: 0, width: JOIN.w, height: 104, borderRadius: '16px 16px 0 0', overflow: 'hidden', opacity: head}}>
        <ChannelBanner w={JOIN.w} h={150} radius={0} minimal />
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(33,33,33,0) 30%, ${YT.raised} 100%)`}} />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 16,
          top: 16,
          width: 36,
          height: 36,
          borderRadius: 18,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="close" size={20} color="#fff" />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 32,
          top: 60,
          transform: `translateZ(${explode * 60}px) scale(${0.6 + head * 0.4})`,
          opacity: head,
          borderRadius: '50%',
          boxShadow: `0 0 0 4px ${YT.raised}`,
        }}
      >
        <ChannelAvatar size={76} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 32,
          top: 146,
          opacity: EASE.out(clamp(appear * 2.2 - 0.3)),
          transform: `translate3d(${(1 - EASE.out(clamp(appear * 2.2 - 0.3))) * 20}px, 0, ${explode * 45}px)`,
        }}
      >
        <div style={{fontFamily: FONT.ui, fontSize: 22, fontWeight: 700, color: YT.text, lineHeight: '28px'}}>
          Join {CHANNEL.name}
        </div>
        <div style={{fontFamily: FONT.ui, fontSize: 14, color: YT.text2, marginTop: 4}}>
          Get access to membership perks · Choose a level
        </div>
      </div>
      <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `translateZ(${explode * 120}px)`}}>
        {TIERS.map((t, i) => (
          <TierCard
            key={t.id}
            i={i}
            appear={clamp(appear * 1.6 - 0.25 - i * 0.12)}
            hover={hoverTier === i ? hover : 0}
            select={selected === i ? select : 0}
            press={selected === i ? press : 0}
            ripple={selected === i ? ripple : undefined}
            perkSweep={perkSweep}
            frame={frame}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 32,
          right: 32,
          top: 538,
          fontFamily: FONT.ui,
          fontSize: 12,
          lineHeight: '18px',
          color: YT.text2,
          opacity: EASE.out(clamp(appear * 2 - 1)),
        }}
      >
        Recurring payment. Cancel anytime. Creator may update perks. <span style={{color: YT.cta}}>Learn more</span>
      </div>
    </div>
  );
};
