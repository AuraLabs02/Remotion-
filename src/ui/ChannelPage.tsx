import React from 'react';
import {CHANNEL, VIDEOS, type Video} from '../config/channel';
import {clamp, EASE} from '../lib/motion';
import {FONT, YT} from '../theme/tokens';
import {REAL} from './assets';
import {ChannelAvatar, ChannelBanner} from './Brand';
import {Pill} from './Button';
import {Icon} from './Icon';
import {ThumbnailArt} from './Thumbnail';
import {Guide, GUIDE_W, Masthead, MASTHEAD_H, VIEWPORT} from './YouTubeChrome';

// Layout of the channel page inside the 1440×900 viewport (page coords).
export const CP = {
  colX: 280,
  colW: 1120,
  banner: {x: 280, y: 72, w: 1120, h: 180},
  avatar: {x: 280, y: 276, size: 160},
  textX: 464,
  buttonsY: 412,
  btnH: 36,
  subW: 98,
  subWDone: 150,
  joinW: 62,
  tabsY: 460,
  chipsY: 524,
  gridY: 572,
  cols: 4,
  gap: 16,
  rowPitch: 262,
};
export const CARD_W = (CP.colW - CP.gap * (CP.cols - 1)) / CP.cols; // 268
export const THUMB_H = CARD_W * (9 / 16);

export const subscribeRect = (subscribed: number) => {
  const w = CP.subW + (CP.subWDone - CP.subW) * EASE.inOut(clamp(subscribed));
  return {x: CP.textX, y: CP.buttonsY, w, h: CP.btnH};
};
export const joinRect = (subscribed: number) => {
  const s = subscribeRect(subscribed);
  return {x: s.x + s.w + 8, y: CP.buttonsY, w: CP.joinW, h: CP.btnH};
};
export const cardRect = (i: number) => ({
  x: CP.colX + (i % CP.cols) * (CARD_W + CP.gap),
  y: CP.gridY + Math.floor(i / CP.cols) * CP.rowPitch,
  w: CARD_W,
  h: THUMB_H,
});

const Skeleton: React.FC<{w: number | string; h: number; r?: number; frame: number; style?: React.CSSProperties}> = ({
  w,
  h,
  r = 8,
  frame,
  style,
}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: r,
      background: `linear-gradient(90deg, ${YT.shimmer} 0%, #343434 ${((frame * 3) % 160) - 30}%, ${YT.shimmer} ${((frame * 3) % 160) - 10}%)`,
      ...style,
    }}
  />
);

/** Crossfades a skeleton into real content as p goes 0 → 1. */
const Reveal: React.FC<{
  p: number;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({p, skeleton, children, style}) => (
  <div style={{position: 'relative', ...style}}>
    <div style={{opacity: clamp(1 - p * 1.6)}}>{skeleton}</div>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: EASE.out(clamp(p * 1.4 - 0.2)),
        transform: `translateY(${(1 - EASE.out(clamp(p))) * 10}px)`,
      }}
    >
      {children}
    </div>
  </div>
);

export const VideoCard: React.FC<{
  v: Video;
  index: number;
  width: number;
  hover?: number;
  src?: string | null;
  badge?: React.ReactNode;
  overlay?: React.ReactNode;
}> = ({v, index, width, hover = 0, src, badge, overlay}) => (
  <div style={{width}}>
    <div
      style={{
        position: 'relative',
        borderRadius: 12 - hover * 12,
        overflow: 'hidden',
        width,
        height: width * (9 / 16),
      }}
    >
      <ThumbnailArt art={v.art} width={width} src={src === undefined ? REAL.thumb(index) : src} />
      <div
        style={{
          position: 'absolute',
          right: 6,
          bottom: 6,
          background: 'rgba(0,0,0,0.75)',
          color: '#fff',
          fontFamily: FONT.ui,
          fontWeight: 500,
          fontSize: 12,
          padding: '1px 4px',
          borderRadius: 4,
          opacity: 1 - hover,
        }}
      >
        {v.duration}
      </div>
      {hover > 0 ? (
        <div style={{position: 'absolute', left: 0, bottom: 0, height: 3, width: `${hover * 38}%`, background: YT.red}} />
      ) : null}
      {overlay}
    </div>
    <div style={{display: 'flex', gap: 12, marginTop: 12}}>
      <div style={{flex: 1}}>
        <div
          style={{
            fontFamily: FONT.ui,
            fontWeight: 500,
            fontSize: 16,
            lineHeight: '22px',
            color: YT.text,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: 44,
          }}
        >
          {v.title}
        </div>
        <div style={{fontFamily: FONT.ui, fontSize: 14, lineHeight: '20px', color: YT.text2, marginTop: 4}}>
          {v.views} • {v.age}
        </div>
        {badge ? <div style={{marginTop: 6, display: 'flex'}}>{badge}</div> : null}
      </div>
      <Icon name="more" size={20} color={YT.text} style={{opacity: hover}} />
    </div>
  </div>
);

export type ChannelPageProps = {
  frame: number;
  load: number;
  scroll?: number;
  subscribed?: number;
  subHover?: number;
  subPress?: number;
  subRipple?: number;
  joinHover?: number;
  joinPress?: number;
  joinRipple?: number;
  joinGlint?: number;
  joinOpacity?: number;
  hoverCard?: number;
  cardHover?: number;
  spotlight?: number;
  query?: string;
};

export const ChannelPage: React.FC<ChannelPageProps> = ({
  frame,
  load,
  scroll = 0,
  subscribed = 0,
  subHover = 0,
  subPress = 0,
  subRipple,
  joinHover = 0,
  joinPress = 0,
  joinRipple,
  joinGlint,
  joinOpacity = 1,
  hoverCard = -1,
  cardHover = 0,
  spotlight = 0,
  query = 'cloud codes',
}) => {
  const r = (start: number) => clamp((load - start) / 0.35);
  const sub = subscribeRect(subscribed);
  const join = joinRect(subscribed);
  const subDone = subscribed > 0.5;
  const tabs = ['Home', 'Videos', 'Shorts', 'Live', 'Playlists', 'Posts'];
  return (
    <div style={{position: 'absolute', inset: 0, background: YT.base, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: GUIDE_W,
          top: MASTHEAD_H,
          width: VIEWPORT.w - GUIDE_W,
          height: VIEWPORT.h - MASTHEAD_H,
          overflow: 'hidden',
        }}
      >
        <div style={{position: 'absolute', left: -GUIDE_W, top: -MASTHEAD_H - scroll, width: VIEWPORT.w, height: 1400}}>
          {/* Banner */}
          <Reveal
            p={r(0)}
            style={{position: 'absolute', left: CP.banner.x, top: CP.banner.y}}
            skeleton={<Skeleton w={CP.banner.w} h={CP.banner.h} r={16} frame={frame} />}
          >
            <ChannelBanner w={CP.banner.w} h={CP.banner.h} />
          </Reveal>

          {/* Avatar */}
          <Reveal
            p={r(0.08)}
            style={{position: 'absolute', left: CP.avatar.x, top: CP.avatar.y}}
            skeleton={<Skeleton w={CP.avatar.size} h={CP.avatar.size} r={80} frame={frame} />}
          >
            <ChannelAvatar size={CP.avatar.size} />
          </Reveal>

          {/* Title + metadata */}
          <Reveal
            p={r(0.14)}
            style={{position: 'absolute', left: CP.textX, top: 282}}
            skeleton={
              <div>
                <Skeleton w={300} h={36} frame={frame} />
                <Skeleton w={420} h={16} frame={frame} style={{marginTop: 18}} />
                <Skeleton w={520} h={16} frame={frame} style={{marginTop: 10}} />
              </div>
            }
          >
            <div style={{width: 800}}>
              <div
                style={{
                  fontFamily: FONT.display,
                  fontWeight: 800,
                  fontSize: 36,
                  lineHeight: '44px',
                  color: YT.text,
                  letterSpacing: -0.4,
                }}
              >
                {CHANNEL.name}
              </div>
              <div style={{fontFamily: FONT.ui, fontSize: 14, lineHeight: '20px', color: YT.text2, marginTop: 8}}>
                <span style={{color: YT.text, fontWeight: 500}}>{CHANNEL.handle}</span> • {CHANNEL.subscribers} •{' '}
                {CHANNEL.videoCount}
              </div>
              <div
                style={{
                  fontFamily: FONT.ui,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: YT.text2,
                  marginTop: 6,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  width: 700,
                }}
              >
                {CHANNEL.description.slice(0, CHANNEL.description.lastIndexOf(' ', 80))}…<span style={{color: YT.text, fontWeight: 500}}>more</span>
              </div>
              <div style={{fontFamily: FONT.ui, fontSize: 14, lineHeight: '20px', marginTop: 4}}>
                <span style={{color: YT.cta, fontWeight: 500}}>{CHANNEL.link}</span>
                <span style={{color: YT.text2}}> {CHANNEL.moreLinks}</span>
              </div>
            </div>
          </Reveal>

          {/* Buttons */}
          <Reveal
            p={r(0.2)}
            style={{position: 'absolute', left: CP.textX, top: CP.buttonsY}}
            skeleton={<Skeleton w={170} h={36} r={18} frame={frame} />}
          >
            <div style={{position: 'relative', width: 400, height: 36}}>
              <div style={{position: 'absolute', left: 0, top: 0}}>
                <Pill
                  variant={subDone ? 'tonal' : 'white'}
                  label={subDone ? 'Subscribed' : 'Subscribe'}
                  icon={subDone ? 'bell' : undefined}
                  trailingIcon={subDone ? 'chevronDown' : undefined}
                  width={sub.w}
                  padX={subDone ? 10 : 16}
                  hover={subHover}
                  press={subPress}
                  ripple={subRipple}
                />
              </div>
              <div style={{position: 'absolute', left: join.x - CP.textX, top: 0, opacity: joinOpacity}}>
                <Pill label="Join" variant="tonal" width={CP.joinW} hover={joinHover} press={joinPress} ripple={joinRipple} />
                {joinGlint !== undefined && joinGlint > 0 && joinGlint < 1 ? (
                  <div style={{position: 'absolute', inset: 0, borderRadius: 18, overflow: 'hidden'}}>
                    <div
                      style={{
                        position: 'absolute',
                        top: -10,
                        bottom: -10,
                        width: 26,
                        left: -40 + joinGlint * 140,
                        transform: 'skewX(-20deg)',
                        background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))',
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </Reveal>

          {/* Tabs */}
          <div style={{position: 'absolute', left: CP.colX, top: CP.tabsY, width: CP.colW, opacity: EASE.out(r(0.26))}}>
            <div style={{display: 'flex', height: 48, alignItems: 'stretch', gap: 24}}>
              {tabs.map((t) => (
                <div
                  key={t}
                  style={{
                    fontFamily: FONT.ui,
                    fontSize: 16,
                    fontWeight: 500,
                    color: t === 'Videos' ? YT.text : YT.text2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: t === 'Videos' ? `2px solid ${YT.text}` : '2px solid transparent',
                    boxSizing: 'border-box',
                  }}
                >
                  {t}
                </div>
              ))}
              <div style={{display: 'flex', alignItems: 'center'}}>
                <Icon name="search" size={24} color={YT.text2} />
              </div>
            </div>
            <div style={{height: 1, background: YT.divider}} />
          </div>

          {/* Chips */}
          <div
            style={{
              position: 'absolute',
              left: CP.colX,
              top: CP.chipsY,
              display: 'flex',
              gap: 12,
              opacity: EASE.out(r(0.3)),
            }}
          >
            {['Latest', 'Popular', 'Oldest'].map((c, i) => (
              <div
                key={c}
                style={{
                  height: 32,
                  padding: '0 12px',
                  borderRadius: 8,
                  background: i === 0 ? '#f1f1f1' : YT.tonal,
                  color: i === 0 ? '#0f0f0f' : YT.text,
                  fontFamily: FONT.ui,
                  fontWeight: 500,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {c}
              </div>
            ))}
          </div>

          {/* Grid */}
          {VIDEOS.map((v, i) => {
            const rect = cardRect(i);
            const p = r(0.34 + i * 0.045);
            const hv = hoverCard === i ? cardHover : 0;
            return (
              <Reveal
                key={v.title}
                p={p}
                style={{
                  position: 'absolute',
                  left: rect.x,
                  top: rect.y,
                  transform: `scale(${1 + hv * 0.04})`,
                  transformOrigin: '50% 30%',
                  zIndex: hv > 0 ? 2 : 1,
                }}
                skeleton={
                  <div>
                    <Skeleton w={CARD_W} h={THUMB_H} r={12} frame={frame} />
                    <Skeleton w={CARD_W - 20} h={16} frame={frame} style={{marginTop: 12}} />
                    <Skeleton w={CARD_W - 90} h={16} frame={frame} style={{marginTop: 8}} />
                  </div>
                }
              >
                <VideoCard v={v} index={i} width={CARD_W} hover={hv} />
              </Reveal>
            );
          })}
        </div>
      </div>

      <Masthead query={query} />
      <Guide />
      {spotlight > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at ${join.x + join.w / 2}px ${join.y + join.h / 2 - scroll}px, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 70px, rgba(0,0,0,${0.62 * spotlight}) 260px)`,
          }}
        />
      ) : null}

    </div>
  );
};
