import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../design/theme';
import { fadeIn, pulse, float, springIn, SPRING_GENTLE } from '../design/animations';

interface BrainNetworkProps {
  startFrame?: number;
  x?: number;
  y?: number;
  scale?: number;
  activeRegion?: number; // 0-5 which region lights up
  color?: string;
}

// Procedural brain network with interconnected nodes
export const BrainNetwork: React.FC<BrainNetworkProps> = ({
  startFrame = 0,
  x = 960,
  y = 400,
  scale = 1,
  activeRegion = -1,
  color = theme.colors.primary.main,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;
  if (f < 0) return null;

  const mainIn = fadeIn(f, 0, 30);

  // Generate brain-like node positions (organized in regions)
  const regions = [
    // Left hemisphere - frontal
    { cx: -180, cy: -80, nodes: [
      { x: -200, y: -120 }, { x: -160, y: -60 }, { x: -220, y: -30 },
      { x: -180, y: -140 }, { x: -140, y: -100 },
    ]},
    // Right hemisphere - frontal
    { cx: 180, cy: -80, nodes: [
      { x: 200, y: -120 }, { x: 160, y: -60 }, { x: 220, y: -30 },
      { x: 180, y: -140 }, { x: 140, y: -100 },
    ]},
    // Left temporal
    { cx: -240, cy: 60, nodes: [
      { x: -260, y: 40 }, { x: -220, y: 80 }, { x: -250, y: 100 },
      { x: -200, y: 50 },
    ]},
    // Right temporal
    { cx: 240, cy: 60, nodes: [
      { x: 260, y: 40 }, { x: 220, y: 80 }, { x: 250, y: 100 },
      { x: 200, y: 50 },
    ]},
    // Central/Parietal
    { cx: 0, cy: -40, nodes: [
      { x: -40, y: -60 }, { x: 40, y: -60 }, { x: 0, y: -100 },
      { x: -60, y: -20 }, { x: 60, y: -20 }, { x: 0, y: -30 },
    ]},
    // Occipital (back)
    { cx: 0, cy: 120, nodes: [
      { x: -60, y: 120 }, { x: 60, y: 120 }, { x: 0, y: 150 },
      { x: -30, y: 100 }, { x: 30, y: 100 },
    ]},
  ];

  // Generate connections between nearby nodes
  const allNodes = regions.flatMap((r, ri) =>
    r.nodes.map((n, ni) => ({ ...n, region: ri, id: `${ri}-${ni}` }))
  );

  const connections: Array<{ from: number; to: number }> = [];
  for (let i = 0; i < allNodes.length; i++) {
    for (let j = i + 1; j < allNodes.length; j++) {
      const dx = allNodes[i].x - allNodes[j].x;
      const dy = allNodes[i].y - allNodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        connections.push({ from: i, to: j });
      }
    }
  }

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={mainIn}>
      {/* Outer brain glow */}
      <ellipse
        cx={0}
        cy={20}
        rx={300}
        ry={200}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity={0.1 + 0.05 * pulse(f)}
        strokeDasharray="8 6"
      />

      {/* Connections */}
      {connections.map((conn, i) => {
        const a = allNodes[conn.from];
        const b = allNodes[conn.to];
        const isActive =
          activeRegion >= 0 &&
          (a.region === activeRegion || b.region === activeRegion);
        const connIn = fadeIn(f, 5 + i * 0.5, 15);
        const connPulse = isActive ? 0.6 + 0.4 * pulse(f, 0.08, i) : 0.15;

        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={isActive ? color : theme.colors.border.medium}
            strokeWidth={isActive ? 2.5 : 1}
            opacity={connIn * connPulse}
          />
        );
      })}

      {/* Nodes */}
      {allNodes.map((node, i) => {
        const isActive = activeRegion >= 0 && node.region === activeRegion;
        const nodeIn = springIn(f, fps, 3 + i * 2, SPRING_GENTLE);
        const floatY = float(f, 2, 0.03, i * 0.7);
        const nodePulse = isActive ? 0.8 + 0.2 * pulse(f, 0.1, i * 0.5) : 1;
        const nodeSize = isActive ? 8 : 5;

        return (
          <g key={i} opacity={nodeIn}>
            {/* Glow ring for active nodes */}
            {isActive && (
              <circle
                cx={node.x}
                cy={node.y + floatY}
                r={nodeSize + 10}
                fill="none"
                stroke={color}
                strokeWidth={2}
                opacity={0.3 * pulse(f, 0.08, i)}
              />
            )}
            <circle
              cx={node.x}
              cy={node.y + floatY}
              r={nodeSize * nodePulse}
              fill={isActive ? color : theme.colors.text.muted}
              opacity={isActive ? 1 : 0.5}
            />
          </g>
        );
      })}

      {/* Signal traveling through active region */}
      {activeRegion >= 0 && (
        <>
          {[0, 1, 2].map((sig) => {
            const region = regions[activeRegion];
            if (!region || region.nodes.length < 2) return null;
            const t = ((f * 0.03 + sig * 0.33) % 1);
            const fromIdx = Math.floor(t * (region.nodes.length - 1));
            const toIdx = Math.min(fromIdx + 1, region.nodes.length - 1);
            const localT = (t * (region.nodes.length - 1)) % 1;
            const sx = region.nodes[fromIdx].x + (region.nodes[toIdx].x - region.nodes[fromIdx].x) * localT;
            const sy = region.nodes[fromIdx].y + (region.nodes[toIdx].y - region.nodes[fromIdx].y) * localT;

            return (
              <circle
                key={sig}
                cx={sx}
                cy={sy}
                r={4}
                fill={theme.colors.text.inverse}
                stroke={color}
                strokeWidth={2}
                opacity={0.8}
              />
            );
          })}
        </>
      )}
    </g>
  );
};
