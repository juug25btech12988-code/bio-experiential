import React, { useEffect, useRef, useState } from 'react';
import { BASE_COLORS } from '../lib/dnaCodec';

/**
 * DoubleHelix component
 * Continuously rotating 3D-looking double helix rendered on SVG.
 * Two sine-wave backbones with base-pair rungs colored according to the A/T/G/C palette.
 * Depth illusion: rungs shrink and fade as they go behind.
 */
export default function DoubleHelix({
  width = 380,
  height = 520,
  speed = 1,
  className = '',
}) {
  const [phase, setPhase] = useState(0);
  const requestRef = useRef();
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion.current) return;

    let lastTime = performance.now();
    const animate = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      setPhase((prev) => (prev + delta * 1.2 * speed) % (Math.PI * 2));
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [speed]);

  const numRungs = 26;
  const rungs = [];
  const paddingY = 30;
  const usableHeight = height - paddingY * 2;
  const centerY = height / 2;
  const centerX = width / 2;
  const amplitude = Math.min(width * 0.36, 110);
  const frequency = (Math.PI * 3.5) / usableHeight;

  const basePattern = [
    { left: 'A', right: 'T' },
    { left: 'G', right: 'C' },
    { left: 'T', right: 'A' },
    { left: 'C', right: 'G' },
    { left: 'A', right: 'T' },
    { left: 'C', right: 'G' },
    { left: 'G', right: 'C' },
    { left: 'T', right: 'A' },
  ];

  for (let i = 0; i < numRungs; i++) {
    const y = paddingY + (i / (numRungs - 1)) * usableHeight;
    const angle = phase + y * frequency;

    // x-positions along sine waves
    const cosVal = Math.cos(angle);
    const sinVal = Math.sin(angle); // depth indicator: >0 front, <0 back

    const x1 = centerX - amplitude * cosVal;
    const x2 = centerX + amplitude * cosVal;

    // Depth factor normalized 0 (farthest behind) to 1 (closest in front)
    const depth = (sinVal + 1) / 2;

    const pair = basePattern[i % basePattern.length];
    // Invert left/right visually depending on whether the strand is rotated
    const isFlipped = cosVal < 0;
    const leftBase = isFlipped ? pair.right : pair.left;
    const rightBase = isFlipped ? pair.left : pair.right;

    rungs.push({
      id: i,
      y,
      x1,
      x2,
      depth,
      sinVal,
      leftBase,
      rightBase,
      leftColor: BASE_COLORS[leftBase].hex,
      rightColor: BASE_COLORS[rightBase].hex,
    });
  }

  // Sort rungs by depth so back rungs are rendered behind front rungs
  const sortedRungs = [...rungs].sort((a, b) => a.depth - b.depth);

  // Generate continuous smooth backbone paths
  const samples = 90;
  let pathStrand1 = '';
  let pathStrand2 = '';

  for (let i = 0; i <= samples; i++) {
    const y = paddingY + (i / samples) * usableHeight;
    const angle = phase + y * frequency;
    const x1 = centerX - amplitude * Math.cos(angle);
    const x2 = centerX + amplitude * Math.cos(angle);

    if (i === 0) {
      pathStrand1 = `M ${x1.toFixed(1)} ${y.toFixed(1)}`;
      pathStrand2 = `M ${x2.toFixed(1)} ${y.toFixed(1)}`;
    } else {
      pathStrand1 += ` L ${x1.toFixed(1)} ${y.toFixed(1)}`;
      pathStrand2 += ` L ${x2.toFixed(1)} ${y.toFixed(1)}`;
    }
  }

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width, height }}
      aria-label="3D Rotating DNA Double Helix"
      role="img"
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible drop-shadow-xl"
      >
        <defs>
          {/* Gradients for backbones */}
          <linearGradient id="backboneGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B7FD4" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#A5D4F4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="backboneGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#D4A5F4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6B7FD4" stopOpacity="0.95" />
          </linearGradient>
          {/* Radial glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient glow behind helix */}
        <ellipse
          cx={centerX}
          cy={centerY}
          rx={amplitude * 1.3}
          ry={usableHeight * 0.45}
          fill="url(#backboneGrad1)"
          opacity="0.07"
          filter="blur(28px)"
        />

        {/* Back rungs (depth < 0.5) */}
        {sortedRungs
          .filter((r) => r.depth <= 0.5)
          .map((r) => {
            const midX = (r.x1 + r.x2) / 2;
            const opacity = 0.25 + r.depth * 0.55;
            const strokeWidth = 1.4 + r.depth * 2;
            const radius = 3 + r.depth * 2;

            return (
              <g key={`back-rung-${r.id}`} opacity={opacity}>
                {/* Left half rung */}
                <line
                  x1={r.x1}
                  y1={r.y}
                  x2={midX}
                  y2={r.y}
                  stroke={r.leftColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
                {/* Right half rung */}
                <line
                  x1={midX}
                  y1={r.y}
                  x2={r.x2}
                  y2={r.y}
                  stroke={r.rightColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
                {/* Hydrogen bond center dot */}
                <circle cx={midX} cy={r.y} r={1.2} fill="#E2E8F0" opacity={0.6} />
              </g>
            );
          })}

        {/* Strand 1 Backbone */}
        <path
          d={pathStrand1}
          fill="none"
          stroke="url(#backboneGrad1)"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.92"
        />

        {/* Strand 2 Backbone */}
        <path
          d={pathStrand2}
          fill="none"
          stroke="url(#backboneGrad2)"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.92"
        />

        {/* Front rungs (depth > 0.5) */}
        {sortedRungs
          .filter((r) => r.depth > 0.5)
          .map((r) => {
            const midX = (r.x1 + r.x2) / 2;
            const opacity = 0.55 + (r.depth - 0.5) * 0.9;
            const strokeWidth = 2.4 + (r.depth - 0.5) * 3.2;
            const nodeRadius = 3.8 + (r.depth - 0.5) * 2.8;

            return (
              <g key={`front-rung-${r.id}`} opacity={Math.min(1, opacity)}>
                {/* Left half rung */}
                <line
                  x1={r.x1}
                  y1={r.y}
                  x2={midX}
                  y2={r.y}
                  stroke={r.leftColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
                {/* Right half rung */}
                <line
                  x1={midX}
                  y1={r.y}
                  x2={r.x2}
                  y2={r.y}
                  stroke={r.rightColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
                {/* Node endpoints at backbone */}
                <circle cx={r.x1} cy={r.y} r={nodeRadius} fill={r.leftColor} />
                <circle cx={r.x2} cy={r.y} r={nodeRadius} fill={r.rightColor} />
                {/* Center hydrogen bond */}
                <circle cx={midX} cy={r.y} r={1.6} fill="#FFFFFF" />
              </g>
            );
          })}
      </svg>
    </div>
  );
}
