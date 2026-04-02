import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../design/theme';
import { FONT_FAMILY, FONT_WEIGHT } from '../design/fonts';
import {
  springIn, fadeIn, float, pulse, scaleIn,
  SPRING_BOUNCY, SPRING_SMOOTH, SPRING_ELASTIC, easeOutExpo, sceneOpacity,
} from '../design/animations';
import { ParticleBackground } from '../components/ParticleBackground';

const SCENE_START = 5070;
const SCENE_END = 5400;

export const S12_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - SCENE_START;
  const opacity = sceneOpacity(frame, SCENE_START, SCENE_END, 20);
  if (opacity <= 0) return null;

  // Key takeaway cards converging to center
  const takeaways = [
    { icon: '🎯', label: 'Be Specific', color: theme.colors.primary.main },
    { icon: '⚙️', label: 'System Prompts', color: theme.colors.secondary.main },
    { icon: '📝', label: 'Few-Shot', color: theme.colors.accent.orange },
    { icon: '💭', label: 'Chain of Thought', color: theme.colors.accent.cyan },
    { icon: '📐', label: 'Structure Output', color: theme.colors.accent.green },
    { icon: '🔧', label: 'Use Tools', color: theme.colors.accent.amber },
  ];

  // Convergence animation
  const convergeProgress = interpolate(f, [30, 80], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Title phases
  const titlePhrases = [
    { text: 'Craft Better Prompts', start: 0, end: 60 },
    { text: 'Get Better Results', start: 50, end: 110 },
    { text: 'Build Better Software', start: 100, end: 200 },
  ];

  // Final scale up
  const finalScale = interpolate(f, [250, 330], [1, 1.03], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Fade to white at very end
  const fadeToWhite = interpolate(f, [310, 330], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <g opacity={opacity}>
      {/* Particles */}
      <ParticleBackground
        count={50}
        color={theme.colors.primary.light}
        opacity={0.1}
        speed={0.4}
      />

      {/* Background glow */}
      <circle
        cx={960}
        cy={450}
        r={300 + 50 * pulse(f, 0.03)}
        fill={theme.colors.primary.main}
        opacity={0.04}
      />
      <circle
        cx={960}
        cy={450}
        r={200 + 30 * pulse(f, 0.04, 1)}
        fill={theme.colors.secondary.main}
        opacity={0.03}
      />

      {/* Orbiting rings matching S01 */}
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          cx={960}
          cy={450}
          rx={280 + i * 70}
          ry={160 + i * 40}
          fill="none"
          stroke={i === 0 ? theme.colors.primary.main : i === 1 ? theme.colors.secondary.main : theme.colors.accent.green}
          strokeWidth={1.5}
          strokeDasharray={`${15 + i * 8} ${20 + i * 10}`}
          strokeDashoffset={f * (1.5 + i * 0.5)}
          opacity={0.12}
          transform={`rotate(${i * 25 + f * 0.15}, 960, 450)`}
        />
      ))}

      {/* Rotating title phrases */}
      {titlePhrases.map((phrase, i) => {
        const phraseIn = fadeIn(f, phrase.start, 20);
        const phraseOut = fadeIn(f, phrase.end, 15);
        const phraseProg = phraseIn * (i === titlePhrases.length - 1 ? 1 : (1 - phraseOut));

        return (
          <text
            key={i}
            x={960}
            y={280}
            textAnchor="middle"
            fontFamily={FONT_FAMILY.display}
            fontSize={theme.fontSize.h1}
            fontWeight={FONT_WEIGHT.black}
            fill={theme.colors.text.primary}
            opacity={phraseProg}
            transform={`translate(0, ${(1 - phraseIn) * 30})`}
            letterSpacing={-2}
          >
            {phrase.text}
          </text>
        );
      })}

      {/* Takeaway cards converging */}
      {takeaways.map((item, i) => {
        const angle = (i / takeaways.length) * Math.PI * 2 - Math.PI / 2;
        const startRadius = 400;
        const endRadius = 180;
        const radius = startRadius + (endRadius - startRadius) * convergeProgress;

        const targetX = 960 + Math.cos(angle) * radius;
        const targetY = 500 + Math.sin(angle) * radius;
        const cardIn = springIn(f, fps, 10 + i * 5, SPRING_BOUNCY);
        const floatY = float(f, 3, 0.03, i);

        return (
          <g
            key={i}
            opacity={cardIn}
            transform={`translate(${targetX}, ${targetY + floatY})`}
          >
            {/* Card */}
            <rect
              x={-75}
              y={-30}
              width={150}
              height={60}
              rx={theme.radius.lg}
              fill={theme.colors.bg.card}
              stroke={item.color}
              strokeWidth={2}
              filter={`drop-shadow(0 3px 10px ${item.color}20)`}
            />

            <text
              x={-40}
              y={8}
              fontSize={22}
            >
              {item.icon}
            </text>

            <text
              x={-10}
              y={8}
              fontFamily={FONT_FAMILY.display}
              fontSize={15}
              fontWeight={FONT_WEIGHT.bold}
              fill={item.color}
            >
              {item.label}
            </text>
          </g>
        );
      })}

      {/* Center badge */}
      <g opacity={fadeIn(f, 100, 20)}>
        <circle
          cx={960}
          cy={500}
          r={60 + 5 * pulse(f, 0.05)}
          fill={theme.colors.primary.main}
          opacity={0.1}
        />
        <circle
          cx={960}
          cy={500}
          r={40}
          fill={theme.colors.primary.main}
        />
        <text
          x={960}
          y={510}
          textAnchor="middle"
          fontSize={32}
          fill={theme.colors.text.inverse}
        >
          ✨
        </text>
      </g>

      {/* CTA */}
      <g opacity={fadeIn(f, 140, 20)} transform={`scale(${finalScale})`} style={{ transformOrigin: '960px 720px' }}>
        <rect
          x={660}
          y={700}
          width={600}
          height={60}
          rx={theme.radius.full}
          fill={theme.colors.primary.main}
          filter={`drop-shadow(0 4px 20px ${theme.colors.primary.glow})`}
        />
        <text
          x={960}
          y={738}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={theme.fontSize.bodySmall}
          fontWeight={FONT_WEIGHT.bold}
          fill={theme.colors.text.inverse}
          letterSpacing={2}
        >
          START ENGINEERING BETTER PROMPTS TODAY
        </text>

        {/* Pulse ring on CTA */}
        <rect
          x={660 - 4}
          y={700 - 4}
          width={608}
          height={68}
          rx={theme.radius.full}
          fill="none"
          stroke={theme.colors.primary.main}
          strokeWidth={2}
          opacity={0.3 * pulse(f, 0.06)}
        />
      </g>

      {/* Brand footer */}
      <g opacity={fadeIn(f, 160, 20)}>
        <text
          x={960}
          y={820}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.display}
          fontSize={theme.fontSize.caption - 4}
          fontWeight={FONT_WEIGHT.semibold}
          fill={theme.colors.text.muted}
          letterSpacing={4}
        >
          PROMPT ENGINEERING IN CLAUDE CODE · MOTION GRAPHICS · 1920×1080 · 30FPS
        </text>
      </g>

      {/* Corner accents */}
      {[
        { x: 60, y: 60 }, { x: 1860, y: 60 },
        { x: 60, y: 1020 }, { x: 1860, y: 1020 },
      ].map((pos, i) => (
        <g key={i} opacity={fadeIn(f, 20 + i * 5, 12)}>
          {[0, 1, 2].map((dot) => (
            <circle
              key={dot}
              cx={pos.x + (i % 2 === 0 ? dot * 14 : -dot * 14)}
              cy={pos.y}
              r={3}
              fill={theme.colors.primary.main}
              opacity={0.25 + 0.15 * pulse(f, 0.05, i + dot)}
            />
          ))}
        </g>
      ))}

      {/* Final fade to white */}
      {fadeToWhite > 0 && (
        <rect
          x={0}
          y={0}
          width={1920}
          height={1080}
          fill={theme.colors.bg.primary}
          opacity={fadeToWhite}
        />
      )}
    </g>
  );
};
