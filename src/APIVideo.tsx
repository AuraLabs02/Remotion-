import React from 'react';
import {useCurrentFrame, interpolate, AbsoluteFill} from 'remotion';
import {Scene1Intro} from './scenes/Scene1Intro';
import {Scene2WhatIsAPI} from './scenes/Scene2WhatIsAPI';
import {Scene3RequestResponse} from './scenes/Scene3RequestResponse';
import {Scene4RealWorld} from './scenes/Scene4RealWorld';
import {Scene5Types} from './scenes/Scene5Types';
import {Scene6Outro} from './scenes/Scene6Outro';

// Total: 1800 frames = 60 seconds at 30fps
// Scene timing (frames):
// Scene 1 Intro:            0 - 180   (6s)
// Scene 2 What is API:    150 - 420   (9s)
// Scene 3 Req/Resp:       390 - 720   (11s)
// Scene 4 Real World:     690 - 990   (10s)
// Scene 5 Types:          960 - 1260  (10s)
// Scene 6 Outro:         1230 - 1800  (19s)

const SCENE_TIMES = {
  scene1: {start: 0, end: 180},
  scene2: {start: 150, end: 420},
  scene3: {start: 390, end: 720},
  scene4: {start: 690, end: 990},
  scene5: {start: 960, end: 1260},
  scene6: {start: 1230, end: 1800},
};

// Background with animated gradient
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const hue1 = (frame * 0.08) % 360;
  const hue2 = (frame * 0.05 + 180) % 360;

  return (
    <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0}}>
      <defs>
        <radialGradient id="bg-grad-1" cx="20%" cy="20%" r="60%">
          <stop offset="0%" stopColor={`hsl(${hue1}, 70%, 8%)`} stopOpacity="1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="bg-grad-2" cx="80%" cy="80%" r="60%">
          <stop offset="0%" stopColor={`hsl(${hue2}, 70%, 6%)`} stopOpacity="1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Global SVG filters */}
        <filter id="strong-glow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="soft-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dark base */}
      <rect width={1920} height={1080} fill="#030712" />

      {/* Animated gradient overlays */}
      <rect width={1920} height={1080} fill="url(#bg-grad-1)" />
      <rect width={1920} height={1080} fill="url(#bg-grad-2)" />

      {/* Grid pattern */}
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.4"
            opacity="0.04"
          />
        </pattern>
      </defs>
      <rect width={1920} height={1080} fill="url(#grid)" />

      {/* Scanline effect */}
      <rect width={1920} height={1080} fill="url(#scanlines)" opacity={0.03} />
      <defs>
        <pattern id="scanlines" width="1" height="4" patternUnits="userSpaceOnUse">
          <rect width="1" height="2" fill="#000" />
        </pattern>
      </defs>
    </svg>
  );
};

// Scene progress indicator
const SceneIndicator: React.FC<{currentScene: number}> = ({currentScene}) => {
  const scenes = ['INTRO', 'WHAT IS API', 'PIPELINE', 'REAL WORLD', 'TYPES', 'SUMMARY'];
  return (
    <svg
      width={1920}
      height={1080}
      style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}
    >
      {/* Top bar */}
      <rect x={0} y={0} width={1920} height={3} fill="url(#top-bar-grad)" opacity={0.6} />
      <defs>
        <linearGradient id="top-bar-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7b2fff" />
          <stop offset="50%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#00ff88" />
        </linearGradient>
      </defs>

      {/* Scene dots */}
      {scenes.map((scene, i) => {
        const isActive = i === currentScene;
        const isPast = i < currentScene;
        const dotX = 960 - ((scenes.length - 1) * 120) / 2 + i * 120;
        return (
          <g key={i}>
            <circle
              cx={dotX}
              cy={36}
              r={isActive ? 8 : 5}
              fill={isActive ? '#00d4ff' : isPast ? '#7b2fff' : '#2a3a4a'}
              opacity={isActive ? 1 : 0.6}
            />
            {isActive && (
              <circle cx={dotX} cy={36} r={14} fill="none" stroke="#00d4ff" strokeWidth={1.5} opacity={0.4} />
            )}
            {i < scenes.length - 1 && (
              <line
                x1={dotX + (isActive ? 9 : 6)}
                y1={36}
                x2={dotX + 120 - (i + 1 === currentScene ? 9 : 6)}
                y2={36}
                stroke={isPast ? '#7b2fff' : '#1a2a3a'}
                strokeWidth={1.5}
                opacity={0.5}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

export const APIVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Determine current scene for indicator
  let currentScene = 0;
  if (frame >= SCENE_TIMES.scene6.start) currentScene = 5;
  else if (frame >= SCENE_TIMES.scene5.start) currentScene = 4;
  else if (frame >= SCENE_TIMES.scene4.start) currentScene = 3;
  else if (frame >= SCENE_TIMES.scene3.start) currentScene = 2;
  else if (frame >= SCENE_TIMES.scene2.start) currentScene = 1;

  return (
    <AbsoluteFill style={{backgroundColor: '#030712'}}>
      {/* Background */}
      <Background />

      {/* Scene indicator */}
      <SceneIndicator currentScene={currentScene} />

      {/* Scenes rendered as SVG layers */}
      <svg
        width={1920}
        height={1080}
        style={{position: 'absolute', top: 0, left: 0}}
      >
        <defs>
          <filter id="strong-glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="soft-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Scene 1: Intro (frames 0-180) */}
        {frame >= SCENE_TIMES.scene1.start && frame <= SCENE_TIMES.scene1.end + 30 && (
          <Scene1Intro startFrame={SCENE_TIMES.scene1.start} />
        )}

        {/* Scene 2: What is API (frames 150-420) */}
        {frame >= SCENE_TIMES.scene2.start && frame <= SCENE_TIMES.scene2.end + 30 && (
          <Scene2WhatIsAPI startFrame={SCENE_TIMES.scene2.start} />
        )}

        {/* Scene 3: Request-Response (frames 390-720) */}
        {frame >= SCENE_TIMES.scene3.start && frame <= SCENE_TIMES.scene3.end + 30 && (
          <Scene3RequestResponse startFrame={SCENE_TIMES.scene3.start} />
        )}

        {/* Scene 4: Real World (frames 690-990) */}
        {frame >= SCENE_TIMES.scene4.start && frame <= SCENE_TIMES.scene4.end + 30 && (
          <Scene4RealWorld startFrame={SCENE_TIMES.scene4.start} />
        )}

        {/* Scene 5: Types (frames 960-1260) */}
        {frame >= SCENE_TIMES.scene5.start && frame <= SCENE_TIMES.scene5.end + 30 && (
          <Scene5Types startFrame={SCENE_TIMES.scene5.start} />
        )}

        {/* Scene 6: Outro (frames 1230-1800) */}
        {frame >= SCENE_TIMES.scene6.start && (
          <Scene6Outro startFrame={SCENE_TIMES.scene6.start} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
