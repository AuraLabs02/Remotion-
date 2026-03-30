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

// Subtle animated white/light background
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = Math.sin(frame * 0.005) * 10;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0}}>
      <defs>
        <radialGradient id="global-bg-1" cx={`${48 + shift * 0.3}%`} cy="35%" r="60%">
          <stop offset="0%"   stopColor="#EEF5FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="global-bg-2" cx={`${54 - shift * 0.2}%`} cy="72%" r="55%">
          <stop offset="0%"   stopColor="#F5F0FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="#FFFFFF" />
      <rect width={1920} height={1080} fill="url(#global-bg-1)" />
      <rect width={1920} height={1080} fill="url(#global-bg-2)" />
    </svg>
  );
};

// Progress bar along the top
const ProgressBar: React.FC<{frame: number}> = ({frame}) => {
  const progress = frame / 1800;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}>
      {/* Track */}
      <rect x={0} y={0} width={1920} height={4} fill={theme.border.light} />
      {/* Fill */}
      <rect x={0} y={0} width={1920 * progress} height={4} rx={0} fill="url(#prog-grad)" />
      <defs>
        <linearGradient id="prog-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={theme.accent.blue} />
          <stop offset="50%"  stopColor={theme.accent.purple} />
          <stop offset="100%" stopColor={theme.accent.green} />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Scene breadcrumb
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
        const isPast   = i < current;
        const dotR = isActive ? 7 : 4.5;
        const dotColor = isActive ? colors[i] : isPast ? `${colors[i]}88` : theme.border.medium;
        return (
          <g key={i}>
            {/* Connector */}
            {i < labels.length - 1 && (
              <line x1={x + dotR + 4} y1={28} x2={x + spacing - dotR - 4} y2={28}
                stroke={isPast ? `${colors[i]}44` : theme.border.light}
                strokeWidth={1.5} />
            )}
            {/* Dot */}
            <circle cx={x} cy={28} r={dotR + 6} fill={colors[i]} opacity={isActive ? 0.12 : 0} />
            <circle cx={x} cy={28} r={dotR} fill={dotColor} />
            {/* Label */}
            <text x={x} y={46} textAnchor="middle"
              fontSize={10} fontFamily="system-ui" fontWeight={isActive ? '700' : '500'}
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
  if (frame >= SCENES.s6.start)      currentScene = 5;
  else if (frame >= SCENES.s5.start) currentScene = 4;
  else if (frame >= SCENES.s4.start) currentScene = 3;
  else if (frame >= SCENES.s3.start) currentScene = 2;
  else if (frame >= SCENES.s2.start) currentScene = 1;

  return (
    <AbsoluteFill style={{backgroundColor: '#FFFFFF'}}>
      <Background />

      <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0}}>
        <defs>
          <filter id="strong-glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#0B1628" floodOpacity="0.10" />
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
