import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import {
  springIn, fadeIn, float, pulse, typewriter,
  SPRING_BOUNCY, SPRING_SMOOTH, easeOutExpo, sceneOpacity,
} from '../design/animations';
import { SectionTitle } from '../components/SectionTitle';

const SCENE_START = 1320;
const SCENE_END = 1950;

export const S04_BasicTechniques: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - SCENE_START;
  const opacity = sceneOpacity(frame, SCENE_START, SCENE_END);
  if (opacity <= 0) return null;

  // 4 techniques with staggered reveals
  const techniques = [
    {
      icon: '🎯',
      title: 'Be Specific',
      bad: '"Fix the bug"',
      good: '"Fix the null pointer exception in UserService.getProfile() on line 42"',
      color: theme.colors.primary.main,
      delay: 30,
    },
    {
      icon: '📋',
      title: 'Provide Context',
      bad: '"Add a function"',
      good: '"Add a validateEmail() function to the auth module using regex, return boolean"',
      color: theme.colors.secondary.main,
      delay: 160,
    },
    {
      icon: '📐',
      title: 'Set the Format',
      bad: '"Explain this code"',
      good: '"Explain this code: 1) What it does 2) Key functions 3) Potential issues"',
      color: theme.colors.accent.green,
      delay: 290,
    },
    {
      icon: '🔄',
      title: 'Iterate & Refine',
      bad: '"Make it better"',
      good: '"The error handling works, now add retry logic with exponential backoff"',
      color: theme.colors.accent.orange,
      delay: 420,
    },
  ];

  // Calculate which quadrant is active
  const activeIdx = f < 160 ? 0 : f < 290 ? 1 : f < 420 ? 2 : 3;

  return (
    <g opacity={opacity}>
      {/* Title */}
      <SectionTitle
        number="03"
        title="Basic Techniques"
        subtitle="Four fundamentals that transform your prompts"
        startFrame={f >= 0 ? 0 : -1}
        y={90}
        color={theme.colors.primary.main}
      />

      {/* 2x2 Grid of technique cards */}
      {techniques.map((tech, i) => {
        const tf = f - tech.delay;
        if (tf < -15) return null;

        const cardIn = springIn(Math.max(0, tf), fps, 0, SPRING_BOUNCY);
        const isActive = i === activeIdx;
        const col = i % 2;
        const row = Math.floor(i / 2);
        const cardX = 80 + col * 920;
        const cardY = 200 + row * 320;
        const cardW = 860;
        const cardH = 290;
        const floatY = float(f, 3, 0.025, i * 1.2);

        // Detail reveal
        const detailIn = fadeIn(tf, 15, 20);

        return (
          <g key={i} opacity={cardIn}>
            {/* Card */}
            <rect
              x={cardX}
              y={cardY + floatY}
              width={cardW}
              height={cardH}
              rx={theme.radius.xl}
              fill={theme.colors.bg.card}
              stroke={isActive ? tech.color : theme.colors.border.light}
              strokeWidth={isActive ? 3 : 1.5}
              filter={isActive
                ? `drop-shadow(0 8px 24px ${tech.color}25)`
                : `drop-shadow(${theme.shadow.sm})`
              }
            />

            {/* Active spotlight glow */}
            {isActive && (
              <rect
                x={cardX}
                y={cardY + floatY}
                width={cardW}
                height={cardH}
                rx={theme.radius.xl}
                fill={tech.color}
                opacity={0.03 + 0.02 * pulse(f, 0.06)}
              />
            )}

            {/* Color accent bar */}
            <rect
              x={cardX}
              y={cardY + floatY}
              width={8}
              height={cardH}
              rx={4}
              fill={tech.color}
              opacity={isActive ? 1 : 0.4}
            />

            {/* Number badge */}
            <circle
              cx={cardX + 50}
              cy={cardY + 45 + floatY}
              r={22}
              fill={isActive ? tech.color : theme.colors.bg.secondary}
              stroke={tech.color}
              strokeWidth={2}
            />
            <text
              x={cardX + 50}
              y={cardY + 52 + floatY}
              textAnchor="middle"
              fontFamily={FONT_FAMILY.display}
              fontSize={18}
              fontWeight={FONT_WEIGHT.bold}
              fill={isActive ? theme.colors.text.inverse : tech.color}
            >
              {i + 1}
            </text>

            {/* Icon & Title */}
            <text
              x={cardX + 88}
              y={cardY + 45 + floatY}
              fontSize={30}
            >
              {tech.icon}
            </text>
            <text
              x={cardX + 130}
              y={cardY + 52 + floatY}
              fontFamily={FONT_FAMILY.display}
              fontSize={theme.fontSize.h3 - 4}
              fontWeight={FONT_WEIGHT.extrabold}
              fill={theme.colors.text.primary}
            >
              {tech.title}
            </text>

            {/* Bad example */}
            <g opacity={detailIn}>
              <rect
                x={cardX + 35}
                y={cardY + 80 + floatY}
                width={cardW - 70}
                height={55}
                rx={theme.radius.md}
                fill={theme.colors.accent.redBg}
                stroke={theme.colors.accent.red}
                strokeWidth={1}
                opacity={0.8}
              />
              <text
                x={cardX + 55}
                y={cardY + 98 + floatY}
                fontFamily={FONT_FAMILY.display}
                fontSize={13}
                fontWeight={FONT_WEIGHT.bold}
                fill={theme.colors.accent.red}
                letterSpacing={1.5}
              >
                ✕ DON&apos;T
              </text>
              <text
                x={cardX + 140}
                y={cardY + 98 + floatY}
                fontFamily={FONT_FAMILY.mono}
                fontSize={17}
                fontWeight={FONT_WEIGHT.medium}
                fill={theme.colors.text.secondary}
              >
                {tech.bad}
              </text>
            </g>

            {/* Good example */}
            <g opacity={fadeIn(tf, 25, 20)}>
              <rect
                x={cardX + 35}
                y={cardY + 150 + floatY}
                width={cardW - 70}
                height={55}
                rx={theme.radius.md}
                fill={theme.colors.accent.greenBg}
                stroke={theme.colors.accent.green}
                strokeWidth={1}
                opacity={0.8}
              />
              <text
                x={cardX + 55}
                y={cardY + 168 + floatY}
                fontFamily={FONT_FAMILY.display}
                fontSize={13}
                fontWeight={FONT_WEIGHT.bold}
                fill={theme.colors.accent.green}
                letterSpacing={1.5}
              >
                ✓ DO
              </text>
              <text
                x={cardX + 125}
                y={cardY + 168 + floatY}
                fontFamily={FONT_FAMILY.mono}
                fontSize={15}
                fontWeight={FONT_WEIGHT.medium}
                fill={theme.colors.text.secondary}
              >
                {tech.good.length > 55 ? tech.good.substring(0, 55) + '...' : tech.good}
              </text>
            </g>

            {/* Impact arrow */}
            {isActive && (
              <g opacity={fadeIn(tf, 35, 15)}>
                <text
                  x={cardX + cardW - 50}
                  y={cardY + 140 + floatY}
                  textAnchor="middle"
                  fontFamily={FONT_FAMILY.display}
                  fontSize={28}
                  fill={tech.color}
                  opacity={0.6 + 0.4 * pulse(f, 0.08)}
                >
                  ↓
                </text>
              </g>
            )}

            {/* Bottom quality bar */}
            <rect
              x={cardX + 35}
              y={cardY + cardH - 30 + floatY}
              width={(cardW - 70) * fadeIn(tf, 30, 30)}
              height={4}
              rx={2}
              fill={tech.color}
              opacity={0.3}
            />
          </g>
        );
      })}
    </g>
  );
};
