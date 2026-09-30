import React from 'react';
import {BRAND, SUBSCRIPTIONS, VIEWER} from '../config/channel';
import {alpha} from '../config/palette';
import {FONT, YT} from '../theme/tokens';
import {ChannelAvatar, LetterAvatar, YouTubeIcon, YouTubeLogo} from './Brand';
import {IconButton} from './Button';
import {Icon, type IconName} from './Icon';

export const VIEWPORT = {w: 1440, h: 900};
export const MASTHEAD_H = 56;
export const GUIDE_W = 240;

export const Masthead: React.FC<{query?: string; caret?: boolean; notifications?: string}> = ({
  query = '',
  caret = false,
  notifications = '9+',
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: VIEWPORT.w,
      height: MASTHEAD_H,
      background: YT.base,
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      boxSizing: 'border-box',
      zIndex: 5,
    }}
  >
    <IconButton icon="menu" />
    <div style={{marginLeft: 16, width: 120}}>
      <YouTubeLogo height={20} />
    </div>
    <div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: 40}}>
      <div
        style={{
          width: 536,
          height: 40,
          border: `1px solid ${YT.outline}`,
          borderRight: 'none',
          borderRadius: '40px 0 0 40px',
          background: YT.searchBg,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          boxSizing: 'border-box',
          fontFamily: FONT.ui,
          fontSize: 16,
          color: query ? YT.text : '#888',
        }}
      >
        {query || 'Search'}
        {caret ? <span style={{width: 1, height: 20, background: YT.text, marginLeft: 1}} /> : null}
      </div>
      <div
        style={{
          width: 64,
          height: 40,
          border: `1px solid ${YT.outline}`,
          borderRadius: '0 40px 40px 0',
          background: YT.searchBtn,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        <Icon name="search" size={24} color={YT.text} />
      </div>
      <IconButton icon="mic" bg={YT.micBg} style={{marginLeft: 12}} />
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 8, marginLeft: 40}}>
      <div
        style={{
          height: 36,
          borderRadius: 18,
          background: YT.tonal,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px 0 8px',
          gap: 6,
          fontFamily: FONT.ui,
          fontSize: 14,
          fontWeight: 500,
          color: YT.text,
        }}
      >
        <Icon name="plus" size={24} color={YT.text} />
        Create
      </div>
      <IconButton icon="bell">
        {notifications ? (
          <div
            style={{
              position: 'absolute',
              top: 1,
              right: -2,
              background: YT.brandRed,
              color: '#fff',
              fontFamily: FONT.ui,
              fontSize: 11,
              fontWeight: 500,
              borderRadius: 8,
              padding: '0 4px',
              height: 16,
              lineHeight: '16px',
              border: `2px solid ${YT.base}`,
            }}
          >
            {notifications}
          </div>
        ) : null}
      </IconButton>
      <LetterAvatar size={32} letter={VIEWER.initial} color={VIEWER.color} style={{marginLeft: 12}} />
    </div>
  </div>
);

const GuideItem: React.FC<{icon?: IconName; label: string; active?: boolean; avatar?: React.ReactNode; live?: boolean}> = ({
  icon,
  label,
  active,
  avatar,
  live,
}) => (
  <div
    style={{
      height: 40,
      borderRadius: 10,
      background: active ? YT.tonal : 'transparent',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: 24,
      fontFamily: FONT.ui,
      fontSize: 14,
      fontWeight: active ? 500 : 400,
      color: YT.text,
    }}
  >
    {avatar ?? (icon ? <Icon name={icon} size={24} color={YT.text} /> : null)}
    <span style={{flex: 1}}>{label}</span>
    {live ? <div style={{width: 4, height: 4, borderRadius: 2, background: YT.cta}} /> : null}
  </div>
);

const Divider = () => <div style={{height: 1, background: YT.divider, margin: '12px 0'}} />;

export const Guide: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: MASTHEAD_H,
      width: GUIDE_W,
      bottom: 0,
      background: YT.base,
      padding: '12px 12px',
      boxSizing: 'border-box',
      zIndex: 4,
    }}
  >
    <GuideItem icon="home" label="Home" />
    <GuideItem icon="shorts" label="Shorts" />
    <GuideItem icon="subs" label="Subscriptions" />
    <Divider />
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        fontFamily: FONT.ui,
        fontSize: 16,
        fontWeight: 500,
        color: YT.text,
      }}
    >
      You <Icon name="chevronRight" size={16} color={YT.text} />
    </div>
    <GuideItem icon="history" label="History" />
    <GuideItem icon="playlist" label="Playlists" />
    <GuideItem icon="clock" label="Watch later" />
    <GuideItem icon="like" label="Liked videos" />
    <Divider />
    <div style={{padding: '6px 12px', fontFamily: FONT.ui, fontSize: 16, fontWeight: 500, color: YT.text}}>
      Subscriptions
    </div>
    {SUBSCRIPTIONS.map((s, i) => (
      <GuideItem
        key={s.name}
        label={s.name}
        active={i === 0}
        live={s.live}
        avatar={
          i === 0 ? (
            <ChannelAvatar size={24} />
          ) : (
            <LetterAvatar size={24} letter={s.name[0]} color={s.color} />
          )
        }
      />
    ))}
  </div>
);

export const BROWSER_BAR_H = 46;

/** Dark desktop browser frame around the YouTube viewport. */
export const BrowserFrame: React.FC<{url: string; title: string; children: React.ReactNode; glow?: number}> = ({
  url,
  title,
  children,
  glow = 0,
}) => (
  <div
    style={{
      width: VIEWPORT.w,
      height: VIEWPORT.h + BROWSER_BAR_H,
      borderRadius: 16,
      overflow: 'hidden',
      background: '#1b1b1f',
      position: 'relative',
      boxShadow: `0 60px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.09), 0 0 ${80 * glow}px ${alpha(BRAND.blue, 0.35 * glow)}`,
    }}
  >
    <div
      style={{
        height: BROWSER_BAR_H,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 8,
        background: '#1b1b1f',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxSizing: 'border-box',
      }}
    >
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
        <div key={c} style={{width: 12, height: 12, borderRadius: 6, background: c}} />
      ))}
      <div
        style={{
          marginLeft: 16,
          height: 32,
          width: 240,
          borderRadius: '10px 10px 0 0',
          background: '#2a2a30',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
          marginTop: 14,
          fontFamily: FONT.ui,
          fontSize: 12.5,
          color: '#e8e8e8',
          boxSizing: 'border-box',
        }}
      >
        <YouTubeIcon height={11} />
        <span style={{flex: 1, overflow: 'hidden', whiteSpace: 'nowrap'}}>{title}</span>
        <Icon name="close" size={12} color="#aaa" />
      </div>
      <div
        style={{
          marginLeft: 24,
          flex: 1,
          maxWidth: 720,
          height: 30,
          borderRadius: 15,
          background: '#2a2a30',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 8,
          fontFamily: FONT.ui,
          fontSize: 13,
          color: '#d6d6d6',
        }}
      >
        <svg viewBox="0 0 24 24" width={13} height={13}>
          <path
            d="M17 9V7A5 5 0 0 0 7 7v2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zM9 7a3 3 0 0 1 6 0v2H9z"
            fill="#9aa0a6"
          />
        </svg>
        <span>
          <span style={{color: '#9aa0a6'}}>https://</span>
          {url}
        </span>
      </div>
    </div>
    <div style={{position: 'relative', width: VIEWPORT.w, height: VIEWPORT.h, overflow: 'hidden', background: YT.base}}>
      {children}
    </div>
  </div>
);
