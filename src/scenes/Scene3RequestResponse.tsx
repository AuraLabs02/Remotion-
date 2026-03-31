import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {drawPath, easeOutExpo, typewriter, pulse} from '../utils';

export const Scene3RequestResponse: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn = interpolate(f, [0, 22], [0, 1], {extrapolateRight: 'clamp'});
  const sceneOut = interpolate(f, [300, 328], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(sceneIn, sceneOut);
  const entryZoom = interpolate(f, [0, 28], [1.05, 1.0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const titleIn = spring({frame: f - 5, fps, config: {damping: 22, stiffness: 80}});

  // Pipeline nodes - 4 nodes instead of 6 for clarity
  const nodes = [
    {x: 200,  y: 430, label: 'CLIENT',   sub: 'Web App',  color: theme.accent.blue,   icon: '💻'},
    {x: 680,  y: 430, label: 'HTTP',     sub: 'Request',  color: theme.accent.purple, icon: '📡'},
    {x: 1240, y: 430, label: 'SERVER',   sub: 'Backend',  color: theme.accent.orange, icon: '⚙️'},
    {x: 1720, y: 430, label: 'DATABASE', sub: 'Storage',  color: theme.accent.green,  icon: '🗄️'},
  ];

  // Node hexagon dimensions - larger
  const hw = 100, hh = 80;
  const hexPts = (cx: number, cy: number, w: number, h: number) =>
    `${cx},${cy - h} ${cx + w * 0.866},${cy - h * 0.5} ${cx + w * 0.866},${cy + h * 0.5} ${cx},${cy + h} ${cx - w * 0.866},${cy + h * 0.5} ${cx - w * 0.866},${cy - h * 0.5}`;

  // Request packet progress (travels through 3 segments)
  const reqP = interpolate(f, [80, 180], [0, 3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Response packet progress
  const resP = interpolate(f, [195, 275], [0, 3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Code typewriter
  const reqLines = [
    {text: 'GET /api/v2/weather?city=NYC', color: theme.accent.purple},
    {text: 'Host: api.openweather.com', color: theme.accent.blue},
    {text: 'Authorization: Bearer eyJhbG...', color: theme.accent.blue},
    {text: 'Accept: application/json', color: theme.accent.blue},
  ];
  const resLines = [
    {text: '200 OK', color: theme.accent.green},
    {text: 'Content-Type: application/json', color: theme.accent.blue},
    {text: '{ "temp": "72°F",', color: theme.accent.purple},
    {text: '  "city": "New York" }', color: theme.accent.purple},
  ];

  const codeIn = interpolate(f, [110, 140], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const resCodeIn = interpolate(f, [200, 230], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Latency bar chart (f=260-310)
  const latencyIn = interpolate(f, [260, 290], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const latencyBars = [
    {label: 'DNS', ms: 15, color: theme.accent.cyan, maxW: 60},
    {label: 'TCP', ms: 20, color: theme.accent.blue, maxW: 80},
    {label: 'TLS', ms: 30, color: theme.accent.purple, maxW: 120},
    {label: 'API', ms: 40, color: theme.accent.amber, maxW: 160},
    {label: 'DB', ms: 10, color: theme.accent.green, maxW: 40},
  ];

  const totalIn = interpolate(f, [285, 310], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const p = pulse(f, 0.08);

  // Packet renderer
  const PacketNode: React.FC<{progress: number; isResponse: boolean}> = ({progress, isResponse}) => {
    if (progress <= 0 || progress >= 3) return null;
    const seg = Math.floor(progress);
    const t = progress - seg;
    const fromIdx = isResponse ? 3 - seg : seg;
    const toIdx = isResponse ? 2 - seg : seg + 1;
    const from = nodes[fromIdx];
    const to = nodes[toIdx];
    if (!from || !to) return null;
    const yOff = isResponse ? 55 : -55;
    const x = from.x + (to.x - from.x) * t;
    const y = from.y + yOff;
    const color = isResponse ? theme.accent.green : theme.accent.blue;
    const label = isResponse ? 'RES' : 'REQ';
    return (
      <g>
        {/* Trail */}
        {[1, 2, 3].map(ti => {
          const tx = x - (isResponse ? -1 : 1) * ti * 18;
          return <circle key={ti} cx={tx} cy={y} r={12 - ti * 2.5} fill={color} opacity={0.05 + ti * 0.02} />;
        })}
        {/* Glow */}
        <circle cx={x} cy={y} r={24} fill={color} opacity={0.10} />
        {/* Packet */}
        <rect x={x - 32} y={y - 15} width={64} height={30} rx={15}
          fill={color} style={{filter: `drop-shadow(0 2px 10px ${color}60)`}} />
        <rect x={x - 24} y={y - 10} width={48} height={8} rx={4} fill="rgba(255,255,255,0.30)" />
        <text x={x} y={y + 2} textAnchor="middle" dominantBaseline="middle"
          fontSize={13} fontFamily={theme.font.body} fontWeight="800"
          fill="#FFFFFF" letterSpacing={1}>{label}</text>
      </g>
    );
  };

  return (
    <g opacity={opacity} transform={`translate(960,540) scale(${entryZoom}) translate(-960,-540)`}>
      <defs>
        <radialGradient id="s3-bg" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#F5F7FF" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </radialGradient>
        <pattern id="s3-dots" width="44" height="44" patternUnits="userSpaceOnUse">
          <circle cx="22" cy="22" r="1.4" fill={theme.accent.blue} opacity="0.06" />
        </pattern>
      </defs>

      <rect width={1920} height={1080} fill="url(#s3-bg)" />
      <rect width={1920} height={1080} fill="url(#s3-dots)" />

      {/* Title */}
      <g opacity={titleIn} transform={`translate(0,${(1 - titleIn) * -20})`}>
        <text x={960} y={68} textAnchor="middle" fontSize={16}
          fontFamily={theme.font.body} fontWeight="700" fill={theme.accent.cyan} letterSpacing={6}>
          SCENE 02 — PIPELINE
        </text>
        <text x={960} y={136} textAnchor="middle" fontSize={64}
          fontFamily={theme.font.display} fontWeight="800" fill={theme.text.primary}>
          Inside the Request Pipeline
        </text>
        <text x={960} y={180} textAnchor="middle" fontSize={24}
          fontFamily={theme.font.body} fontWeight="400" fill={theme.text.secondary}>
          Every API call travels through these layers in milliseconds
        </text>
        <rect x={880} y={196} width={160} height={3} rx={2} fill={theme.accent.cyan} opacity={0.5} />
      </g>

      {/* Flow direction labels */}
      {f > 55 && (
        <g opacity={interpolate(f, [55, 75], [0, 1], {extrapolateRight: 'clamp'})}>
          <text x={960} y={352} textAnchor="middle" fontSize={14}
            fontFamily={theme.font.body} fontWeight="700" fill={theme.accent.blue} letterSpacing={5}>
            REQUEST →
          </text>
          <text x={960} y={515} textAnchor="middle" fontSize={14}
            fontFamily={theme.font.body} fontWeight="700" fill={theme.accent.green} letterSpacing={5}>
            ← RESPONSE
          </text>
        </g>
      )}

      {/* Track lines between nodes */}
      {nodes.slice(0, -1).map((node, i) => {
        const next = nodes[i + 1];
        const segReqDone = reqP > i;
        const segResDone = resP > (2 - i);
        return (
          <g key={i}>
            <line x1={node.x + hw * 0.866 + 8} y1={node.y - 40} x2={next.x - hw * 0.866 - 8} y2={next.y - 40}
              stroke={segReqDone ? theme.accent.blue : theme.border.light}
              strokeWidth={segReqDone ? 2.5 : 1.5} strokeDasharray="8 5"
              opacity={segReqDone ? 0.50 : 0.30} />
            <line x1={node.x + hw * 0.866 + 8} y1={node.y + 40} x2={next.x - hw * 0.866 - 8} y2={next.y + 40}
              stroke={segResDone ? theme.accent.green : theme.border.light}
              strokeWidth={segResDone ? 2.5 : 1.5} strokeDasharray="8 5"
              opacity={segResDone ? 0.50 : 0.30} />
          </g>
        );
      })}

      {/* Hexagon nodes */}
      {nodes.map((node, i) => {
        const ni = spring({frame: f - (12 + i * 14), fps, config: {damping: 14, stiffness: 100}});
        const isReqActive = reqP > i - 0.3;
        const isResActive = resP > (2.7 - i);
        const isActive = isReqActive || isResActive;
        return (
          <g key={i} opacity={ni}>
            {/* Active glow */}
            {isActive && (
              <polygon points={hexPts(node.x, node.y, hw + 14, hh + 10)} fill="none"
                stroke={node.color} strokeWidth={2.5} opacity={0.15 + 0.08 * p} />
            )}
            {/* Shadow */}
            <polygon points={hexPts(node.x, node.y + 6, hw, hh)} fill={node.color} opacity={0.06} />
            {/* Main hex */}
            <polygon points={hexPts(node.x, node.y, hw, hh)}
              fill="#FFFFFF" stroke={node.color} strokeWidth={isActive ? 3 : 2} />
            {/* Icon */}
            <text x={node.x} y={node.y - 14} textAnchor="middle" dominantBaseline="middle"
              fontSize={34}>{node.icon}</text>
            {/* Label */}
            <text x={node.x} y={node.y + 26} textAnchor="middle"
              fontSize={14} fontFamily={theme.font.body} fontWeight="800"
              fill={node.color} letterSpacing={2}>{node.label}</text>
            {/* Sub */}
            <text x={node.x} y={node.y + hh + 24} textAnchor="middle"
              fontSize={15} fontFamily={theme.font.body} fill={theme.text.muted}>{node.sub}</text>
            {/* Active dot */}
            {isActive && (
              <circle cx={node.x + hw * 0.7} cy={node.y - hh * 0.8} r={7}
                fill={theme.accent.green} opacity={0.7 + 0.3 * p} />
            )}
          </g>
        );
      })}

      {/* Packets */}
      <PacketNode progress={reqP} isResponse={false} />
      <PacketNode progress={resP} isResponse={true} />

      {/* Code panel - centered below pipeline */}
      <g opacity={Math.max(codeIn, resCodeIn)} transform={`translate(0,${(1 - Math.max(codeIn, resCodeIn)) * 20})`}>
        <rect x={160} y={570} width={1600} height={210} rx={16}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={1.5}
          style={{filter: 'drop-shadow(0 4px 20px rgba(29,111,232,0.08))'}} />
        {/* Header bar */}
        <rect x={160} y={570} width={1600} height={38} rx={16} fill={theme.bg.code} />
        <rect x={160} y={594} width={1600} height={14} fill={theme.bg.code} />
        <circle cx={190} cy={590} r={6} fill={theme.accent.red} opacity={0.7} />
        <circle cx={212} cy={590} r={6} fill={theme.accent.amber} opacity={0.7} />
        <circle cx={234} cy={590} r={6} fill={theme.accent.green} opacity={0.7} />

        {/* Request column */}
        <g opacity={codeIn}>
          <circle cx={210} cy={622} r={8} fill={theme.accent.blue} opacity={0.6} />
          <text x={228} y={622} dominantBaseline="middle"
            fontSize={14} fontFamily={theme.font.body} fontWeight="700" fill={theme.accent.blue}>
            HTTP REQUEST
          </text>
          {reqLines.map((line, ri) => {
            const lineChars = typewriter(f, 120 + ri * 12, line.text, 1.5);
            return (
              <text key={ri} x={210} y={650 + ri * 28} dominantBaseline="middle"
                fontSize={16} fontFamily={theme.font.mono} fontWeight="500" fill={line.color}>
                {line.text.slice(0, lineChars)}
              </text>
            );
          })}
        </g>

        {/* Divider */}
        <line x1={960} y1={612} x2={960} y2={770} stroke={theme.border.light} strokeWidth={1} />

        {/* Response column */}
        <g opacity={resCodeIn}>
          <circle cx={1000} cy={622} r={8} fill={theme.accent.green} opacity={0.6} />
          <text x={1018} y={622} dominantBaseline="middle"
            fontSize={14} fontFamily={theme.font.body} fontWeight="700" fill={theme.accent.green}>
            HTTP RESPONSE
          </text>
          {resLines.map((line, ri) => {
            const lineChars = typewriter(f, 208 + ri * 12, line.text, 1.5);
            return (
              <text key={ri} x={1000} y={650 + ri * 28} dominantBaseline="middle"
                fontSize={16} fontFamily={theme.font.mono} fontWeight="500" fill={line.color}>
                {line.text.slice(0, lineChars)}
              </text>
            );
          })}
        </g>
      </g>

      {/* Latency bar chart */}
      <g opacity={latencyIn} transform={`translate(0,${(1 - latencyIn) * 20})`}>
        <text x={960} y={810} textAnchor="middle"
          fontSize={14} fontFamily={theme.font.body} fontWeight="700"
          fill={theme.text.muted} letterSpacing={4}>
          LATENCY BREAKDOWN
        </text>
        {latencyBars.map((bar, i) => {
          const barW = bar.maxW * latencyIn;
          const bx = 240 + i * 310;
          return (
            <g key={i}>
              {/* Bar track */}
              <rect x={bx} y={830} width={200} height={32} rx={8} fill={theme.bg.code} />
              {/* Bar fill */}
              <rect x={bx} y={830} width={barW} height={32} rx={8} fill={bar.color} opacity={0.75} />
              {/* Label */}
              <text x={bx + 210} y={840} fontSize={18}
                fontFamily={theme.font.body} fontWeight="800" fill={bar.color}>~{bar.ms}ms</text>
              <text x={bx + 210} y={858} fontSize={14}
                fontFamily={theme.font.body} fill={theme.text.muted}>{bar.label}</text>
            </g>
          );
        })}
      </g>

      {/* Total latency badge */}
      <g opacity={totalIn} transform={`translate(0,${(1 - totalIn) * 14})`}>
        <rect x={560} y={886} width={800} height={60} rx={30}
          fill="#FFFFFF" stroke={theme.border.light} strokeWidth={2}
          style={{filter: 'drop-shadow(0 4px 16px rgba(29,111,232,0.10))'}} />
        <circle cx={610} cy={916} r={10} fill={theme.accent.green} opacity={0.18} />
        <circle cx={610} cy={916} r={6} fill={theme.accent.green} />
        <text x={634} y={916} dominantBaseline="middle"
          fontSize={22} fontFamily={theme.font.body} fontWeight="700" fill={theme.text.primary}>
          Round trip complete —
        </text>
        <text x={920} y={916} dominantBaseline="middle"
          fontSize={22} fontFamily={theme.font.body} fontWeight="800" fill={theme.accent.blue}>
          ~120ms avg
        </text>
      </g>
    </g>
  );
};
