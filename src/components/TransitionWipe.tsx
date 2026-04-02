import React from 'react';
import { useCurrentFrame } from 'remotion';
import { theme } from '../design/theme';
import { easeInOutCubic } from '../design/animations';

interface TransitionWipeProps {
  startFrame: number;
  duration?: number;
  color?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  width?: number;
  height?: number;
}

export const TransitionWipe: React.FC<TransitionWipeProps> = ({
  startFrame,
  duration = 20,
  color = theme.colors.primary.main,
  direction = 'right',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();
  const f = frame - startFrame;
  if (f < 0 || f > duration * 2) return null;

  const halfDuration = duration;
  const progress = f <= halfDuration
    ? easeInOutCubic(f / halfDuration)
    : easeInOutCubic(1 - (f - halfDuration) / halfDuration);

  let rectProps: { x: number; y: number; width: number; height: number };

  switch (direction) {
    case 'right':
      rectProps = { x: 0, y: 0, width: width * progress, height };
      break;
    case 'left':
      rectProps = { x: width * (1 - progress), y: 0, width: width * progress, height };
      break;
    case 'down':
      rectProps = { x: 0, y: 0, width, height: height * progress };
      break;
    case 'up':
      rectProps = { x: 0, y: height * (1 - progress), width, height: height * progress };
      break;
  }

  return (
    <rect
      {...rectProps}
      fill={color}
      opacity={0.95}
    />
  );
};
