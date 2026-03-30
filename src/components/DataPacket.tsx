import React from 'react';

interface DataPacketProps {
  progress: number; // 0 to 1
  path: {x1: number; y1: number; x2: number; y2: number};
  color: string;
  label?: string;
  size?: number;
}

export const DataPacket: React.FC<DataPacketProps> = ({
  progress,
  path,
  color,
  label,
  size = 12,
}) => {
  const x = path.x1 + (path.x2 - path.x1) * progress;
  const y = path.y1 + (path.y2 - path.y1) * progress;

  if (progress <= 0 || progress >= 1) return null;

  return (
    <g>
      {/* Glow trail */}
      <circle cx={x} cy={y} r={size * 2} fill={color} opacity={0.15} />
      <circle cx={x} cy={y} r={size * 1.4} fill={color} opacity={0.25} />
      {/* Main packet */}
      <rect
        x={x - size}
        y={y - size * 0.6}
        width={size * 2}
        height={size * 1.2}
        rx={size * 0.3}
        fill={color}
        opacity={0.9}
      />
      {/* Inner shine */}
      <rect
        x={x - size * 0.7}
        y={y - size * 0.45}
        width={size * 1.4}
        height={size * 0.3}
        rx={size * 0.15}
        fill="rgba(255,255,255,0.5)"
      />
      {label && (
        <text
          x={x}
          y={y - size * 1.8}
          textAnchor="middle"
          fontSize={11}
          fill={color}
          fontFamily="'Courier New', monospace"
          fontWeight="bold"
          opacity={0.9}
        >
          {label}
        </text>
      )}
    </g>
  );
};
