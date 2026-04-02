import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import { springIn, typewriter, SPRING_SMOOTH } from '../design/animations';

interface CodeLine {
  text: string;
  indent?: number;
  type?: 'keyword' | 'string' | 'comment' | 'function' | 'number' | 'plain' | 'bracket';
}

interface AnimatedCodeEditorProps {
  lines: CodeLine[];
  title?: string;
  startFrame?: number;
  typingSpeed?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  showLineNumbers?: boolean;
  accentColor?: string;
}

const getColor = (type: CodeLine['type']): string => {
  switch (type) {
    case 'keyword': return theme.colors.text.codeKeyword;
    case 'string': return theme.colors.text.codeString;
    case 'comment': return theme.colors.text.codeComment;
    case 'function': return theme.colors.text.codeFunction;
    case 'number': return theme.colors.text.codeNumber;
    case 'bracket': return '#F9A8D4';
    default: return theme.colors.text.code;
  }
};

export const AnimatedCodeEditor: React.FC<AnimatedCodeEditorProps> = ({
  lines,
  title = 'code.ts',
  startFrame = 0,
  typingSpeed = 1.2,
  width = 800,
  height = 450,
  x = 0,
  y = 0,
  showLineNumbers = true,
  accentColor = theme.colors.primary.main,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;
  if (f < 0) return null;

  const editorIn = springIn(f, fps, 0, SPRING_SMOOTH);
  const titleBarH = 44;
  const lineH = 36;
  const padX = 24;
  const padY = 16;
  const lineNumW = showLineNumbers ? 50 : 0;

  // Calculate total characters for typing animation
  const allText = lines.map(l => l.text).join('\n');
  const totalChars = typewriter(f, 8, allText, typingSpeed);

  let charCount = 0;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      opacity={editorIn}
      style={{ transform: `scale(${0.85 + 0.15 * editorIn})` }}
    >
      {/* Editor shadow */}
      <rect
        x={4}
        y={4}
        width={width}
        height={height}
        rx={theme.radius.lg}
        fill="rgba(0,0,0,0.15)"
        filter="blur(12px)"
      />

      {/* Editor body */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={theme.radius.lg}
        fill={theme.colors.bg.code}
      />

      {/* Title bar */}
      <rect
        x={0}
        y={0}
        width={width}
        height={titleBarH}
        rx={theme.radius.lg}
        fill={theme.colors.bg.codeLight}
      />
      <rect
        x={0}
        y={titleBarH - 12}
        width={width}
        height={12}
        fill={theme.colors.bg.codeLight}
      />

      {/* Traffic lights */}
      <circle cx={20} cy={titleBarH / 2} r={7} fill="#FF5F57" />
      <circle cx={42} cy={titleBarH / 2} r={7} fill="#FEBC2E" />
      <circle cx={64} cy={titleBarH / 2} r={7} fill="#28C840" />

      {/* Title */}
      <text
        x={width / 2}
        y={titleBarH / 2 + 5}
        textAnchor="middle"
        fontFamily={FONT_FAMILY.mono}
        fontSize={16}
        fontWeight={FONT_WEIGHT.medium}
        fill={theme.colors.text.muted}
      >
        {title}
      </text>

      {/* Accent line */}
      <rect
        x={0}
        y={titleBarH}
        width={width * editorIn}
        height={2}
        fill={accentColor}
      />

      {/* Code lines */}
      {lines.map((line, i) => {
        const lineStart = charCount;
        charCount += line.text.length + 1;
        const visibleChars = Math.max(0, totalChars - lineStart);
        const displayText = line.text.substring(0, Math.min(visibleChars, line.text.length));
        const indent = (line.indent || 0) * 24;
        const lineY = titleBarH + padY + i * lineH + lineH / 2;
        const isVisible = totalChars > lineStart;

        if (!isVisible) return null;

        return (
          <g key={i}>
            {/* Line number */}
            {showLineNumbers && (
              <text
                x={padX}
                y={lineY + 6}
                fontFamily={FONT_FAMILY.mono}
                fontSize={theme.fontSize.caption}
                fontWeight={FONT_WEIGHT.regular}
                fill={theme.colors.text.codeComment}
                textAnchor="end"
              >
                {i + 1}
              </text>
            )}

            {/* Code text */}
            <text
              x={padX + lineNumW + indent}
              y={lineY + 6}
              fontFamily={FONT_FAMILY.mono}
              fontSize={theme.fontSize.code}
              fontWeight={FONT_WEIGHT.medium}
              fill={getColor(line.type)}
            >
              {displayText}
            </text>

            {/* Cursor */}
            {visibleChars > 0 && visibleChars <= line.text.length && (
              <rect
                x={padX + lineNumW + indent + displayText.length * 16.8}
                y={lineY - 12}
                width={2}
                height={24}
                fill={accentColor}
                opacity={Math.sin(f * 0.15) > 0 ? 1 : 0}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};
