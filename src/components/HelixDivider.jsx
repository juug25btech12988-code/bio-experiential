import React from 'react';

/**
 * HelixDivider
 * Elegant horizontal double-helix divider between major sections.
 */
export default function HelixDivider({ className = '' }) {
  return (
    <div
      className={`w-full overflow-hidden flex items-center justify-center py-6 select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full max-w-4xl h-12 stroke-current text-indigo-300/40"
        viewBox="0 0 800 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Repeating double-helix horizontal sine waves */}
        <defs>
          <linearGradient id="dividerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F4A5A5" stopOpacity="0.4" />
            <stop offset="35%" stopColor="#6B7FD4" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#A5F4B8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#D4A5F4" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Base-pair rungs connecting the two strands */}
        {[
          { x: 100, color: '#F4A5A5' },
          { x: 150, color: '#A5D4F4' },
          { x: 200, color: '#A5F4B8' },
          { x: 250, color: '#D4A5F4' },
          { x: 300, color: '#F4A5A5' },
          { x: 350, color: '#A5D4F4' },
          { x: 400, color: '#A5F4B8' },
          { x: 450, color: '#D4A5F4' },
          { x: 500, color: '#F4A5A5' },
          { x: 550, color: '#A5D4F4' },
          { x: 600, color: '#A5F4B8' },
          { x: 650, color: '#D4A5F4' },
          { x: 700, color: '#F4A5A5' },
        ].map((r, i) => {
          const yOffset = Math.sin((r.x / 50) * Math.PI) * 14;
          return (
            <line
              key={i}
              x1={r.x}
              y1={24 - yOffset}
              x2={r.x}
              y2={24 + yOffset}
              stroke={r.color}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.65"
            />
          );
        })}

        {/* Sine wave Strand 1 */}
        <path
          d="M 50 24 Q 75 4 100 24 T 150 24 T 200 24 T 250 24 T 300 24 T 350 24 T 400 24 T 450 24 T 500 24 T 550 24 T 600 24 T 650 24 T 700 24 T 750 24"
          stroke="url(#dividerGrad)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Sine wave Strand 2 (offset) */}
        <path
          d="M 50 24 Q 75 44 100 24 T 150 24 T 200 24 T 250 24 T 300 24 T 350 24 T 400 24 T 450 24 T 500 24 T 550 24 T 600 24 T 650 24 T 700 24 T 750 24"
          stroke="url(#dividerGrad)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="4 2"
        />
      </svg>
    </div>
  );
}
