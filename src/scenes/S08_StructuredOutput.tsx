import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import {
  springIn, fadeIn, float, pulse, typewriter,
  SPRING_BOUNCY, SPRING_SMOOTH, easeOutExpo, sceneOpacity,
} from '../design/animations';
import { SectionTitle } from '../components/SectionTitle';

const SCENE_START = 3270;
const SCENE_END = 3750;

export const S08_StructuredOutput: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - SCENE_START;
  const opacity = sceneOpacity(frame, SCENE_START, SCENE_END);
  if (opacity <= 0) return null;

  // Messy text
  const messyText = [
    'The user is John Smith he is 28 years old',
    'and works as a software engineer at Acme',
    'Corp his email is john@acme.com and he',
    'started on March 15 2024...',
  ];

  // Structured JSON
  const jsonLines = [
    { text: '{', color: theme.colors.text.code },
    { text: '  "name": "John Smith",', color: theme.colors.text.codeString },
    { text: '  "age": 28,', color: theme.colors.text.codeNumber },
    { text: '  "role": "Software Engineer",', color: theme.colors.text.codeString },
    { text: '  "company": "Acme Corp",', color: theme.colors.text.codeString },
    { text: '  "email": "john@acme.com",', color: theme.colors.text.codeString },
    { text: '  "startDate": "2024-03-15"', color: theme.colors.text.codeString },
    { text: '}', color: theme.colors.text.code },
  ];

  // Morph progress
  const morphProgress = interpolate(f, [80, 130], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Format tabs
  const formats = [
    { label: 'JSON', icon: '{ }', color: theme.colors.primary.main, active: true },
    { label: 'YAML', icon: '---', color: theme.colors.secondary.main, active: false },
    { label: 'Markdown', icon: '# #', color: theme.colors.accent.green, active: false },
    { label: 'XML', icon: '< />', color: theme.colors.accent.orange, active: false },
  ];

  // Schema fields
  const schemaFields = [
    { name: 'name', type: 'string', required: true, delay: 180 },
    { name: 'age', type: 'number', required: true, delay: 195 },
    { name: 'role', type: 'string', required: true, delay: 210 },
    { name: 'company', type: 'string', required: false, delay: 225 },
    { name: 'email', type: 'string', required: true, delay: 240 },
    { name: 'startDate', type: 'date', required: false, delay: 255 },
  ];

  return (
    <g opacity={opacity}>
      {/* Title */}
      <SectionTitle
        number="07"
        title="Structured Output"
        subtitle="Transform chaos into organized data"
        startFrame={f >= 0 ? 0 : -1}
        y={90}
        color={theme.colors.primary.main}
      />

      {/* Messy text panel - fades out during morph */}
      <g opacity={1 - morphProgress}>
        <rect
          x={260}
          y={220}
          width={680}
          height={240}
          rx={theme.radius.lg}
          fill={theme.colors.bg.secondary}
          stroke={theme.colors.border.medium}
          strokeWidth={1.5}
        />
        <rect
          x={280}
          y={235}
          width={120}
          height={26}
          rx={theme.radius.full}
          fill={theme.colors.accent.redBg}
        />
        <text
          x={340}
          y={254}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={12}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.accent.red}
          letterSpacing={1.5}
        >
          MESSY TEXT
        </text>

        {messyText.map((line, i) => (
          <text
            key={i}
            x={290}
            y={290 + i * 34}
            fontFamily={FONT_FAMILY.body}
            fontSize={theme.fontSize.bodySmall - 2}
            fontWeight={FONT_WEIGHT.regular}
            fill={theme.colors.text.secondary}
            opacity={fadeIn(f, 20 + i * 8, 15)}
          >
            {line}
          </text>
        ))}
      </g>

      {/* Morph arrow */}
      <g opacity={fadeIn(f, 60, 20)}>
        <text
          x={960}
          y={350}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={48}
          fill={theme.colors.primary.main}
          opacity={0.5 + 0.5 * pulse(f, 0.08)}
        >
          →
        </text>
        <text
          x={960}
          y={310}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={theme.fontSize.caption}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.primary.main}
          letterSpacing={2}
        >
          TRANSFORM
        </text>
      </g>

      {/* Structured JSON output panel */}
      <g opacity={fadeIn(f, 50, 30)}>
        <rect
          x={1000}
          y={220}
          width={680}
          height={320}
          rx={theme.radius.lg}
          fill={theme.colors.bg.code}
          stroke={theme.colors.primary.main}
          strokeWidth={2}
          filter={`drop-shadow(0 4px 16px ${theme.colors.primary.glow})`}
        />

        {/* Format tabs */}
        {formats.map((fmt, i) => {
          const tabIn = fadeIn(f, 55 + i * 5, 10);
          return (
            <g key={i} opacity={tabIn}>
              <rect
                x={1020 + i * 140}
                y={228}
                width={120}
                height={32}
                rx={theme.radius.sm}
                fill={fmt.active ? fmt.color : 'transparent'}
                opacity={fmt.active ? 0.2 : 0}
              />
              <text
                x={1080 + i * 140}
                y={250}
                textAnchor="middle"
                fontFamily={FONT_FAMILY.mono}
                fontSize={14}
                fontWeight={FONT_WEIGHT.bold}
                fill={fmt.active ? fmt.color : theme.colors.text.muted}
              >
                {fmt.label}
              </text>
            </g>
          );
        })}

        {/* JSON lines with typing effect */}
        {jsonLines.map((line, i) => {
          const lineIn = fadeIn(f, 70 + i * 10, 12);
          return (
            <text
              key={i}
              x={1040}
              y={295 + i * 34}
              fontFamily={FONT_FAMILY.mono}
              fontSize={26}
              fontWeight={FONT_WEIGHT.medium}
              fill={line.color}
              opacity={lineIn}
            >
              {line.text}
            </text>
          );
        })}

        {/* Syntax highlight flash effect */}
        {jsonLines.map((line, i) => {
          const highlightPhase = interpolate(f, [70 + i * 10, 80 + i * 10], [0.3, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          return highlightPhase > 0 ? (
            <rect
              key={`hl-${i}`}
              x={1030}
              y={278 + i * 30}
              width={630}
              height={26}
              rx={4}
              fill={theme.colors.primary.main}
              opacity={highlightPhase}
            />
          ) : null;
        })}
      </g>

      {/* Schema template below */}
      <g opacity={fadeIn(f, 170, 25)}>
        <text
          x={960}
          y={600}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={theme.fontSize.label}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.text.muted}
          letterSpacing={3}
        >
          SCHEMA DEFINITION
        </text>

        {/* Schema field cards */}
        {schemaFields.map((field, i) => {
          const fieldIn = springIn(f, fps, field.delay, SPRING_BOUNCY);
          const col = i % 3;
          const row = Math.floor(i / 3);
          const fieldX = 260 + col * 500;
          const fieldY = 630 + row * 70;

          return (
            <g key={i} opacity={fieldIn}>
              <rect
                x={fieldX}
                y={fieldY}
                width={450}
                height={55}
                rx={theme.radius.md}
                fill={theme.colors.bg.card}
                stroke={theme.colors.border.light}
                strokeWidth={1.5}
              />

              {/* Field name */}
              <text
                x={fieldX + 20}
                y={fieldY + 34}
                fontFamily={FONT_FAMILY.mono}
                fontSize={20}
                fontWeight={FONT_WEIGHT.bold}
                fill={theme.colors.text.primary}
              >
                {field.name}
              </text>

              {/* Type badge */}
              <rect
                x={fieldX + 180}
                y={fieldY + 14}
                width={80}
                height={28}
                rx={theme.radius.full}
                fill={theme.colors.secondary.bg}
              />
              <text
                x={fieldX + 220}
                y={fieldY + 33}
                textAnchor="middle"
                fontFamily={FONT_FAMILY.mono}
                fontSize={14}
                fontWeight={FONT_WEIGHT.semibold}
                fill={theme.colors.secondary.main}
              >
                {field.type}
              </text>

              {/* Required badge */}
              {field.required && (
                <g>
                  <rect
                    x={fieldX + 280}
                    y={fieldY + 14}
                    width={90}
                    height={28}
                    rx={theme.radius.full}
                    fill={theme.colors.accent.redBg}
                  />
                  <text
                    x={fieldX + 325}
                    y={fieldY + 33}
                    textAnchor="middle"
                    fontFamily={FONT_FAMILY.display}
                    fontSize={12}
                    fontWeight={FONT_WEIGHT.bold}
                    fill={theme.colors.accent.red}
                    letterSpacing={1}
                  >
                    REQUIRED
                  </text>
                </g>
              )}

              {/* Check icon */}
              <circle
                cx={fieldX + 420}
                cy={fieldY + 28}
                r={14}
                fill={theme.colors.accent.greenBg}
              />
              <text
                x={fieldX + 420}
                y={fieldY + 34}
                textAnchor="middle"
                fontSize={14}
                fill={theme.colors.accent.green}
              >
                ✓
              </text>
            </g>
          );
        })}
      </g>

      {/* Prompt tip */}
      <g opacity={fadeIn(f, 280, 20)}>
        <rect
          x={200}
          y={810}
          width={1520}
          height={60}
          rx={theme.radius.lg}
          fill={theme.colors.primary.bg}
          stroke={theme.colors.border.purple}
          strokeWidth={1}
        />
        <text
          x={960}
          y={848}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.body}
          fontSize={theme.fontSize.bodySmall - 2}
          fontWeight={FONT_WEIGHT.medium}
          fill={theme.colors.primary.main}
        >
          🎯 &quot;Return the result as JSON with this exact schema: name (string), age (number), ...&quot;
        </text>
      </g>
    </g>
  );
};
