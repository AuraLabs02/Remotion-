import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {pulse, formatBigNumber, drawPath, easeOutExpo} from '../utils';

export const Scene6Outro: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn = interpolate(f, [0, 28], [0, 1], {extrapolateRight: 'clamp'});
  const p = pulse(f, 0.06);

  // Phase 1: Montage flash (f=0-60)
  const montageIcons = ['API', '🔗', '📡', '🌤️', '⚡'];
  const montagePhase = Math.floor(f / 12);

  // Phase 2: "NOW YOU KNOW" (f=40-100)
  const titleClip = interpolate(f, [40, 72], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const titleScale = spring({frame: f - 42, fps, config: {damping: 18, stiffness: 60}});

  // Phase 3: Summary cards (f=80-200)
  const summaryItems = [
    {icon: '🔗', title: 'APIs are Contracts', desc: 'Defined rules for how software systems communicate', color: theme.accent.blue},
    {icon: '📡', title: 'Request & Response', desc: 'Client sends a request; server processes and replies', color: theme.accent.purple},
    {icon: '🌐', title: 'Multiple Protocols', desc: 'REST, GraphQL, WebSocket & gRPC for different needs', color: theme.accent.green},
    {icon: '⚡', title: 'Powers Everything', desc: 'Weather, payments, AI — all powered by APIs daily', color: theme.accent.orange},
  ];

  // Phase 4: CTA terminal (f=200-320)
  const ctaIn = spring({frame: f - 200, fps, config: {damping: 20, stiffness: 70}});
  const ctaCmd = '$ curl https://api.example.com/hello';
  const ctaRes = '{ "message": "Welcome to the world of APIs!" }';
  const ctaCmdChars = Math.max(0, Math.min(ctaCmd.length, Math.floor((f - 220) * 1.0)));
  const ctaResChars = Math.max(0, Math.min(ctaRes.length, Math.floor((f - 250) * 1.2)));

  // Phase 5: Counter (f=280-460)
  const counterIn = interpolate(f, [280, 310], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const callsCount = Math.floor(interpolate(f, [300, 420], [0, 4500000000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));

  // Brand footer
  const brandIn = interpolate(f, [340, 380], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const bgRotate = f * 0.06;
  const ringScale = 0.85 + 0.15 * Math.sin(f * 0.035);

  return (
    <g opacity={sceneIn}>
      <defs>
        <radialGradient id="s6-bg" cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#EEF4FF" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </radialGradient>
        <radialGradient id="s6-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={theme.accent.blue} stopOpacity={0.04 + 0.02 * p} />
          <stop offset="100%" stopColor={theme.accent.blue} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="s6-title-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${20 + f * 0.05}%`} stopColor={theme.accent.blue} />
          <stop offset={`${60 + f * 0.05}%`} stopColor={theme.accent.purple} />
        </linearGradient>
        <linearGradient id="s6-bar-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={theme.accent.blue} />
          <stop offset="50%" stopColor={theme.accent.purple} />
          <stop offset="100%" stopColor={theme.accent.green} />
        </linearGradient>
        <clipPath id="s6-title-clip">
          <rect x={960 - titleClip * 500} y={210} width={titleClip * 1000} height={200} />
        </clipPath>
        <pattern id="s6-dots" width="52" height="52" patternUnits="userSpaceOnUse">
          <circle cx="26" cy="26" r="1.4" fill={theme.accent.blue} opacity="0.06" />
        </pattern>
      </defs>

      <rect width={1920} height={1080} fill="url(#s6-bg)" />
      <rect width={1920} height={1080} fill="url(#s6-dots)" />
      <ellipse cx={960} cy={340} rx={960} ry={480} fill="url(#s6-glow)" />

      {/* Rotating rings */}
      <g transform={`translate(960,310) rotate(${bgRotate})`} opacity={0.04}>
        {[200, 320, 440, 560].map((r, i) => (
          <circle key={i} cx={0} cy={0} r={r * ringScale} fill="none"
            stroke={i % 2 === 0 ? theme.accent.blue : theme.accent.purple}
            strokeWidth={1.5} strokeDasharray={`${16 + i * 5} ${12 + i * 4}`} />
        ))}
      </g>

      {/* Phase 1: Quick montage flashes */}
      {f < 60 && montagePhase < 5 && (
        <g opacity={interpolate(f % 12, [0, 3, 9, 12], [0, 0.6, 0.6, 0])}>
          <text x={960} y={400} textAnchor="middle" dominantBaseline="middle"
            fontSize={montagePhase === 0 ? 120 : 80}
            fontFamily={theme.font.display} fontWeight="900"
            fill={[theme.accent.blue, theme.accent.purple, theme.accent.cyan, theme.accent.orange, theme.accent.green][montagePhase]}
            opacity={0.25}>
            {montageIcons[montagePhase]}
          </text>
        </g>
      )}

      {/* Phase 2: "NOW YOU KNOW" - clip reveal */}
      <g clipPath="url(#s6-title-clip)" opacity={titleScale}>
        <text x={960} y={275} textAnchor="middle" dominantBaseline="middle"
          fontSize={96} fontFamily={theme.font.display} fontWeight="900"
          fill={theme.text.primary} letterSpacing={-2}
          transform={`translate(960,275) scale(${0.85 + 0.15 * titleScale}) translate(-960,-275)`}>
          NOW YOU
        </text>
        <text x={960} y={385} textAnchor="middle" dominantBaseline="middle"
          fontSize={140} fontFamily={theme.font.display} fontWeight="900"
          fill="url(#s6-title-grad)" letterSpacing={-5}
          transform={`translate(960,385) scale(${0.85 + 0.15 * titleScale}) translate(-960,-385)`}>
          KNOW
        </text>
      </g>

      {/* Subtitle + underline */}
      {f > 55 && (
        <g opacity={interpolate(f, [55, 75], [0, 1], {extrapolateRight: 'clamp'})}>
          <text x={960} y={458} textAnchor="middle"
            fontSize={24} fontFamily={theme.font.body} fontWeight="500"
            fill={theme.text.secondary} letterSpacing={5}>
            HOW APIs WORK — VISUALLY EXPLAINED
          </text>
          <rect
            x={960 - interpolate(f, [60, 85], [0, 300], {extrapolateRight: 'clamp'})}
            y={478}
            width={interpolate(f, [60, 85], [0, 600], {extrapolateRight: 'clamp'})}
            height={3} rx={2} fill="url(#s6-bar-grad)" />
        </g>
      )}

      {/* Phase 3: Summary cards */}
      {summaryItems.map((item, i) => {
        const si = spring({frame: f - (85 + i * 22), fps, config: {damping: 18, stiffness: 80}});
        const cw = 1300, ch = 78;
        const cx = (1920 - cw) / 2;
        const cy = 498 + i * (ch + 14);

        // Animated checkmark draw
        const checkDraw = drawPath(f, 95 + i * 22, 15, easeOutExpo);

        return (
          <g key={i} opacity={si} transform={`translate(${(1 - si) * 60},${(1 - si) * 12})`}>
            <rect x={cx + 2} y={cy + 4} width={cw} height={ch} rx={14}
              fill={item.color} opacity={0.04} />
            <rect x={cx} y={cy} width={cw} height={ch} rx={14}
              fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5} />
            <rect x={cx} y={cy} width={5} height={ch} rx={3} fill={item.color} />
            <circle cx={cx + 52} cy={cy + ch / 2} r={26} fill={item.color} opacity={0.08} />
            <text x={cx + 52} y={cy + ch / 2} textAnchor="middle" dominantBaseline="middle"
              fontSize={28}>{item.icon}</text>
            <text x={cx + 95} y={cy + 26} fontSize={20}
              fontFamily={theme.font.body} fontWeight="700" fill={theme.text.primary}>{item.title}</text>
            <text x={cx + 95} y={cy + 54} fontSize={16}
              fontFamily={theme.font.body} fill={theme.text.muted}>{item.desc}</text>
            {/* Animated checkmark */}
            <circle cx={cx + cw - 38} cy={cy + ch / 2} r={18}
              fill={item.color} opacity={0.10} />
            <circle cx={cx + cw - 38} cy={cy + ch / 2} r={18}
              fill="none" stroke={item.color} strokeWidth={2}
              strokeDasharray={113} strokeDashoffset={113 * (1 - checkDraw)} />
            {checkDraw > 0.5 && (
              <path
                d={`M${cx + cw - 46},${cy + ch / 2} L${cx + cw - 40},${cy + ch / 2 + 6} L${cx + cw - 30},${cy + ch / 2 - 6}`}
                fill="none" stroke={item.color} strokeWidth={2.5} strokeLinecap="round"
                opacity={interpolate(checkDraw, [0.5, 1], [0, 1])} />
            )}
          </g>
        );
      })}

      {/* Phase 4: CTA Terminal */}
      <g opacity={ctaIn} transform={`translate(0,${(1 - ctaIn) * 20})`}>
        <rect x={310} y={820} width={1300} height={120} rx={16}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={2}
          style={{filter: 'drop-shadow(0 4px 24px rgba(29,111,232,0.10))'}} />
        <rect x={310} y={820} width={5} height={120} rx={3} fill="url(#s6-bar-grad)" />
        {/* Terminal header dots */}
        <rect x={310} y={820} width={1300} height={36} rx={16} fill={theme.bg.code} />
        <rect x={310} y={844} width={1300} height={12} fill={theme.bg.code} />
        <circle cx={338} cy={838} r={5} fill={theme.accent.red} opacity={0.6} />
        <circle cx={358} cy={838} r={5} fill={theme.accent.amber} opacity={0.6} />
        <circle cx={378} cy={838} r={5} fill={theme.accent.green} opacity={0.6} />

        {/* Command */}
        <text x={340} y={878} dominantBaseline="middle"
          fontSize={19} fontFamily={theme.font.mono} fontWeight="600" fill={theme.accent.blue}>
          {ctaCmd.slice(0, ctaCmdChars)}
        </text>
        {ctaCmdChars > 0 && ctaCmdChars < ctaCmd.length && Math.sin(f * 0.15) > 0 && (
          <rect x={340 + ctaCmdChars * 10.2} y={865} width={2} height={22} fill={theme.accent.blue} rx={1} />
        )}
        {/* Response */}
        <text x={340} y={916} dominantBaseline="middle"
          fontSize={18} fontFamily={theme.font.mono} fontWeight="500" fill={theme.accent.green}>
          {ctaRes.slice(0, ctaResChars)}
        </text>
      </g>

      {/* Phase 5: API Counter + Pulse */}
      <g opacity={counterIn}>
        {/* Counter card */}
        <rect x={310} y={956} width={620} height={64} rx={14}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
          style={{filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.05))'}} />
        <circle cx={345} cy={988} r={8} fill={theme.accent.green}
          opacity={0.6 + 0.4 * pulse(f, 0.15)} />
        <text x={368} y={988} dominantBaseline="middle"
          fontSize={16} fontFamily={theme.font.body} fontWeight="600" fill={theme.text.secondary}>
          API calls made today:
        </text>
        <text x={640} y={988} dominantBaseline="middle"
          fontSize={34} fontFamily={theme.font.display} fontWeight="900" fill={theme.accent.blue}>
          {formatBigNumber(callsCount)}
        </text>

        {/* Pulse bars */}
        <rect x={990} y={956} width={620} height={64} rx={14}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
          style={{filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.05))'}} />
        {Array.from({length: 22}).map((_, bi) => {
          const bh = 16 + Math.sin(f * 0.14 + bi * 0.55) * 22;
          return (
            <rect key={bi}
              x={1010 + bi * 24} y={988 - bh / 2}
              width={16} height={bh} rx={4}
              fill={theme.accent.blue}
              opacity={0.20 + 0.30 * ((bi % 3 === 0) ? 1 : 0.5)} />
          );
        })}
        <text x={1300} y={1015} textAnchor="middle"
          fontSize={12} fontFamily={theme.font.body} fill={theme.text.muted} letterSpacing={2}>
          LIVE PULSE
        </text>
      </g>

      {/* Brand footer */}
      <g opacity={brandIn}>
        <line x1={760} y1={1042} x2={1160} y2={1042}
          stroke={theme.border.light} strokeWidth={1} />
        <text x={960} y={1062} textAnchor="middle"
          fontSize={14} fontFamily={theme.font.body} fontWeight="500"
          fill={theme.text.muted} letterSpacing={3}>
          MOTION GRAPHICS · BUILT WITH REMOTION · 1920x1080 · 30FPS
        </text>
      </g>
    </g>
  );
};
