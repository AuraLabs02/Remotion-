import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import { springIn, fadeIn, easeOutExpo, SPRING_SMOOTH } from '../design/animations';

interface SectionTitleProps {
  number?: string;
  title: string;
  subtitle?: string;
  startFrame?: number;
  x?: number;
  y?: number;
  align?: 'left' | 'center';
  color?: string;
  size?: 'large' | 'medium';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  number,
  title,
  subtitle,
  startFrame = 0,
  x = 960,
  y = 120,
  align = 'center',
  color = theme.colors.primary.main,
  size = 'large',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;
  if (f < 0) return null;

  const titleIn = springIn(f, fps, 0, SPRING_SMOOTH);
  const subtitleIn = fadeIn(f, 15, 20);
  const underlineIn = fadeIn(f, 8, 25);
  const textAnchor = align === 'center' ? 'middle' : 'start';
  const fontSize = size === 'large' ? theme.fontSize.h1 : theme.fontSize.h2;

  return (
    <g>
      {/* Scene number badge */}
      {number && (
        <g opacity={springIn(f, fps, 0, SPRING_SMOOTH)}>
          <rect
            x={align === 'center' ? x - 28 : x}
            y={y - 55}
            width={56}
            height={32}
            rx={theme.radius.full}
            fill={color}
          />
          <text
            x={align === 'center' ? x : x + 28}
            y={y - 33}
            textAnchor="middle"
            fontFamily={FONT_FAMILY.display}
            fontSize={16}
            fontWeight={FONT_WEIGHT.bold}
            fill={theme.colors.text.inverse}
            letterSpacing={2}
          >
            {number}
          </text>
        </g>
      )}

      {/* Title */}
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        fontFamily={FONT_FAMILY.display}
        fontSize={fontSize}
        fontWeight={FONT_WEIGHT.black}
        fill={theme.colors.text.primary}
        opacity={titleIn}
      >
        {title}
      </text>

      {/* Underline */}
      <rect
        x={align === 'center' ? x - 50 : x}
        y={y + 14}
        width={100 * easeOutExpo(underlineIn)}
        height={4}
        rx={2}
        fill={color}
      />

      {/* Subtitle */}
      {subtitle && (
        <text
          x={x}
          y={y + 52}
          textAnchor={textAnchor}
          fontFamily={FONT_FAMILY.body}
          fontSize={theme.fontSize.body}
          fontWeight={FONT_WEIGHT.medium}
          fill={theme.colors.text.secondary}
          opacity={subtitleIn}
        >
          {subtitle}
        </text>
      )}
    </g>
  );
};
