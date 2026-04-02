import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import { springIn, easeOutExpo, SPRING_BOUNCY } from '../design/animations';

interface MetricCardProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon?: string;
  startFrame?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  decimals?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  suffix = '',
  prefix = '',
  label,
  icon,
  startFrame = 0,
  x = 0,
  y = 0,
  width = 280,
  height = 160,
  color = theme.colors.primary.main,
  decimals = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;
  if (f < 0) return null;

  const cardIn = springIn(f, fps, 0, SPRING_BOUNCY);
  const countProgress = easeOutExpo(Math.min(1, f / 45));
  const currentValue = decimals > 0
    ? (value * countProgress).toFixed(decimals)
    : Math.round(value * countProgress).toString();

  return (
    <g
      transform={`translate(${x}, ${y})`}
      opacity={cardIn}
    >
      {/* Card shadow */}
      <rect
        x={3}
        y={3}
        width={width}
        height={height}
        rx={theme.radius.lg}
        fill="rgba(0,0,0,0.06)"
        filter="blur(8px)"
      />

      {/* Card bg */}
      <rect
        width={width}
        height={height}
        rx={theme.radius.lg}
        fill={theme.colors.bg.card}
        stroke={theme.colors.border.light}
        strokeWidth={1.5}
      />

      {/* Accent top bar */}
      <rect
        width={width * cardIn}
        height={4}
        rx={2}
        fill={color}
      />

      {/* Icon */}
      {icon && (
        <text
          x={width / 2}
          y={45}
          textAnchor="middle"
          fontSize={32}
        >
          {icon}
        </text>
      )}

      {/* Value */}
      <text
        x={width / 2}
        y={icon ? 90 : 75}
        textAnchor="middle"
        fontFamily={FONT_FAMILY.display}
        fontSize={theme.fontSize.h2}
        fontWeight={FONT_WEIGHT.black}
        fill={color}
      >
        {prefix}{currentValue}{suffix}
      </text>

      {/* Label */}
      <text
        x={width / 2}
        y={icon ? 125 : 110}
        textAnchor="middle"
        fontFamily={FONT_FAMILY.body}
        fontSize={theme.fontSize.label}
        fontWeight={FONT_WEIGHT.semibold}
        fill={theme.colors.text.secondary}
      >
        {label}
      </text>
    </g>
  );
};
