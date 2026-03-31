import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {typewriter, pulse, formatBigNumber} from '../utils';

export const Scene4RealWorld: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn = interpolate(f, [0, 22], [0, 1], {extrapolateRight: 'clamp'});
  const sceneOut = interpolate(f, [270, 298], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(sceneIn, sceneOut);
  const titleIn = spring({frame: f - 5, fps, config: {damping: 22, stiffness: 80}});

  const p = pulse(f, 0.06);

  // === API #1: Weather (f=25-100) ===
  const weather = {
    in: spring({frame: f - 25, fps, config: {damping: 16, stiffness: 90}}),
    out: interpolate(f, [95, 110], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    endpoint: 'GET /weather?q=London',
    response: '{ "temp": 18, "sky": "cloudy" }',
  };
  const weatherEndChars = typewriter(f, 45, weather.endpoint, 1.2);
  const weatherResChars = typewriter(f, 65, weather.response, 1.5);

  // === API #2: Payments (f=100-180) ===
  const payments = {
    in: spring({frame: f - 100, fps, config: {damping: 16, stiffness: 90}}),
    out: interpolate(f, [175, 190], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    endpoint: 'POST /v1/payment_intents',
    response: '{ "status": "succeeded", "amount": 2999 }',
  };
  const payEndChars = typewriter(f, 120, payments.endpoint, 1.2);
  const payResChars = typewriter(f, 140, payments.response, 1.5);
  const cardFlip = interpolate(f, [108, 128], [0, Math.PI * 2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const checkIn = spring({frame: f - 135, fps, config: {damping: 12, stiffness: 100}});

  // === API #3: Claude AI (f=180-255) ===
  const ai = {
    in: spring({frame: f - 180, fps, config: {damping: 16, stiffness: 90}}),
    out: interpolate(f, [250, 265], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    endpoint: 'POST /v1/messages',
    response: '{ "content": [{"text": "Hello!"}] }',
  };
  const aiEndChars = typewriter(f, 200, ai.endpoint, 1.2);
  const aiResChars = typewriter(f, 218, ai.response, 1.5);
  const chatBubble1 = spring({frame: f - 192, fps, config: {damping: 18, stiffness: 90}});
  const chatBubble2 = spring({frame: f - 212, fps, config: {damping: 18, stiffness: 90}});

  // === Stats (f=240-280) ===
  const statsIn = spring({frame: f - 240, fps, config: {damping: 20, stiffness: 70}});
  const stats = [
    {val: 13000, label: 'Public APIs', suffix: '+', color: theme.accent.blue},
    {val: 83, label: 'Apps Use APIs', suffix: '%', color: theme.accent.purple},
    {val: 4500000000, label: 'Daily API Calls', suffix: '', color: theme.accent.green},
  ];

  // Card layout helper
  const cardY = 260, cardH = 350, cardW = 1400;
  const cardX = (1920 - cardW) / 2;

  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id="s4-bg" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#F8F9FF" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </radialGradient>
        <pattern id="s4-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke={theme.border.light} strokeWidth="0.8" />
        </pattern>
      </defs>

      <rect width={1920} height={1080} fill="url(#s4-bg)" />
      <rect width={1920} height={1080} fill="url(#s4-grid)" opacity={0.40} />

      {/* Title */}
      <g opacity={titleIn} transform={`translate(0,${(1 - titleIn) * -20})`}>
        <text x={960} y={68} textAnchor="middle" fontSize={16}
          fontFamily={theme.font.body} fontWeight="700" fill={theme.accent.orange} letterSpacing={6}>
          SCENE 03 — EXAMPLES
        </text>
        <text x={960} y={138} textAnchor="middle" fontSize={64}
          fontFamily={theme.font.display} fontWeight="800" fill={theme.text.primary}>
          APIs Power Everything
        </text>
        <text x={960} y={182} textAnchor="middle" fontSize={24}
          fontFamily={theme.font.body} fontWeight="400" fill={theme.text.secondary}>
          From weather to payments — every modern app runs on APIs
        </text>
        <rect x={880} y={198} width={160} height={3} rx={2} fill={theme.accent.orange} opacity={0.5} />
      </g>

      {/* ===== API #1: WEATHER ===== */}
      <g opacity={Math.min(weather.in, weather.out)} transform={`translate(${(1 - weather.in) * 80},0)`}>
        <rect x={cardX} y={cardY} width={cardW} height={cardH} rx={20}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
          style={{filter: 'drop-shadow(0 6px 24px rgba(29,111,232,0.10))'}} />
        <rect x={cardX} y={cardY} width={cardW} height={6} rx={3} fill={theme.accent.blue} />

        {/* Animated weather illustration - SCALED UP 2x */}
        <g transform="translate(400,400) scale(1.8)">
          {/* Sun */}
          <circle cx={0} cy={0} r={45} fill={theme.accent.amber} opacity={0.20} />
          <circle cx={0} cy={0} r={30} fill={theme.accent.amber} opacity={0.40} />
          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle + f * 0.5) * Math.PI / 180;
            return (
              <line key={i}
                x1={Math.cos(rad) * 38} y1={Math.sin(rad) * 38}
                x2={Math.cos(rad) * 55} y2={Math.sin(rad) * 55}
                stroke={theme.accent.amber} strokeWidth={3} strokeLinecap="round" opacity={0.45} />
            );
          })}
          {/* Cloud */}
          <g transform={`translate(${Math.sin(f * 0.03) * 12},0)`}>
            <ellipse cx={20} cy={-10} rx={55} ry={30} fill={theme.accent.blue} opacity={0.15} />
            <ellipse cx={-15} cy={0} rx={40} ry={25} fill={theme.accent.blue} opacity={0.18} />
            <ellipse cx={35} cy={5} rx={35} ry={22} fill={theme.accent.blue} opacity={0.15} />
          </g>
          {/* Rain drops */}
          {[0, 1, 2, 3, 4, 5].map(i => {
            const rx = -25 + i * 16;
            const ry = ((f * 1.5 + i * 15) % 60) + 25;
            return (
              <line key={i} x1={rx} y1={ry} x2={rx - 3} y2={ry + 14}
                stroke={theme.accent.blue} strokeWidth={2.5} strokeLinecap="round" opacity={0.40} />
            );
          })}
        </g>

        {/* API Details */}
        <text x={cardX + 520} y={cardY + 48} fontSize={36}
          fontFamily={theme.font.display} fontWeight="800" fill={theme.text.primary}>🌤️ Weather API</text>
        <text x={cardX + 520} y={cardY + 82} fontSize={20}
          fontFamily={theme.font.body} fill={theme.text.muted}>OpenWeatherMap · REST API</text>
        <rect x={cardX + 520} y={cardY + 100} width={800} height={40} rx={10} fill={theme.bg.code} />
        <text x={cardX + 536} y={cardY + 122} dominantBaseline="middle"
          fontSize={18} fontFamily={theme.font.mono} fontWeight="500" fill={theme.accent.blue}>
          {weather.endpoint.slice(0, weatherEndChars)}
        </text>
        <text x={cardX + 520} y={cardY + 170} fontSize={18}
          fontFamily={theme.font.mono} fill={theme.accent.green}>
          ← {weather.response.slice(0, weatherResChars)}
        </text>
        <text x={cardX + 520} y={cardY + 210} fontSize={18}
          fontFamily={theme.font.body} fill={theme.text.muted} fontStyle="italic">
          Weather apps · Travel sites · IoT devices
        </text>
      </g>

      {/* ===== API #2: PAYMENTS ===== */}
      <g opacity={Math.min(payments.in, payments.out)} transform={`translate(${(1 - payments.in) * -80},0)`}>
        <rect x={cardX} y={cardY} width={cardW} height={cardH} rx={20}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
          style={{filter: 'drop-shadow(0 6px 24px rgba(124,58,237,0.10))'}} />
        <rect x={cardX} y={cardY} width={cardW} height={6} rx={3} fill={theme.accent.purple} />

        {/* Credit card animation - SCALED UP */}
        <g transform="translate(400,395) scale(1.6)">
          <g transform={`scaleX(${Math.cos(cardFlip)})`}>
            <rect x={-80} y={-52} width={160} height={104} rx={14}
              fill={theme.accent.purple} opacity={0.88} />
            <rect x={-62} y={-32} width={44} height={30} rx={5}
              fill={theme.accent.amber} opacity={0.85} />
            <rect x={-62} y={10} width={105} height={9} rx={4} fill="rgba(255,255,255,0.38)" />
            <rect x={-62} y={28} width={65} height={7} rx={3} fill="rgba(255,255,255,0.28)" />
          </g>
          {/* Success checkmark */}
          <g opacity={checkIn} transform={`translate(95,-32) scale(${checkIn})`}>
            <circle r={26} fill={theme.accent.green} />
            <path d="M-10,0 L-3,8 L10,-8" fill="none" stroke="#FFFFFF" strokeWidth={3.5} strokeLinecap="round" />
          </g>
        </g>

        {/* API Details */}
        <text x={cardX + 520} y={cardY + 48} fontSize={36}
          fontFamily={theme.font.display} fontWeight="800" fill={theme.text.primary}>💳 Payments API</text>
        <text x={cardX + 520} y={cardY + 82} fontSize={20}
          fontFamily={theme.font.body} fill={theme.text.muted}>Stripe · REST API</text>
        <rect x={cardX + 520} y={cardY + 100} width={800} height={40} rx={10} fill={theme.bg.code} />
        <text x={cardX + 536} y={cardY + 122} dominantBaseline="middle"
          fontSize={18} fontFamily={theme.font.mono} fontWeight="500" fill={theme.accent.purple}>
          {payments.endpoint.slice(0, payEndChars)}
        </text>
        <text x={cardX + 520} y={cardY + 170} fontSize={18}
          fontFamily={theme.font.mono} fill={theme.accent.green}>
          ← {payments.response.slice(0, payResChars)}
        </text>
        <text x={cardX + 520} y={cardY + 210} fontSize={18}
          fontFamily={theme.font.body} fill={theme.text.muted} fontStyle="italic">
          E-commerce · SaaS billing · Marketplaces
        </text>
      </g>

      {/* ===== API #3: CLAUDE AI ===== */}
      <g opacity={Math.min(ai.in, ai.out)} transform={`translate(0,${(1 - ai.in) * 50})`}>
        <rect x={cardX} y={cardY} width={cardW} height={cardH} rx={20}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
          style={{filter: 'drop-shadow(0 6px 24px rgba(234,88,12,0.10))'}} />
        <rect x={cardX} y={cardY} width={cardW} height={6} rx={3} fill={theme.accent.orange} />

        {/* Chat bubble animation - SCALED UP */}
        <g transform="translate(400,380) scale(1.5)">
          {/* User bubble */}
          <g opacity={chatBubble1} transform={`translate(0,${(1 - chatBubble1) * 15})`}>
            <rect x={-90} y={-40} width={180} height={48} rx={20} fill={theme.accent.blue} opacity={0.14} />
            <text x={0} y={-16} textAnchor="middle" dominantBaseline="middle"
              fontSize={18} fontFamily={theme.font.body} fontWeight="600" fill={theme.accent.blue}>
              "Explain APIs"
            </text>
          </g>
          {/* AI bubble */}
          <g opacity={chatBubble2} transform={`translate(0,${(1 - chatBubble2) * 15})`}>
            <rect x={-100} y={18} width={200} height={54} rx={20} fill={theme.accent.orange} opacity={0.14} />
            {f < 220 ? (
              <g>
                {[0, 1, 2].map(i => (
                  <circle key={i} cx={-22 + i * 22} cy={45} r={5}
                    fill={theme.accent.orange} opacity={0.3 + 0.4 * pulse(f, 0.12, i * 1.5)} />
                ))}
              </g>
            ) : (
              <text x={0} y={45} textAnchor="middle" dominantBaseline="middle"
                fontSize={16} fontFamily={theme.font.body} fontWeight="600"
                fill={theme.accent.orange}>
                "An API is a contract..."
              </text>
            )}
          </g>
        </g>

        {/* API Details */}
        <text x={cardX + 520} y={cardY + 48} fontSize={36}
          fontFamily={theme.font.display} fontWeight="800" fill={theme.text.primary}>🤖 Claude AI API</text>
        <text x={cardX + 520} y={cardY + 82} fontSize={20}
          fontFamily={theme.font.body} fill={theme.text.muted}>Anthropic · REST API</text>
        <rect x={cardX + 520} y={cardY + 100} width={800} height={40} rx={10} fill={theme.bg.code} />
        <text x={cardX + 536} y={cardY + 122} dominantBaseline="middle"
          fontSize={18} fontFamily={theme.font.mono} fontWeight="500" fill={theme.accent.orange}>
          {ai.endpoint.slice(0, aiEndChars)}
        </text>
        <text x={cardX + 520} y={cardY + 170} fontSize={18}
          fontFamily={theme.font.mono} fill={theme.accent.green}>
          ← {ai.response.slice(0, aiResChars)}
        </text>
        <text x={cardX + 520} y={cardY + 210} fontSize={18}
          fontFamily={theme.font.body} fill={theme.text.muted} fontStyle="italic">
          Chatbots · Code assist · Content generation
        </text>
      </g>

      {/* ===== STATS ROW ===== */}
      <g opacity={statsIn} transform={`translate(0,${(1 - statsIn) * 24})`}>
        {stats.map((stat, i) => {
          const sw = 520, sh = 100;
          const sx = 120 + i * (sw + 40);
          const countVal = interpolate(f, [245, 275], [0, stat.val], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <g key={i}>
              <rect x={sx} y={648} width={sw} height={sh} rx={16}
                fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
                style={{filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.06))'}} />
              <rect x={sx} y={648} width={6} height={sh} rx={3} fill={stat.color} />
              <text x={sx + 28} y={690} fontSize={40}
                fontFamily={theme.font.display} fontWeight="900" fill={stat.color}>
                {formatBigNumber(Math.floor(countVal))}{stat.suffix}
              </text>
              <text x={sx + 28} y={726} fontSize={18}
                fontFamily={theme.font.body} fill={theme.text.muted}>{stat.label}</text>
            </g>
          );
        })}
      </g>
    </g>
  );
};
