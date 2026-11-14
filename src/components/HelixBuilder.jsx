import React from 'react';
import { BASE_COLORS, COMPLEMENT } from '../lib/dnaCodec';

/**
 * HelixBuilder
 * Dynamic interactive helix on the simulator page.
 * In 'build' mode: builds base-by-base as sequence generates.
 * In 'unzip' mode: base-pairs split apart as reading occurs.
 */
export default function HelixBuilder({
  sequence = '',
  currentIndex = 0,
  mode = 'build', // 'build' | 'unzip'
  className = '',
}) {
  const bases = typeof sequence === 'string' ? sequence.split('') : sequence;
  const totalBases = Math.min(bases.length, 32); // display up to 32 bases cleanly
  const displayBases = bases.slice(0, totalBases);

  const width = 280;
  const height = 360;
  const centerX = width / 2;
  const paddingY = 24;
  const usableHeight = height - paddingY * 2;
  const amplitude = 54;
  const frequency = (Math.PI * 2.8) / (usableHeight || 1);

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white/70 backdrop-blur-xs border border-indigo-100/60 shadow-sm ${className}`}
      role="region"
      aria-label="Synthetic DNA Strand Visualization"
    >
      <div className="flex items-center justify-between w-full px-2 mb-2 text-xs font-semibold text-slate-500">
        <span className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              mode === 'build' ? 'bg-emerald-400 animate-pulse' : 'bg-purple-400 animate-ping'
            }`}
          />
          {mode === 'build' ? 'Strand Synthesis' : 'Sequencing (Unzipping)'}
        </span>
        <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          {Math.min(currentIndex, totalBases)} / {totalBases} bases
        </span>
      </div>

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="hbStrand1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6B7FD4" />
            <stop offset="100%" stopColor="#A5D4F4" />
          </linearGradient>
          <linearGradient id="hbStrand2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#D4A5F4" />
          </linearGradient>
        </defs>

        {/* Backbones guide lines */}
        {displayBases.map((_, i) => {
          if (i === 0) return null;
          const yPrev = paddingY + ((i - 1) / (totalBases - 1 || 1)) * usableHeight;
          const yCurr = paddingY + (i / (totalBases - 1 || 1)) * usableHeight;

          const anglePrev = yPrev * frequency;
          const angleCurr = yCurr * frequency;

          const x1Prev = centerX - amplitude * Math.cos(anglePrev);
          const x1Curr = centerX - amplitude * Math.cos(angleCurr);

          const x2Prev = centerX + amplitude * Math.cos(anglePrev);
          const x2Curr = centerX + amplitude * Math.cos(angleCurr);

          const isBuilt = i <= currentIndex;

          return (
            <g key={`bb-seg-${i}`} opacity={isBuilt ? 0.85 : 0.2}>
              <line
                x1={x1Prev}
                y1={yPrev}
                x2={x1Curr}
                y2={yCurr}
                stroke="url(#hbStrand1)"
                strokeWidth={isBuilt ? 3 : 1.5}
                strokeDasharray={isBuilt ? undefined : '2 2'}
                strokeLinecap="round"
              />
              <line
                x1={x2Prev}
                y1={yPrev}
                x2={x2Curr}
                y2={yCurr}
                stroke="url(#hbStrand2)"
                strokeWidth={isBuilt ? 3 : 1.5}
                strokeDasharray={isBuilt ? undefined : '2 2'}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Base-Pair Rungs */}
        {displayBases.map((base, i) => {
          const y = paddingY + (i / (totalBases - 1 || 1)) * usableHeight;
          const angle = y * frequency;
          const cosVal = Math.cos(angle);
          const sinVal = Math.sin(angle);

          const x1 = centerX - amplitude * cosVal;
          const x2 = centerX + amplitude * cosVal;
          const midX = (x1 + x2) / 2;

          const isVisible = i < currentIndex;
          const isCurrentActive = i === currentIndex - 1;

          const comp = COMPLEMENT[base] || 'T';
          const baseColor = BASE_COLORS[base]?.hex || '#CBD5E1';
          const compColor = BASE_COLORS[comp]?.hex || '#CBD5E1';

          // Unzip separation displacement
          let unzipOffset = 0;
          if (mode === 'unzip' && isVisible) {
            unzipOffset = 18; // Pull strands apart from center
          }

          if (!isVisible) {
            // Render faint outline placeholder
            return (
              <g key={`placeholder-rung-${i}`} opacity="0.12">
                <line
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="#94A3B8"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              </g>
            );
          }

          return (
            <g
              key={`active-rung-${i}`}
              className="transition-all duration-300 ease-out"
            >
              {/* Left base segment */}
              <line
                x1={x1}
                y1={y}
                x2={midX - unzipOffset}
                y2={y}
                stroke={baseColor}
                strokeWidth={isCurrentActive ? 4.5 : 3}
                strokeLinecap="round"
              />

              {/* Right complementary base segment */}
              <line
                x1={midX + unzipOffset}
                y1={y}
                x2={x2}
                y2={y}
                stroke={compColor}
                strokeWidth={isCurrentActive ? 4.5 : 3}
                strokeLinecap="round"
              />

              {/* Hydrogen bond dots when not unzipped */}
              {unzipOffset === 0 && (
                <circle cx={midX} cy={y} r={isCurrentActive ? 2.5 : 1.5} fill="#FFFFFF" />
              )}

              {/* Backbone anchor nodes */}
              <circle
                cx={x1}
                cy={y}
                r={isCurrentActive ? 4.5 : 3}
                fill={baseColor}
                stroke="#FFFFFF"
                strokeWidth="1"
              />
              <circle
                cx={x2}
                cy={y}
                r={isCurrentActive ? 4.5 : 3}
                fill={compColor}
                stroke="#FFFFFF"
                strokeWidth="1"
              />

              {/* Base letter labels */}
              <text
                x={x1 - (cosVal > 0 ? 12 : -12)}
                y={y + 3}
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fontFamily="JetBrains Mono, monospace"
                fill={BASE_COLORS[base]?.text || '#1E293B'}
              >
                {base}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
