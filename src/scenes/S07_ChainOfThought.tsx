import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import {
  springIn, fadeIn, float, pulse,
  SPRING_BOUNCY, SPRING_SMOOTH, easeOutExpo, sceneOpacity,
} from '../design/animations';
import { SectionTitle } from '../components/SectionTitle';

const SCENE_START = 2820;
const SCENE_END = 3300;

export const S07_ChainOfThought: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - SCENE_START;
  const opacity = sceneOpacity(frame, SCENE_START, SCENE_END);
  if (opacity <= 0) return null;

  // Chain steps
  const steps = [
    { label: 'Understand', desc: 'Parse the problem', icon: '🔍', color: theme.colors.secondary.main },
    { label: 'Break Down', desc: 'Identify sub-tasks', icon: '🧩', color: theme.colors.primary.main },
    { label: 'Reason', desc: 'Think step by step', icon: '💭', color: theme.colors.accent.orange },
    { label: 'Synthesize', desc: 'Combine insights', icon: '🔗', color: theme.colors.accent.cyan },
    { label: 'Answer', desc: 'Deliver result', icon: '✅', color: theme.colors.accent.green },
  ];

  // Active chain link
  const activeStep = Math.min(
    Math.floor(interpolate(f, [40, 200], [0, 5], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })),
    4
  );

  // Comparison section timing
  const comparisonIn = fadeIn(f, 220, 25);

  return (
    <g opacity={opacity}>
      {/* Title */}
      <SectionTitle
        number="06"
        title="Chain of Thought"
        subtitle="Guide the AI to think step by step"
        startFrame={f >= 0 ? 0 : -1}
        y={90}
        color={theme.colors.accent.orange}
      />

      {/* Chain of thought steps - horizontal chain */}
      <g>
        {steps.map((step, i) => {
          const stepIn = springIn(f, fps, 40 + i * 30, SPRING_BOUNCY);
          const isActive = i <= activeStep;
          const isCurrent = i === activeStep;
          const stepX = 190 + i * 360;
          const stepY = 290;
          const floatY = float(f, 3, 0.03, i);

          return (
            <g key={i} opacity={stepIn}>
              {/* Chain link connector */}
              {i > 0 && (
                <g opacity={fadeIn(f, 40 + i * 30, 15)}>
                  <line
                    x1={stepX - 200}
                    y1={stepY + 45}
                    x2={stepX - 60}
                    y2={stepY + 45}
                    stroke={isActive ? step.color : theme.colors.border.medium}
                    strokeWidth={3}
                    strokeDasharray={isActive ? 'none' : '8 4'}
                  />

                  {/* Traveling pulse */}
                  {isCurrent && (
                    <circle
                      cx={stepX - 200 + (140 * ((f * 0.03) % 1))}
                      cy={stepY + 45}
                      r={5}
                      fill={step.color}
                      opacity={0.8}
                    />
                  )}

                  <polygon
                    points={`${stepX - 60},${stepY + 45} ${stepX - 72},${stepY + 39} ${stepX - 72},${stepY + 51}`}
                    fill={isActive ? step.color : theme.colors.border.medium}
                  />
                </g>
              )}

              {/* Step node */}
              <g transform={`translate(0, ${floatY})`}>
                {/* Glow ring for current */}
                {isCurrent && (
                  <circle
                    cx={stepX}
                    cy={stepY + 45}
                    r={55}
                    fill="none"
                    stroke={step.color}
                    strokeWidth={2}
                    opacity={0.2 + 0.15 * pulse(f, 0.08)}
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={stepX}
                  cy={stepY + 45}
                  r={52}
                  fill={isActive ? theme.colors.bg.card : theme.colors.bg.secondary}
                  stroke={isActive ? step.color : theme.colors.border.light}
                  strokeWidth={isActive ? 3 : 1.5}
                  filter={isCurrent ? `drop-shadow(0 4px 16px ${step.color}30)` : undefined}
                />

                {/* Icon */}
                <text
                  x={stepX}
                  y={stepY + 40}
                  textAnchor="middle"
                  fontSize={28}
                  opacity={isActive ? 1 : 0.4}
                >
                  {step.icon}
                </text>

                {/* Step number */}
                <circle
                  cx={stepX + 35}
                  cy={stepY + 10}
                  r={14}
                  fill={isActive ? step.color : theme.colors.border.light}
                />
                <text
                  x={stepX + 35}
                  y={stepY + 16}
                  textAnchor="middle"
                  fontFamily={FONT_FAMILY.display}
                  fontSize={14}
                  fontWeight={FONT_WEIGHT.bold}
                  fill={theme.colors.text.inverse}
                >
                  {i + 1}
                </text>

                {/* Label */}
                <text
                  x={stepX}
                  y={stepY + 115}
                  textAnchor="middle"
                  fontFamily={FONT_FAMILY.display}
                  fontSize={theme.fontSize.label}
                  fontWeight={FONT_WEIGHT.extrabold}
                  fill={isActive ? step.color : theme.colors.text.muted}
                >
                  {step.label}
                </text>

                {/* Description */}
                <text
                  x={stepX}
                  y={stepY + 142}
                  textAnchor="middle"
                  fontFamily={FONT_FAMILY.body}
                  fontSize={theme.fontSize.caption - 2}
                  fontWeight={FONT_WEIGHT.medium}
                  fill={theme.colors.text.muted}
                >
                  {step.desc}
                </text>
              </g>
            </g>
          );
        })}
      </g>

      {/* Comparison: Direct vs CoT */}
      <g opacity={comparisonIn}>
        <text
          x={960}
          y={530}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={theme.fontSize.label}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.text.muted}
          letterSpacing={3}
        >
          COMPARISON
        </text>

        {/* Direct answer - left */}
        <g opacity={springIn(f - 220, fps, 0, SPRING_SMOOTH)}>
          <rect
            x={120}
            y={560}
            width={780}
            height={300}
            rx={theme.radius.xl}
            fill={theme.colors.bg.card}
            stroke={theme.colors.accent.red}
            strokeWidth={2}
          />

          <rect
            x={140}
            y={575}
            width={160}
            height={32}
            rx={theme.radius.full}
            fill={theme.colors.accent.redBg}
          />
          <text
            x={220}
            y={597}
            textAnchor="middle"
            fontFamily={FONT_FAMILY.display}
            fontSize={14}
            fontWeight={FONT_WEIGHT.bold}
            fill={theme.colors.accent.red}
            letterSpacing={1.5}
          >
            ✕ DIRECT ASK
          </text>

          {/* Prompt */}
          <rect
            x={140}
            y={620}
            width={740}
            height={50}
            rx={theme.radius.sm}
            fill={theme.colors.bg.secondary}
          />
          <text
            x={160}
            y={651}
            fontFamily={FONT_FAMILY.mono}
            fontSize={18}
            fontWeight={FONT_WEIGHT.medium}
            fill={theme.colors.text.secondary}
          >
            &quot;What&apos;s 17 * 24 + 133 / 7?&quot;
          </text>

          {/* Result */}
          <text
            x={160}
            y={710}
            fontFamily={FONT_FAMILY.body}
            fontSize={theme.fontSize.bodySmall}
            fontWeight={FONT_WEIGHT.medium}
            fill={theme.colors.text.secondary}
          >
            → &quot;The answer is 425&quot;
          </text>

          {/* Wrong mark */}
          <circle cx={820} cy={790} r={28} fill={theme.colors.accent.redBg} stroke={theme.colors.accent.red} strokeWidth={2} />
          <text
            x={820}
            y={798}
            textAnchor="middle"
            fontSize={24}
            fontWeight={FONT_WEIGHT.bold}
            fill={theme.colors.accent.red}
          >
            ✕
          </text>
          <text
            x={760}
            y={840}
            textAnchor="middle"
            fontFamily={FONT_FAMILY.body}
            fontSize={theme.fontSize.caption}
            fontWeight={FONT_WEIGHT.semibold}
            fill={theme.colors.accent.red}
          >
            Often incorrect
          </text>
        </g>

        {/* CoT answer - right */}
        <g opacity={springIn(f - 220, fps, 15, SPRING_SMOOTH)}>
          <rect
            x={1020}
            y={560}
            width={780}
            height={300}
            rx={theme.radius.xl}
            fill={theme.colors.bg.card}
            stroke={theme.colors.accent.green}
            strokeWidth={2}
          />

          <rect
            x={1040}
            y={575}
            width={220}
            height={32}
            rx={theme.radius.full}
            fill={theme.colors.accent.greenBg}
          />
          <text
            x={1150}
            y={597}
            textAnchor="middle"
            fontFamily={FONT_FAMILY.display}
            fontSize={14}
            fontWeight={FONT_WEIGHT.bold}
            fill={theme.colors.accent.green}
            letterSpacing={1.5}
          >
            ✓ CHAIN OF THOUGHT
          </text>

          {/* Prompt */}
          <rect
            x={1040}
            y={620}
            width={740}
            height={50}
            rx={theme.radius.sm}
            fill={theme.colors.bg.secondary}
          />
          <text
            x={1060}
            y={651}
            fontFamily={FONT_FAMILY.mono}
            fontSize={17}
            fontWeight={FONT_WEIGHT.medium}
            fill={theme.colors.text.secondary}
          >
            &quot;Think step by step: 17 * 24 + 133 / 7&quot;
          </text>

          {/* Steps */}
          {[
            'Step 1: 17 × 24 = 408',
            'Step 2: 133 ÷ 7 = 19',
            'Step 3: 408 + 19 = 427',
          ].map((step, i) => (
            <text
              key={i}
              x={1060}
              y={700 + i * 28}
              fontFamily={FONT_FAMILY.mono}
              fontSize={17}
              fontWeight={FONT_WEIGHT.medium}
              fill={theme.colors.text.secondary}
              opacity={fadeIn(f - 220, 20 + i * 10, 10)}
            >
              → {step}
            </text>
          ))}

          {/* Correct mark */}
          <circle cx={1720} cy={790} r={28} fill={theme.colors.accent.greenBg} stroke={theme.colors.accent.green} strokeWidth={2} />
          <text
            x={1720}
            y={798}
            textAnchor="middle"
            fontSize={24}
            fontWeight={FONT_WEIGHT.bold}
            fill={theme.colors.accent.green}
          >
            ✓
          </text>
          <text
            x={1660}
            y={840}
            textAnchor="middle"
            fontFamily={FONT_FAMILY.body}
            fontSize={theme.fontSize.caption}
            fontWeight={FONT_WEIGHT.semibold}
            fill={theme.colors.accent.green}
          >
            Reliably correct
          </text>
        </g>
      </g>
    </g>
  );
};
