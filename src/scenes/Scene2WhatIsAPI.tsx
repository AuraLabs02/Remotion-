import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {interpolateWithEasing, easeOutElastic} from '../utils';

export const Scene2WhatIsAPI: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn = interpolate(f, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const sceneOut = interpolate(f, [240, 270], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(sceneIn, sceneOut);

  // Waiter metaphor positions
  const customerX = 250;
  const waiterX = 960;
  const kitchenX = 1670;
  const centerY = 420;

  // Elements appear timings
  const customerIn = spring({frame: f - 15, fps, config: {damping: 14, stiffness: 100}});
  const waiterIn = spring({frame: f - 40, fps, config: {damping: 14, stiffness: 100}});
  const kitchenIn = spring({frame: f - 65, fps, config: {damping: 14, stiffness: 100}});

  // Arrow animations
  const arrow1Progress = interpolate(f, [80, 120], [0, 1], {extrapolateRight: 'clamp'});
  const arrow2Progress = interpolate(f, [120, 160], [0, 1], {extrapolateRight: 'clamp'});
  const arrow3Progress = interpolate(f, [160, 200], [0, 1], {extrapolateRight: 'clamp'});
  const arrow4Progress = interpolate(f, [200, 240], [0, 1], {extrapolateRight: 'clamp'});

  // Labels
  const labelsOpacity = interpolate(f, [70, 90], [0, 1], {extrapolateRight: 'clamp'});
  const titleOpacity = interpolate(f, [0, 25], [0, 1], {extrapolateRight: 'clamp'});

  // Floating animation
  const float = Math.sin(f * 0.05) * 8;
  const float2 = Math.sin(f * 0.05 + 1) * 8;
  const float3 = Math.sin(f * 0.05 + 2) * 8;

  const drawCircleNode = (
    cx: number,
    cy: number,
    scale: number,
    color: string,
    icon: string,
    label: string,
    sublabel: string,
    floatOffset: number
  ) => (
    <g transform={`translate(0, ${floatOffset})`} opacity={scale}>
      {/* Outer glow ring */}
      <circle
        cx={cx}
        cy={cy}
        r={105 * scale}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity={0.3}
        strokeDasharray="8 4"
      />
      {/* Glow */}
      <circle cx={cx} cy={cy} r={85 * scale} fill={color} opacity={0.08} />
      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={80 * scale}
        fill={`${color}18`}
        stroke={color}
        strokeWidth={2.5}
      />
      {/* Icon */}
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={52 * scale}
        style={{userSelect: 'none'}}
      >
        {icon}
      </text>
      {/* Label */}
      <text
        x={cx}
        y={cy + 48 * scale}
        textAnchor="middle"
        fontSize={20 * scale}
        fontFamily="'Arial Black', sans-serif"
        fontWeight="800"
        fill={color}
        letterSpacing={2}
      >
        {label}
      </text>
      {/* Sub label */}
      <text
        x={cx}
        y={cy + 75 * scale}
        textAnchor="middle"
        fontSize={13 * scale}
        fontFamily="Arial, sans-serif"
        fill="#8899aa"
        letterSpacing={1}
      >
        {sublabel}
      </text>
    </g>
  );

  const drawArrow = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    progress: number,
    color: string,
    label: string,
    isReturn: boolean = false
  ) => {
    const currentX = x1 + (x2 - x1) * progress;
    if (progress <= 0) return null;
    const midX = (x1 + x2) / 2;
    return (
      <g>
        <defs>
          <marker
            id={`arrow-${color.replace('#', '')}-${isReturn ? 'r' : 'f'}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={color} />
          </marker>
        </defs>
        {/* Dashed line path */}
        <line
          x1={x1}
          y1={y1}
          x2={currentX}
          y2={y2}
          stroke={color}
          strokeWidth={2.5}
          strokeDasharray="8 4"
          opacity={0.6}
          markerEnd={progress >= 1 ? `url(#arrow-${color.replace('#', '')}-${isReturn ? 'r' : 'f'})` : undefined}
        />
        {/* Glowing dot moving along path */}
        <circle cx={currentX} cy={y1 + (y2 - y1) * progress} r={6} fill={color} opacity={0.9} />
        <circle cx={currentX} cy={y1 + (y2 - y1) * progress} r={12} fill={color} opacity={0.2} />
        {/* Label */}
        {progress >= 1 && (
          <text
            x={midX}
            y={y1 + (isReturn ? 30 : -18)}
            textAnchor="middle"
            fontSize={14}
            fontFamily="'Courier New', monospace"
            fill={color}
            fontWeight="bold"
            opacity={0.85}
          >
            {label}
          </text>
        )}
      </g>
    );
  };

  return (
    <g opacity={opacity}>
      <defs>
        <filter id="node-glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Section title */}
      <g opacity={titleOpacity}>
        <text
          x={960}
          y={80}
          textAnchor="middle"
          fontSize={20}
          fontFamily="Arial, sans-serif"
          fontWeight="600"
          fill="#7b2fff"
          letterSpacing={6}
        >
          WHAT IS AN API?
        </text>
        <text
          x={960}
          y={130}
          textAnchor="middle"
          fontSize={58}
          fontFamily="'Arial Black', Impact, sans-serif"
          fontWeight="900"
          fill="#ffffff"
          letterSpacing={3}
          style={{filter: 'drop-shadow(0 0 20px #7b2fff)'}}
        >
          The Restaurant Analogy
        </text>
        <rect x={660} y={150} width={600} height={2} rx={1} fill="url(#line-gradient-2)" opacity={0.7} />
        <defs>
          <linearGradient id="line-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#7b2fff" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </g>

      {/* Three nodes */}
      {drawCircleNode(customerX, centerY, customerIn, '#00ff88', '👤', 'YOU (CLIENT)', 'The App / Browser', float)}
      {drawCircleNode(waiterX, centerY, waiterIn, '#00d4ff', '🔗', 'API', 'The Waiter / Bridge', float2)}
      {drawCircleNode(kitchenX, centerY, kitchenIn, '#ff6b6b', '🗄️', 'SERVER', 'The Kitchen / Database', float3)}

      {/* Arrows - Request flow */}
      {drawArrow(customerX + 85, centerY - 20, waiterX - 85, centerY - 20, arrow1Progress, '#00ff88', 'REQUEST →', false)}
      {drawArrow(waiterX + 85, centerY - 20, kitchenX - 85, centerY - 20, arrow2Progress, '#00d4ff', 'FETCH DATA →', false)}

      {/* Response flow */}
      {drawArrow(kitchenX - 85, centerY + 20, waiterX + 85, centerY + 20, arrow3Progress, '#ff6b6b', '← RESPONSE', true)}
      {drawArrow(waiterX - 85, centerY + 20, customerX + 85, centerY + 20, arrow4Progress, '#ffb347', '← RESULT', true)}

      {/* Bottom explanation */}
      <g opacity={labelsOpacity}>
        {[
          {x: customerX, text: '"I want pasta"', color: '#00ff88'},
          {x: waiterX, text: '"Order: pasta"', color: '#00d4ff'},
          {x: kitchenX, text: '"Here is pasta"', color: '#ff6b6b'},
        ].map((item, i) => (
          <g key={i}>
            <rect
              x={item.x - 110}
              y={centerY + 130}
              width={220}
              height={44}
              rx={22}
              fill={`${item.color}15`}
              stroke={item.color}
              strokeWidth={1.5}
              opacity={0.8}
            />
            <text
              x={item.x}
              y={centerY + 153}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={15}
              fontFamily="'Courier New', monospace"
              fill={item.color}
              fontWeight="bold"
            >
              {item.text}
            </text>
          </g>
        ))}
      </g>

      {/* Bottom callout */}
      {f > 160 && (
        <g opacity={interpolate(f, [160, 190], [0, 1], {extrapolateRight: 'clamp'})}>
          <rect x={560} y={700} width={800} height={80} rx={16}
            fill="#0d1a2e" stroke="#00d4ff" strokeWidth={1.5} opacity={0.9} />
          <text x={960} y={733} textAnchor="middle" fontSize={17} fill="#8899aa" fontFamily="Arial, sans-serif">
            An API is a
          </text>
          <text x={1035} y={733} textAnchor="start" fontSize={17} fill="#00d4ff" fontFamily="Arial, sans-serif" fontWeight="bold">
            &nbsp;contract between software systems —
          </text>
          <text x={960} y={762} textAnchor="middle" fontSize={17} fill="#8899aa" fontFamily="Arial, sans-serif">
            defining how to
          </text>
          <text x={1030} y={762} textAnchor="start" fontSize={17} fill="#7b2fff" fontFamily="Arial, sans-serif" fontWeight="bold">
            &nbsp;request and receive data
          </text>
        </g>
      )}
    </g>
  );
};
