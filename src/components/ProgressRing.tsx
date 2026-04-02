import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import { springIn, easeOutExpo, fadeIn, SPRING_BOUNCY } from '../design/animations';

interface ProgressRingProps {
  value: number; // 0-100
  label?: string;
  sublabel?: string;
  startFrame?: number;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  label,
  sublabel,
  startFrame = 0,
  x = 0,
  y = 0,
  size = 140,
  color = theme.colors.primary.main,
  strokeWidth = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;
  if (f < 0) return null;

  const ringIn = springIn(f, fps, 0, SPRING_BOUNCY);
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const animProgress = easeOutExpo(Math.min(1, f / 50));
  const currentValue = Math.round(value * animProgress);
  const dashOffset = circumference * (1 - (value / 100) * animProgress);

  return (
    <g transform={`translate(${x}, ${y})`} opacity={ringIn}>
      {/* Background ring */}
      <circle
        r={radius}
        fill="none"
        stroke={theme.colors.border.light}
        strokeWidth={strokeWidth}
      />

      {/* Glow */}
      <circle
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + 8}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        opacity={0.15}
        transform="rotate(-90)"
      />

      {/* Progress ring */}
      <circle
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform="rotate(-90)"
      />

      {/* Center value */}
      <text
        y={label ? -8 : 12}
        textAnchor="middle"
        fontFamily={FONT_FAMILY.display}
        fontSize={size * 0.3}
        fontWeight={FONT_WEIGHT.black}
        fill={theme.colors.text.primary}
      >
        {currentValue}%
      </text>

      {/* Label */}
      {label && (
        <text
          y={size * 0.18}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.body}
          fontSize={theme.fontSize.caption}
          fontWeight={FONT_WEIGHT.semibold}
          fill={theme.colors.text.secondary}
        >
          {label}
        </text>
      )}

      {/* Sublabel */}
      {sublabel && (
        <text
          y={size * 0.32}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.body}
          fontSize={theme.fontSize.caption - 4}
          fontWeight={FONT_WEIGHT.medium}
          fill={theme.colors.text.muted}
        >
          {sublabel}
        </text>
      )}
    </g>
  );
};
