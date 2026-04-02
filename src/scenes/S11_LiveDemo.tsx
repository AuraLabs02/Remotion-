import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import {
  springIn, fadeIn, float, pulse, typewriter,
  SPRING_BOUNCY, SPRING_SMOOTH, easeOutExpo, sceneOpacity,
} from '../design/animations';
import { SectionTitle } from '../components/SectionTitle';
import { ProgressRing } from '../components/ProgressRing';

const SCENE_START = 4620;
const SCENE_END = 5100;

export const S11_LiveDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - SCENE_START;
  const opacity = sceneOpacity(frame, SCENE_START, SCENE_END);
  if (opacity <= 0) return null;

  // Step-by-step prompt building
  const promptSteps = [
    { frame: 25, text: 'You are a senior TypeScript engineer.', label: 'ROLE', color: theme.colors.primary.main },
    { frame: 65, text: 'Review this React component for performance issues.', label: 'TASK', color: theme.colors.secondary.main },
    { frame: 105, text: 'Focus on: re-renders, memo usage, state management.', label: 'FOCUS', color: theme.colors.accent.orange },
    { frame: 145, text: 'For each issue found, provide:', label: 'FORMAT', color: theme.colors.accent.green },
    { frame: 165, text: '1. Problem description  2. Code fix  3. Impact level', label: 'STRUCTURE', color: theme.colors.accent.green },
    { frame: 200, text: 'Think step by step before suggesting changes.', label: 'COT', color: theme.colors.accent.cyan },
  ];

  // Response appears after prompt is built
  const responseLines = [
    { text: '## Performance Analysis', delay: 250, color: theme.colors.primary.main },
    { text: '', delay: 260, color: '' },
    { text: '### Issue 1: Unnecessary Re-renders', delay: 270, color: theme.colors.accent.red },
    { text: 'The UserList component re-renders on every', delay: 285, color: theme.colors.text.secondary },
    { text: 'parent state change due to missing React.memo()', delay: 295, color: theme.colors.text.secondary },
    { text: '', delay: 305, color: '' },
    { text: '**Fix:** Wrap with React.memo and useMemo', delay: 310, color: theme.colors.accent.green },
    { text: '**Impact:** High — reduces renders by ~60%', delay: 325, color: theme.colors.accent.orange },
  ];

  // Quality score animation - starts earlier so it's visible sooner
  const scoreProgress = interpolate(f, [100, 220], [0, 96], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Annotation highlights
  const annotations = [
    { label: 'Sets expertise', x: 1460, y: 290, targetY: 300, delay: 40, color: theme.colors.primary.main },
    { label: 'Clear objective', x: 1460, y: 340, targetY: 350, delay: 80, color: theme.colors.secondary.main },
    { label: 'Narrows scope', x: 1460, y: 390, targetY: 400, delay: 120, color: theme.colors.accent.orange },
    { label: 'Output format', x: 1460, y: 450, targetY: 460, delay: 160, color: theme.colors.accent.green },
    { label: 'Forces reasoning', x: 1460, y: 530, targetY: 540, delay: 215, color: theme.colors.accent.cyan },
  ];

  return (
    <g opacity={opacity}>
      {/* Title */}
      <SectionTitle
        number="10"
        title="Live Demo"
        subtitle="Building a professional prompt step by step"
        startFrame={f >= 0 ? 0 : -1}
        y={90}
        color={theme.colors.accent.green}
      />

      {/* Code editor mockup for prompt */}
      <g opacity={springIn(f, fps, 10, SPRING_SMOOTH)}>
        {/* Editor shadow */}
        <rect
          x={104}
          y={204}
          width={900}
          height={450}
          rx={theme.radius.lg}
          fill="rgba(0,0,0,0.1)"
          filter="blur(12px)"
        />

        {/* Editor body */}
        <rect
          x={100}
          y={200}
          width={900}
          height={450}
          rx={theme.radius.lg}
          fill={theme.colors.bg.code}
        />

        {/* Title bar */}
        <rect
          x={100}
          y={200}
          width={900}
          height={42}
          rx={theme.radius.lg}
          fill={theme.colors.bg.codeLight}
        />
        <rect x={100} y={230} width={900} height={12} fill={theme.colors.bg.codeLight} />

        {/* Traffic lights */}
        <circle cx={124} cy={221} r={6} fill="#FF5F57" />
        <circle cx={144} cy={221} r={6} fill="#FEBC2E" />
        <circle cx={164} cy={221} r={6} fill="#28C840" />

        <text
          x={550}
          y={226}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.mono}
          fontSize={13}
          fontWeight={FONT_WEIGHT.medium}
          fill={theme.colors.text.muted}
        >
          prompt-builder.md
        </text>

        {/* Accent line */}
        <rect
          x={100}
          y={242}
          width={900 * springIn(f, fps, 10, SPRING_SMOOTH)}
          height={2}
          fill={theme.colors.accent.green}
        />

        {/* Prompt lines appearing step by step */}
        {promptSteps.map((step, i) => {
          const stepIn = fadeIn(f, step.frame, 18);
          const chars = typewriter(f, step.frame, step.text, 2.5);
          const displayText = step.text.substring(0, chars);
          const lineY = 275 + i * 40;

          return (
            <g key={i} opacity={stepIn}>
              {/* Line highlight flash */}
              {f >= step.frame && f < step.frame + 15 && (
                <rect
                  x={110}
                  y={lineY - 16}
                  width={880}
                  height={32}
                  rx={4}
                  fill={step.color}
                  opacity={0.08}
                />
              )}

              {/* Label badge */}
              <rect
                x={120}
                y={lineY - 12}
                width={70}
                height={22}
                rx={theme.radius.full}
                fill={step.color}
                opacity={0.2}
              />
              <text
                x={155}
                y={lineY + 3}
                textAnchor="middle"
                fontFamily={FONT_FAMILY.display}
                fontSize={10}
                fontWeight={FONT_WEIGHT.bold}
                fill={step.color}
                letterSpacing={1}
              >
                {step.label}
              </text>

              {/* Text */}
              <text
                x={200}
                y={lineY + 4}
                fontFamily={FONT_FAMILY.mono}
                fontSize={21}
                fontWeight={FONT_WEIGHT.medium}
                fill={theme.colors.text.code}
              >
                {displayText}
              </text>

              {/* Cursor */}
              {chars > 0 && chars < step.text.length && (
                <rect
                  x={200 + chars * 10.8}
                  y={lineY - 10}
                  width={2}
                  height={20}
                  fill={theme.colors.accent.green}
                  opacity={Math.sin(f * 0.15) > 0 ? 1 : 0}
                />
              )}
            </g>
          );
        })}
      </g>

      {/* Floating annotations */}
      {annotations.map((ann, i) => {
        const annIn = fadeIn(f, ann.delay, 12);
        return (
          <g key={i} opacity={annIn}>
            <line
              x1={1005}
              y1={ann.targetY}
              x2={ann.x - 5}
              y2={ann.y + 10}
              stroke={ann.color}
              strokeWidth={1}
              strokeDasharray="4 3"
              opacity={0.4}
            />
            <rect
              x={ann.x}
              y={ann.y}
              width={140}
              height={28}
              rx={theme.radius.full}
              fill={ann.color}
              opacity={0.12}
            />
            <text
              x={ann.x + 70}
              y={ann.y + 19}
              textAnchor="middle"
              fontFamily={FONT_FAMILY.display}
              fontSize={13}
              fontWeight={FONT_WEIGHT.bold}
              fill={ann.color}
            >
              {ann.label}
            </text>
          </g>
        );
      })}

      {/* Response panel below */}
      <g opacity={fadeIn(f, 240, 20)}>
        <rect
          x={104}
          y={684}
          width={1200}
          height={290}
          rx={theme.radius.lg}
          fill="rgba(0,0,0,0.08)"
          filter="blur(10px)"
        />

        <rect
          x={100}
          y={680}
          width={1200}
          height={290}
          rx={theme.radius.lg}
          fill={theme.colors.bg.card}
          stroke={theme.colors.accent.green}
          strokeWidth={2}
        />

        {/* Response header */}
        <rect
          x={120}
          y={695}
          width={160}
          height={28}
          rx={theme.radius.full}
          fill={theme.colors.accent.greenBg}
        />
        <text
          x={200}
          y={714}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={13}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.accent.green}
          letterSpacing={1.5}
        >
          ✨ RESPONSE
        </text>

        {/* Response lines */}
        {responseLines.map((line, i) => {
          const lineIn = fadeIn(f, line.delay, 12);
          return (
            <text
              key={i}
              x={140}
              y={745 + i * 28}
              fontFamily={line.text.startsWith('#') || line.text.startsWith('**')
                ? FONT_FAMILY.display : FONT_FAMILY.body}
              fontSize={line.text.startsWith('#') ? 26 : 21}
              fontWeight={line.text.startsWith('#') || line.text.startsWith('**')
                ? FONT_WEIGHT.bold : FONT_WEIGHT.medium}
              fill={line.color || theme.colors.text.secondary}
              opacity={lineIn}
            >
              {line.text}
            </text>
          );
        })}
      </g>

      {/* Quality score ring */}
      <ProgressRing
        value={scoreProgress}
        label="Quality Score"
        sublabel="professional prompt"
        startFrame={80}
        x={1560}
        y={810}
        size={180}
        color={theme.colors.accent.green}
        strokeWidth={12}
      />

      {/* Score breakdown */}
      <g opacity={fadeIn(f, 300, 20)}>
        {[
          { label: 'Clarity', val: '98%' },
          { label: 'Specificity', val: '95%' },
          { label: 'Structure', val: '92%' },
        ].map((item, i) => (
          <g key={i}>
            <text
              x={1490}
              y={920 + i * 24}
              textAnchor="end"
              fontFamily={FONT_FAMILY.body}
              fontSize={14}
              fontWeight={FONT_WEIGHT.medium}
              fill={theme.colors.text.muted}
            >
              {item.label}
            </text>
            <text
              x={1640}
              y={920 + i * 24}
              textAnchor="end"
              fontFamily={FONT_FAMILY.display}
              fontSize={14}
              fontWeight={FONT_WEIGHT.bold}
              fill={theme.colors.accent.green}
            >
              {item.val}
            </text>
          </g>
        ))}
      </g>
    </g>
  );
};
