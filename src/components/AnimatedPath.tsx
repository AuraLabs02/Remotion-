import React from 'react';
import {useCurrentFrame} from 'remotion';
import {drawPath, easeOutExpo} from '../utils';

interface AnimatedPathProps {
  d: string;
  totalLength: number;
  startFrame: number;
  duration: number;
  color: string;
  strokeWidth?: number;
  glowColor?: string;
  glowIntensity?: number;
  easing?: (t: number) => number;
  id?: string;
}

export const AnimatedPath: React.FC<AnimatedPathProps> = ({
  d,
  totalLength,
  startFrame,
  duration,
  color,
  strokeWidth = 2.5,
  glowColor,
  glowIntensity = 0.3,
  easing = easeOutExpo,
  id = 'apath',
}) => {
  const frame = useCurrentFrame();
  const progress = drawPath(frame, startFrame, duration, easing);
  const dashOffset = totalLength * (1 - progress);
  const glow = glowColor || color;

  return (
    <g>
      {/* Glow layer */}
      {progress > 0 && (
        <path
          d={d}
          fill="none"
          stroke={glow}
          strokeWidth={strokeWidth + 6}
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={dashOffset}
          opacity={glowIntensity * progress}
          style={{filter: `blur(6px)`}}
        />
      )}
      {/* Main path */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
      />
      {/* Leading dot */}
      {progress > 0 && progress < 1 && (
        <>
          <circle
            cx={0} cy={0} r={strokeWidth + 4}
            fill={color} opacity={0.15}
            style={{
              offsetPath: `path('${d}')`,
              offsetDistance: `${progress * 100}%`,
            }}
          />
          <circle
            cx={0} cy={0} r={strokeWidth + 1}
            fill={color}
            style={{
              offsetPath: `path('${d}')`,
              offsetDistance: `${progress * 100}%`,
            }}
          />
        </>
      )}
    </g>
  );
};
