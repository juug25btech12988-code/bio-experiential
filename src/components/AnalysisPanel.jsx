import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BASE_COLORS } from '../lib/dnaCodec';

/**
 * AnalysisPanel
 * Comprehensive sequence analytics matching the project proposal:
 * Base composition, GC ratio, homopolymer detection, and molecular density metrics.
 */
export default function AnalysisPanel({
  analysis,
  inputBytes = 0,
  inputBits = 0,
  isConstraintAware = false,
  isOligos = false,
  isRepetition = false,
  className = '',
}) {
  const [showLearnMore, setShowLearnMore] = useState(false);

  if (!analysis || analysis.length === 0) {
    return null;
  }

  const { length, composition, percentages, gcContent, longestRun, longestRunBase, runsOfFourOrMore } = analysis;

  // Pie chart data for base composition
  const pieData = [
    { name: 'Adenine (A)', base: 'A', value: composition.A, percent: percentages.A, color: BASE_COLORS.A.hex },
    { name: 'Cytosine (C)', base: 'C', value: composition.C, percent: percentages.C, color: BASE_COLORS.C.hex },
    { name: 'Guanine (G)', base: 'G', value: composition.G, percent: percentages.G, color: BASE_COLORS.G.hex },
    { name: 'Thymine (T)', base: 'T', value: composition.T, percent: percentages.T, color: BASE_COLORS.T.hex },
  ].filter((d) => d.value > 0);

  // GC evaluation: ideal range is roughly 40% - 60%
  const isGcOptimal = gcContent >= 40 && gcContent <= 60;
  const gcStatusColor = isGcOptimal
    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
    : 'text-amber-700 bg-amber-50 border-amber-200';

  // Density calculations
  const rawBits = inputBits;
  const theoreticalBitsPerBase = 2.0;
  const effectiveBitsPerBase = length > 0 ? (rawBits / length).toFixed(2) : '2.00';
  const basesPerByte = inputBytes > 0 ? (length / inputBytes).toFixed(1) : '4.0';

  // Text vs DNA byte equivalent: 1 base as ASCII char = 1 byte (8 bits).
  // In physical DNA, 1 nucleotide weighs ~330 Daltons (~5.5e-22 grams)!
  const asciiStorageEquivalent = length; // 1 byte per char if saved as plain text file

  return (
    <div
      className={`p-6 rounded-2xl bg-white border border-slate-200 shadow-sm ${className}`}
      role="region"
      aria-label="Sequence Analysis and Storage Metrics"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📊</span> Sequence Analysis & Molecular Metrics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theoretical and biochemical parameters of the synthesized DNA strand.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowLearnMore((prev) => !prev)}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
        >
          {showLearnMore ? 'Hide Guide ▲' : 'Learn About Metrics ▼'}
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {/* Metric 1 */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Sequence Length
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-slate-800 mt-1">
            {length} <span className="text-xs font-normal text-slate-500">bases (nt)</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
            {inputBytes} bytes ({inputBits} bits)
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Information Density
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-indigo-700 mt-1">
            {effectiveBitsPerBase} <span className="text-xs font-normal text-slate-500">bits/base</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Theoretical max: {theoreticalBitsPerBase} bits/nt
          </div>
        </div>

        {/* Metric 3: GC Content */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            GC Content Ratio
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-slate-800 mt-1 flex items-baseline gap-2">
            <span>{gcContent}%</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-sans font-medium ${gcStatusColor}`}>
              {isGcOptimal ? 'Optimal' : 'Sub-optimal'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Ideal biological window: 40–60%
          </div>
        </div>

        {/* Metric 4: Homopolymer Run */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Max Homopolymer Run
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono mt-1 flex items-baseline gap-2">
            <span className={longestRun >= 4 ? 'text-amber-600' : 'text-slate-800'}>
              {longestRun} <span className="text-xs font-normal text-slate-500">x ({longestRunBase || '-'})</span>
            </span>
            {longestRun >= 4 ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-sans font-medium">
                Warning ≥ 4
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-sans font-medium">
                Safe &lt; 4
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {isConstraintAware ? 'Controlled by Goldman rotation' : 'Direct mapping allows runs'}
          </div>
        </div>
      </div>

      {/* Middle Row: Donut Chart + Base Composition Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-4 rounded-xl bg-slate-50/50 border border-slate-100 mb-6">
        {/* Donut Chart */}
        <div className="h-44 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={65}
                paddingAngle={3}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.base} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name, item) => [
                  `${val} bases (${item.payload.percent}%)`,
                  item.payload.name,
                ]}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Base Breakdown Tiles */}
        <div className="grid grid-cols-2 gap-2.5">
          {['A', 'C', 'G', 'T'].map((base) => {
            const count = composition[base] || 0;
            const pct = percentages[base] || 0;
            const info = BASE_COLORS[base];

            return (
              <div
                key={base}
                className="p-3 rounded-lg border border-slate-200/70 bg-white flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center font-mono font-bold text-xs"
                    style={{ backgroundColor: info.hex, color: info.text }}
                  >
                    {base}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-700">
                      {info.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      2-bit: {info.bits}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-slate-800">
                    {count}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {pct}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Callout */}
      <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-900 leading-relaxed">
        <span className="text-base">💡</span>
        <div>
          <span className="font-semibold">Storage Equivalence:</span> This {inputBytes}-byte message occupies {length} DNA bases. In a computer text file, storing "{length}" ASCII characters requires {asciiStorageEquivalent} bytes on disk. In biological medium, the same molecular sequence occupies merely ~{((length * 330) / 6.022e23 * 1e18).toFixed(2)} femtograms of physical matter, achieving over 10 million times the volumetric density of flash silicon.
        </div>
      </div>

      {/* Collapsible Explanations */}
      {showLearnMore && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <h4 className="font-semibold text-slate-800 mb-1">GC Content (40–60%)</h4>
            <p className="leading-relaxed">
              Guanine-Cytosine base pairs form three hydrogen bonds, whereas Adenine-Thymine pairs form two. Sequences with extreme GC levels (&gt;65% or &lt;35%) fold into secondary hairpins and exhibit significantly higher synthesis and sequencing dropout rates in PCR and Illumina flow cells.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <h4 className="font-semibold text-slate-800 mb-1">Homopolymers (&lt; 4 bases)</h4>
            <p className="leading-relaxed">
              Consecutive runs of identical nucleotides (e.g. AAAA or GGGG) cause optical fluorescence phasing and signal blur in sequencing machines. The constraint-aware mode utilizes a base-3 rotating mapping (Goldman et al., 2013) that mathematically forbids any two adjacent bases from being identical.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
