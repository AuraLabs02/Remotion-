import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import {
  springIn, fadeIn, float, pulse,
  SPRING_BOUNCY, SPRING_SMOOTH, easeOutExpo, sceneOpacity,
} from '../design/animations';
import { SectionTitle } from '../components/SectionTitle';
import { ProgressRing } from '../components/ProgressRing';

const SCENE_START = 2370;
const SCENE_END = 2850;

export const S06_FewShotExamples: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - SCENE_START;
  const opacity = sceneOpacity(frame, SCENE_START, SCENE_END);
  if (opacity <= 0) return null;

  // Example cards data
  const examples = [
    {
      input: 'Convert "hello world" to title case',
      output: '"Hello World"',
      label: 'EXAMPLE 1',
      delay: 30,
    },
    {
      input: 'Convert "foo bar baz" to title case',
      output: '"Foo Bar Baz"',
      label: 'EXAMPLE 2',
      delay: 70,
    },
    {
      input: 'Convert "the quick brown fox" to title case',
      output: '"The Quick Brown Fox"',
      label: 'EXAMPLE 3',
      delay: 110,
    },
  ];

  // The "new" task after learning
  const newTask = {
    input: 'Convert "prompt engineering rocks" to title case',
    output: '"Prompt Engineering Rocks"',
    delay: 160,
  };

  // Fan-out animation for cards
  const fanAngles = [-12, 0, 12];
  const fanOffsets = [-260, 0, 260];

  // Pattern recognition lines
  const patternIn = fadeIn(f, 140, 25);

  return (
    <g opacity={opacity}>
      {/* Title */}
      <SectionTitle
        number="05"
        title="Few-Shot Examples"
        subtitle="Teach by showing, not just telling"
        startFrame={f >= 0 ? 0 : -1}
        y={90}
        color={theme.colors.accent.orange}
      />

      {/* Example cards fanning out */}
      {examples.map((ex, i) => {
        const cardIn = springIn(f, fps, ex.delay, SPRING_BOUNCY);
        const cardX = 960 + fanOffsets[i] * cardIn;
        const cardY = 350;
        const rotation = fanAngles[i] * cardIn;
        const floatY = float(f, 3, 0.03, i);
        const cardW = 440;
        const cardH = 220;

        return (
          <g
            key={i}
            opacity={cardIn}
            transform={`translate(${cardX}, ${cardY + floatY}) rotate(${rotation})`}
          >
            {/* Card shadow */}
            <rect
              x={-cardW / 2 + 4}
              y={4}
              width={cardW}
              height={cardH}
              rx={theme.radius.xl}
              fill="rgba(0,0,0,0.08)"
              filter="blur(10px)"
            />

            {/* Card */}
            <rect
              x={-cardW / 2}
              y={0}
              width={cardW}
              height={cardH}
              rx={theme.radius.xl}
              fill={theme.colors.bg.card}
              stroke={theme.colors.accent.orange}
              strokeWidth={2}
            />

            {/* Label badge */}
            <rect
              x={-cardW / 2 + 20}
              y={18}
              width={110}
              height={28}
              rx={theme.radius.full}
              fill={theme.colors.accent.orange}
            />
            <text
              x={-cardW / 2 + 75}
              y={37}
              textAnchor="middle"
              fontFamily={FONT_FAMILY.display}
              fontSize={13}
              fontWeight={FONT_WEIGHT.bold}
              fill={theme.colors.text.inverse}
              letterSpacing={1.5}
            >
              {ex.label}
            </text>

            {/* Input */}
            <text
              x={-cardW / 2 + 30}
              y={78}
              fontFamily={FONT_FAMILY.display}
              fontSize={15}
              fontWeight={FONT_WEIGHT.bold}
              fill={theme.colors.text.muted}
              letterSpacing={1}
            >
              INPUT
            </text>
            <rect
              x={-cardW / 2 + 20}
              y={90}
              width={cardW - 40}
              height={40}
              rx={theme.radius.sm}
              fill={theme.colors.bg.secondary}
            />
            <text
              x={-cardW / 2 + 35}
              y={116}
              fontFamily={FONT_FAMILY.mono}
              fontSize={16}
              fontWeight={FONT_WEIGHT.medium}
              fill={theme.colors.text.secondary}
            >
              {ex.input}
            </text>

            {/* Output */}
            <text
              x={-cardW / 2 + 30}
              y={152}
              fontFamily={FONT_FAMILY.display}
              fontSize={15}
              fontWeight={FONT_WEIGHT.bold}
              fill={theme.colors.accent.green}
              letterSpacing={1}
            >
              OUTPUT
            </text>
            <rect
              x={-cardW / 2 + 20}
              y={162}
              width={cardW - 40}
              height={40}
              rx={theme.radius.sm}
              fill={theme.colors.accent.greenBg}
            />
            <text
              x={-cardW / 2 + 35}
              y={188}
              fontFamily={FONT_FAMILY.mono}
              fontSize={18}
              fontWeight={FONT_WEIGHT.bold}
              fill={theme.colors.accent.green}
            >
              {ex.output}
            </text>
          </g>
        );
      })}

      {/* Pattern recognition arrow */}
      <g opacity={patternIn}>
        {/* Dotted lines from examples converging */}
        <text
          x={960}
          y={610}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={theme.fontSize.h3}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.primary.main}
          opacity={0.8 + 0.2 * pulse(f, 0.06)}
        >
          Pattern Learned ✓
        </text>

        {/* Down arrow */}
        <line
          x1={960} y1={630} x2={960} y2={670}
          stroke={theme.colors.primary.main}
          strokeWidth={3}
          strokeDasharray="6 4"
        />
        <polygon
          points="960,680 952,668 968,668"
          fill={theme.colors.primary.main}
        />
      </g>

      {/* New task card */}
      <g opacity={springIn(f, fps, newTask.delay, SPRING_SMOOTH)}>
        <rect
          x={400}
          y={700}
          width={720}
          height={110}
          rx={theme.radius.xl}
          fill={theme.colors.bg.card}
          stroke={theme.colors.accent.green}
          strokeWidth={3}
          filter={`drop-shadow(0 6px 20px ${theme.colors.accent.green}25)`}
        />

        {/* New task badge */}
        <rect
          x={420}
          y={715}
          width={100}
          height={28}
          rx={theme.radius.full}
          fill={theme.colors.accent.green}
        />
        <text
          x={470}
          y={734}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={13}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.text.inverse}
          letterSpacing={1.5}
        >
          NEW TASK
        </text>

        {/* New input */}
        <text
          x={540}
          y={734}
          fontFamily={FONT_FAMILY.mono}
          fontSize={18}
          fontWeight={FONT_WEIGHT.medium}
          fill={theme.colors.text.secondary}
        >
          {newTask.input}
        </text>

        {/* New output */}
        <text
          x={420}
          y={785}
          fontFamily={FONT_FAMILY.display}
          fontSize={15}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.accent.green}
          letterSpacing={1}
        >
          → {newTask.output}
        </text>

        {/* Checkmark */}
        <g opacity={fadeIn(f, newTask.delay + 30, 15)}>
          <circle
            cx={1070}
            cy={755}
            r={24}
            fill={theme.colors.accent.green}
          />
          <text
            x={1070}
            y={763}
            textAnchor="middle"
            fontSize={22}
            fill={theme.colors.text.inverse}
            fontWeight={FONT_WEIGHT.bold}
          >
            ✓
          </text>
        </g>
      </g>

      {/* Accuracy meter */}
      <ProgressRing
        value={95}
        label="Accuracy"
        sublabel="with 3 examples"
        startFrame={newTask.delay + 20}
        x={1500}
        y={750}
        size={160}
        color={theme.colors.accent.green}
      />

      {/* Bottom tip */}
      <g opacity={fadeIn(f, 220, 20)}>
        <rect
          x={200}
          y={860}
          width={1520}
          height={60}
          rx={theme.radius.lg}
          fill={theme.colors.accent.orangeBg}
          stroke={theme.colors.accent.orange}
          strokeWidth={1}
          opacity={0.7}
        />
        <text
          x={960}
          y={898}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.body}
          fontSize={theme.fontSize.bodySmall - 2}
          fontWeight={FONT_WEIGHT.medium}
          fill={theme.colors.accent.orange}
        >
          💡 Just 2-3 examples dramatically improve output quality — no fine-tuning needed!
        </text>
      </g>
    </g>
  );
};
