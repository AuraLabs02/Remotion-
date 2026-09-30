import React from 'react';
import {Img} from 'remotion';
import type {ThumbArt, ThumbIcon} from '../config/channel';
import {FONT} from '../theme/tokens';
import {CloudCodesMark} from './Brand';

// Stand-in thumbnails in a bold tech-channel style. Designed on a 320×180
// artboard and scaled, so they stay consistent at every size.

const Art: React.FC<{icon: ThumbIcon; accent: string}> = ({icon, accent}) => {
  const s = {stroke: accent, strokeWidth: 5, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
  switch (icon) {
    case 'gauge':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <path d="M14 70a38 38 0 1 1 72 0" {...s} strokeWidth={8} stroke="rgba(255,255,255,0.18)" />
          <path d="M14 70a38 38 0 0 1 58-45" {...s} strokeWidth={8} />
          <line x1="50" y1="62" x2="76" y2="30" {...s} stroke="#fff" strokeWidth={6} />
          <circle cx="50" cy="62" r="7" fill="#fff" />
        </svg>
      );
    case 'layers':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M50 ${22 + i * 16} 88 ${38 + i * 16} 50 ${54 + i * 16} 12 ${38 + i * 16}z`}
              fill={i === 0 ? accent : 'rgba(255,255,255,0.08)'}
              stroke={i === 0 ? '#fff' : accent}
              strokeWidth={3}
              strokeLinejoin="round"
            />
          ))}
        </svg>
      );
    case 'gpu':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <rect x="8" y="26" width="84" height="46" rx="6" fill="#1a1d24" stroke={accent} strokeWidth={3} />
          {[32, 68].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="49" r="16" fill="#0c0e12" stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <path
                  key={a}
                  d={`M${cx} 49 L${cx + 13 * Math.cos((a * Math.PI) / 180)} ${49 + 13 * Math.sin((a * Math.PI) / 180)}`}
                  stroke={accent}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              ))}
              <circle cx={cx} cy="49" r="4" fill="#fff" />
            </g>
          ))}
          <rect x="18" y="72" width="40" height="6" fill={accent} />
        </svg>
      );
    case 'bolt':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <path d="M58 6 22 56h24l-6 38 38-54H54z" fill={accent} stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
        </svg>
      );
    case 'rocket':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <path d="M50 8c16 12 22 30 18 52H32C28 38 34 20 50 8z" fill="#f4f6fb" stroke={accent} strokeWidth={3} />
          <circle cx="50" cy="34" r="8" fill={accent} stroke="#1a1d24" strokeWidth={3} />
          <path d="M32 50 18 66l16-2zM68 50l14 16-16-2z" fill={accent} />
          <path d="M40 62c2 14 8 22 10 28 2-6 8-14 10-28z" fill="#ffb020" />
        </svg>
      );
    case 'cloud':
      return (
        <div style={{width: '100%', height: '100%'}}>
          <CloudCodesMark size={100} id="thumbcloud" />
        </div>
      );
    case 'container':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {[0, 1, 2].map((r) =>
            [0, 1, 2].slice(0, 3 - r).map((c) => (
              <rect
                key={`${r}-${c}`}
                x={18 + c * 22 + r * 11}
                y={66 - r * 18}
                width="20"
                height="16"
                rx="2"
                fill={r === 2 ? '#fff' : accent}
                opacity={r === 1 ? 0.8 : 1}
              />
            )),
          )}
          <path d="M8 86c20 8 64 8 84 0" {...s} strokeWidth={4} />
        </svg>
      );
    case 'terminal':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <rect x="8" y="16" width="84" height="66" rx="8" fill="#10131a" stroke={accent} strokeWidth={3} />
          <path d="M8 30h84" stroke={accent} strokeWidth={3} />
          <path d="M22 46l12 10-12 10" {...s} stroke="#fff" />
          <path d="M42 66h22" {...s} />
        </svg>
      );
    case 'code':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <path d="M34 26 12 50l22 24M66 26l22 24-22 24" {...s} strokeWidth={8} />
          <path d="M58 18 42 82" {...s} stroke="#fff" strokeWidth={8} />
        </svg>
      );
    case 'mic':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <rect x="36" y="10" width="28" height="50" rx="14" fill={accent} stroke="#fff" strokeWidth={3} />
          <path d="M24 46c0 16 12 26 26 26s26-10 26-26" {...s} />
          <path d="M50 72v16M36 90h28" {...s} />
        </svg>
      );
  }
};

export const ThumbnailArt: React.FC<{art: ThumbArt; width: number; src?: string | null}> = ({art, width, src}) => {
  const k = width / 320;
  if (src) {
    return (
      <div style={{width, height: width * (9 / 16), overflow: 'hidden'}}>
        <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
    );
  }
  const long = art.big.length > 3;
  return (
    <div style={{width, height: width * (9 / 16), overflow: 'hidden', position: 'relative'}}>
      <div
        style={{
          width: 320,
          height: 180,
          transform: `scale(${k})`,
          transformOrigin: '0 0',
          position: 'absolute',
          left: 0,
          top: 0,
          background: `radial-gradient(circle at 74% 46%, ${art.accent}55 0%, ${art.accent}00 46%), linear-gradient(120deg, ${art.base} 0%, #06070b 100%)`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 14,
            top: 26,
            width: 128,
            height: 128,
            filter: `drop-shadow(0 0 14px ${art.accent}88)`,
          }}
        >
          <Art icon={art.icon} accent={art.accent} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 14,
            padding: '3px 8px',
            borderRadius: 4,
            background: art.accent,
            color: '#0b0b0b',
            fontFamily: FONT.display,
            fontWeight: 900,
            fontSize: 13,
            letterSpacing: 0.5,
          }}
        >
          {art.tag}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 12,
            bottom: 16,
            fontFamily: FONT.display,
            fontWeight: 900,
            fontStyle: 'italic',
            lineHeight: 0.9,
            color: '#fff',
            textShadow: `0 3px 0 rgba(0,0,0,0.6), 0 0 18px ${art.accent}66`,
          }}
        >
          <div
            style={{
              fontSize: long ? 58 : 84,
              color: art.accent,
              WebkitTextStroke: '2px #fff',
              letterSpacing: -2,
            }}
          >
            {art.big}
          </div>
          <div style={{fontSize: 22, marginTop: 6, letterSpacing: 0.2}}>{art.small}</div>
        </div>
      </div>
    </div>
  );
};
