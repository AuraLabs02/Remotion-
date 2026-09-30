import React from 'react';
import {BRAND, CHANNEL, TIERS, SELECTED_TIER, VIEWER} from '../config/channel';
import {clamp, EASE, lerp} from '../lib/motion';
import {FONT, YT} from '../theme/tokens';
import {REAL} from './assets';
import {BrandMark, ChannelAvatar, CloudCodesMark, YouTubeIcon} from './Brand';
import {Icon} from './Icon';

export const CHECKOUT = {w: 560, h: 540};
export const BUY = {x: 24, y: 408, w: 512, h: 48};
export const CARD_SLOT = {x: 40, y: 272, w: 48, h: 30};

/** Physical-looking payment card (brand edition). */
export const PaymentCard: React.FC<{w?: number; sheen?: number}> = ({w = 360, sheen = 0.5}) => {
  const h = w / 1.586;
  const k = w / 360;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 16 * k,
        position: 'relative',
        overflow: 'hidden',
        background: `radial-gradient(circle at 85% 15%, rgba(236,72,153,0.55) 0%, rgba(236,72,153,0) 45%), linear-gradient(135deg, #0b1130 0%, #1d2a78 45%, #4b2aa8 100%)`,
        boxShadow: `0 ${24 * k}px ${50 * k}px rgba(0,0,0,0.5), inset 0 0 0 ${1 * k}px rgba(255,255,255,0.18)`,
        fontFamily: FONT.mono,
        color: '#fff',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(115deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 2px, transparent 2px, transparent 9px)',
        }}
      />
      {REAL.avatar ? null : (
        <div style={{position: 'absolute', right: -40 * k, bottom: -46 * k, opacity: 0.22}}>
          <CloudCodesMark size={220 * k} id="cardmark" glyph="#1d2a78" />
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          left: 26 * k,
          top: 22 * k,
          fontFamily: FONT.display,
          fontWeight: 800,
          fontSize: 17 * k,
          letterSpacing: 0.5 * k,
          display: 'flex',
          alignItems: 'center',
          gap: 8 * k,
        }}
      >
        <BrandMark size={30 * k} id="cardlogo" glyph="#0b1130" />
        {CHANNEL.name}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 28 * k,
          top: 78 * k,
          width: 46 * k,
          height: 34 * k,
          borderRadius: 7 * k,
          background: 'linear-gradient(135deg, #f7e7a1 0%, #d4a93c 50%, #f3d77c 100%)',
          boxShadow: `inset 0 0 0 ${1 * k}px rgba(0,0,0,0.25)`,
        }}
      >
        <div style={{position: 'absolute', left: '33%', top: 0, bottom: 0, width: 1 * k, background: 'rgba(0,0,0,0.3)'}} />
        <div style={{position: 'absolute', left: '66%', top: 0, bottom: 0, width: 1 * k, background: 'rgba(0,0,0,0.3)'}} />
        <div style={{position: 'absolute', top: '50%', left: 0, right: 0, height: 1 * k, background: 'rgba(0,0,0,0.3)'}} />
      </div>
      <svg
        viewBox="0 0 24 24"
        width={26 * k}
        height={26 * k}
        style={{position: 'absolute', left: 86 * k, top: 82 * k, opacity: 0.85}}
      >
        {[5, 9, 13].map((r) => (
          <path key={r} d={`M${6 + r * 0.3} ${12 - r * 0.55}a${r} ${r} 0 0 1 0 ${r * 1.1}`} stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 26 * k, top: 132 * k, fontSize: 20 * k, letterSpacing: 2.5 * k, fontWeight: 500}}>
        •••• •••• •••• 4242
      </div>
      <div style={{position: 'absolute', left: 26 * k, bottom: 20 * k, fontSize: 11.5 * k, letterSpacing: 1.2 * k, opacity: 0.9}}>
        {VIEWER.name.toUpperCase()} <span style={{marginLeft: 18 * k, opacity: 0.7}}>08/29</span>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 22 * k,
          bottom: 14 * k,
          fontFamily: FONT.display,
          fontStyle: 'italic',
          fontWeight: 900,
          fontSize: 28 * k,
          letterSpacing: -0.5 * k,
        }}
      >
        VISA
      </div>
      <div
        style={{
          position: 'absolute',
          top: -h,
          bottom: -h,
          width: w * 0.5,
          left: lerp(-w * 0.8, w * 1.3, sheen),
          transform: 'rotate(20deg)',
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%)',
        }}
      />
    </div>
  );
};

type CheckoutProps = {
  appear: number;
  /** 0→1: card graphic becomes visible in the payment row (after the 3D card lands). */
  cardIn?: number;
  rowFlash?: number;
  buyHover?: number;
  buyPress?: number;
  buyRipple?: number;
  /** 0→1 pill morphs into a circle. */
  morph?: number;
  /** spinner rotation phase (frames). */
  spin?: number;
  /** 0→1 success: green fill + check draw. */
  success?: number;
  priceTick?: number;
};

export const CheckoutDialog: React.FC<CheckoutProps> = ({
  appear,
  cardIn = 0,
  rowFlash = 0,
  buyHover = 0,
  buyPress = 0,
  buyRipple,
  morph = 0,
  spin = 0,
  success = 0,
  priceTick = 1,
}) => {
  const tier = TIERS[SELECTED_TIER];
  const row = (k: number) => {
    const p = EASE.out(clamp(appear * 2.4 - k * 0.22));
    return {opacity: p, transform: `translateY(${(1 - p) * 16}px)`};
  };
  const m = EASE.inOut(clamp(morph));
  const bw = lerp(BUY.w, BUY.h, m);
  const s = clamp(success);
  const price = (tier.priceValue * clamp(priceTick)).toFixed(2);
  const checkLen = 30;
  return (
    <div
      style={{
        position: 'relative',
        width: CHECKOUT.w,
        height: CHECKOUT.h,
        borderRadius: 16,
        background: YT.raised,
        boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
        fontFamily: FONT.ui,
        color: YT.text,
        overflow: 'hidden',
      }}
    >
      <div style={{height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 10, ...row(0)}}>
        <YouTubeIcon height={20} />
        <span style={{fontSize: 18, fontWeight: 500}}>Complete your purchase</span>
        <div style={{flex: 1}} />
        <Icon name="close" size={22} color={YT.text2} />
      </div>
      <div style={{height: 1, background: YT.divider, margin: '0 24px'}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', ...row(1)}}>
        <ChannelAvatar size={52} />
        <div style={{flex: 1}}>
          <div style={{fontSize: 16, fontWeight: 500}}>{CHANNEL.name} membership</div>
          <div style={{fontSize: 14, color: YT.text2, marginTop: 2}}>{tier.name} · Level 2</div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>${price}</div>
          <div style={{fontSize: 12, color: YT.text2}}>per month</div>
        </div>
      </div>
      <div style={{padding: '0 24px', ...row(2)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: YT.text2, height: 26}}>
          <Icon name="clock" size={18} color={YT.text2} /> Billed monthly, starting today
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: YT.text2, height: 26}}>
          <Icon name="check" size={18} color={YT.text2} /> Cancel anytime in Purchases and memberships
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: 256,
          height: 62,
          borderRadius: 12,
          background: `rgba(255,255,255,${0.05 + rowFlash * 0.08})`,
          boxShadow: rowFlash > 0 ? `inset 0 0 0 1.5px rgba(62,166,255,${rowFlash})` : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 14,
          ...row(3),
        }}
      >
        <div style={{width: CARD_SLOT.w, height: CARD_SLOT.h, borderRadius: 5, position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.08)'}}>
          <div style={{position: 'absolute', inset: 0, opacity: cardIn}}>
            <div style={{transform: `scale(${CARD_SLOT.w / 360})`, transformOrigin: '0 0'}}>
              <PaymentCard w={360} sheen={0.5} />
            </div>
          </div>
          {cardIn < 0.5 ? <Icon name="card" size={22} color={YT.text2} style={{position: 'absolute', left: 13, top: 4, opacity: 1 - cardIn * 2}} /> : null}
        </div>
        <div style={{flex: 1}}>
          <div style={{fontSize: 15, fontWeight: 500}}>{cardIn > 0.5 ? 'Visa •••• 4242' : 'Add payment method'}</div>
          <div style={{fontSize: 12, color: YT.text2}}>{cardIn > 0.5 ? `${VIEWER.name} · Expires 08/29` : 'Card, UPI or PayPal'}</div>
        </div>
        <Icon name="chevronRight" size={22} color={YT.text2} />
      </div>
      <div style={{position: 'absolute', left: 24, right: 24, top: 336, height: 1, background: YT.divider}} />
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: 352,
          display: 'flex',
          alignItems: 'baseline',
          ...row(4),
        }}
      >
        <span style={{fontSize: 16, fontWeight: 500}}>Total today</span>
        <div style={{flex: 1}} />
        <span style={{fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>${price}</span>
      </div>
      {/* Buy button → spinner → success */}
      <div
        style={{
          position: 'absolute',
          left: BUY.x + (BUY.w - bw) / 2,
          top: BUY.y,
          width: bw,
          height: BUY.h,
          borderRadius: BUY.h / 2,
          background: s > 0 ? `rgb(${lerp(62, 43, s)}, ${lerp(166, 166, s)}, ${lerp(255, 64, s)})` : YT.cta,
          overflow: 'hidden',
          opacity: row(5).opacity,
          transform: `${row(5).transform} scale(${1 - buyPress * 0.04 + s * 0.08 * Math.sin(Math.min(1, s * 1.4) * Math.PI)})`,
          boxShadow: s > 0 ? `0 0 ${40 * s}px rgba(43,166,64,${0.6 * s})` : `0 0 ${24 * buyHover}px rgba(62,166,255,${0.5 * buyHover})`,
        }}
      >
        <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: buyHover * 0.15}} />
        {buyRipple !== undefined && buyRipple > 0 && buyRipple < 1 ? (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 600,
              height: 600,
              marginLeft: -300,
              marginTop: -300,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.4)',
              transform: `scale(${0.05 + buyRipple})`,
              opacity: 1 - buyRipple,
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 500,
            color: YT.ctaText,
            opacity: 1 - clamp(m * 3),
            whiteSpace: 'nowrap',
          }}
        >
          Buy · ${tier.priceValue.toFixed(2)}/month
        </div>
        {m > 0.6 && s < 1 ? (
          <svg
            viewBox="0 0 48 48"
            width={48}
            height={48}
            style={{position: 'absolute', left: (bw - 48) / 2, top: 0, opacity: clamp((m - 0.6) * 4) * (1 - s)}}
          >
            <circle
              cx="24"
              cy="24"
              r="13"
              fill="none"
              stroke={YT.ctaText}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${30 + Math.sin(spin * 0.12) * 18} 100`}
              transform={`rotate(${spin * 14} 24 24)`}
            />
          </svg>
        ) : null}
        {s > 0 ? (
          <svg viewBox="0 0 48 48" width={48} height={48} style={{position: 'absolute', left: (bw - 48) / 2, top: 0}}>
            <path
              d="M14 24.5l6.5 6.5L34 17.5"
              fill="none"
              stroke="#fff"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={checkLen}
              strokeDashoffset={checkLen * (1 - EASE.out(clamp(s * 1.6 - 0.3)))}
            />
          </svg>
        ) : null}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: 472,
          fontSize: 12,
          lineHeight: '18px',
          color: YT.text2,
          ...row(6),
        }}
      >
        By clicking Buy, you agree to the <span style={{color: YT.cta}}>Paid Service Terms</span>. Recurring charge, cancel anytime.
      </div>
      {s > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 474,
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 500,
            color: '#5bd46e',
            background: YT.raised,
            opacity: EASE.out(clamp(s * 2 - 0.6)),
            transform: `translateY(${(1 - EASE.out(clamp(s * 2 - 0.6))) * 10}px)`,
          }}
        >
          Payment complete · Welcome to {CHANNEL.name}!
        </div>
      ) : null}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: BRAND.gradient, opacity: s}} />
    </div>
  );
};
