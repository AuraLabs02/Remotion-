import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const Scene3RequestResponse: React.FC<{startFrame: number}> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - startFrame;

  const sceneIn = interpolate(f, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const sceneOut = interpolate(f, [300, 330], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(sceneIn, sceneOut);

  // Node positions in the pipeline
  const nodes = [
    {x: 120, y: 450, label: 'CLIENT', sublabel: 'Your App', color: '#00ff88', icon: '💻'},
    {x: 420, y: 450, label: 'DNS', sublabel: 'Resolver', color: '#00d4ff', icon: '🌐'},
    {x: 720, y: 450, label: 'HTTP', sublabel: 'Request', color: '#7b2fff', icon: '📡'},
    {x: 1020, y: 450, label: 'API', sublabel: 'Gateway', color: '#ffb347', icon: '🔗'},
    {x: 1320, y: 450, label: 'SERVER', sublabel: 'Backend', color: '#ff6b6b', icon: '⚙️'},
    {x: 1620, y: 450, label: 'DATABASE', sublabel: 'Storage', color: '#00d4ff', icon: '🗄️'},
  ];

  // Packet animation - travels across the pipeline
  const requestProgress = interpolate(f, [40, 160], [0, 5], {extrapolateRight: 'clamp'});
  const responseProgress = interpolate(f, [180, 290], [0, 5], {extrapolateRight: 'clamp'});

  // Code panels appear
  const codeOpacity = interpolate(f, [50, 90], [0, 1], {extrapolateRight: 'clamp'});

  // Status code display
  const statusOpacity = interpolate(f, [200, 230], [0, 1], {extrapolateRight: 'clamp'});
  const titleOpacity = interpolate(f, [0, 25], [0, 1], {extrapolateRight: 'clamp'});

  const drawNode = (node: typeof nodes[0], index: number) => {
    const nodeIn = spring({frame: f - (10 + index * 15), fps, config: {damping: 14, stiffness: 100}});
    const isActive = requestProgress > index - 0.5 || responseProgress > (5 - index - 0.5);
    const glowOpacity = isActive ? 0.4 + 0.2 * Math.sin(f * 0.1) : 0.1;

    return (
      <g key={index} opacity={nodeIn}>
        {/* Glow */}
        <circle cx={node.x} cy={node.y} r={72} fill={node.color} opacity={glowOpacity * 0.3} />
        {/* Hexagon shape */}
        <polygon
          points={`
            ${node.x},${node.y - 65}
            ${node.x + 56},${node.y - 32}
            ${node.x + 56},${node.y + 32}
            ${node.x},${node.y + 65}
            ${node.x - 56},${node.y + 32}
            ${node.x - 56},${node.y - 32}
          `}
          fill={`${node.color}15`}
          stroke={node.color}
          strokeWidth={isActive ? 3 : 2}
          opacity={0.9}
        />
        {/* Icon */}
        <text x={node.x} y={node.y - 8} textAnchor="middle" dominantBaseline="middle" fontSize={32}>
          {node.icon}
        </text>
        {/* Label */}
        <text
          x={node.x}
          y={node.y + 28}
          textAnchor="middle"
          fontSize={14}
          fontFamily="'Arial Black', sans-serif"
          fontWeight="800"
          fill={node.color}
          letterSpacing={1}
        >
          {node.label}
        </text>
        {/* Sub label */}
        <text
          x={node.x}
          y={node.y + 88}
          textAnchor="middle"
          fontSize={13}
          fontFamily="Arial, sans-serif"
          fill="#6688aa"
        >
          {node.sublabel}
        </text>
        {/* Active indicator */}
        {isActive && (
          <circle cx={node.x + 48} cy={node.y - 52} r={8} fill="#00ff88" opacity={0.8 + 0.2 * Math.sin(f * 0.2)}>
            <animate attributeName="r" values="6;10;6" dur="1s" repeatCount="indefinite" />
          </circle>
        )}
      </g>
    );
  };

  const drawPacket = (progress: number, isResponse: boolean) => {
    if (progress <= 0 || progress >= 5) return null;
    const segmentIndex = Math.floor(progress);
    const segmentProgress = progress - segmentIndex;

    const fromNode = isResponse ? nodes[5 - segmentIndex] : nodes[segmentIndex];
    const toNode = isResponse ? nodes[4 - segmentIndex] : nodes[segmentIndex + 1];

    if (!fromNode || !toNode) return null;

    const x = fromNode.x + (toNode.x - fromNode.x) * segmentProgress;
    const y = fromNode.y + (toNode.y - fromNode.y) * segmentProgress + (isResponse ? 50 : -50);
    const color = isResponse ? '#ffb347' : '#00ff88';
    const label = isResponse ? 'RESPONSE' : 'REQUEST';

    return (
      <g>
        {/* Trail */}
        <circle cx={x} cy={y} r={20} fill={color} opacity={0.15} />
        <circle cx={x} cy={y} r={12} fill={color} opacity={0.3} />
        {/* Packet body */}
        <rect x={x - 30} y={y - 14} width={60} height={28} rx={8} fill={color} opacity={0.95} />
        <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#000" fontWeight="bold">
          {label}
        </text>
        {/* Glow */}
        <circle cx={x} cy={y} r={25} fill={color} opacity={0.08} />
      </g>
    );
  };

  const drawConnection = (from: typeof nodes[0], to: typeof nodes[0], index: number) => {
    const progress = requestProgress > index ? 1 : 0;
    const retProgress = responseProgress > (5 - index - 1) ? 1 : 0;
    return (
      <g key={index}>
        {/* Forward connection line */}
        <line
          x1={from.x + 58}
          y1={from.y - 25}
          x2={to.x - 58}
          y2={to.y - 25}
          stroke="#00ff88"
          strokeWidth={1.5}
          strokeDasharray="6 4"
          opacity={0.2 + 0.4 * progress}
        />
        {/* Return connection line */}
        <line
          x1={from.x + 58}
          y1={from.y + 25}
          x2={to.x - 58}
          y2={to.y + 25}
          stroke="#ffb347"
          strokeWidth={1.5}
          strokeDasharray="6 4"
          opacity={0.2 + 0.4 * retProgress}
        />
      </g>
    );
  };

  return (
    <g opacity={opacity}>
      <defs>
        <filter id="hex-glow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Title */}
      <g opacity={titleOpacity}>
        <text x={960} y={80} textAnchor="middle" fontSize={18} fontFamily="Arial" fontWeight="600" fill="#ffb347" letterSpacing={6}>
          THE REQUEST-RESPONSE CYCLE
        </text>
        <text
          x={960}
          y={130}
          textAnchor="middle"
          fontSize={56}
          fontFamily="'Arial Black', sans-serif"
          fontWeight="900"
          fill="#ffffff"
          style={{filter: 'drop-shadow(0 0 20px #7b2fff)'}}
        >
          Inside the Pipeline
        </text>
        <rect x={760} y={152} width={400} height={2} rx={1} fill="url(#pipeline-grad)" opacity={0.7} />
        <defs>
          <linearGradient id="pipeline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#ffb347" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </g>

      {/* Connection lines */}
      {nodes.slice(0, -1).map((node, i) => drawConnection(node, nodes[i + 1], i))}

      {/* Nodes */}
      {nodes.map((node, i) => drawNode(node, i))}

      {/* Moving packets */}
      {drawPacket(requestProgress, false)}
      {drawPacket(responseProgress, true)}

      {/* HTTP Request code panel */}
      <g opacity={codeOpacity}>
        <rect x={40} y={600} width={420} height={200} rx={12} fill="#0a0f1e" stroke="#00ff88" strokeWidth={1.5} opacity={0.9} />
        <rect x={40} y={600} width={420} height={36} rx={12} fill="#00ff88" opacity={0.15} />
        <rect x={40} y={624} width={420} height={12} rx={0} fill="#00ff88" opacity={0.15} />
        <text x={60} y={624} fontSize={13} fontFamily="'Courier New', monospace" fill="#00ff88" fontWeight="bold">REQUEST</text>
        {[
          ['GET', ' /api/v2/weather?city=NYC'],
          ['Host:', ' api.openweather.com'],
          ['Auth:', ' Bearer eyJhbGci...'],
          ['Accept:', ' application/json'],
          ['Cache:', ' no-cache'],
        ].map(([key, val], i) => (
          <g key={i}>
            <text x={60} y={652 + i * 28} fontSize={12} fontFamily="'Courier New', monospace" fill="#7b2fff" fontWeight="bold">{key}</text>
            <text x={60 + key.length * 8} y={652 + i * 28} fontSize={12} fontFamily="'Courier New', monospace" fill="#a0c8e0">{val}</text>
          </g>
        ))}
      </g>

      {/* HTTP Response code panel */}
      <g opacity={statusOpacity}>
        <rect x={1460} y={600} width={420} height={200} rx={12} fill="#0a0f1e" stroke="#ffb347" strokeWidth={1.5} opacity={0.9} />
        <rect x={1460} y={600} width={420} height={36} rx={12} fill="#ffb347" opacity={0.15} />
        <rect x={1460} y={624} width={420} height={12} rx={0} fill="#ffb347" opacity={0.15} />
        <text x={1480} y={624} fontSize={13} fontFamily="'Courier New', monospace" fill="#ffb347" fontWeight="bold">RESPONSE</text>
        {[
          ['Status:', ' 200 OK'],
          ['Content:', ' application/json'],
          ['{', ''],
          ['  temp:', ' 72°F,'],
          ['  city:', ' "New York"'],
        ].map(([key, val], i) => (
          <g key={i}>
            <text x={1480} y={652 + i * 28} fontSize={12} fontFamily="'Courier New', monospace" fill="#ffb347" fontWeight="bold">{key}</text>
            <text x={1480 + key.length * 8} y={652 + i * 28} fontSize={12} fontFamily="'Courier New', monospace" fill="#a0c8e0">{val}</text>
          </g>
        ))}
      </g>

      {/* Status indicator bottom */}
      {f > 260 && (
        <g opacity={interpolate(f, [260, 285], [0, 1], {extrapolateRight: 'clamp'})}>
          <rect x={660} y={860} width={600} height={60} rx={30} fill="#00ff8815" stroke="#00ff88" strokeWidth={2} />
          <circle cx={700} cy={890} r={10} fill="#00ff88" opacity={0.8 + 0.2 * Math.sin(f * 0.2)} />
          <text x={730} y={895} textAnchor="start" dominantBaseline="middle" fontSize={20} fill="#00ff88" fontFamily="'Arial Black', sans-serif" fontWeight="800" letterSpacing={2}>
            ROUND TRIP COMPLETE — ~120ms
          </text>
        </g>
      )}
    </g>
  );
};
