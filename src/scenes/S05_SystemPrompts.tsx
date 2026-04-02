import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import {
  springIn, fadeIn, float, pulse, typewriter,
  SPRING_BOUNCY, SPRING_SMOOTH, easeOutExpo, sceneOpacity,
} from '../design/animations';
import { SectionTitle } from '../components/SectionTitle';
import { AnimatedCodeEditor } from '../components/AnimatedCodeEditor';

const SCENE_START = 1920;
const SCENE_END = 2400;

export const S05_SystemPrompts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - SCENE_START;
  const opacity = sceneOpacity(frame, SCENE_START, SCENE_END);
  if (opacity <= 0) return null;

  // Layer cake data
  const layers = [
    { label: 'SYSTEM PROMPT', desc: 'Sets persona, rules & behavior', color: theme.colors.primary.main, icon: '⚙️', y: 260 },
    { label: 'USER MESSAGE', desc: 'Your specific request', color: theme.colors.secondary.main, icon: '💬', y: 400 },
    { label: 'ASSISTANT RESPONSE', desc: 'AI generates based on both', color: theme.colors.accent.green, icon: '✨', y: 540 },
  ];

  // System prompt code example
  const codeLines = [
    { text: '{', type: 'bracket' as const, indent: 0 },
    { text: '"system": "You are a senior TypeScript', type: 'string' as const, indent: 1 },
    { text: '  developer. Follow these rules:', type: 'string' as const, indent: 1 },
    { text: '', type: 'plain' as const, indent: 0 },
    { text: '  1. Use strict TypeScript', type: 'string' as const, indent: 1 },
    { text: '  2. Write unit tests', type: 'string' as const, indent: 1 },
    { text: '  3. Handle all edge cases', type: 'string' as const, indent: 1 },
    { text: '  4. Keep functions under 20 lines",', type: 'string' as const, indent: 1 },
    { text: '', type: 'plain' as const, indent: 0 },
    { text: '"model": "claude-sonnet-4-6"', type: 'keyword' as const, indent: 1 },
    { text: '}', type: 'bracket' as const, indent: 0 },
  ];

  // Labels connecting to code
  const annotations = [
    { label: 'PERSONA', color: theme.colors.primary.main, y: 290, lineY: 320, delay: 120 },
    { label: 'RULES', color: theme.colors.accent.orange, y: 370, lineY: 400, delay: 150 },
    { label: 'CONSTRAINTS', color: theme.colors.accent.green, y: 440, lineY: 460, delay: 180 },
  ];

  return (
    <g opacity={opacity}>
      {/* Title */}
      <SectionTitle
        number="04"
        title="System Prompts"
        subtitle="Set the stage for every interaction"
        startFrame={f >= 0 ? 0 : -1}
        y={90}
        color={theme.colors.primary.main}
      />

      {/* Layer cake visualization - left side */}
      <g opacity={fadeIn(f, 20, 20)}>
        <text
          x={320}
          y={220}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={theme.fontSize.label}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.text.muted}
          letterSpacing={3}
        >
          MESSAGE STACK
        </text>

        {layers.map((layer, i) => {
          const layerIn = springIn(f, fps, 30 + i * 20, SPRING_BOUNCY);
          const floatY = float(f, 3, 0.03, i);
          const isActive = Math.floor((f / 80) % 3) === i;

          return (
            <g key={i} opacity={layerIn}>
              {/* Layer card */}
              <rect
                x={80}
                y={layer.y + floatY}
                width={480}
                height={110}
                rx={theme.radius.lg}
                fill={theme.colors.bg.card}
                stroke={layer.color}
                strokeWidth={isActive ? 3 : 2}
                filter={isActive
                  ? `drop-shadow(0 6px 20px ${layer.color}30)`
                  : `drop-shadow(${theme.shadow.sm})`
                }
              />

              {/* Active glow */}
              {isActive && (
                <rect
                  x={80}
                  y={layer.y + floatY}
                  width={480}
                  height={110}
                  rx={theme.radius.lg}
                  fill={layer.color}
                  opacity={0.04}
                />
              )}

              {/* Icon */}
              <text
                x={120}
                y={layer.y + 50 + floatY}
                fontSize={32}
              >
                {layer.icon}
              </text>

              {/* Label */}
              <text
                x={170}
                y={layer.y + 42 + floatY}
                fontFamily={FONT_FAMILY.display}
                fontSize={theme.fontSize.bodySmall}
                fontWeight={FONT_WEIGHT.extrabold}
                fill={layer.color}
                letterSpacing={1}
              >
                {layer.label}
              </text>

              {/* Description */}
              <text
                x={170}
                y={layer.y + 72 + floatY}
                fontFamily={FONT_FAMILY.body}
                fontSize={theme.fontSize.caption}
                fontWeight={FONT_WEIGHT.medium}
                fill={theme.colors.text.muted}
              >
                {layer.desc}
              </text>

              {/* Stack order number */}
              <circle
                cx={530}
                cy={layer.y + 55 + floatY}
                r={18}
                fill={layer.color}
                opacity={0.15}
              />
              <text
                x={530}
                y={layer.y + 61 + floatY}
                textAnchor="middle"
                fontFamily={FONT_FAMILY.display}
                fontSize={18}
                fontWeight={FONT_WEIGHT.bold}
                fill={layer.color}
              >
                {i + 1}
              </text>

              {/* Down arrow between layers */}
              {i < layers.length - 1 && (
                <g opacity={fadeIn(f, 40 + i * 20, 15)}>
                  <line
                    x1={320}
                    y1={layer.y + 110 + floatY}
                    x2={320}
                    y2={layers[i + 1].y + float(f, 3, 0.03, i + 1)}
                    stroke={theme.colors.border.medium}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                  <polygon
                    points={`320,${layers[i + 1].y + float(f, 3, 0.03, i + 1)} 314,${layers[i + 1].y - 8 + float(f, 3, 0.03, i + 1)} 326,${layers[i + 1].y - 8 + float(f, 3, 0.03, i + 1)}`}
                    fill={theme.colors.border.medium}
                  />
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* Code editor - right side, positioned below title */}
      <AnimatedCodeEditor
        lines={codeLines}
        title="system-prompt.json"
        startFrame={40}
        typingSpeed={1}
        width={720}
        height={420}
        x={700}
        y={250}
        accentColor={theme.colors.primary.main}
      />

      {/* Floating annotations pointing to code */}
      {annotations.map((ann, i) => {
        const annIn = fadeIn(f, ann.delay, 15);

        return (
          <g key={i} opacity={annIn}>
            <rect
              x={1460}
              y={ann.y}
              width={150}
              height={34}
              rx={theme.radius.full}
              fill={ann.color}
              opacity={0.12}
            />
            <text
              x={1535}
              y={ann.y + 23}
              textAnchor="middle"
              fontFamily={FONT_FAMILY.display}
              fontSize={14}
              fontWeight={FONT_WEIGHT.bold}
              fill={ann.color}
              letterSpacing={2}
            >
              {ann.label}
            </text>
            <line
              x1={1425}
              y1={ann.lineY}
              x2={1460}
              y2={ann.y + 17}
              stroke={ann.color}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              opacity={0.5}
            />
          </g>
        );
      })}

      {/* Bottom insight */}
      <g opacity={fadeIn(f, 200, 20)}>
        <rect
          x={200}
          y={720}
          width={1520}
          height={70}
          rx={theme.radius.lg}
          fill={theme.colors.primary.bg}
          stroke={theme.colors.border.purple}
          strokeWidth={1.5}
        />
        <text
          x={240}
          y={755}
          fontFamily={FONT_FAMILY.body}
          fontSize={theme.fontSize.bodySmall}
          fontWeight={FONT_WEIGHT.semibold}
          fill={theme.colors.primary.main}
        >
          💡
        </text>
        <text
          x={280}
          y={762}
          fontFamily={FONT_FAMILY.body}
          fontSize={theme.fontSize.bodySmall}
          fontWeight={FONT_WEIGHT.medium}
          fill={theme.colors.text.primary}
        >
          System prompts persist across the entire conversation — set them once, benefit every turn.
        </text>
      </g>
    </g>
  );
};
