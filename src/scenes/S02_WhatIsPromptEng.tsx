import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import {
  springIn, fadeIn, float, pulse, typewriter,
  SPRING_BOUNCY, SPRING_SMOOTH, easeOutExpo, sceneOpacity,
} from '../design/animations';
import { SectionTitle } from '../components/SectionTitle';
import { BrainNetwork } from '../components/BrainNetwork';

const SCENE_START = 420;
const SCENE_END = 900;

export const S02_WhatIsPromptEng: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - SCENE_START;
  const opacity = sceneOpacity(frame, SCENE_START, SCENE_END);
  if (opacity <= 0) return null;

  // Phase timing
  const phase1 = f >= 0 && f < 150;   // Definition
  const phase2 = f >= 120 && f < 300;  // Pipeline diagram
  const phase3 = f >= 260;              // Good vs Bad comparison

  // Active brain region based on phase
  const activeRegion = f < 80 ? 4 : f < 160 ? 0 : f < 240 ? 1 : f < 320 ? 5 : 2;

  // Definition text word-by-word (split into two lines for readability)
  const line1Words = 'The art and science of crafting inputs'.split(' ');
  const line2Words = 'that guide AI models to produce optimal outputs'.split(' ');
  const allWords = [...line1Words, ...line2Words];
  const wordsVisible = Math.floor(interpolate(f, [30, 110], [0, allWords.length], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));

  return (
    <g opacity={opacity}>
      {/* Title */}
      <SectionTitle
        number="01"
        title="What is Prompt Engineering?"
        subtitle="Understanding the foundation"
        startFrame={f >= 0 ? 0 : -1}
        y={100}
        color={theme.colors.primary.main}
      />

      {/* Brain Network - left side */}
      <BrainNetwork
        startFrame={0}
        x={350}
        y={520}
        scale={0.85}
        activeRegion={activeRegion}
        color={theme.colors.primary.main}
      />

      {/* Definition panel - right side */}
      <g opacity={fadeIn(f, 25, 25)}>
        <rect
          x={680}
          y={300}
          width={1100}
          height={180}
          rx={theme.radius.xl}
          fill={theme.colors.bg.secondary}
          stroke={theme.colors.border.purple}
          strokeWidth={2}
        />

        {/* Label */}
        <rect
          x={710}
          y={315}
          width={120}
          height={30}
          rx={theme.radius.full}
          fill={theme.colors.primary.main}
        />
        <text
          x={770}
          y={335}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={14}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.text.inverse}
          letterSpacing={2}
        >
          DEFINITION
        </text>

        {/* Word-by-word text - line 1 */}
        <text
          x={720}
          y={380}
          fontFamily={FONT_FAMILY.body}
          fontSize={theme.fontSize.body}
          fontWeight={FONT_WEIGHT.medium}
          fill={theme.colors.text.primary}
        >
          {line1Words.map((word, i) => (
            <tspan
              key={i}
              fill={i < wordsVisible ? theme.colors.text.primary : 'transparent'}
              fontWeight={
                ['art', 'science', 'crafting'].includes(word)
                  ? FONT_WEIGHT.bold
                  : FONT_WEIGHT.medium
              }
            >
              {word}{' '}
            </tspan>
          ))}
        </text>
        {/* Word-by-word text - line 2 */}
        <text
          x={720}
          y={420}
          fontFamily={FONT_FAMILY.body}
          fontSize={theme.fontSize.body}
          fontWeight={FONT_WEIGHT.medium}
          fill={theme.colors.text.primary}
        >
          {line2Words.map((word, i) => {
            const globalIdx = line1Words.length + i;
            return (
              <tspan
                key={i}
                fill={globalIdx < wordsVisible ? theme.colors.text.primary : 'transparent'}
                fontWeight={
                  ['optimal', 'outputs'].includes(word)
                    ? FONT_WEIGHT.bold
                    : FONT_WEIGHT.medium
                }
              >
                {word}{' '}
              </tspan>
            );
          })}
        </text>

        {/* Highlighted keywords */}
        <text
          x={720}
          y={440}
          fontFamily={FONT_FAMILY.body}
          fontSize={theme.fontSize.bodySmall - 2}
          fontWeight={FONT_WEIGHT.medium}
          fill={theme.colors.text.muted}
          opacity={fadeIn(f, 90, 20)}
        >
          It&apos;s not just about asking questions — it&apos;s about asking the right way.
        </text>
      </g>

      {/* Input → Processing → Output pipeline */}
      {phase2 && (() => {
        const pf = f - 120;
        const pipeIn = fadeIn(f, 120, 25);
        const stages = [
          { label: 'YOUR PROMPT', icon: '✏️', color: theme.colors.secondary.main, x: 740 },
          { label: 'AI MODEL', icon: '🧠', color: theme.colors.primary.main, x: 1060 },
          { label: 'OUTPUT', icon: '✨', color: theme.colors.accent.green, x: 1380 },
        ];

        return (
          <g opacity={pipeIn}>
            {stages.map((stage, i) => {
              const stageIn = springIn(pf, fps, i * 15, SPRING_BOUNCY);
              const floatY = float(f, 4, 0.03, i);

              return (
                <g key={i} opacity={stageIn}>
                  {/* Stage card */}
                  <rect
                    x={stage.x - 120}
                    y={530 + floatY}
                    width={240}
                    height={130}
                    rx={theme.radius.lg}
                    fill={theme.colors.bg.card}
                    stroke={stage.color}
                    strokeWidth={2.5}
                    filter={`drop-shadow(0 4px 16px ${stage.color}30)`}
                  />

                  {/* Icon */}
                  <text
                    x={stage.x}
                    y={575 + floatY}
                    textAnchor="middle"
                    fontSize={36}
                  >
                    {stage.icon}
                  </text>

                  {/* Label */}
                  <text
                    x={stage.x}
                    y={630 + floatY}
                    textAnchor="middle"
                    fontFamily={FONT_FAMILY.display}
                    fontSize={theme.fontSize.label}
                    fontWeight={FONT_WEIGHT.bold}
                    fill={stage.color}
                    letterSpacing={1.5}
                  >
                    {stage.label}
                  </text>

                  {/* Arrow between stages */}
                  {i < stages.length - 1 && (
                    <g opacity={fadeIn(pf, (i + 1) * 15 + 10, 15)}>
                      <line
                        x1={stage.x + 125}
                        y1={595 + floatY}
                        x2={stages[i + 1].x - 125}
                        y2={595 + float(f, 4, 0.03, i + 1)}
                        stroke={theme.colors.text.muted}
                        strokeWidth={2}
                        strokeDasharray="8 4"
                      />
                      <polygon
                        points={`${stages[i + 1].x - 128},${595 + float(f, 4, 0.03, i + 1)} ${stages[i + 1].x - 140},${588 + float(f, 4, 0.03, i + 1)} ${stages[i + 1].x - 140},${602 + float(f, 4, 0.03, i + 1)}`}
                        fill={theme.colors.text.muted}
                      />

                      {/* Traveling dot */}
                      {(() => {
                        const dotT = ((pf * 0.025 + i * 0.5) % 1);
                        const x1 = stage.x + 125;
                        const x2 = stages[i + 1].x - 128;
                        return (
                          <circle
                            cx={x1 + (x2 - x1) * dotT}
                            cy={595}
                            r={4}
                            fill={stage.color}
                            opacity={0.8}
                          />
                        );
                      })()}
                    </g>
                  )}
                </g>
              );
            })}

            {/* The key insight label */}
            <g opacity={fadeIn(pf, 60, 20)}>
              <rect
                x={740}
                y={700}
                width={640}
                height={50}
                rx={theme.radius.md}
                fill={theme.colors.primary.bg}
              />
              <text
                x={1060}
                y={732}
                textAnchor="middle"
                fontFamily={FONT_FAMILY.body}
                fontSize={theme.fontSize.bodySmall}
                fontWeight={FONT_WEIGHT.semibold}
                fill={theme.colors.primary.main}
              >
                Better prompts = Better outputs. It&apos;s that simple.
              </text>
            </g>
          </g>
        );
      })()}

      {/* Good vs Bad comparison */}
      {phase3 && (() => {
        const cf = f - 260;
        const compIn = fadeIn(f, 260, 25);

        return (
          <g opacity={compIn}>
            {/* Bad prompt */}
            <g opacity={springIn(cf, fps, 0, SPRING_SMOOTH)}>
              <rect
                x={700}
                y={800}
                width={400}
                height={100}
                rx={theme.radius.lg}
                fill={theme.colors.accent.redBg}
                stroke={theme.colors.accent.red}
                strokeWidth={2}
              />
              <text
                x={720}
                y={835}
                fontFamily={FONT_FAMILY.display}
                fontSize={16}
                fontWeight={FONT_WEIGHT.bold}
                fill={theme.colors.accent.red}
                letterSpacing={2}
              >
                ✕ VAGUE PROMPT
              </text>
              <text
                x={720}
                y={875}
                fontFamily={FONT_FAMILY.mono}
                fontSize={20}
                fontWeight={FONT_WEIGHT.medium}
                fill={theme.colors.text.secondary}
              >
                &quot;Write me some code&quot;
              </text>
            </g>

            {/* Good prompt */}
            <g opacity={springIn(cf, fps, 15, SPRING_SMOOTH)}>
              <rect
                x={1160}
                y={800}
                width={560}
                height={100}
                rx={theme.radius.lg}
                fill={theme.colors.accent.greenBg}
                stroke={theme.colors.accent.green}
                strokeWidth={2}
              />
              <text
                x={1180}
                y={835}
                fontFamily={FONT_FAMILY.display}
                fontSize={16}
                fontWeight={FONT_WEIGHT.bold}
                fill={theme.colors.accent.green}
                letterSpacing={2}
              >
                ✓ SPECIFIC PROMPT
              </text>
              <text
                x={1180}
                y={875}
                fontFamily={FONT_FAMILY.mono}
                fontSize={20}
                fontWeight={FONT_WEIGHT.medium}
                fill={theme.colors.text.secondary}
              >
                &quot;Write a TypeScript REST API endpoint...&quot;
              </text>
            </g>
          </g>
        );
      })()}
    </g>
  );
};
