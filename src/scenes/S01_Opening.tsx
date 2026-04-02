import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import {
  springIn, fadeIn, float, pulse, scaleIn,
  SPRING_BOUNCY, SPRING_SMOOTH, SPRING_ELASTIC,
  easeOutExpo, easeOutBack, sceneOpacity,
} from '../design/animations';
import { ParticleBackground } from '../components/ParticleBackground';

const SCENE_START = 0;
const SCENE_END = 450;

export const S01_Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - SCENE_START;
  const opacity = sceneOpacity(frame, SCENE_START, SCENE_END);
  if (opacity <= 0) return null;

  // Title animation phases
  const titleIn = springIn(f, fps, 30, SPRING_BOUNCY);
  const subtitleIn = springIn(f, fps, 55, SPRING_SMOOTH);
  const badgeIn = springIn(f, fps, 15, SPRING_SMOOTH);
  const taglineIn = fadeIn(f, 80, 25);
  const codeSnippetsIn = fadeIn(f, 45, 30);

  // Floating code snippets around the title
  const codeSnippets = [
    { text: 'system: "You are..."', x: 180, y: 280, rot: -8 },
    { text: 'temperature: 0.7', x: 1520, y: 320, rot: 6 },
    { text: 'max_tokens: 4096', x: 220, y: 680, rot: 5 },
    { text: 'role: "assistant"', x: 1480, y: 720, rot: -5 },
    { text: '{"model": "claude"}', x: 300, y: 180, rot: -3 },
    { text: 'stream: true', x: 1600, y: 550, rot: 4 },
  ];

  // Orbiting rings
  const ringCount = 3;

  // Particle convergence effect (first 30 frames)
  const convergePhase = interpolate(f, [0, 30], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <g opacity={opacity}>
      {/* Particles */}
      <ParticleBackground
        count={40}
        color={theme.colors.primary.light}
        opacity={0.08}
        speed={0.3}
      />

      {/* Background gradient circles */}
      <circle
        cx={960}
        cy={540}
        r={400 + 100 * pulse(f, 0.02)}
        fill="none"
        stroke={theme.colors.primary.main}
        strokeWidth={1}
        opacity={0.06}
      />
      <circle
        cx={960}
        cy={540}
        r={550 + 80 * pulse(f, 0.015, 1)}
        fill="none"
        stroke={theme.colors.secondary.main}
        strokeWidth={1}
        opacity={0.04}
      />

      {/* Orbiting rings */}
      {Array.from({ length: ringCount }).map((_, i) => {
        const angle = (f * (0.008 + i * 0.003)) + (i * Math.PI * 2) / ringCount;
        const radiusX = 320 + i * 60;
        const radiusY = 180 + i * 40;
        const dashLen = 20 + i * 10;

        return (
          <ellipse
            key={i}
            cx={960}
            cy={500}
            rx={radiusX}
            ry={radiusY}
            fill="none"
            stroke={i === 0 ? theme.colors.primary.main : i === 1 ? theme.colors.secondary.main : theme.colors.accent.green}
            strokeWidth={1.5}
            strokeDasharray={`${dashLen} ${dashLen * 2}`}
            strokeDashoffset={f * (1 + i * 0.5)}
            opacity={0.15 + 0.05 * Math.sin(f * 0.04 + i)}
            transform={`rotate(${i * 20 + f * 0.1}, 960, 500)`}
          />
        );
      })}

      {/* Claude badge */}
      <g opacity={badgeIn} transform={`translate(960, ${340 + (1 - badgeIn) * -30})`}>
        <rect
          x={-100}
          y={-20}
          width={200}
          height={40}
          rx={theme.radius.full}
          fill={theme.colors.primary.bg}
          stroke={theme.colors.primary.main}
          strokeWidth={2}
        />
        <text
          textAnchor="middle"
          y={7}
          fontFamily={FONT_FAMILY.display}
          fontSize={18}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.primary.main}
          letterSpacing={3}
        >
          CLAUDE CODE
        </text>
      </g>

      {/* Main title - PROMPT */}
      <text
        x={960}
        y={470}
        textAnchor="middle"
        fontFamily={FONT_FAMILY.display}
        fontSize={theme.fontSize.hero}
        fontWeight={FONT_WEIGHT.black}
        fill={theme.colors.text.primary}
        opacity={titleIn}
        transform={`translate(0, ${(1 - titleIn) * 40})`}
        letterSpacing={-3}
      >
        PROMPT
      </text>

      {/* Main title - ENGINEERING */}
      <text
        x={960}
        y={570}
        textAnchor="middle"
        fontFamily={FONT_FAMILY.display}
        fontSize={theme.fontSize.hero}
        fontWeight={FONT_WEIGHT.black}
        fill={theme.colors.primary.main}
        opacity={titleIn}
        transform={`translate(0, ${(1 - titleIn) * 40})`}
        letterSpacing={-3}
      >
        ENGINEERING
      </text>

      {/* Underline accent */}
      <rect
        x={960 - 200 * easeOutExpo(fadeIn(f, 50, 20))}
        y={590}
        width={400 * easeOutExpo(fadeIn(f, 50, 20))}
        height={5}
        rx={2.5}
        fill={theme.colors.primary.main}
      />

      {/* Subtitle */}
      <text
        x={960}
        y={650}
        textAnchor="middle"
        fontFamily={FONT_FAMILY.body}
        fontSize={theme.fontSize.h3}
        fontWeight={FONT_WEIGHT.medium}
        fill={theme.colors.text.secondary}
        opacity={subtitleIn}
      >
        Master the Art of AI Communication
      </text>

      {/* Tagline */}
      <g opacity={taglineIn}>
        <rect
          x={960 - 220}
          y={695}
          width={440}
          height={48}
          rx={theme.radius.full}
          fill={theme.colors.bg.secondary}
          stroke={theme.colors.border.purple}
          strokeWidth={1.5}
        />
        <text
          x={960}
          y={725}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.body}
          fontSize={theme.fontSize.bodySmall}
          fontWeight={FONT_WEIGHT.semibold}
          fill={theme.colors.text.secondary}
        >
          Write better prompts. Get better results.
        </text>
      </g>

      {/* Floating code snippets */}
      {codeSnippets.map((snippet, i) => {
        const snippetIn = fadeIn(f, 45 + i * 8, 20);
        const floatY = float(f, 8, 0.025, i * 1.3);
        const floatX = float(f, 5, 0.018, i * 2.1 + 1);

        return (
          <g
            key={i}
            opacity={snippetIn * 0.6}
            transform={`translate(${snippet.x + floatX}, ${snippet.y + floatY}) rotate(${snippet.rot})`}
          >
            <rect
              x={-10}
              y={-18}
              width={snippet.text.length * 11 + 20}
              height={36}
              rx={8}
              fill={theme.colors.bg.code}
              opacity={0.85}
            />
            <text
              fontFamily={FONT_FAMILY.mono}
              fontSize={16}
              fontWeight={FONT_WEIGHT.medium}
              fill={theme.colors.text.codeString}
            >
              {snippet.text}
            </text>
          </g>
        );
      })}

      {/* Decorative corner dots */}
      {[
        { x: 80, y: 80 }, { x: 1840, y: 80 },
        { x: 80, y: 1000 }, { x: 1840, y: 1000 },
      ].map((pos, i) => (
        <g key={i} opacity={fadeIn(f, 20 + i * 5, 15)}>
          {[0, 1, 2].map((dot) => (
            <circle
              key={dot}
              cx={pos.x + dot * 16}
              cy={pos.y}
              r={3}
              fill={theme.colors.primary.main}
              opacity={0.3 + 0.2 * pulse(f, 0.05, i + dot)}
            />
          ))}
        </g>
      ))}

      {/* Animated gradient glow behind title */}
      <circle
        cx={960}
        cy={510}
        r={200 + 30 * pulse(f, 0.03)}
        fill={theme.colors.primary.main}
        opacity={0.03 + 0.02 * pulse(f, 0.04)}
      />
    </g>
  );
};
