import React from 'react';
import {Img} from 'remotion';
import {BRAND, CHANNEL} from '../config/channel';
import {alpha, mixHex} from '../config/palette';
import {FONT} from '../theme/tokens';
import {REAL} from './assets';

/** The YouTube play-button mark (official proportions, 28.57 × 20). */
export const YouTubeIcon: React.FC<{height?: number; style?: React.CSSProperties; triangle?: string}> = ({
  height = 20,
  style,
  triangle = '#fff',
}) => (
  <svg viewBox="0 0 28.57 20" height={height} width={(height * 28.57) / 20} style={{display: 'block', ...style}}>
    <path
      d="M27.973 3.123A3.578 3.578 0 0 0 25.447.597C23.22 0 14.285 0 14.285 0S5.35 0 3.123.597A3.578 3.578 0 0 0 .597 3.123C0 5.35 0 10 0 10s0 4.65.597 6.877a3.578 3.578 0 0 0 2.526 2.526C5.35 20 14.285 20 14.285 20s8.935 0 11.162-.597a3.578 3.578 0 0 0 2.526-2.526C28.57 14.65 28.57 10 28.57 10s-.002-4.65-.597-6.877z"
      fill="#FF0000"
    />
    <path d="M11.425 14.285 18.848 10l-7.423-4.285v8.57z" fill={triangle} />
  </svg>
);

/** Masthead logo: play mark + wordmark. */
export const YouTubeLogo: React.FC<{height?: number; country?: string}> = ({height = 20, country}) => (
  <div style={{display: 'flex', alignItems: 'center', height, position: 'relative'}}>
    <YouTubeIcon height={height} />
    <span
      style={{
        fontFamily: FONT.display,
        fontWeight: 800,
        fontSize: height * 1.08,
        letterSpacing: -height * 0.07,
        color: '#fff',
        marginLeft: height * 0.1,
        lineHeight: 1,
        transform: `scaleX(0.92)`,
        transformOrigin: 'left center',
      }}
    >
      YouTube
    </span>
    {country ? (
      <span
        style={{
          position: 'absolute',
          right: -height * 0.9,
          top: -height * 0.35,
          fontFamily: FONT.ui,
          fontSize: height * 0.5,
          color: '#aaa',
        }}
      >
        {country}
      </span>
    ) : null}
  </div>
);

/** Stand-in Cloud Codes mark: gradient cloud with a </> glyph. */
export const CloudCodesMark: React.FC<{size: number; glyph?: string; id?: string; glow?: boolean}> = ({
  size,
  glyph = BRAND.night,
  id = 'ccm',
  glow = false,
}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{display: 'block', overflow: 'visible'}}>
    <defs>
      <linearGradient id={`${id}-g`} x1="18" y1="28" x2="84" y2="74" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={BRAND.cyan} />
        <stop offset="0.5" stopColor={BRAND.blue} />
        <stop offset="1" stopColor={BRAND.violet} />
      </linearGradient>
      {glow ? (
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      ) : null}
    </defs>
    <g fill={`url(#${id}-g)`} filter={glow ? `url(#${id}-glow)` : undefined}>
      <circle cx="32" cy="58" r="14" />
      <circle cx="50" cy="46" r="18" />
      <circle cx="69" cy="57" r="15" />
      <rect x="32" y="50" width="37" height="22" />
    </g>
    <g stroke={glyph} strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <polyline points="41,52 35,58.5 41,65" />
      <line x1="53.5" y1="49.5" x2="47.5" y2="67.5" />
      <polyline points="60,52 66,58.5 60,65" />
    </g>
  </svg>
);

/** The channel mark: real logo (circle-cropped) when provided, else the stand-in. */
export const BrandMark: React.FC<{size: number; id?: string; glyph?: string; glow?: boolean}> = (props) =>
  REAL.avatar ? (
    <Img
      src={REAL.avatar}
      style={{width: props.size, height: props.size, borderRadius: '50%', objectFit: 'cover', display: 'block'}}
    />
  ) : (
    <CloudCodesMark {...props} />
  );

/** Circular channel avatar (real logo if provided in public/brand). */
export const ChannelAvatar: React.FC<{size: number; ring?: number; ringColor?: string; style?: React.CSSProperties}> = ({
  size,
  ring = 0,
  ringColor = BRAND.cyan,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      flexShrink: 0,
      position: 'relative',
      boxShadow: ring ? `0 0 0 ${ring}px ${ringColor}` : undefined,
      background: `radial-gradient(circle at 35% 30%, ${mixHex(BRAND.blue, '#05060d', 0.72)} 0%, ${BRAND.night} 55%, ${BRAND.deep} 100%)`,
      ...style,
    }}
  >
    {REAL.avatar ? (
      <Img src={REAL.avatar} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    ) : (
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <CloudCodesMark size={size * 0.9} id={`av${Math.round(size)}`} />
      </div>
    )}
  </div>
);

/** Viewer avatar — YouTube's default initial-on-colour avatar. */
export const LetterAvatar: React.FC<{size: number; letter: string; color: string; style?: React.CSSProperties}> = ({
  size,
  letter,
  color,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT.ui,
      fontWeight: 500,
      fontSize: size * 0.5,
      flexShrink: 0,
      ...style,
    }}
  >
    {letter}
  </div>
);

const BADGE_GRADIENTS: [string, string][] = [
  [BRAND.cyan, BRAND.blue],
  [BRAND.blue, BRAND.violet],
  [BRAND.violet, BRAND.pink],
  ['#fbbf24', '#f97316'],
];

export const BADGE_LABELS = ['New member', '1 month', '6 months', '1 year'];

/** Custom loyalty badge (stand-in): gradient shield holding the cloud mark. */
export const MemberBadge: React.FC<{size: number; level?: number; id?: string; shine?: number}> = ({
  size,
  level = 1,
  id = 'mb',
  shine,
}) => {
  const [a, c] = BADGE_GRADIENTS[Math.max(0, Math.min(3, level))];
  const gid = `${id}-${level}-${Math.round(size)}`;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{display: 'block', overflow: 'visible'}}>
      <defs>
        <linearGradient id={`${gid}-f`} x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
        <linearGradient id={`${gid}-s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${gid}-c`}>
          <path d="M32 3 8 12v17c0 15.2 10.2 28.6 24 32 13.8-3.4 24-16.8 24-32V12L32 3z" />
        </clipPath>
      </defs>
      <path d="M32 3 8 12v17c0 15.2 10.2 28.6 24 32 13.8-3.4 24-16.8 24-32V12L32 3z" fill={`url(#${gid}-f)`} />
      <path
        d="M32 7.5 12 15v14c0 12.9 8.4 24.3 20 27.4 11.6-3.1 20-14.5 20-27.4V15L32 7.5z"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.6"
      />
      <g fill="#fff">
        <circle cx="23.5" cy="36" r="6.5" />
        <circle cx="32" cy="30.5" r="8.5" />
        <circle cx="41" cy="35.5" r="7" />
        <rect x="23.5" y="34" width="17.5" height="8.5" />
      </g>
      <g stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <polyline points="28,33.5 25.5,36.3 28,39" />
        <line x1="33.6" y1="32.4" x2="31" y2="40.2" />
        <polyline points="36.6,33.5 39.1,36.3 36.6,39" />
      </g>
      {shine !== undefined ? (
        <g clipPath={`url(#${gid}-c)`}>
          <rect
            x={-40 + shine * 120}
            y="-10"
            width="26"
            height="90"
            fill={`url(#${gid}-s)`}
            transform={`skewX(-20)`}
          />
        </g>
      ) : null}
    </svg>
  );
};

/** Channel banner stand-in (used when public/brand/banner.* is absent). */
export const ChannelBanner: React.FC<{w: number; h: number; radius?: number; minimal?: boolean}> = ({
  w,
  h,
  radius = 16,
  minimal = false,
}) => {
  if (REAL.banner) {
    return (
      <div style={{width: w, height: h, borderRadius: radius, overflow: 'hidden'}}>
        <Img src={REAL.banner} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
    );
  }
  const lines = [
    'const agent = await deploy({ model: "qwen3.8-27b", ctx: "1M" });',
    'kubectl apply -f cloud-codes/homelab.yaml',
    'terraform plan -out=infra.tfplan && terraform apply infra.tfplan',
    'docker compose up -d llm-gateway vector-db',
    'for await (const token of stream) process.stdout.write(token);',
  ];
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        overflow: 'hidden',
        position: 'relative',
        background: `radial-gradient(ellipse 60% 120% at 78% 50%, ${alpha(BRAND.blue, 0.55)} 0%, ${alpha(BRAND.blue, 0)} 60%), radial-gradient(ellipse 40% 90% at 95% 10%, ${alpha(BRAND.violet, 0.55)} 0%, ${alpha(BRAND.violet, 0)} 70%), linear-gradient(100deg, ${BRAND.deep} 0%, ${mixHex(BRAND.blue, '#05060d', 0.78)} 55%, ${mixHex(BRAND.violet, '#05060d', 0.78)} 100%)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: `${h * 0.08}px ${w * 0.3}px`,
          fontFamily: FONT.mono,
          fontSize: h * 0.085,
          lineHeight: 1.75,
          color: alpha(BRAND.light, 0.075),
          whiteSpace: 'nowrap',
        }}
      >
        {lines.map((l, i) => (
          <div key={i} style={{marginLeft: (i % 2) * h * 0.4}}>
            {l}
          </div>
        ))}
      </div>
      {minimal ? null : (
      <>
      <div
        style={{
          position: 'absolute',
          left: w * 0.06,
          top: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          gap: h * 0.12,
        }}
      >
        <BrandMark size={h * 0.62} id="banner" glow />
        <div>
          <div
            style={{
              fontFamily: FONT.display,
              fontWeight: 900,
              fontSize: h * 0.3,
              letterSpacing: -h * 0.01,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            {CHANNEL.name.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: FONT.mono,
              fontWeight: 500,
              fontSize: h * 0.085,
              color: BRAND.cyan,
              marginTop: h * 0.06,
              letterSpacing: h * 0.01,
            }}
          >
            {CHANNEL.tagline}
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: w * 0.05,
          top: h * 0.3,
          fontFamily: FONT.display,
          fontWeight: 700,
          fontSize: h * 0.1,
          color: 'rgba(255,255,255,0.85)',
          textAlign: 'right',
          lineHeight: 1.3,
        }}
      >
        NEW VIDEOS
        <br />
        <span style={{color: BRAND.cyan}}>EVERY WEEK</span>
      </div>
      </>
      )}
    </div>
  );
};
