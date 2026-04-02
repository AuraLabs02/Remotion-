import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import {
  springIn, fadeIn, float, pulse,
  SPRING_BOUNCY, SPRING_SMOOTH, SPRING_SNAPPY, easeOutExpo, sceneOpacity,
} from '../design/animations';
import { SectionTitle } from '../components/SectionTitle';

const SCENE_START = 4170;
const SCENE_END = 4650;

export const S10_CommonMistakes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - SCENE_START;
  const opacity = sceneOpacity(frame, SCENE_START, SCENE_END);
  if (opacity <= 0) return null;

  const mistakes = [
    {
      bad: 'Too Vague',
      badDesc: '"Help me with my code"',
      good: 'Be Specific',
      goodDesc: '"Fix the TypeError in auth.ts line 42"',
      icon: '🎯',
      delay: 25,
    },
    {
      bad: 'No Context',
      badDesc: '"Add a function"',
      good: 'Set the Scene',
      goodDesc: '"In the React auth module, add email validation"',
      icon: '📋',
      delay: 100,
    },
    {
      bad: 'Mega Prompt',
      badDesc: '"Do everything at once in one prompt"',
      good: 'Break It Down',
      goodDesc: '"Step 1: Plan. Step 2: Implement. Step 3: Test"',
      icon: '🧩',
      delay: 175,
    },
    {
      bad: 'No Format',
      badDesc: '"Give me the answer"',
      good: 'Specify Output',
      goodDesc: '"Return as JSON with keys: result, confidence"',
      icon: '📐',
      delay: 250,
    },
    {
      bad: 'One-Shot',
      badDesc: '"Give me the perfect answer first try"',
      good: 'Iterate',
      goodDesc: '"Good start. Now refine the error handling"',
      icon: '🔄',
      delay: 325,
    },
  ];

  return (
    <g opacity={opacity}>
      {/* Title */}
      <SectionTitle
        number="09"
        title="Common Mistakes"
        subtitle="What to avoid and how to fix it"
        startFrame={f >= 0 ? 0 : -1}
        y={90}
        color={theme.colors.accent.red}
      />

      {/* DO vs DON'T header */}
      <g opacity={fadeIn(f, 15, 15)}>
        <rect
          x={130}
          y={185}
          width={780}
          height={40}
          rx={theme.radius.sm}
          fill={theme.colors.accent.redBg}
        />
        <text
          x={520}
          y={212}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={18}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.accent.red}
          letterSpacing={3}
        >
          ✕ DON&apos;T DO THIS
        </text>

        <rect
          x={1010}
          y={185}
          width={780}
          height={40}
          rx={theme.radius.sm}
          fill={theme.colors.accent.greenBg}
        />
        <text
          x={1400}
          y={212}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={18}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.accent.green}
          letterSpacing={3}
        >
          ✓ DO THIS INSTEAD
        </text>
      </g>

      {/* Mistake rows */}
      {mistakes.map((mistake, i) => {
        const mf = f - mistake.delay;
        if (mf < -10) return null;

        const rowIn = springIn(Math.max(0, mf), fps, 0, SPRING_SNAPPY);
        const flipProgress = interpolate(mf, [30, 50], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        const rowY = 245 + i * 118;
        const floatY = float(f, 2, 0.02, i);

        // Shake effect for bad card entrance
        const shakeX = mf >= 0 && mf < 15
          ? Math.sin(mf * 1.5) * 6 * (1 - mf / 15)
          : 0;

        return (
          <g key={i} opacity={rowIn}>
            {/* Row number */}
            <circle
              cx={100}
              cy={rowY + 45 + floatY}
              r={20}
              fill={theme.colors.bg.secondary}
              stroke={theme.colors.border.medium}
              strokeWidth={1.5}
            />
            <text
              x={100}
              y={rowY + 52 + floatY}
              textAnchor="middle"
              fontFamily={FONT_FAMILY.display}
              fontSize={18}
              fontWeight={FONT_WEIGHT.bold}
              fill={theme.colors.text.secondary}
            >
              {i + 1}
            </text>

            {/* Bad card - left */}
            <g transform={`translate(${shakeX}, 0)`}>
              <rect
                x={140}
                y={rowY + floatY}
                width={770}
                height={95}
                rx={theme.radius.lg}
                fill={theme.colors.bg.card}
                stroke={theme.colors.accent.red}
                strokeWidth={2}
                opacity={1 - flipProgress * 0.4}
              />

              {/* Red accent */}
              <rect
                x={140}
                y={rowY + floatY}
                width={6}
                height={95}
                rx={3}
                fill={theme.colors.accent.red}
              />

              {/* X icon */}
              <circle
                cx={180}
                cy={rowY + 35 + floatY}
                r={16}
                fill={theme.colors.accent.redBg}
              />
              <text
                x={180}
                y={rowY + 41 + floatY}
                textAnchor="middle"
                fontSize={16}
                fontWeight={FONT_WEIGHT.bold}
                fill={theme.colors.accent.red}
              >
                ✕
              </text>

              <text
                x={210}
                y={rowY + 40 + floatY}
                fontFamily={FONT_FAMILY.display}
                fontSize={theme.fontSize.bodySmall}
                fontWeight={FONT_WEIGHT.extrabold}
                fill={theme.colors.accent.red}
              >
                {mistake.bad}
              </text>

              <text
                x={168}
                y={rowY + 72 + floatY}
                fontFamily={FONT_FAMILY.mono}
                fontSize={20}
                fontWeight={FONT_WEIGHT.medium}
                fill={theme.colors.text.muted}
              >
                {mistake.badDesc}
              </text>
            </g>

            {/* Arrow */}
            <text
              x={960}
              y={rowY + 52 + floatY}
              textAnchor="middle"
              fontSize={28}
              fill={theme.colors.primary.main}
              opacity={flipProgress}
            >
              →
            </text>

            {/* Good card - right */}
            <g opacity={flipProgress}>
              <rect
                x={1020}
                y={rowY + floatY}
                width={770}
                height={95}
                rx={theme.radius.lg}
                fill={theme.colors.bg.card}
                stroke={theme.colors.accent.green}
                strokeWidth={2}
                filter={`drop-shadow(0 3px 12px ${theme.colors.accent.green}15)`}
              />

              {/* Green accent */}
              <rect
                x={1020}
                y={rowY + floatY}
                width={6}
                height={95}
                rx={3}
                fill={theme.colors.accent.green}
              />

              {/* Check icon */}
              <circle
                cx={1060}
                cy={rowY + 35 + floatY}
                r={16}
                fill={theme.colors.accent.greenBg}
              />
              <text
                x={1060}
                y={rowY + 41 + floatY}
                textAnchor="middle"
                fontSize={16}
                fontWeight={FONT_WEIGHT.bold}
                fill={theme.colors.accent.green}
              >
                ✓
              </text>

              {/* Emoji */}
              <text
                x={1088}
                y={rowY + 40 + floatY}
                fontSize={22}
              >
                {mistake.icon}
              </text>

              <text
                x={1118}
                y={rowY + 40 + floatY}
                fontFamily={FONT_FAMILY.display}
                fontSize={theme.fontSize.bodySmall}
                fontWeight={FONT_WEIGHT.extrabold}
                fill={theme.colors.accent.green}
              >
                {mistake.good}
              </text>

              <text
                x={1048}
                y={rowY + 72 + floatY}
                fontFamily={FONT_FAMILY.mono}
                fontSize={20}
                fontWeight={FONT_WEIGHT.medium}
                fill={theme.colors.text.secondary}
              >
                {mistake.goodDesc}
              </text>
            </g>
          </g>
        );
      })}

      {/* Bottom summary bar */}
      <g opacity={fadeIn(f, 380, 20)}>
        <rect
          x={200}
          y={855}
          width={1520}
          height={55}
          rx={theme.radius.lg}
          fill={theme.colors.primary.bg}
          stroke={theme.colors.border.purple}
          strokeWidth={1}
        />
        <text
          x={960}
          y={890}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.body}
          fontSize={theme.fontSize.bodySmall - 2}
          fontWeight={FONT_WEIGHT.semibold}
          fill={theme.colors.primary.main}
        >
          💡 Most prompt failures come from being too vague — specificity is the #1 improvement lever
        </text>
      </g>
    </g>
  );
};
