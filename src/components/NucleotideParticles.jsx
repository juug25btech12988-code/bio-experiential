import React, { useMemo } from 'react';
import { BASE_COLORS } from '../lib/dnaCodec';

/**
 * NucleotideParticles
 * Subtle floating A, T, G, C letters drifting gently behind hero or header sections.
 * Optimized with CSS animations and prefers-reduced-motion support.
 */
export default function NucleotideParticles({ count = 32, className = '' }) {
  const bases = ['A', 'T', 'G', 'C'];

  // Generate deterministic particle attributes based on index
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // Deterministic pseudo-random seed
      const pseudo = (seed) => {
        const x = Math.sin(seed + i * 19.33) * 10000;
        return x - Math.floor(x);
      };

      const base = bases[i % bases.length];
      const left = pseudo(1) * 96 + 2; // 2% to 98%
      const top = pseudo(2) * 96 + 2;
      const size = 16 + Math.floor(pseudo(3) * 20); // 16px to 36px
      const opacity = 0.14 + pseudo(4) * 0.22; // 0.14 to 0.36
      const duration = 16 + pseudo(5) * 18; // 16s to 34s
      const delay = -(pseudo(6) * 20); // staggered starting offset
      const driftX = (pseudo(7) - 0.5) * 50; // horizontal drift px

      return {
        id: i,
        base,
        color: BASE_COLORS[base].hex,
        left: `${left}%`,
        top: `${top}%`,
        size: `${size}px`,
        opacity,
        duration: `${duration}s`,
        delay: `${delay}s`,
        driftX: `${driftX}px`,
      };
    });
  }, [count]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes float-particle {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-24px) translateX(var(--drift-x)) rotate(12deg);
          }
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .particle-floating {
            animation: none !important;
          }
        }
      `}</style>
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle-floating absolute font-mono font-bold transition-opacity"
          style={{
            left: p.left,
            top: p.top,
            fontSize: p.size,
            color: p.color,
            opacity: p.opacity,
            '--drift-x': p.driftX,
            animation: `float-particle ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
            filter: 'blur(0.2px)',
          }}
        >
          {p.base}
        </span>
      ))}
    </div>
  );
}
