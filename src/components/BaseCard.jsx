import React from 'react';
import { BASE_COLORS } from '../lib/dnaCodec';

/**
 * BaseCard
 * Interactive nucleotide base tile with color styling, 2-bit indicator,
 * mutation highlighting, and linked hover support.
 */
export default function BaseCard({
  base = 'A',
  size = 'md',
  isHighlighted = false,
  showBits = false,
  isMutated = false,
  originalBase = null,
  onClick = null,
  onMouseEnter = null,
  onMouseLeave = null,
  className = '',
}) {
  const meta = BASE_COLORS[base] || {
    name: 'Unknown',
    hex: '#E2E8F0',
    text: '#1E293B',
    bits: '--',
    pair: '?',
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs rounded-md',
    md: 'w-10 h-10 text-sm rounded-lg',
    lg: 'w-14 h-14 text-base rounded-xl',
  };

  const isInteractive = Boolean(onClick || onMouseEnter);

  return (
    <div
      role={onClick ? 'button' : 'figure'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Nucleotide ${meta.name} (${base}), binary ${meta.bits}${
        isMutated ? `, mutated from ${originalBase}` : ''
      }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative inline-flex flex-col items-center justify-center font-mono font-bold select-none transition-all duration-200 ${
        sizeClasses[size] || sizeClasses.md
      } ${
        isInteractive
          ? 'cursor-pointer hover:scale-110 hover:shadow-md active:scale-95'
          : ''
      } ${
        isHighlighted
          ? 'ring-3 ring-indigo-500 scale-105 shadow-md z-10'
          : 'shadow-xs'
      } ${
        isMutated
          ? 'ring-2 ring-rose-500 bg-rose-100 animate-pulse'
          : ''
      } ${className}`}
      style={{
        backgroundColor: isMutated ? '#FFE4E6' : meta.hex,
        color: isMutated ? '#9F1239' : meta.text,
      }}
    >
      {/* Base Letter */}
      <span className="leading-none">{base}</span>

      {/* 2-Bit Representation */}
      {showBits && (
        <span
          className="text-[9px] font-normal opacity-85 leading-none mt-0.5"
          aria-hidden="true"
        >
          {meta.bits}
        </span>
      )}

      {/* Mutation Indicator Pill */}
      {isMutated && (
        <span
          className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-rose-600 rounded-full border border-white flex items-center justify-center text-[7px] text-white"
          title={`Mutated from ${originalBase}`}
        >
          !
        </span>
      )}
    </div>
  );
}
