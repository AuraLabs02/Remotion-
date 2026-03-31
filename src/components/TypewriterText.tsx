import React from 'react';
import {useCurrentFrame} from 'remotion';
import {typewriter} from '../utils';
import {theme} from '../theme';

interface TypewriterTextProps {
  text: string;
  startFrame: number;
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  charsPerFrame?: number;
  showCursor?: boolean;
  fontFamily?: string;
  fontWeight?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame,
  x,
  y,
  fontSize = 18,
  color = theme.text.primary,
  charsPerFrame = 0.8,
  showCursor = true,
  fontFamily = theme.font.mono,
  fontWeight = '500',
}) => {
  const frame = useCurrentFrame();
  const charCount = typewriter(frame, startFrame, text, charsPerFrame);
  const visibleText = text.slice(0, charCount);
  const cursorBlink = Math.sin(frame * 0.15) > 0;
  const isDone = charCount >= text.length;

  // Approximate cursor x position
  const charWidth = fontSize * 0.6;
  const cursorX = x + charCount * charWidth;

  return (
    <g>
      <text
        x={x}
        y={y}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontWeight={fontWeight}
        fill={color}
        dominantBaseline="middle"
      >
        {visibleText}
      </text>
      {showCursor && !isDone && cursorBlink && (
        <rect
          x={cursorX}
          y={y - fontSize * 0.4}
          width={fontSize * 0.08}
          height={fontSize * 0.8}
          fill={color}
          rx={1}
        />
      )}
    </g>
  );
};

// Multi-line typewriter for code blocks
interface TypewriterCodeProps {
  lines: Array<{text: string; color?: string}>;
  startFrame: number;
  x: number;
  y: number;
  fontSize?: number;
  lineHeight?: number;
  charsPerFrame?: number;
  framesBetweenLines?: number;
}

export const TypewriterCode: React.FC<TypewriterCodeProps> = ({
  lines,
  startFrame,
  x,
  y,
  fontSize = 16,
  lineHeight = 28,
  charsPerFrame = 1.2,
  framesBetweenLines = 8,
}) => {
  const frame = useCurrentFrame();

  let currentStart = startFrame;
  return (
    <g>
      {lines.map((line, i) => {
        const lineStart = currentStart;
        const lineFrames = Math.ceil(line.text.length / charsPerFrame);
        currentStart = lineStart + lineFrames + framesBetweenLines;

        const charCount = typewriter(frame, lineStart, line.text, charsPerFrame);
        const visibleText = line.text.slice(0, charCount);
        const cursorBlink = Math.sin(frame * 0.15) > 0;
        const isActive = frame >= lineStart && charCount < line.text.length;
        const charWidth = fontSize * 0.6;
        const cursorX = x + charCount * charWidth;

        return (
          <g key={i}>
            <text
              x={x}
              y={y + i * lineHeight}
              fontSize={fontSize}
              fontFamily={theme.font.mono}
              fontWeight="500"
              fill={line.color || theme.text.code}
              dominantBaseline="middle"
            >
              {visibleText}
            </text>
            {isActive && cursorBlink && (
              <rect
                x={cursorX}
                y={y + i * lineHeight - fontSize * 0.4}
                width={fontSize * 0.08}
                height={fontSize * 0.8}
                fill={theme.accent.blue}
                rx={1}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};
