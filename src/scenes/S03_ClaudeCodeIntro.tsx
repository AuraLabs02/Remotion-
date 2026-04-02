import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import {
  springIn, fadeIn, float, pulse, typewriter,
  SPRING_BOUNCY, SPRING_SMOOTH, easeOutExpo, sceneOpacity,
} from '../design/animations';
import { SectionTitle } from '../components/SectionTitle';

const SCENE_START = 870;
const SCENE_END = 1350;

export const S03_ClaudeCodeIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - SCENE_START;
  const opacity = sceneOpacity(frame, SCENE_START, SCENE_END);
  if (opacity <= 0) return null;

  // Terminal typing animation
  const termLines = [
    { text: '$ claude', delay: 20, color: theme.colors.accent.green },
    { text: '> Help me refactor this React component', delay: 50, color: theme.colors.text.code },
    { text: '', delay: 75, color: '' },
    { text: '  Claude is analyzing your codebase...', delay: 80, color: theme.colors.primary.light },
    { text: '  Found 3 files to update', delay: 110, color: theme.colors.accent.cyanLight },
    { text: '  ✓ Refactoring complete', delay: 140, color: theme.colors.accent.greenLight },
  ];

  // Feature cards
  const features = [
    { icon: '⚡', title: 'Code Generation', desc: 'Write code from natural language', color: theme.colors.primary.main },
    { icon: '🔍', title: 'Debug & Fix', desc: 'Find and resolve bugs instantly', color: theme.colors.secondary.main },
    { icon: '🔄', title: 'Refactor', desc: 'Improve code quality and structure', color: theme.colors.accent.green },
    { icon: '📖', title: 'Explain', desc: 'Understand complex codebases', color: theme.colors.accent.orange },
  ];

  // Architecture flow
  const archNodes = [
    { label: 'YOU', x: 260, y: 750, color: theme.colors.secondary.main, icon: '👤' },
    { label: 'CLAUDE CODE', x: 660, y: 750, color: theme.colors.primary.main, icon: '💻' },
    { label: 'CLAUDE API', x: 1060, y: 750, color: theme.colors.primary.dark, icon: '🧠' },
    { label: 'RESPONSE', x: 1460, y: 750, color: theme.colors.accent.green, icon: '✨' },
  ];

  return (
    <g opacity={opacity}>
      {/* Title */}
      <SectionTitle
        number="02"
        title="Meet Claude Code"
        subtitle="Your AI-powered coding companion"
        startFrame={f >= 0 ? 0 : -1}
        y={100}
        color={theme.colors.secondary.main}
      />

      {/* Terminal mockup */}
      <g opacity={springIn(f, fps, 15, SPRING_SMOOTH)} transform={`translate(0, ${(1 - springIn(f, fps, 15, SPRING_SMOOTH)) * 30})`}>
        {/* Terminal shadow */}
        <rect
          x={284}
          y={204}
          width={900}
          height={380}
          rx={theme.radius.lg}
          fill="rgba(0,0,0,0.12)"
          filter="blur(16px)"
        />

        {/* Terminal body */}
        <rect
          x={280}
          y={200}
          width={900}
          height={380}
          rx={theme.radius.lg}
          fill={theme.colors.bg.code}
        />

        {/* Terminal title bar */}
        <rect
          x={280}
          y={200}
          width={900}
          height={44}
          rx={theme.radius.lg}
          fill={theme.colors.bg.codeLight}
        />
        <rect
          x={280}
          y={232}
          width={900}
          height={12}
          fill={theme.colors.bg.codeLight}
        />

        {/* Traffic lights */}
        <circle cx={305} cy={222} r={7} fill="#FF5F57" />
        <circle cx={327} cy={222} r={7} fill="#FEBC2E" />
        <circle cx={349} cy={222} r={7} fill="#28C840" />

        <text
          x={730}
          y={228}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.mono}
          fontSize={14}
          fontWeight={FONT_WEIGHT.medium}
          fill={theme.colors.text.muted}
        >
          Terminal — claude
        </text>

        {/* Accent line */}
        <rect
          x={280}
          y={244}
          width={900 * springIn(f, fps, 15, SPRING_SMOOTH)}
          height={2}
          fill={theme.colors.primary.main}
        />

        {/* Terminal lines */}
        {termLines.map((line, i) => {
          const lineChars = typewriter(f, line.delay, line.text, 2);
          const displayText = line.text.substring(0, lineChars);

          return (
            <g key={i}>
              <text
                x={310}
                y={280 + i * 36}
                fontFamily={FONT_FAMILY.mono}
                fontSize={22}
                fontWeight={FONT_WEIGHT.medium}
                fill={line.color}
              >
                {displayText}
              </text>

              {/* Cursor on active line */}
              {lineChars > 0 && lineChars < line.text.length && (
                <rect
                  x={310 + lineChars * 13.2}
                  y={262 + i * 36}
                  width={2}
                  height={22}
                  fill={theme.colors.accent.green}
                  opacity={Math.sin(f * 0.15) > 0 ? 1 : 0}
                />
              )}
            </g>
          );
        })}
      </g>

      {/* Feature cards - right side */}
      {features.map((feat, i) => {
        const cardIn = springIn(f, fps, 30 + i * 12, SPRING_BOUNCY);
        const floatY = float(f, 3, 0.03, i * 1.5);
        const cardY = 230 + i * 95;

        return (
          <g key={i} opacity={cardIn} transform={`translate(${(1 - cardIn) * 40}, ${floatY})`}>
            <rect
              x={1260}
              y={cardY}
              width={540}
              height={80}
              rx={theme.radius.md}
              fill={theme.colors.bg.card}
              stroke={feat.color}
              strokeWidth={2}
              filter={`drop-shadow(0 2px 8px ${feat.color}20)`}
            />

            {/* Color accent */}
            <rect
              x={1260}
              y={cardY}
              width={6}
              height={80}
              rx={3}
              fill={feat.color}
            />

            <text x={1290} y={cardY + 38} fontSize={28}>{feat.icon}</text>

            <text
              x={1330}
              y={cardY + 33}
              fontFamily={FONT_FAMILY.display}
              fontSize={theme.fontSize.label}
              fontWeight={FONT_WEIGHT.bold}
              fill={theme.colors.text.primary}
            >
              {feat.title}
            </text>

            <text
              x={1330}
              y={cardY + 58}
              fontFamily={FONT_FAMILY.body}
              fontSize={theme.fontSize.caption}
              fontWeight={FONT_WEIGHT.medium}
              fill={theme.colors.text.muted}
            >
              {feat.desc}
            </text>
          </g>
        );
      })}

      {/* Architecture flow at bottom */}
      <g opacity={fadeIn(f, 100, 25)}>
        {/* Section label */}
        <text
          x={960}
          y={690}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={theme.fontSize.label}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.text.muted}
          letterSpacing={3}
        >
          HOW IT WORKS
        </text>

        {archNodes.map((node, i) => {
          const nodeIn = springIn(f - 100, fps, i * 12, SPRING_BOUNCY);
          const floatY = float(f, 3, 0.025, i);

          return (
            <g key={i} opacity={nodeIn}>
              {/* Node */}
              <rect
                x={node.x - 80}
                y={node.y - 45 + floatY}
                width={160}
                height={90}
                rx={theme.radius.lg}
                fill={theme.colors.bg.card}
                stroke={node.color}
                strokeWidth={2.5}
                filter={`drop-shadow(0 4px 12px ${node.color}25)`}
              />

              <text
                x={node.x}
                y={node.y - 10 + floatY}
                textAnchor="middle"
                fontSize={28}
              >
                {node.icon}
              </text>

              <text
                x={node.x}
                y={node.y + 28 + floatY}
                textAnchor="middle"
                fontFamily={FONT_FAMILY.display}
                fontSize={16}
                fontWeight={FONT_WEIGHT.bold}
                fill={node.color}
                letterSpacing={1.5}
              >
                {node.label}
              </text>

              {/* Arrow */}
              {i < archNodes.length - 1 && (
                <g opacity={fadeIn(f - 100, (i + 1) * 12 + 8, 12)}>
                  <line
                    x1={node.x + 85}
                    y1={node.y + floatY}
                    x2={archNodes[i + 1].x - 85}
                    y2={archNodes[i + 1].y + float(f, 3, 0.025, i + 1)}
                    stroke={theme.colors.border.medium}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                  />
                  <polygon
                    points={`${archNodes[i + 1].x - 88},${archNodes[i + 1].y + float(f, 3, 0.025, i + 1)} ${archNodes[i + 1].x - 98},${archNodes[i + 1].y - 6 + float(f, 3, 0.025, i + 1)} ${archNodes[i + 1].x - 98},${archNodes[i + 1].y + 6 + float(f, 3, 0.025, i + 1)}`}
                    fill={theme.colors.border.medium}
                  />

                  {/* Traveling dot */}
                  {(() => {
                    const dotT = ((f * 0.02 + i * 0.33) % 1);
                    const x1 = node.x + 85;
                    const x2 = archNodes[i + 1].x - 88;
                    return (
                      <circle
                        cx={x1 + (x2 - x1) * dotT}
                        cy={node.y}
                        r={4}
                        fill={node.color}
                        opacity={0.7}
                      />
                    );
                  })()}
                </g>
              )}
            </g>
          );
        })}
      </g>
    </g>
  );
};
