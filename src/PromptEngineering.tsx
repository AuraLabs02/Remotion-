import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from './design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from './design/fonts';
import { pulse, fadeIn, easeOutExpo } from './design/animations';

// Import all scenes
import { S01_Opening } from './scenes/S01_Opening';
import { S02_WhatIsPromptEng } from './scenes/S02_WhatIsPromptEng';
import { S03_ClaudeCodeIntro } from './scenes/S03_ClaudeCodeIntro';
import { S04_BasicTechniques } from './scenes/S04_BasicTechniques';
import { S05_SystemPrompts } from './scenes/S05_SystemPrompts';
import { S06_FewShotExamples } from './scenes/S06_FewShotExamples';
import { S07_ChainOfThought } from './scenes/S07_ChainOfThought';
import { S08_StructuredOutput } from './scenes/S08_StructuredOutput';
import { S09_AdvancedPatterns } from './scenes/S09_AdvancedPatterns';
import { S10_CommonMistakes } from './scenes/S10_CommonMistakes';
import { S11_LiveDemo } from './scenes/S11_LiveDemo';
import { S12_Closing } from './scenes/S12_Closing';

// Scene definitions with frame ranges
const SCENES = [
  { id: 'INTRO', start: 0, end: 450, label: 'INTRO' },
  { id: 'WHAT', start: 420, end: 900, label: 'WHAT' },
  { id: 'CLAUDE', start: 870, end: 1350, label: 'CLAUDE' },
  { id: 'BASICS', start: 1320, end: 1950, label: 'BASICS' },
  { id: 'SYSTEM', start: 1920, end: 2400, label: 'SYSTEM' },
  { id: 'FEWSHOT', start: 2370, end: 2850, label: 'FEW-SHOT' },
  { id: 'COT', start: 2820, end: 3300, label: 'COT' },
  { id: 'STRUCT', start: 3270, end: 3750, label: 'STRUCT' },
  { id: 'ADVANCED', start: 3720, end: 4200, label: 'ADVANCED' },
  { id: 'MISTAKES', start: 4170, end: 4650, label: 'MISTAKES' },
  { id: 'DEMO', start: 4620, end: 5100, label: 'DEMO' },
  { id: 'CLOSING', start: 5070, end: 5400, label: 'OUTRO' },
];

const TOTAL_FRAMES = 5400;

// Background component with subtle animated gradients
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const gradientShift1 = 0.5 + 0.5 * Math.sin(frame * 0.003);
  const gradientShift2 = 0.5 + 0.5 * Math.sin(frame * 0.004 + 1);

  return (
    <>
      {/* Base white */}
      <rect width={1920} height={1080} fill={theme.colors.bg.primary} />

      {/* Subtle gradient wash */}
      <defs>
        <radialGradient id="bg-grad-1" cx={`${30 + 20 * gradientShift1}%`} cy="30%" r="60%">
          <stop offset="0%" stopColor={theme.colors.primary.main} stopOpacity={0.03} />
          <stop offset="100%" stopColor={theme.colors.bg.primary} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="bg-grad-2" cx={`${60 + 15 * gradientShift2}%`} cy="70%" r="50%">
          <stop offset="0%" stopColor={theme.colors.secondary.main} stopOpacity={0.02} />
          <stop offset="100%" stopColor={theme.colors.bg.primary} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#bg-grad-1)" />
      <rect width={1920} height={1080} fill="url(#bg-grad-2)" />

      {/* Subtle dot grid */}
      <defs>
        <pattern id="dot-grid" width={40} height={40} patternUnits="userSpaceOnUse">
          <circle cx={20} cy={20} r={0.8} fill={theme.colors.text.muted} opacity={0.15} />
        </pattern>
      </defs>
      <rect width={1920} height={1080} fill="url(#dot-grid)" opacity={0.5} />
    </>
  );
};

// Progress bar at the bottom
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / TOTAL_FRAMES;

  return (
    <g>
      {/* Track */}
      <rect
        x={0}
        y={1074}
        width={1920}
        height={6}
        fill={theme.colors.bg.secondary}
      />
      {/* Fill */}
      <defs>
        <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={theme.colors.primary.main} />
          <stop offset="50%" stopColor={theme.colors.secondary.main} />
          <stop offset="100%" stopColor={theme.colors.accent.green} />
        </linearGradient>
      </defs>
      <rect
        x={0}
        y={1074}
        width={1920 * progress}
        height={6}
        fill="url(#progress-grad)"
      />
      {/* Glow dot at tip */}
      <circle
        cx={1920 * progress}
        cy={1077}
        r={4}
        fill={theme.colors.text.inverse}
        stroke={theme.colors.primary.main}
        strokeWidth={2}
      />
    </g>
  );
};

// Scene breadcrumb navigation at top
const SceneBreadcrumb: React.FC = () => {
  const frame = useCurrentFrame();

  // Find current scene index
  let currentScene = 0;
  for (let i = 0; i < SCENES.length; i++) {
    if (frame >= SCENES[i].start) currentScene = i;
  }

  const dotSpacing = 140;
  const startX = (1920 - (SCENES.length - 1) * dotSpacing) / 2;
  const y = 38;

  return (
    <g opacity={0.85}>
      {/* Connector line */}
      <line
        x1={startX}
        y1={y}
        x2={startX + (SCENES.length - 1) * dotSpacing}
        y2={y}
        stroke={theme.colors.border.light}
        strokeWidth={1.5}
      />

      {/* Active progress line */}
      <line
        x1={startX}
        y1={y}
        x2={startX + currentScene * dotSpacing}
        y2={y}
        stroke={theme.colors.primary.main}
        strokeWidth={2}
      />

      {/* Dots */}
      {SCENES.map((scene, i) => {
        const isPast = i < currentScene;
        const isCurrent = i === currentScene;
        const dotX = startX + i * dotSpacing;
        const dotScale = isCurrent ? 1.6 : 1;

        return (
          <g key={i}>
            {/* Glow for current */}
            {isCurrent && (
              <circle
                cx={dotX}
                cy={y}
                r={12}
                fill={theme.colors.primary.main}
                opacity={0.15 + 0.1 * pulse(frame, 0.06)}
              />
            )}

            {/* Dot */}
            <circle
              cx={dotX}
              cy={y}
              r={4 * dotScale}
              fill={isCurrent ? theme.colors.primary.main : isPast ? theme.colors.primary.light : theme.colors.border.medium}
            />

            {/* Label (only show for current and neighbors) */}
            {Math.abs(i - currentScene) <= 2 && (
              <text
                x={dotX}
                y={y + 22}
                textAnchor="middle"
                fontFamily={FONT_FAMILY.display}
                fontSize={10}
                fontWeight={isCurrent ? FONT_WEIGHT.bold : FONT_WEIGHT.medium}
                fill={isCurrent ? theme.colors.primary.main : theme.colors.text.muted}
                letterSpacing={1}
              >
                {scene.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

// Main video component
export const PromptEngineering: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg.primary }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ width: '100%', height: '100%' }}
      >
        {/* SVG Filters */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.1)" />
          </filter>
        </defs>

        {/* Background */}
        <Background />

        {/* All scenes - each handles its own visibility via sceneOpacity */}
        <S01_Opening />
        <S02_WhatIsPromptEng />
        <S03_ClaudeCodeIntro />
        <S04_BasicTechniques />
        <S05_SystemPrompts />
        <S06_FewShotExamples />
        <S07_ChainOfThought />
        <S08_StructuredOutput />
        <S09_AdvancedPatterns />
        <S10_CommonMistakes />
        <S11_LiveDemo />
        <S12_Closing />

        {/* Global UI */}
        <SceneBreadcrumb />
        <ProgressBar />
      </svg>
    </AbsoluteFill>
  );
};
