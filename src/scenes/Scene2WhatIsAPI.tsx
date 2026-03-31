import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {drawPath, easeOutExpo, typewriter, pulse} from '../utils';

export const Scene2WhatIsAPI: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn = interpolate(f, [0, 22], [0, 1], {extrapolateRight: 'clamp'});
  const sceneOut = interpolate(f, [240, 268], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(sceneIn, sceneOut);
  const entryZoom = interpolate(f, [0, 30], [1.06, 1.0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const titleIn = spring({frame: f - 5, fps, config: {damping: 20, stiffness: 70}});
  const clientIn = spring({frame: f - 30, fps, config: {damping: 14, stiffness: 100}});
  const apiIn = spring({frame: f - 50, fps, config: {damping: 14, stiffness: 100}});
  const serverIn = spring({frame: f - 70, fps, config: {damping: 14, stiffness: 100}});

  // Node positions
  const nodeY = 460;
  const clientX = 310, apiX = 960, serverX = 1610;
  const nodeR = 72;

  // Path drawing progress
  const reqPath1 = drawPath(f, 90, 35, easeOutExpo);
  const reqPath2 = drawPath(f, 125, 35, easeOutExpo);
  const resPath1 = drawPath(f, 160, 35, easeOutExpo);
  const resPath2 = drawPath(f, 195, 35, easeOutExpo);

  // Packet positions (follows path with delay)
  const packet1 = interpolate(f, [100, 130], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const packet2 = interpolate(f, [135, 165], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const packet3 = interpolate(f, [170, 200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const packet4 = interpolate(f, [205, 235], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Terminal window (f=145-220)
  const termIn = spring({frame: f - 145, fps, config: {damping: 20, stiffness: 80}});
  const reqText = 'GET /weather?city=NYC';
  const resText = '200 OK  { "temp": "72°F", "city": "New York" }';
  const reqChars = typewriter(f, 155, reqText, 1.2);
  const resChars = typewriter(f, 185, resText, 1.5);

  // Definition callout (f=200-260)
  const defIn = spring({frame: f - 200, fps, config: {damping: 22, stiffness: 80}});

  const p = pulse(f, 0.06);

  // Arrow path helpers
  const reqArcY = nodeY - 50;
  const resArcY = nodeY + 50;
  const pathLen1 = 720;

  const Packet: React.FC<{progress: number; fromX: number; toX: number; y: number; color: string; label: string}> =
    ({progress, fromX, toX, y, color, label}) => {
    if (progress <= 0 || progress >= 1) return null;
    const x = fromX + (toX - fromX) * progress;
    return (
      <g>
        {/* Trail */}
        {[0.85, 0.7, 0.55].map((tp, i) => {
          if (progress < tp - 0.4) return null;
          const tx = fromX + (toX - fromX) * Math.max(0, progress - (3 - i) * 0.06);
          return <circle key={i} cx={tx} cy={y} r={10 - i * 2} fill={color} opacity={0.06 + i * 0.02} />;
        })}
        {/* Main packet */}
        <circle cx={x} cy={y} r={18} fill={color} opacity={0.12} />
        <rect x={x - 30} y={y - 14} width={60} height={28} rx={14}
          fill={color} style={{filter: `drop-shadow(0 2px 8px ${color}55)`}} />
        <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
          fontSize={12} fontFamily={theme.font.body} fontWeight="800"
          fill="#FFFFFF" letterSpacing={1}>{label}</text>
      </g>
    );
  };

  return (
    <g opacity={opacity} transform={`translate(960,540) scale(${entryZoom}) translate(-960,-540)`}>
      <defs>
        <radialGradient id="s2-bg" cx="50%" cy="48%" r="65%">
          <stop offset="0%" stopColor="#F0F5FF" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </radialGradient>
        <pattern id="s2-grid" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M 64 0 L 0 0 0 64" fill="none" stroke={theme.border.light} strokeWidth="0.8" />
        </pattern>
      </defs>

      <rect width={1920} height={1080} fill="url(#s2-bg)" />
      <rect width={1920} height={1080} fill="url(#s2-grid)" opacity={0.45} />

      {/* Title */}
      <g opacity={titleIn} transform={`translate(0,${(1 - titleIn) * -25})`}>
        <text x={960} y={68} textAnchor="middle"
          fontSize={16} fontFamily={theme.font.body} fontWeight="700"
          fill={theme.accent.purple} letterSpacing={6}>
          SCENE 01 — CONCEPT
        </text>
        <text x={960} y={138} textAnchor="middle"
          fontSize={72} fontFamily={theme.font.display} fontWeight="800"
          fill={theme.text.primary}>
          The Bridge Between Systems
        </text>
        <text x={960} y={185} textAnchor="middle"
          fontSize={24} fontFamily={theme.font.body} fontWeight="400"
          fill={theme.text.secondary}>
          APIs act as a bridge — connecting your app to any server
        </text>
        <rect x={860} y={202} width={200} height={3} rx={2} fill={theme.accent.purple} opacity={0.45} />
      </g>

      {/* CLIENT node */}
      <g opacity={clientIn} transform={`translate(${clientX},${nodeY}) scale(${clientIn})`}>
        <circle r={nodeR + 18} fill={theme.accent.blue} opacity={0.05 + 0.03 * p} />
        <circle r={nodeR + 8} fill="none" stroke={theme.accent.blue} strokeWidth={2} opacity={0.12 + 0.06 * p} />
        <circle r={nodeR} fill="#FFFFFF" stroke={theme.accent.blue} strokeWidth={2.5}
          style={{filter: 'drop-shadow(0 4px 20px rgba(29,111,232,0.14))'}} />
        <text x={0} y={-10} textAnchor="middle" dominantBaseline="middle" fontSize={42}>👤</text>
        <text x={0} y={35} textAnchor="middle" fontSize={20} fontFamily={theme.font.body}
          fontWeight="800" fill={theme.accent.blue} letterSpacing={2}>CLIENT</text>
        <text x={0} y={nodeR + 28} textAnchor="middle" fontSize={16}
          fontFamily={theme.font.body} fill={theme.text.muted}>Your App / Browser</text>
      </g>

      {/* API node (center, larger with rotating ring) */}
      <g opacity={apiIn} transform={`translate(${apiX},${nodeY}) scale(${apiIn})`}>
        <circle r={nodeR + 28} fill={theme.accent.purple} opacity={0.04 + 0.03 * p} />
        {/* Rotating connector ring */}
        <circle r={nodeR + 16} fill="none" stroke={theme.accent.purple}
          strokeWidth={2} strokeDasharray="12 8" opacity={0.20}
          transform={`rotate(${f * 0.8})`} />
        <circle r={nodeR + 6} fill="none" stroke={theme.accent.purple}
          strokeWidth={1.5} opacity={0.12} />
        <circle r={nodeR} fill="#FFFFFF" stroke={theme.accent.purple} strokeWidth={3}
          style={{filter: 'drop-shadow(0 4px 20px rgba(124,58,237,0.16))'}} />
        <text x={0} y={-10} textAnchor="middle" dominantBaseline="middle" fontSize={42}>🔗</text>
        <text x={0} y={35} textAnchor="middle" fontSize={20} fontFamily={theme.font.body}
          fontWeight="800" fill={theme.accent.purple} letterSpacing={2}>API</text>
        <text x={0} y={nodeR + 28} textAnchor="middle" fontSize={16}
          fontFamily={theme.font.body} fill={theme.text.muted}>The Bridge</text>
      </g>

      {/* SERVER node */}
      <g opacity={serverIn} transform={`translate(${serverX},${nodeY}) scale(${serverIn})`}>
        <circle r={nodeR + 18} fill={theme.accent.green} opacity={0.05 + 0.03 * p} />
        <circle r={nodeR + 8} fill="none" stroke={theme.accent.green} strokeWidth={2} opacity={0.12 + 0.06 * p} />
        <circle r={nodeR} fill="#FFFFFF" stroke={theme.accent.green} strokeWidth={2.5}
          style={{filter: 'drop-shadow(0 4px 20px rgba(5,150,105,0.14))'}} />
        <text x={0} y={-10} textAnchor="middle" dominantBaseline="middle" fontSize={42}>🗄️</text>
        <text x={0} y={35} textAnchor="middle" fontSize={20} fontFamily={theme.font.body}
          fontWeight="800" fill={theme.accent.green} letterSpacing={2}>SERVER</text>
        <text x={0} y={nodeR + 28} textAnchor="middle" fontSize={16}
          fontFamily={theme.font.body} fill={theme.text.muted}>Backend + Database</text>
      </g>

      {/* Request paths (upper arc) Client→API and API→Server */}
      <g>
        {/* Track lines */}
        <line x1={clientX + nodeR + 10} y1={reqArcY} x2={apiX - nodeR - 10} y2={reqArcY}
          stroke={theme.border.light} strokeWidth={1.5} strokeDasharray="6 8" />
        <line x1={apiX + nodeR + 10} y1={reqArcY} x2={serverX - nodeR - 10} y2={reqArcY}
          stroke={theme.border.light} strokeWidth={1.5} strokeDasharray="6 8" />

        {/* Drawn paths */}
        <line x1={clientX + nodeR + 10} y1={reqArcY}
          x2={clientX + nodeR + 10 + (apiX - clientX - 2 * nodeR - 20) * reqPath1} y2={reqArcY}
          stroke={theme.accent.blue} strokeWidth={2.5} strokeLinecap="round" />
        <line x1={apiX + nodeR + 10} y1={reqArcY}
          x2={apiX + nodeR + 10 + (serverX - apiX - 2 * nodeR - 20) * reqPath2} y2={reqArcY}
          stroke={theme.accent.purple} strokeWidth={2.5} strokeLinecap="round" />

        {/* Request label */}
        {reqPath1 > 0.4 && (
          <g opacity={interpolate(reqPath1, [0.4, 0.8], [0, 1])}>
            <rect x={(clientX + apiX) / 2 - 65} y={reqArcY - 30} width={130} height={26} rx={13}
              fill={theme.accent.blue} opacity={0.10} />
            <text x={(clientX + apiX) / 2} y={reqArcY - 17} textAnchor="middle" dominantBaseline="middle"
              fontSize={14} fontFamily={theme.font.mono} fontWeight="700"
              fill={theme.accent.blue}>① REQUEST</text>
          </g>
        )}
        {reqPath2 > 0.4 && (
          <g opacity={interpolate(reqPath2, [0.4, 0.8], [0, 1])}>
            <rect x={(apiX + serverX) / 2 - 72} y={reqArcY - 30} width={144} height={26} rx={13}
              fill={theme.accent.purple} opacity={0.10} />
            <text x={(apiX + serverX) / 2} y={reqArcY - 17} textAnchor="middle" dominantBaseline="middle"
              fontSize={14} fontFamily={theme.font.mono} fontWeight="700"
              fill={theme.accent.purple}>② FETCH DATA</text>
          </g>
        )}

        {/* Packets on request path */}
        <Packet progress={packet1} fromX={clientX + nodeR + 20} toX={apiX - nodeR - 20}
          y={reqArcY} color={theme.accent.blue} label="REQ" />
        <Packet progress={packet2} fromX={apiX + nodeR + 20} toX={serverX - nodeR - 20}
          y={reqArcY} color={theme.accent.purple} label="GET" />
      </g>

      {/* Response paths (lower arc) Server→API and API→Client */}
      <g>
        <line x1={serverX - nodeR - 10} y1={resArcY} x2={apiX + nodeR + 10} y2={resArcY}
          stroke={theme.border.light} strokeWidth={1.5} strokeDasharray="6 8" />
        <line x1={apiX - nodeR - 10} y1={resArcY} x2={clientX + nodeR + 10} y2={resArcY}
          stroke={theme.border.light} strokeWidth={1.5} strokeDasharray="6 8" />

        <line x1={serverX - nodeR - 10} y1={resArcY}
          x2={serverX - nodeR - 10 - (serverX - apiX - 2 * nodeR - 20) * resPath1} y2={resArcY}
          stroke={theme.accent.green} strokeWidth={2.5} strokeLinecap="round" />
        <line x1={apiX - nodeR - 10} y1={resArcY}
          x2={apiX - nodeR - 10 - (apiX - clientX - 2 * nodeR - 20) * resPath2} y2={resArcY}
          stroke={theme.accent.orange} strokeWidth={2.5} strokeLinecap="round" />

        {resPath1 > 0.4 && (
          <g opacity={interpolate(resPath1, [0.4, 0.8], [0, 1])}>
            <rect x={(apiX + serverX) / 2 - 65} y={resArcY + 8} width={130} height={26} rx={13}
              fill={theme.accent.green} opacity={0.10} />
            <text x={(apiX + serverX) / 2} y={resArcY + 21} textAnchor="middle" dominantBaseline="middle"
              fontSize={14} fontFamily={theme.font.mono} fontWeight="700"
              fill={theme.accent.green}>③ RESPONSE</text>
          </g>
        )}
        {resPath2 > 0.4 && (
          <g opacity={interpolate(resPath2, [0.4, 0.8], [0, 1])}>
            <rect x={(clientX + apiX) / 2 - 55} y={resArcY + 8} width={110} height={26} rx={13}
              fill={theme.accent.orange} opacity={0.10} />
            <text x={(clientX + apiX) / 2} y={resArcY + 21} textAnchor="middle" dominantBaseline="middle"
              fontSize={14} fontFamily={theme.font.mono} fontWeight="700"
              fill={theme.accent.orange}>④ RESULT</text>
          </g>
        )}

        <Packet progress={packet3} fromX={serverX - nodeR - 20} toX={apiX + nodeR + 20}
          y={resArcY} color={theme.accent.green} label="RES" />
        <Packet progress={packet4} fromX={apiX - nodeR - 20} toX={clientX + nodeR + 20}
          y={resArcY} color={theme.accent.orange} label="JSON" />
      </g>

      {/* Terminal window */}
      <g opacity={termIn} transform={`translate(0,${(1 - termIn) * 30})`}>
        <rect x={310} y={608} width={1300} height={140} rx={16}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
          style={{filter: 'drop-shadow(0 4px 20px rgba(29,111,232,0.10))'}} />
        {/* Terminal header */}
        <rect x={310} y={608} width={1300} height={38} rx={16} fill={theme.bg.code} />
        <rect x={310} y={630} width={1300} height={16} fill={theme.bg.code} />
        <circle cx={338} cy={628} r={6} fill={theme.accent.red} opacity={0.7} />
        <circle cx={360} cy={628} r={6} fill={theme.accent.amber} opacity={0.7} />
        <circle cx={382} cy={628} r={6} fill={theme.accent.green} opacity={0.7} />
        <text x={960} y={628} textAnchor="middle" dominantBaseline="middle"
          fontSize={13} fontFamily={theme.font.mono} fontWeight="600"
          fill={theme.text.muted}>API Request / Response</text>

        {/* Request line */}
        <text x={340} y={672} dominantBaseline="middle"
          fontSize={14} fontFamily={theme.font.mono} fontWeight="600" fill={theme.accent.green}>{'>'}</text>
        <text x={360} y={672} dominantBaseline="middle"
          fontSize={18} fontFamily={theme.font.mono} fontWeight="500" fill={theme.accent.blue}>
          {reqText.slice(0, reqChars)}
        </text>
        {reqChars < reqText.length && reqChars > 0 && Math.sin(f * 0.15) > 0 && (
          <rect x={360 + reqChars * 10.5} y={660} width={2} height={22} fill={theme.accent.blue} rx={1} />
        )}

        {/* Response line */}
        <text x={340} y={716} dominantBaseline="middle"
          fontSize={14} fontFamily={theme.font.mono} fontWeight="600" fill={theme.accent.orange}>{'<'}</text>
        <text x={360} y={716} dominantBaseline="middle"
          fontSize={18} fontFamily={theme.font.mono} fontWeight="500" fill={theme.accent.green}>
          {resText.slice(0, resChars)}
        </text>
        {resChars < resText.length && resChars > 0 && Math.sin(f * 0.15) > 0 && (
          <rect x={360 + resChars * 10.5} y={704} width={2} height={22} fill={theme.accent.green} rx={1} />
        )}
      </g>

      {/* Definition callout */}
      <g opacity={defIn} transform={`translate(0,${(1 - defIn) * 24})`}>
        <rect x={310} y={778} width={1300} height={115} rx={16}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
          style={{filter: 'drop-shadow(0 4px 20px rgba(29,111,232,0.09))'}} />
        <rect x={310} y={778} width={5} height={115} rx={3} fill={theme.accent.blue} />
        <circle cx={360} cy={835} r={24} fill={theme.accent.blue} opacity={0.10} />
        <text x={360} y={835} textAnchor="middle" dominantBaseline="middle" fontSize={26}>💡</text>
        <text x={400} y={815} fontSize={18} fontFamily={theme.font.body} fontWeight="700"
          fill={theme.text.primary}>Definition</text>
        <text x={400} y={845} fontSize={20} fontFamily={theme.font.body} fontWeight="400"
          fill={theme.text.secondary}>
          An API is a
          <tspan fontWeight="700" fill={theme.accent.blue}> defined contract </tspan>
          that lets software systems
          <tspan fontWeight="700" fill={theme.accent.purple}> communicate and exchange data</tspan>.
        </text>
        <text x={400} y={874} fontSize={17} fontFamily={theme.font.body} fill={theme.text.muted}>
          Think of it as a menu — it tells you what you can request and how to ask for it.
        </text>
      </g>
    </g>
  );
};
