import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import { springIn, fadeIn, float, SPRING_BOUNCY, easeOutExpo } from '../design/animations';

interface FlowNode {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  x: number;
  y: number;
  size?: number;
}

interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  color?: string;
  animated?: boolean;
}

interface FlowDiagramProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  startFrame?: number;
  staggerDelay?: number;
  showLabels?: boolean;
  offsetX?: number;
  offsetY?: number;
}

export const FlowDiagram: React.FC<FlowDiagramProps> = ({
  nodes,
  edges,
  startFrame = 0,
  staggerDelay = 12,
  showLabels = true,
  offsetX = 0,
  offsetY = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;
  if (f < 0) return null;

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return (
    <g transform={`translate(${offsetX}, ${offsetY})`}>
      {/* Edges */}
      {edges.map((edge, i) => {
        const fromNode = nodeMap.get(edge.from);
        const toNode = nodeMap.get(edge.to);
        if (!fromNode || !toNode) return null;

        const edgeDelay = (nodes.length + i) * staggerDelay;
        const edgeIn = fadeIn(f, edgeDelay, 20);
        const edgeColor = edge.color || theme.colors.primary.light;
        const fromSize = fromNode.size || 60;

        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / dist;
        const ny = dy / dist;

        const x1 = fromNode.x + nx * fromSize;
        const y1 = fromNode.y + ny * fromSize;
        const x2 = toNode.x - nx * (toNode.size || 60);
        const y2 = toNode.y - ny * (toNode.size || 60);

        // Arrow
        const arrowSize = 12;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const ax1 = x2 - arrowSize * Math.cos(angle - 0.4);
        const ay1 = y2 - arrowSize * Math.sin(angle - 0.4);
        const ax2 = x2 - arrowSize * Math.cos(angle + 0.4);
        const ay2 = y2 - arrowSize * Math.sin(angle + 0.4);

        // Animated dot along edge
        const dotProgress = edge.animated
          ? ((f * 0.02 + i * 0.3) % 1)
          : -1;

        return (
          <g key={`${edge.from}-${edge.to}`} opacity={edgeIn}>
            {/* Line */}
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={edgeColor}
              strokeWidth={3}
              strokeDasharray={dist}
              strokeDashoffset={dist * (1 - easeOutExpo(edgeIn))}
              strokeLinecap="round"
            />

            {/* Arrow head */}
            <polygon
              points={`${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}`}
              fill={edgeColor}
              opacity={edgeIn}
            />

            {/* Animated dot */}
            {dotProgress >= 0 && (
              <circle
                cx={x1 + (x2 - x1) * dotProgress}
                cy={y1 + (y2 - y1) * dotProgress}
                r={5}
                fill={theme.colors.text.inverse}
                stroke={edgeColor}
                strokeWidth={2}
              />
            )}

            {/* Edge label */}
            {edge.label && showLabels && (
              <text
                x={(x1 + x2) / 2}
                y={(y1 + y2) / 2 - 12}
                textAnchor="middle"
                fontFamily={FONT_FAMILY.body}
                fontSize={theme.fontSize.caption}
                fontWeight={FONT_WEIGHT.semibold}
                fill={theme.colors.text.secondary}
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const nodeIn = springIn(f, fps, i * staggerDelay, SPRING_BOUNCY);
        const size = node.size || 60;
        const color = node.color || theme.colors.primary.main;
        const floatY = float(f, 4, 0.03, i * 1.5);

        return (
          <g
            key={node.id}
            transform={`translate(${node.x}, ${node.y + floatY})`}
            opacity={nodeIn}
          >
            {/* Glow */}
            <circle
              r={size + 8}
              fill="none"
              stroke={color}
              strokeWidth={2}
              opacity={0.15 + 0.1 * Math.sin(f * 0.05 + i)}
            />

            {/* Node circle */}
            <circle
              r={size}
              fill={theme.colors.bg.card}
              stroke={color}
              strokeWidth={3}
              filter={`drop-shadow(0 4px 12px ${color}40)`}
            />

            {/* Icon */}
            {node.icon && (
              <text
                y={showLabels ? -6 : 10}
                textAnchor="middle"
                fontSize={size * 0.55}
              >
                {node.icon}
              </text>
            )}

            {/* Label */}
            {showLabels && (
              <text
                y={node.icon ? size * 0.35 : 10}
                textAnchor="middle"
                fontFamily={FONT_FAMILY.body}
                fontSize={Math.min(theme.fontSize.label, size * 0.35)}
                fontWeight={FONT_WEIGHT.bold}
                fill={theme.colors.text.primary}
              >
                {node.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};
