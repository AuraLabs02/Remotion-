import React from 'react';
import {useCurrentFrame, spring, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {pulse} from '../utils';

interface NetworkNodeProps {
  cx: number;
  cy: number;
  radius?: number;
  color: string;
  icon: string;
  label: string;
  sublabel?: string;
  enterFrame: number;
  showPulse?: boolean;
  isActive?: boolean;
}

export const NetworkNode: React.FC<NetworkNodeProps> = ({
  cx,
  cy,
  radius = 60,
  color,
  icon,
  label,
  sublabel,
  enterFrame,
  showPulse = true,
  isActive = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({
    frame: frame - enterFrame,
    fps,
    config: {damping: 14, stiffness: 120},
  });
  const p = pulse(frame, 0.06, cx * 0.01);

  return (
    <g opacity={scale} transform={`translate(${cx},${cy}) scale(${scale})`}>
      {/* Pulse rings */}
      {showPulse && isActive && (
        <>
          <circle r={radius + 24} fill="none" stroke={color}
            strokeWidth={1.5} opacity={0.08 + 0.06 * p} />
          <circle r={radius + 14} fill="none" stroke={color}
            strokeWidth={2} opacity={0.12 + 0.08 * p} />
        </>
      )}
      {/* Outer glow */}
      <circle r={radius + 6} fill={color} opacity={0.06} />
      {/* Main circle */}
      <circle r={radius} fill="#FFFFFF" stroke={color}
        strokeWidth={isActive ? 3 : 2}
        style={{filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.10))'}} />
      {/* Active indicator */}
      {isActive && (
        <circle cx={radius * 0.65} cy={-radius * 0.65} r={8}
          fill={theme.accent.green} opacity={0.7 + 0.3 * p} />
      )}
      {/* Icon */}
      <text x={0} y={-6} textAnchor="middle" dominantBaseline="middle"
        fontSize={radius * 0.55}>{icon}</text>
      {/* Label */}
      <text x={0} y={radius * 0.55} textAnchor="middle" dominantBaseline="middle"
        fontSize={18} fontFamily={theme.font.body} fontWeight="800"
        fill={color} letterSpacing={2}>{label}</text>
      {/* Sublabel */}
      {sublabel && (
        <text x={0} y={radius + 28} textAnchor="middle"
          fontSize={15} fontFamily={theme.font.body} fontWeight="400"
          fill={theme.text.muted}>{sublabel}</text>
      )}
    </g>
  );
};
