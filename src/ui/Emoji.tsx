import React from 'react';
import {BRAND} from '../config/channel';

// Custom channel emoji (members-only). Simple, bold shapes that read at 20px.

export type EmojiName = 'cloudHappy' | 'rocket' | 'codeHeart' | 'lgtm' | 'fire';

export const CustomEmoji: React.FC<{name: EmojiName; size?: number; style?: React.CSSProperties}> = ({
  name,
  size = 24,
  style,
}) => {
  const common = {width: size, height: size, style: {display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style}};
  switch (name) {
    case 'cloudHappy':
      return (
        <svg viewBox="0 0 32 32" {...common}>
          <g fill={BRAND.sky}>
            <circle cx="10" cy="19" r="6" />
            <circle cx="16" cy="13.5" r="8" />
            <circle cx="23" cy="18.5" r="6.5" />
            <rect x="10" y="17" width="13" height="8" />
          </g>
          <circle cx="13" cy="17" r="1.6" fill="#0b1130" />
          <circle cx="20" cy="17" r="1.6" fill="#0b1130" />
          <path d="M12.5 20.5c2 2.4 6 2.4 8 0" stroke="#0b1130" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="10.5" cy="20.5" r="1.4" fill="#ff8fb1" opacity="0.8" />
          <circle cx="22.5" cy="20.5" r="1.4" fill="#ff8fb1" opacity="0.8" />
        </svg>
      );
    case 'rocket':
      return (
        <svg viewBox="0 0 32 32" {...common}>
          <path d="M16 3c5 4 7 10 5.5 17h-11C9 13 11 7 16 3z" fill="#eef2ff" />
          <circle cx="16" cy="11.5" r="3" fill={BRAND.blue} />
          <path d="M10.5 16 6 21.5l5-.6zM21.5 16l4.5 5.5-5-.6z" fill={BRAND.violet} />
          <path d="M13 20.5c.6 4.5 2.4 6.8 3 8.5.6-1.7 2.4-4 3-8.5z" fill="#ffb020" />
        </svg>
      );
    case 'codeHeart':
      return (
        <svg viewBox="0 0 32 32" {...common}>
          <path
            d="M16 28 5.5 17.8C2.6 14.9 2.8 10 6 7.6c2.9-2.2 6.8-1.5 9 1.2L16 10l1-1.2c2.2-2.7 6.1-3.4 9-1.2 3.2 2.4 3.4 7.3.5 10.2z"
            fill={BRAND.pink}
          />
          <g stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="12.5,13 10,15.5 12.5,18" />
            <polyline points="19.5,13 22,15.5 19.5,18" />
            <line x1="17" y1="12" x2="15" y2="19" />
          </g>
        </svg>
      );
    case 'lgtm':
      return (
        <svg viewBox="0 0 32 32" {...common}>
          <rect x="2" y="7" width="28" height="18" rx="5" fill="#22c55e" />
          <text
            x="16"
            y="20"
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight="900"
            fontSize="10"
            fill="#052e16"
            letterSpacing="-0.3"
          >
            LGTM
          </text>
        </svg>
      );
    case 'fire':
      return (
        <svg viewBox="0 0 32 32" {...common}>
          <path d="M16 3c1 6 8 8 8 16a8 8 0 0 1-16 0c0-4 2-6 3.5-7.5C12 15 13 16 14 16c-1-5 0-9 2-13z" fill="#ff6a1a" />
          <path d="M16 15c.5 3 4 4 4 8a4 4 0 0 1-8 0c0-2.5 2-4 4-8z" fill="#ffd23f" />
        </svg>
      );
  }
};
