import React from 'react';
import {useCurrentFrame, interpolate, AbsoluteFill} from 'remotion';
import {theme} from './theme';
import {Scene1Intro} from './scenes/Scene1Intro';
import {Scene2WhatIsAPI} from './scenes/Scene2WhatIsAPI';
import {Scene3RequestResponse} from './scenes/Scene3RequestResponse';
import {Scene4RealWorld} from './scenes/Scene4RealWorld';
import {Scene5Types} from './scenes/Scene5Types';
import {Scene6Outro} from './scenes/Scene6Outro';

// 1800 frames = 60s @ 30fps
const SCENES = {
  s1: {start: 0,    end: 180},
  s2: {start: 150,  end: 420},
  s3: {start: 390,  end: 720},
  s4: {start: 690,  end: 990},
  s5: {start: 960,  end: 1260},
  s6: {start: 1230, end: 1800},
};

// Animated background with drifting gradient orbs
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = Math.sin(frame * 0.004) * 12;
  const shift2 = Math.cos(frame * 0.003) * 8;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0}}>
      <defs>
        <radialGradient id="global-bg-1" cx={`${46 + shift * 0.3}%`} cy={`${32 + shift2 * 0.2}%`} r="55%">
          <stop offset="0%" stopColor="#EEF5FF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="global-bg-2" cx={`${56 - shift * 0.2}%`} cy={`${68 + shift2 * 0.3}%`} r="50%">
          <stop offset="0%" stopColor="#F5F0FF" stopOpacity="0.70" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="global-bg-3" cx={`${50 + shift2 * 0.4}%`} cy={`${50 - shift * 0.15}%`} r="45%">
          <stop offset="0%" stopColor="#F0FFF8" stopOpacity="0.40" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="#FFFFFF" />
      <rect width={1920} height={1080} fill="url(#global-bg-1)" />
      <rect width={1920} height={1080} fill="url(#global-bg-2)" />
      <rect width={1920} height={1080} fill="url(#global-bg-3)" />
    </svg>
  );
};

// Enhanced progress bar with glowing dot
const ProgressBar: React.FC<{frame: number}> = ({frame}) => {
  const progress = frame / 1800;
  const dotX = 1920 * progress;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}>
      <defs>
        <linearGradient id="prog-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={theme.accent.blue} />
          <stop offset="50%" stopColor={theme.accent.purple} />
          <stop offset="100%" stopColor={theme.accent.green} />
        </linearGradient>
      </defs>
      {/* Track */}
      <rect x={0} y={0} width={1920} height={5} fill={theme.border.light} />
      {/* Fill */}
      <rect x={0} y={0} width={1920 * progress} height={5} fill="url(#prog-grad)" />
      {/* Glowing leading dot */}
      {progress > 0.01 && (
        <>
          <circle cx={dotX} cy={2.5} r={8} fill={theme.accent.blue} opacity={0.15} />
          <circle cx={dotX} cy={2.5} r={4} fill={theme.accent.purple} opacity={0.8} />
        </>
      )}
    </svg>
  );
};

// Scene breadcrumb with animated connectors
const SceneBreadcrumb: React.FC<{current: number}> = ({current}) => {
  const labels = ['INTRO', 'CONCEPT', 'PIPELINE', 'EXAMPLES', 'TYPES', 'SUMMARY'];
  const colors = [
    theme.accent.blue, theme.accent.purple, theme.accent.cyan,
    theme.accent.orange, theme.accent.purple, theme.accent.green,
  ];
  const spacing = 220;
  const startX = 960 - ((labels.length - 1) * spacing) / 2;

  return (
    <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}>
      {labels.map((label, i) => {
        const x = startX + i * spacing;
        const isActive = i === current;
        const isPast = i < current;
        const dotR = isActive ? 8 : 5;
        const dotColor = isActive ? colors[i] : isPast ? `${colors[i]}88` : theme.border.medium;
        return (
          <g key={i}>
            {/* Connector line */}
            {i < labels.length - 1 && (
              <line x1={x + dotR + 6} y1={32} x2={x + spacing - dotR - 6} y2={32}
                stroke={isPast ? `${colors[i]}55` : theme.border.light}
                strokeWidth={isPast ? 2 : 1.5} />
            )}
            {/* Active halo */}
            <circle cx={x} cy={32} r={dotR + 8} fill={colors[i]} opacity={isActive ? 0.12 : 0} />
            {/* Dot */}
            <circle cx={x} cy={32} r={dotR} fill={dotColor} />
            {/* Label */}
            <text x={x} y={52} textAnchor="middle"
              fontSize={11} fontFamily={theme.font.body} fontWeight={isActive ? '700' : '500'}
              fill={isActive ? colors[i] : theme.text.muted} letterSpacing={1.5}>
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export const APIVideo: React.FC = () => {
  const frame = useCurrentFrame();

  let currentScene = 0;
  if (frame >= SCENES.s6.start) currentScene = 5;
  else if (frame >= SCENES.s5.start) currentScene = 4;
  else if (frame >= SCENES.s4.start) currentScene = 3;
  else if (frame >= SCENES.s3.start) currentScene = 2;
  else if (frame >= SCENES.s2.start) currentScene = 1;

  // Scene transition zoom effect
  const getSceneTransform = (sceneStart: number, sceneEnd: number) => {
    const entryZoom = interpolate(frame, [sceneStart, sceneStart + 20], [0.98, 1.0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
    });
    const exitZoom = interpolate(frame, [sceneEnd - 20, sceneEnd], [1.0, 0.98], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
    });
    return Math.min(entryZoom, exitZoom);
  };

  return (
    <AbsoluteFill style={{backgroundColor: '#FFFFFF'}}>
      <Background />

      <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0}}>
        <defs>
          <filter id="strong-glow">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="14" floodColor="#0B1628" floodOpacity="0.10" />
          </filter>
          {/* Color-specific glow filters */}
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={theme.accent.blue} floodOpacity="0.3" />
            <feComposite in2="blur" operator="in" />
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-purple">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={theme.accent.purple} floodOpacity="0.3" />
            <feComposite in2="blur" operator="in" />
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {frame >= SCENES.s1.start && frame <= SCENES.s1.end + 30 && (
          <Scene1Intro startFrame={SCENES.s1.start} />
        )}
        {frame >= SCENES.s2.start && frame <= SCENES.s2.end + 30 && (
          <Scene2WhatIsAPI startFrame={SCENES.s2.start} />
        )}
        {frame >= SCENES.s3.start && frame <= SCENES.s3.end + 30 && (
          <Scene3RequestResponse startFrame={SCENES.s3.start} />
        )}
        {frame >= SCENES.s4.start && frame <= SCENES.s4.end + 30 && (
          <Scene4RealWorld startFrame={SCENES.s4.start} />
        )}
        {frame >= SCENES.s5.start && frame <= SCENES.s5.end + 30 && (
          <Scene5Types startFrame={SCENES.s5.start} />
        )}
        {frame >= SCENES.s6.start && (
          <Scene6Outro startFrame={SCENES.s6.start} />
        )}
      </svg>

      <ProgressBar frame={frame} />
      <SceneBreadcrumb current={currentScene} />
    </AbsoluteFill>
  );
};
