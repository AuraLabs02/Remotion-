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
import { MetricCard } from '../components/MetricCard';

const SCENE_START = 3720;
const SCENE_END = 4200;

export const S09_AdvancedPatterns: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - SCENE_START;
  const opacity = sceneOpacity(frame, SCENE_START, SCENE_END);
  if (opacity <= 0) return null;

  // Dashboard panels
  const panels = [
    {
      title: 'Tool Use',
      icon: '🔧',
      color: theme.colors.primary.main,
      desc: 'Let Claude call functions, read files, run commands',
      items: ['read_file()', 'write_file()', 'bash()', 'search()'],
      delay: 25,
    },
    {
      title: 'Context Window',
      icon: '📊',
      color: theme.colors.secondary.main,
      desc: 'Manage your 200K token budget wisely',
      items: ['Prioritize recent', 'Summarize old', 'Chunk large files'],
      delay: 60,
    },
    {
      title: 'Multi-Turn Strategy',
      icon: '🔄',
      color: theme.colors.accent.green,
      desc: 'Build complex solutions across conversations',
      items: ['Plan first', 'Execute steps', 'Review & iterate'],
      delay: 95,
    },
  ];

  // Token meter animation
  const tokenProgress = interpolate(f, [60, 160], [0, 78], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Context window segments
  const segments = [
    { label: 'System', color: theme.colors.primary.main, width: 15 },
    { label: 'History', color: theme.colors.secondary.main, width: 25 },
    { label: 'Files', color: theme.colors.accent.green, width: 20 },
    { label: 'Tools', color: theme.colors.accent.orange, width: 18 },
    { label: 'Free', color: theme.colors.border.light, width: 22 },
  ];

  // Active panel
  const activePanel = Math.min(2, Math.floor(interpolate(f, [25, 180], [0, 3], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })));

  return (
    <g opacity={opacity}>
      {/* Title */}
      <SectionTitle
        number="08"
        title="Advanced Patterns"
        subtitle="Power techniques for expert prompt engineers"
        startFrame={f >= 0 ? 0 : -1}
        y={90}
        color={theme.colors.secondary.main}
      />

      {/* Three dashboard panels */}
      {panels.map((panel, i) => {
        const panelIn = springIn(f, fps, panel.delay, SPRING_BOUNCY);
        const isActive = i === activePanel;
        const panelX = 80 + i * 600;
        const panelY = 210;
        const panelW = 560;
        const panelH = 340;
        const floatY = float(f, 3, 0.025, i);

        return (
          <g key={i} opacity={panelIn}>
            {/* Panel card */}
            <rect
              x={panelX}
              y={panelY + floatY}
              width={panelW}
              height={panelH}
              rx={theme.radius.xl}
              fill={theme.colors.bg.card}
              stroke={isActive ? panel.color : theme.colors.border.light}
              strokeWidth={isActive ? 3 : 1.5}
              filter={isActive
                ? `drop-shadow(0 8px 24px ${panel.color}20)`
                : `drop-shadow(${theme.shadow.sm})`
              }
            />

            {/* Active glow */}
            {isActive && (
              <rect
                x={panelX}
                y={panelY + floatY}
                width={panelW}
                height={panelH}
                rx={theme.radius.xl}
                fill={panel.color}
                opacity={0.03}
              />
            )}

            {/* Top accent */}
            <rect
              x={panelX}
              y={panelY + floatY}
              width={panelW * panelIn}
              height={4}
              rx={2}
              fill={panel.color}
            />

            {/* Icon & Title */}
            <text
              x={panelX + 28}
              y={panelY + 50 + floatY}
              fontSize={36}
            >
              {panel.icon}
            </text>
            <text
              x={panelX + 78}
              y={panelY + 52 + floatY}
              fontFamily={FONT_FAMILY.display}
              fontSize={theme.fontSize.body}
              fontWeight={FONT_WEIGHT.extrabold}
              fill={theme.colors.text.primary}
            >
              {panel.title}
            </text>

            {/* Description */}
            <text
              x={panelX + 28}
              y={panelY + 88 + floatY}
              fontFamily={FONT_FAMILY.body}
              fontSize={theme.fontSize.caption}
              fontWeight={FONT_WEIGHT.medium}
              fill={theme.colors.text.muted}
            >
              {panel.desc}
            </text>

            {/* Divider */}
            <line
              x1={panelX + 20}
              y1={panelY + 105 + floatY}
              x2={panelX + panelW - 20}
              y2={panelY + 105 + floatY}
              stroke={theme.colors.border.light}
              strokeWidth={1}
            />

            {/* Items */}
            {panel.items.map((item, j) => {
              const itemIn = fadeIn(f, panel.delay + 15 + j * 10, 12);
              return (
                <g key={j} opacity={itemIn}>
                  <circle
                    cx={panelX + 40}
                    cy={panelY + 130 + j * 42 + floatY}
                    r={5}
                    fill={panel.color}
                    opacity={0.6}
                  />
                  <text
                    x={panelX + 58}
                    y={panelY + 136 + j * 42 + floatY}
                    fontFamily={FONT_FAMILY.mono}
                    fontSize={theme.fontSize.caption - 2}
                    fontWeight={FONT_WEIGHT.semibold}
                    fill={theme.colors.text.secondary}
                  >
                    {item}
                  </text>
                </g>
              );
            })}

            {/* Active indicator pulse */}
            {isActive && (
              <circle
                cx={panelX + panelW - 30}
                cy={panelY + 30 + floatY}
                r={8}
                fill={panel.color}
                opacity={0.4 + 0.4 * pulse(f, 0.08)}
              />
            )}
          </g>
        );
      })}

      {/* Context window bar at bottom */}
      <g opacity={fadeIn(f, 130, 25)}>
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
          CONTEXT WINDOW ALLOCATION
        </text>

        {/* Background bar */}
        <rect
          x={200}
          y={625}
          width={1520}
          height={50}
          rx={theme.radius.md}
          fill={theme.colors.bg.secondary}
          stroke={theme.colors.border.light}
          strokeWidth={1}
        />

        {/* Segments */}
        {(() => {
          let offsetX = 200;
          return segments.map((seg, i) => {
            const segIn = fadeIn(f, 140 + i * 12, 15);
            const segWidth = (seg.width / 100) * 1520;
            const x = offsetX;
            offsetX += segWidth;

            return (
              <g key={i} opacity={segIn}>
                <rect
                  x={x + 1}
                  y={626}
                  width={segWidth * easeOutExpo(segIn) - 2}
                  height={48}
                  rx={i === 0 ? theme.radius.md : 0}
                  fill={seg.color}
                  opacity={0.2}
                />
                <rect
                  x={x + 1}
                  y={626}
                  width={segWidth * easeOutExpo(segIn) - 2}
                  height={48}
                  rx={i === 0 ? theme.radius.md : 0}
                  fill={seg.color}
                  opacity={0.08}
                />
                <text
                  x={x + segWidth / 2}
                  y={655}
                  textAnchor="middle"
                  fontFamily={FONT_FAMILY.display}
                  fontSize={15}
                  fontWeight={FONT_WEIGHT.bold}
                  fill={seg.color}
                >
                  {seg.label} ({seg.width}%)
                </text>
              </g>
            );
          });
        })()}
      </g>

      {/* Metrics row */}
      <MetricCard
        value={200}
        suffix="K"
        label="Context Window"
        icon="📐"
        startFrame={180}
        x={200}
        y={720}
        width={340}
        color={theme.colors.primary.main}
      />
      <MetricCard
        value={3.5}
        suffix="x"
        label="Efficiency Gain"
        icon="⚡"
        startFrame={195}
        x={600}
        y={720}
        width={340}
        color={theme.colors.accent.green}
        decimals={1}
      />
      <MetricCard
        value={85}
        suffix="%"
        label="First-Try Success"
        icon="🎯"
        startFrame={210}
        x={1000}
        y={720}
        width={340}
        color={theme.colors.secondary.main}
      />

      {/* Token budget ring */}
      <ProgressRing
        value={tokenProgress}
        label="Token Usage"
        sublabel="efficient allocation"
        startFrame={60}
        x={1560}
        y={810}
        size={140}
        color={theme.colors.primary.main}
      />
    </g>
  );
};
