import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import { springIn, typewriter, fadeIn, SPRING_SMOOTH } from '../design/animations';

interface ConversationBubbleProps {
  role: 'user' | 'assistant';
  message: string;
  startFrame?: number;
  x?: number;
  y?: number;
  width?: number;
  typingSpeed?: number;
  showAvatar?: boolean;
}

export const ConversationBubble: React.FC<ConversationBubbleProps> = ({
  role,
  message,
  startFrame = 0,
  x = 0,
  y = 0,
  width = 700,
  typingSpeed = 1.8,
  showAvatar = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;
  if (f < 0) return null;

  const isUser = role === 'user';
  const bubbleIn = springIn(f, fps, 0, SPRING_SMOOTH);
  const visibleChars = typewriter(f, 10, message, typingSpeed);
  const displayText = message.substring(0, visibleChars);

  const avatarSize = 48;
  const padding = 24;
  const bubbleX = isUser ? x : x + avatarSize + 16;
  const avatarX = isUser ? x + width - avatarSize : x;
  const bubbleFill = isUser ? theme.colors.primary.main : theme.colors.bg.secondary;
  const textColor = isUser ? theme.colors.text.inverse : theme.colors.text.primary;
  const bubbleWidth = width - avatarSize - 16;

  // Wrap text into lines
  const maxCharsPerLine = Math.floor(bubbleWidth / 17);
  const words = displayText.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    if ((currentLine + ' ' + word).length > maxCharsPerLine && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    }
  }
  if (currentLine) lines.push(currentLine);

  const lineHeight = 34;
  const bubbleHeight = Math.max(60, lines.length * lineHeight + padding * 2);

  return (
    <g
      opacity={bubbleIn}
      transform={`translate(0, ${(1 - bubbleIn) * 30})`}
    >
      {/* Avatar */}
      {showAvatar && (
        <g>
          <circle
            cx={avatarX + avatarSize / 2}
            cy={y + avatarSize / 2}
            r={avatarSize / 2}
            fill={isUser ? theme.colors.secondary.main : theme.colors.primary.main}
          />
          <text
            x={avatarX + avatarSize / 2}
            y={y + avatarSize / 2 + 8}
            textAnchor="middle"
            fontSize={22}
            fontFamily={FONT_FAMILY.body}
            fontWeight={FONT_WEIGHT.bold}
            fill={theme.colors.text.inverse}
          >
            {isUser ? 'U' : 'C'}
          </text>
        </g>
      )}

      {/* Bubble */}
      <rect
        x={isUser ? bubbleX + avatarSize + 16 : bubbleX}
        y={y}
        width={bubbleWidth}
        height={bubbleHeight}
        rx={theme.radius.lg}
        fill={bubbleFill}
        filter={isUser ? undefined : `drop-shadow(${theme.shadow.sm})`}
        stroke={isUser ? undefined : theme.colors.border.light}
        strokeWidth={isUser ? 0 : 1}
      />

      {/* Text */}
      {lines.map((line, i) => (
        <text
          key={i}
          x={(isUser ? bubbleX + avatarSize + 16 : bubbleX) + padding}
          y={y + padding + i * lineHeight + 22}
          fontFamily={FONT_FAMILY.body}
          fontSize={theme.fontSize.bodySmall}
          fontWeight={FONT_WEIGHT.medium}
          fill={textColor}
        >
          {line}
        </text>
      ))}

      {/* Typing indicator */}
      {visibleChars < message.length && (
        <g>
          {[0, 1, 2].map((dot) => (
            <circle
              key={dot}
              cx={(isUser ? bubbleX + avatarSize + 16 : bubbleX) + padding + dot * 14}
              cy={y + bubbleHeight + 20}
              r={4}
              fill={theme.colors.text.muted}
              opacity={0.3 + 0.7 * Math.sin(f * 0.12 + dot * 1.2)}
            />
          ))}
        </g>
      )}
    </g>
  );
};
