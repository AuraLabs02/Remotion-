import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {easeOutExpo, easeOutElastic, typewriter, drawPath} from '../utils';

export const Scene1Intro: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneOut = interpolate(f, [140, 170], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sceneScale = interpolate(f, [140, 170], [1, 0.92], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // --- Fragment assembly for "API" --- starts immediately at frame 0
  const fragments = [
    // A fragments - larger shapes
    {finalX: 695, finalY: 460, startX: 150, startY: 120, rotation: 145, type: 'tri', color: theme.accent.blue, letter: 'A'},
    {finalX: 735, finalY: 460, startX: 1800, startY: 200, rotation: -200, type: 'rect', color: theme.accent.blue, letter: 'A'},
    {finalX: 715, finalY: 430, startX: 400, startY: 900, rotation: 90, type: 'circle', color: theme.accent.blue, letter: 'A'},
    // P fragments
    {finalX: 920, finalY: 460, startX: 960, startY: 50, rotation: 270, type: 'rect', color: theme.accent.purple, letter: 'P'},
    {finalX: 960, finalY: 430, startX: 1600, startY: 800, rotation: -160, type: 'tri', color: theme.accent.purple, letter: 'P'},
    {finalX: 940, finalY: 460, startX: 200, startY: 600, rotation: 180, type: 'circle', color: theme.accent.purple, letter: 'P'},
    // I fragments
    {finalX: 1170, finalY: 460, startX: 1700, startY: 950, rotation: -300, type: 'rect', color: theme.accent.cyan, letter: 'I'},
    {finalX: 1190, finalY: 430, startX: 100, startY: 400, rotation: 220, type: 'tri', color: theme.accent.cyan, letter: 'I'},
    {finalX: 1180, finalY: 460, startX: 1400, startY: 100, rotation: -120, type: 'circle', color: theme.accent.cyan, letter: 'I'},
  ];

  // Fragment assembly (f=0-30) - starts IMMEDIATELY
  const fragmentProgress = fragments.map((frag, i) => {
    const delay = i * 1.5; // faster stagger
    const s = spring({frame: f - delay, fps, config: {damping: 12, stiffness: 90}});
    return s;
  });

  // Title text appears (f=15-35) - earlier
  const titleIn = spring({frame: f - 15, fps, config: {damping: 16, stiffness: 70}});

  // "HOW" and "WORKS" clip-path reveal (f=22-52) - earlier
  const howReveal = interpolate(f, [22, 45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const worksReveal = interpolate(f, [28, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Circuit paths draw-on (f=5-55) - start earlier
  const circuitPaths = [
    {d: 'M 0,300 Q 400,280 700,400', len: 780, delay: 5},
    {d: 'M 1920,350 Q 1500,320 1220,420', len: 780, delay: 10},
    {d: 'M 300,1080 Q 500,750 700,540', len: 620, delay: 15},
    {d: 'M 1620,1080 Q 1400,750 1220,540', len: 620, delay: 20},
    {d: 'M 0,600 Q 350,550 650,480', len: 700, delay: 25},
    {d: 'M 1920,620 Q 1550,560 1260,490', len: 720, delay: 30},
  ];

  // Subtitle typewriter (f=55-95) - earlier
  const subtitleText = 'Application Programming Interface — Explained Visually';
  const subtitleChars = typewriter(f, 55, subtitleText, 1.2);

  // Badge entrance (f=80-100) - earlier
  const badgeIn = spring({frame: f - 80, fps, config: {damping: 10, stiffness: 100}});

  // HTTP method orbit (f=65-130) - earlier and wider
  const methods = [
    {name: 'GET', desc: 'Read', color: theme.accent.blue},
    {name: 'POST', desc: 'Create', color: theme.accent.green},
    {name: 'PUT', desc: 'Update', color: theme.accent.amber},
    {name: 'DELETE', desc: 'Remove', color: theme.accent.red},
  ];
  const orbitIn = interpolate(f, [65, 88], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const orbitAngle = f * 0.015;

  // Network node positions for background
  const bgNodes = [
    {x: 180, y: 240, delay: 55},
    {x: 1740, y: 260, delay: 60},
    {x: 180, y: 840, delay: 65},
    {x: 1740, y: 820, delay: 70},
    {x: 960, y: 180, delay: 75},
  ];

  return (
    <g opacity={sceneOut} transform={`translate(960,540) scale(${sceneScale}) translate(-960,-540)`}>
      <defs>
        <radialGradient id="s1-bg" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#EEF4FF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
        </radialGradient>
        <linearGradient id="s1-title-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={theme.accent.blue} />
          <stop offset="50%" stopColor={theme.accent.purple} />
          <stop offset="100%" stopColor={theme.accent.cyan} />
        </linearGradient>
        <linearGradient id="s1-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={theme.accent.blue} stopOpacity="0" />
          <stop offset="20%" stopColor={theme.accent.blue} stopOpacity="1" />
          <stop offset="80%" stopColor={theme.accent.purple} stopOpacity="1" />
          <stop offset="100%" stopColor={theme.accent.purple} stopOpacity="0" />
        </linearGradient>
        <clipPath id="s1-how-clip">
          <rect x={960 - howReveal * 200} y={290} width={howReveal * 400} height={60} />
        </clipPath>
        <clipPath id="s1-works-clip">
          <rect x={960 - worksReveal * 280} y={530} width={worksReveal * 560} height={100} />
        </clipPath>
        <pattern id="s1-dotgrid" width="52" height="52" patternUnits="userSpaceOnUse">
          <circle cx="26" cy="26" r="1.5" fill={theme.accent.blue} opacity="0.07" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width={1920} height={1080} fill="url(#s1-bg)" />
      <rect width={1920} height={1080} fill="url(#s1-dotgrid)" />

      {/* Circuit path traces */}
      {circuitPaths.map((cp, i) => {
        const prog = drawPath(f, cp.delay, 35, easeOutExpo);
        const dashOff = cp.len * (1 - prog);
        return (
          <g key={i}>
            <path d={cp.d} fill="none" stroke={i % 2 === 0 ? theme.accent.blue : theme.accent.purple}
              strokeWidth={2} opacity={0.18} strokeDasharray={cp.len} strokeDashoffset={dashOff}
              strokeLinecap="round" />
            {/* Glow on path */}
            <path d={cp.d} fill="none" stroke={i % 2 === 0 ? theme.accent.blue : theme.accent.purple}
              strokeWidth={8} opacity={0.07 * prog} strokeDasharray={cp.len} strokeDashoffset={dashOff}
              strokeLinecap="round" style={{filter: 'blur(5px)'}} />
          </g>
        );
      })}

      {/* Background network nodes */}
      {bgNodes.map((node, i) => {
        const ni = spring({frame: f - node.delay, fps, config: {damping: 18, stiffness: 90}});
        const p = Math.sin(f * 0.05 + i) * 0.3 + 0.7;
        return (
          <g key={i} opacity={ni * 0.25}>
            <circle cx={node.x} cy={node.y} r={18} fill="none"
              stroke={i % 2 === 0 ? theme.accent.blue : theme.accent.purple}
              strokeWidth={1.5} opacity={p} />
            <circle cx={node.x} cy={node.y} r={5}
              fill={i % 2 === 0 ? theme.accent.blue : theme.accent.purple} opacity={0.5} />
          </g>
        );
      })}

      {/* Connecting lines from bg nodes to center */}
      {bgNodes.map((node, i) => {
        const lineIn = interpolate(f, [node.delay + 10, node.delay + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <line key={i} x1={node.x} y1={node.y} x2={960} y2={460}
            stroke={i % 2 === 0 ? theme.accent.blue : theme.accent.purple}
            strokeWidth={1} strokeDasharray="6 12" opacity={lineIn * 0.12} />
        );
      })}

      {/* Geometric fragments assembling */}
      {fragments.map((frag, i) => {
        const p = fragmentProgress[i];
        const x = frag.startX + (frag.finalX - frag.startX) * p;
        const y = frag.startY + (frag.finalY - frag.startY) * p;
        const rot = frag.rotation * (1 - p);
        const fadeOut = interpolate(f, [28, 42], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <g key={i} opacity={p * fadeOut * 0.6} transform={`translate(${x},${y}) rotate(${rot})`}>
            {frag.type === 'tri' && (
              <polygon points="0,-18 16,14 -16,14" fill={frag.color} />
            )}
            {frag.type === 'rect' && (
              <rect x={-12} y={-12} width={24} height={24} rx={4} fill={frag.color} />
            )}
            {frag.type === 'circle' && (
              <circle r={12} fill={frag.color} />
            )}
          </g>
        );
      })}

      {/* Main "API" title */}
      <g opacity={titleIn} transform={`translate(960,460) scale(${0.7 + 0.3 * titleIn})`}>
        <text x={0} y={0} textAnchor="middle" dominantBaseline="middle"
          fontSize={200} fontFamily={theme.font.display} fontWeight="900"
          fill="url(#s1-title-grad)" letterSpacing={-4}
          style={{filter: 'drop-shadow(0 4px 20px rgba(29,111,232,0.18))'}}>
          API
        </text>
      </g>

      {/* "HOW" - clip reveal - larger and darker */}
      <g clipPath="url(#s1-how-clip)">
        <text x={960} y={325} textAnchor="middle" dominantBaseline="middle"
          fontSize={48} fontFamily={theme.font.display} fontWeight="800"
          fill={theme.text.secondary} letterSpacing={16}>
          H O W
        </text>
      </g>

      {/* "WORKS" - clip reveal */}
      <g clipPath="url(#s1-works-clip)">
        <text x={960} y={588} textAnchor="middle" dominantBaseline="middle"
          fontSize={80} fontFamily={theme.font.display} fontWeight="800"
          fill={theme.text.primary} letterSpacing={18}>
          WORKS
        </text>
      </g>

      {/* Animated gradient underline */}
      {f > 28 && (
        <rect
          x={960 - interpolate(f, [28, 52], [0, 400], {extrapolateRight: 'clamp'})}
          y={638}
          width={interpolate(f, [28, 52], [0, 800], {extrapolateRight: 'clamp'})}
          height={4} rx={2} fill="url(#s1-line-grad)" />
      )}

      {/* Subtitle - typewriter */}
      <g opacity={interpolate(f, [55, 65], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}>
        <text x={960} y={685} textAnchor="middle"
          fontSize={28} fontFamily={theme.font.body} fontWeight="400"
          fill={theme.text.secondary} letterSpacing={2}>
          {subtitleText.slice(0, subtitleChars)}
        </text>
        {/* Blinking cursor */}
        {subtitleChars < subtitleText.length && Math.sin(f * 0.15) > 0 && (
          <rect
            x={960 + (subtitleChars - subtitleText.length / 2) * 14.5}
            y={670} width={2} height={28} rx={1} fill={theme.accent.blue} />
        )}
      </g>

      {/* Badge */}
      <g opacity={badgeIn} transform={`translate(960,${738 + (1 - badgeIn) * 30}) scale(${0.8 + 0.2 * badgeIn})`}>
        <rect x={-175} y={-22} width={350} height={44} rx={22}
          fill={theme.accent.blue} opacity={0.08} />
        <rect x={-175} y={-22} width={350} height={44} rx={22}
          fill="none" stroke={theme.accent.blue} strokeWidth={1.5} opacity={0.30} />
        <circle cx={-148} cy={0} r={6} fill={theme.accent.green} opacity={0.9} />
        <text x={0} y={0} textAnchor="middle" dominantBaseline="middle"
          fontSize={15} fontFamily={theme.font.body} fontWeight="700"
          fill={theme.accent.blue} letterSpacing={3}>
          PROFESSIONAL MOTION GUIDE
        </text>
      </g>

      {/* HTTP Methods - orbital */}
      {methods.map((method, i) => {
        const angle = orbitAngle + (i * Math.PI * 2) / methods.length;
        const rx = 400, ry = 145;
        const mx = 960 + Math.cos(angle) * rx;
        const my = 460 + Math.sin(angle) * ry;
        const methodScale = spring({frame: f - (68 + i * 8), fps, config: {damping: 12, stiffness: 100}});
        const zOrder = Math.sin(angle);
        const size = 0.7 + 0.3 * (zOrder * 0.5 + 0.5);
        return (
          <g key={i} opacity={orbitIn * methodScale * (0.5 + 0.5 * (zOrder * 0.5 + 0.5))}
            transform={`translate(${mx},${my}) scale(${size * methodScale})`}>
            <circle r={50} fill="#FFFFFF" stroke={method.color} strokeWidth={2.5}
              style={{filter: 'drop-shadow(0 3px 12px rgba(0,0,0,0.10))'}} />
            <text x={0} y={-6} textAnchor="middle" dominantBaseline="middle"
              fontSize={18} fontFamily={theme.font.body} fontWeight="800"
              fill={method.color} letterSpacing={1}>{method.name}</text>
            <text x={0} y={18} textAnchor="middle" dominantBaseline="middle"
              fontSize={14} fontFamily={theme.font.body} fill={theme.text.muted}>{method.desc}</text>
          </g>
        );
      })}
    </g>
  );
};
