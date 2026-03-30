import React from 'react';

interface GlowTextProps {
  text: string;
  fontSize: number;
  color: string;
  glowColor: string;
  x: number;
  y: number;
  opacity?: number;
  fontWeight?: string;
  letterSpacing?: number;
  textAnchor?: 'start' | 'middle' | 'end';
  pulse?: boolean;
  frame?: number;
}

export const GlowText: React.FC<GlowTextProps> = ({
  text,
  fontSize,
  color,
  glowColor,
  x,
  y,
  opacity = 1,
  fontWeight = '700',
  letterSpacing = 2,
  textAnchor = 'middle',
  pulse = false,
  frame = 0,
}) => {
  const glowSize = pulse ? 8 + 4 * Math.sin(frame * 0.08) : 8;
  const glowSize2 = pulse ? 20 + 8 * Math.sin(frame * 0.08) : 20;

  return (
    <g opacity={opacity}>
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        fontSize={fontSize}
        fontFamily="'Arial Black', 'Impact', sans-serif"
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        fill={glowColor}
        filter="url(#strong-glow)"
        opacity={0.6}
      >
        {text}
      </text>
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        fontSize={fontSize}
        fontFamily="'Arial Black', 'Impact', sans-serif"
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        fill={color}
        style={{
          filter: `drop-shadow(0 0 ${glowSize}px ${glowColor}) drop-shadow(0 0 ${glowSize2}px ${glowColor})`,
        }}
      >
        {text}
      </text>
    </g>
  );
};
