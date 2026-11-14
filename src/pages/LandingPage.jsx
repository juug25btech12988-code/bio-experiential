import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DoubleHelix from '../components/DoubleHelix';
import NucleotideParticles from '../components/NucleotideParticles';
import HelixDivider from '../components/HelixDivider';
import ScrollProgress from '../components/ScrollProgress';
import BaseCard from '../components/BaseCard';
import { BASE_COLORS } from '../lib/dnaCodec';

export default function LandingPage() {
  // Interactive state for complementary base pairing demo
  const [hoveredBase, setHoveredBase] = useState(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sampleOligoStrand = ['A', 'T', 'G', 'C', 'C', 'A', 'T', 'G'];
  const sampleComplementStrand = ['T', 'A', 'C', 'G', 'G', 'T', 'A', 'C'];

  return (
    <div className="relative min-h-screen bg-background text-text-main overflow-x-hidden">
      <ScrollProgress />

      {/* ========================================================
          SECTION 1: HERO
      ======================================================== */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950 text-white overflow-hidden">
        <NucleotideParticles count={36} />

        <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-medium tracking-wide text-indigo-200">
                Molecular Information Architecture
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              DNA Computing &{' '}
              <span className="bg-gradient-to-r from-dna-A via-dna-C to-dna-T bg-clip-text text-transparent">
                Molecular Data Storage
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
              Where the molecule of life becomes the medium of tomorrow. Explore how digital bits convert losslessly into synthetic A, C, G, T strands and how biocomputing processes information at the molecular scale.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/simulator"
                className="px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Launch Interactive Simulator</span>
                <span aria-hidden="true">→</span>
              </Link>

              <button
                type="button"
                onClick={() => scrollToSection('section-what-is-dna')}
                className="px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-xs transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                <span>Explore the Theory</span>
                <span aria-hidden="true">↓</span>
              </button>
            </div>

            {/* 4 Base Color Palette Chips Preview */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Alphabet:
              </span>
              {[
                { base: 'A', name: 'Adenine (00)', color: BASE_COLORS.A },
                { base: 'C', name: 'Cytosine (01)', color: BASE_COLORS.C },
                { base: 'G', name: 'Guanine (10)', color: BASE_COLORS.G },
                { base: 'T', name: 'Thymine (11)', color: BASE_COLORS.T },
              ].map((item) => (
                <div
                  key={item.base}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-xs font-mono"
                  title={item.name}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color.hex }}
                  />
                  <span className="font-bold">{item.base}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: 3D Double Helix */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center items-center"
          >
            <div className="relative p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
              <DoubleHelix width={340} height={460} speed={1.1} />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-[11px] font-mono text-indigo-200/80 tracking-wider">
                  Continuous 3D Double Helix • A-T & G-C Hydrogen Bonds
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: WHAT IS DNA?
      ======================================================== */}
      <section id="section-what-is-dna" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            Molecular Fundamentals
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-3 tracking-tight">
            What is Deoxyribonucleic Acid (DNA)?
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            DNA is a polymeric macromolecule composed of repeating monomeric units called nucleotides. In living cells, it encodes genetic blueprints; in computer engineering, it serves as a four-symbol molecular data bus.
          </p>
        </div>

        {/* Nucleotide Anatomy & Complementary Base Pairing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Anatomy Card */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>🔬</span> Anatomy of a Nucleotide
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every nucleotide consists of three covalently bonded chemical components:
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <span className="text-xl">⚪</span>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Phosphate Group</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Negatively charged ester backbone linkage connecting the 5' carbon of one sugar to the 3' carbon of the next.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <span className="text-xl">🔷</span>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Deoxyribose Pentose Sugar</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    A 5-carbon cyclic sugar lacking an oxygen atom at the 2' position, conferring superior long-term chemical stability over RNA.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <span className="text-xl">🔤</span>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Nitrogenous Base</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    The variable information carrier. Purines (Adenine, Guanine) pair with pyrimidines (Thymine, Cytosine) via hydrogen bonds.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
              <span className="font-bold">5' → 3' Directionality:</span> DNA polymerization occurs in an asymmetric direction. Strands run antiparallel: the forward strand runs 5' to 3', while the complementary template strand runs 3' to 5'.
            </div>
          </div>

          {/* Interactive Complementary Pairing Card */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span>🔗</span> Complementary Base Pairing
              </h3>
              <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Interactive Hover
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Watson-Crick base pairing strictly binds <strong className="text-slate-800">Adenine (A) to Thymine (T)</strong> via two hydrogen bonds, and <strong className="text-slate-800">Guanine (G) to Cytosine (C)</strong> via three hydrogen bonds. Hover over any base below to highlight its molecular partner!
            </p>

            {/* Interactive Strand Pair Demonstration */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
              {/* Primary 5'->3' Strand */}
              <div>
                <div className="text-[11px] font-mono font-semibold text-slate-500 mb-1.5 flex items-center justify-between">
                  <span>5' Primary Coding Strand →</span>
                  <span className="text-slate-400">Direction: 5' to 3'</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {sampleOligoStrand.map((base, idx) => {
                    const isPartner =
                      hoveredBase !== null &&
                      (hoveredBase.base === base ||
                        (hoveredBase.base === 'A' && base === 'T') ||
                        (hoveredBase.base === 'T' && base === 'A') ||
                        (hoveredBase.base === 'G' && base === 'C') ||
                        (hoveredBase.base === 'C' && base === 'G'));

                    return (
                      <BaseCard
                        key={`strand-1-${idx}`}
                        base={base}
                        size="md"
                        showBits={true}
                        isHighlighted={isPartner}
                        onMouseEnter={() => setHoveredBase({ base, idx, strand: 1 })}
                        onMouseLeave={() => setHoveredBase(null)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Hydrogen Bonds Connecting Visual */}
              <div className="flex justify-start gap-2 pl-3" aria-hidden="true">
                {sampleOligoStrand.map((base, i) => (
                  <div
                    key={`bond-${i}`}
                    className={`w-10 flex flex-col items-center justify-center transition-opacity ${
                      hoveredBase?.idx === i ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    <span className="text-xs text-slate-400 leading-none">
                      {base === 'G' || base === 'C' ? '⋮' : '∶'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Antiparallel 3'->5' Strand */}
              <div>
                <div className="text-[11px] font-mono font-semibold text-slate-500 mb-1.5 flex items-center justify-between">
                  <span>3' Complementary Strand ←</span>
                  <span className="text-slate-400">Direction: 3' to 5'</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {sampleComplementStrand.map((base, idx) => {
                    const isPartner =
                      hoveredBase !== null &&
                      (hoveredBase.base === base ||
                        (hoveredBase.base === 'A' && base === 'T') ||
                        (hoveredBase.base === 'T' && base === 'A') ||
                        (hoveredBase.base === 'G' && base === 'C') ||
                        (hoveredBase.base === 'C' && base === 'G'));

                    return (
                      <BaseCard
                        key={`strand-2-${idx}`}
                        base={base}
                        size="md"
                        showBits={true}
                        isHighlighted={isPartner}
                        onMouseEnter={() => setHoveredBase({ base, idx, strand: 2 })}
                        onMouseLeave={() => setHoveredBase(null)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Hover details callout */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center justify-between font-mono">
              <span>Selected Base: <strong className="text-indigo-600">{hoveredBase ? hoveredBase.base : 'None (Hover above)'}</strong></span>
              <span>Bonds: {hoveredBase ? (hoveredBase.base === 'G' || hoveredBase.base === 'C' ? '3 H-bonds (Stronger)' : '2 H-bonds') : '--'}</span>
            </div>
          </div>
        </div>
      </section>

      <HelixDivider />

      {/* ========================================================
          SECTION 3: DNA AS AN INFORMATION MEDIUM
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            Information Theory
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-3 tracking-tight">
            DNA as an Information Medium
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            In computing, information is quantized by the number of states per symbol. Binary silicon uses two voltage states {'{0, 1}'}. DNA operates on a quaternary alphabet {'{A, C, G, T}'}.
          </p>
        </div>

        {/* Side-by-Side Comparison: Binary vs Quaternary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Binary Card */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 rounded-bl-full -z-0 opacity-60" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  Conventional Computing
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  Base-2
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Binary Alphabet</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Represents data using electrical charges, magnetic orientations, or optical pits.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Alphabet Set:</span>
                  <span className="font-bold text-slate-800">{`{ 0, 1 }`} (2 states)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Information per symbol:</span>
                  <span className="font-bold text-slate-800">log₂(2) = 1.0 bit / symbol</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Physical carrier:</span>
                  <span className="font-bold text-slate-800">Electrons in transistors</span>
                </div>
              </div>
            </div>
          </div>

          {/* DNA Quaternary Card */}
          <div className="p-7 rounded-3xl bg-white border border-indigo-200/80 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-0" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">
                  Molecular Storage
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                  Base-4
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">DNA Alphabet</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Represents information in covalent nucleotide polymers, doubling theoretical information density per symbol.
              </p>

              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">Alphabet Set:</span>
                  <span className="font-bold text-indigo-900">{`{ A, C, G, T }`} (4 states)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">Information per symbol:</span>
                  <span className="font-bold text-indigo-900">log₂(4) = 2.0 bits / base</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">Physical carrier:</span>
                  <span className="font-bold text-indigo-900">Nucleic acid phosphodiester chains</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Bit Mapping Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            The Standard 2-Bit Mapping Standard
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            Because 2² = 4, every nucleotide base maps losslessly to exactly two binary digits. This produces a bijective mapping between arbitrary digital bitstreams and DNA sequences.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { bits: '00', base: 'A', name: 'Adenine', color: BASE_COLORS.A, pair: 'T' },
              { bits: '01', base: 'C', name: 'Cytosine', color: BASE_COLORS.C, pair: 'G' },
              { bits: '10', base: 'G', name: 'Guanine', color: BASE_COLORS.G, pair: 'C' },
              { bits: '11', base: 'T', name: 'Thymine', color: BASE_COLORS.T, pair: 'A' },
            ].map((entry) => (
              <div
                key={entry.bits}
                className="p-4 rounded-2xl border transition-all hover:scale-105"
                style={{
                  backgroundColor: entry.color.bgLight,
                  borderColor: entry.color.border,
                }}
              >
                <div className="text-xs font-mono text-slate-500 flex items-center justify-between">
                  <span>Binary Bit-Pair</span>
                  <span className="font-bold text-slate-800">{entry.bits}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-lg shadow-xs"
                    style={{ backgroundColor: entry.color.hex, color: entry.color.text }}
                  >
                    {entry.base}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800">{entry.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">Pairs with {entry.pair}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HelixDivider />

      {/* ========================================================
          SECTION 4: THE 7-STAGE PIPELINE & WORKED EXAMPLE
      ======================================================== */}
      <section id="section-pipeline" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            End-To-End Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-3 tracking-tight">
            How Digital Data Becomes DNA: The 7-Stage Pipeline
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            The project proposal establishes an end-to-end transformation architecture spanning text serialization, bit pairing, nucleotide synthesis, simulated archival, sequencing, and lossless recovery.
          </p>
        </div>

        {/* Stepper Timeline Visual */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 mb-12">
          {[
            { step: '1', title: 'Digital Text', desc: 'Input string in UTF-8 format', icon: '📝' },
            { step: '2', title: 'Binary Conversion', desc: '8-bit binary per character', icon: '🔢' },
            { step: '3', title: 'Bit-Pair Grouping', desc: 'Partitioned into 2-bit pairs', icon: '🧩' },
            { step: '4', title: 'DNA Encoding', desc: 'Mapped to A, C, G, T alphabet', icon: '🧬' },
            { step: '5', title: 'Simulated Storage', desc: 'Vial preservation & oligo synthesis', icon: '🧪' },
            { step: '6', title: 'DNA Decoding', desc: 'Sequencing bases back to 2-bit pairs', icon: '🔍' },
            { step: '7', title: 'Original Recovery', desc: 'UTF-8 byte rebuild & verification', icon: '✅' },
          ].map((s, idx) => (
            <div
              key={s.step}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-mono font-bold text-xs flex items-center justify-center border border-indigo-200">
                    {s.step}
                  </span>
                  <span className="text-base">{s.icon}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm leading-tight">
                  {s.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {s.desc}
                </p>
              </div>
              {idx < 6 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-300 font-bold z-10">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Worked Example Card: "Hi" -> "CAGACGGC" */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Worked Example: "Hi" → <span className="font-mono text-dna-C">CAGACGGC</span> → "Hi"
              </h3>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Lossless Verification: 100% Match ✓
            </span>
          </div>

          {/* Stepper Details Table */}
          <div className="space-y-4 font-mono text-xs sm:text-sm">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-slate-400">1. Input Characters:</span>
              <span className="font-bold text-white text-base">"H" (ASCII 72) &nbsp;|&nbsp; "i" (ASCII 105)</span>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-slate-400">2. 8-Bit Binary Conversion:</span>
              <div className="flex items-center gap-3">
                <span className="text-indigo-300 font-bold">01001000</span>
                <span className="text-slate-500">|</span>
                <span className="text-indigo-300 font-bold">01101001</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-slate-400">3. 2-Bit Pair Grouping:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {['01', '00', '10', '00', '|', '01', '10', '10', '01'].map((pair, i) =>
                  pair === '|' ? (
                    <span key={i} className="text-slate-500 px-1 font-bold">|</span>
                  ) : (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-bold text-white"
                    >
                      {pair}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-slate-400">4. DNA Base Substitution:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { b: 'C', bits: '01' },
                  { b: 'A', bits: '00' },
                  { b: 'G', bits: '10' },
                  { b: 'A', bits: '00' },
                  { b: '|', bits: '' },
                  { b: 'C', bits: '01' },
                  { b: 'G', bits: '10' },
                  { b: 'G', bits: '10' },
                  { b: 'C', bits: '01' },
                ].map((item, i) =>
                  item.b === '|' ? (
                    <span key={i} className="text-slate-500 px-1 font-bold">|</span>
                  ) : (
                    <BaseCard key={i} base={item.b} size="sm" showBits={true} />
                  )
                )}
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-indigo-300">5. Output DNA Sequence:</span>
              <span className="font-bold text-lg tracking-widest text-emerald-400 font-mono">
                5'-CAGACGGC-3'
              </span>
            </div>
          </div>
        </div>
      </section>

      <HelixDivider />

      {/* ========================================================
          SECTION 5: WHY DNA FOR STORAGE? (PROBLEM STATEMENT)
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            The Storage Crisis
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-3 tracking-tight">
            Why DNA for Storage?
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            Global data generation is projected to exceed 175 zettabytes. Conventional electronic and magnetic media face thermodynamic limits in physical volume, active cooling electricity, and media degradation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <span className="text-3xl">💾</span>
            <h3 className="text-lg font-bold text-slate-800">Conventional Degradation</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Magnetic HDD drives experience mechanical failure within 3–7 years. Enterprise LTO magnetic tape requires climate-controlled silos and complete media rewrites every 10–30 years to prevent bit rot.
            </p>
            <div className="text-xs font-mono text-rose-600 font-semibold pt-1">
              • High periodic migration costs
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <span className="text-3xl">🧊</span>
            <h3 className="text-lg font-bold text-slate-800">Millennial Durability</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              DNA requires no active electrical power once synthesized. In dry, cold, dark conditions, DNA exhibits a half-life measured in thousands of years — proven by intact DNA retrieved from Siberian permafrost specimens over 1,000,000 years old.
            </p>
            <div className="text-xs font-mono text-emerald-600 font-semibold pt-1">
              • Zero idle electricity consumption
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <span className="text-3xl">📦</span>
            <h3 className="text-lg font-bold text-slate-800">Ultra-High Molecular Density</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Erlich & Zielinski (2017, Science) reported an empirical information density of ~215 petabytes (2.15 × 10⁵ TB) per gram of synthesized DNA. The entire global internet could theoretically fit within a shoebox of nucleic acids.
            </p>
            <div className="text-xs font-mono text-indigo-600 font-semibold pt-1">
              • ~215 PB / gram benchmark
            </div>
          </div>
        </div>

        {/* Cautious Academic Note */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <div>
            <strong className="font-semibold">Academic Rigor Note:</strong> Density figures cited reflect controlled laboratory benchmarks (e.g., DNA Fountain, 2017). Commercialization requires overcoming multi-step chemical synthesis throughput bottlenecks and enzymatic sequencing latency.
          </div>
        </div>
      </section>

      <HelixDivider />

      {/* ========================================================
          SECTION 6: HOW REAL DNA STORAGE WORKS ("THE LITTLE EXTRA")
      ======================================================== */}
      <section id="section-real-world" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            Biochemical Reality
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-3 tracking-tight">
            How Real DNA Storage Works
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            In physical biology, you cannot synthesize a single 10-megabyte strand. Real DNA storage requires oligonucleotide chunking, primer binding, Reed-Solomon redundancy, and sequencing flow cells.
          </p>
        </div>

        {/* Real-World Flow Diagram */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm mb-12">
          <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">
            The Complete Biochemical Lifecycle
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-mono font-bold text-indigo-600 mb-1">Step 1 • Encoding</div>
              <h4 className="font-bold text-slate-800 text-sm">Oligo Chunking & Indexing</h4>
              <p className="text-xs text-slate-500 mt-1">
                Data is partitioned into 100–200 nucleotide strands. Each strand receives a binary index and error-correcting parity bits.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-mono font-bold text-indigo-600 mb-1">Step 2 • Writing</div>
              <h4 className="font-bold text-slate-800 text-sm">Chemical Synthesis</h4>
              <p className="text-xs text-slate-500 mt-1">
                Phosphoramidite chemistry or enzymatic synthesis (TdT polymerase) builds physical oligonucleotides base-by-base on silicon chips.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-mono font-bold text-indigo-600 mb-1">Step 3 • Storage</div>
              <h4 className="font-bold text-slate-800 text-sm">Archival In Vial</h4>
              <p className="text-xs text-slate-500 mt-1">
                Dehydrated DNA pellets or silica-encapsulated particles are preserved in cool, dark microtubes without power.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-mono font-bold text-indigo-600 mb-1">Step 4 • Reading</div>
              <h4 className="font-bold text-slate-800 text-sm">Illumina / Nanopore Sequencing</h4>
              <p className="text-xs text-slate-500 mt-1">
                PCR primers retrieve specific files; high-throughput sequencers optically or electrically read bases back into binary files.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Biochemical Constraints Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Homopolymers */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 font-mono font-bold flex items-center justify-center">
              AAAA
            </div>
            <h3 className="text-base font-bold text-slate-800">Homopolymer Avoidance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consecutive runs of identical bases (≥ 4 bases, e.g. AAAA) produce optical fluorescence blurring in sequencers, resulting in deletion errors. Modern codecs rotate choices to strictly limit homopolymer length.
            </p>
          </div>

          {/* Card 2: GC Content */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 font-mono font-bold flex items-center justify-center">
              50%
            </div>
            <h3 className="text-base font-bold text-slate-800">GC Ratio Control (40–60%)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Because G-C pairs contain 3 hydrogen bonds compared to A-T's 2, unbalanced GC ratios cause severe secondary structure hairpin folding and unequal melting temperatures during PCR amplification.
            </p>
          </div>

          {/* Card 3: Error Correction */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-mono font-bold flex items-center justify-center">
              RS/F
            </div>
            <h3 className="text-base font-bold text-slate-800">Indels & Redundancy Codes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike silicon's substitution-only bit flips, DNA synthesis introduces insertions and deletions (indels) that desynchronize byte alignment. Reed-Solomon and Fountain codes are required to rebuild corrupted strands.
            </p>
          </div>
        </div>

        {/* Historical Milestones Timeline */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80">
          <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">
            Key Milestones in DNA Storage Research
          </h3>

          <div className="space-y-4">
            {[
              {
                year: '2012',
                author: 'Church et al. (Harvard)',
                feat: 'Encoded an entire HTML book (5.27 megabits), draftsmanship images, and text into DNA, synthesized on a microfluidic chip.',
              },
              {
                year: '2013',
                author: 'Goldman et al. (European Bioinformatics Institute)',
                feat: 'Introduced base-3 rotating differential encoding avoiding homopolymers, losslessly storing MP3 audio and Shakespeare sonnets.',
              },
              {
                year: '2017',
                author: 'Erlich & Zielinski (Columbia / NYGC)',
                feat: 'DNA Fountain architecture achieving 215 PB/g using Luby transform rateless erasure codes, robust to strand dropouts.',
              },
              {
                year: '2019+',
                author: 'Microsoft Research & Univ. of Washington',
                feat: 'Demonstrated the first fully automated end-to-end DNA storage device capable of writing, storing, and reading the word "HELLO".',
              },
            ].map((m) => (
              <div
                key={m.year}
                className="p-4 rounded-xl bg-white border border-slate-200/80 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <span className="text-base font-bold font-mono text-indigo-600 sm:w-20">
                  {m.year}
                </span>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-800">{m.author}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{m.feat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HelixDivider />

      {/* ========================================================
          SECTION 7: DNA COMPUTING BEYOND STORAGE
      ======================================================== */}
      <section id="section-computing" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            Information Processing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-3 tracking-tight">
            DNA Computing Beyond Storage
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            Beyond passive memory, DNA molecules can perform computation. Billions of strands in a test tube can bind concurrently, executing massively parallel search algorithms and molecular logic gates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
          {/* Adleman's Experiment */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <span className="text-3xl">🧩</span>
            <h3 className="text-xl font-bold text-slate-800">Adleman’s 1994 Breakthrough</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Leonard Adleman demonstrated the first physical DNA computer by solving an instance of the NP-complete <strong>Directed Hamiltonian Path Problem</strong> (the Traveling Salesperson Problem on 7 vertices).
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              By designing oligonucleotide strands representing cities and connecting paths, random hybridization generated all potential trajectories in parallel (10¹⁴ simultaneous reactions). Standard electrophoresis and affinity chromatography then extracted the single valid sequence visiting every vertex once.
            </p>
          </div>

          {/* Molecular Logic & Strand Displacement */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <span className="text-3xl">⚡</span>
            <h3 className="text-xl font-bold text-slate-800">DNA Strand Displacement (DSD)</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In DNA Strand Displacement, an invading single strand displaces an incumbent strand from a duplex via a toehold domain. This reaction acts as a biochemical transistor.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cascading these displacements creates boolean logic gates (AND, OR, NOT), state machines, and molecular neural networks operating purely inside aqueous solutions without electrical wires.
            </p>
          </div>
        </div>
      </section>

      <HelixDivider />

      {/* ========================================================
          SECTION 8: LIMITATIONS AND CHALLENGES
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            Current Bottlenecks
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-3 tracking-tight">
            Limitations & Technical Challenges
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            DNA storage is currently an archival research frontier, not an immediate consumer replacement for solid-state silicon drives.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl">💰</span>
            <h3 className="font-bold text-slate-800 text-base">Synthesis Cost</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chemical nucleotide assembly remains orders of magnitude more expensive per megabyte than magnetic media, limiting write operations to high-value archival data.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl">⏱️</span>
            <h3 className="font-bold text-slate-800 text-base">Latency & Read/Write Speeds</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Writing requires chemical cycling over hours; reading requires enzymatic flow cell sequencing over minutes to hours. There is no sub-millisecond random access.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl">⚠️</span>
            <h3 className="font-bold text-slate-800 text-base">Error Susceptibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deletions, insertions, and substitutions require significant parity overhead (10–30% redundant oligos) to guarantee deterministic decoding.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl">✏️</span>
            <h3 className="font-bold text-slate-800 text-base">No In-Place Overwrites</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modifying an existing file requires synthesizing completely new oligos. DNA storage is fundamentally WORM (Write Once, Read Many).
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500 font-mono">
          • This project explores DNA storage as an educational software simulation and architectural analysis •
        </div>
      </section>

      <HelixDivider />

      {/* ========================================================
          SECTION 9: APPLICATIONS
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            Real-World Horizons
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-3 tracking-tight">
            Target Applications
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-3">
            <span className="text-3xl">🏛️</span>
            <h3 className="font-bold text-slate-800 text-base">Long-Term Cold Archival</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Preserving civilization-scale cultural artifacts, historical documents, patent registries, and scientific records for centuries without electrical decay.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-3">
            <span className="text-3xl">🧪</span>
            <h3 className="font-bold text-slate-800 text-base">In-Vivo Biological Storage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Engineering bacterial genomes (e.g. <em>E. coli</em>) with CRISPR memory tapes that continuously record environmental cellular events and toxin exposure.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-3">
            <span className="text-3xl">⚙️</span>
            <h3 className="font-bold text-slate-800 text-base">Molecular Biocomputing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strand displacement circuits functioning as smart biosensors, medical diagnostic nanorobots, and autonomous in-vitro drug delivery triggers.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-3">
            <span className="text-3xl">🔐</span>
            <h3 className="font-bold text-slate-800 text-base">Molecular Steganography</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hiding cryptographic keys and micro-payloads inside biological genomic samples, invisible to traditional electromagnetic eavesdropping detectors.
            </p>
          </div>
        </div>
      </section>

      <HelixDivider />

      {/* ========================================================
          SECTION 10: PROJECT AIM & CALL TO ACTION
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-semibold text-indigo-200 border border-white/15">
            Interactive Pipeline Simulator
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto">
            Ready to test the pipeline with your own data?
          </h2>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
            Our interactive simulator implements the complete 7-stage proposal pipeline: encode arbitrary text, watch the double helix synthesize base by base, inspect sequence metrics, simulate mutations, and verify lossless recovery.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/simulator"
              className="px-8 py-4 rounded-2xl font-bold text-base text-indigo-900 bg-white hover:bg-slate-100 shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Launch Simulator Page</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 11: REFERENCES & FURTHER READING
      ======================================================== */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-200">
        <div className="mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
            Academic Bibliography
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-1">
            References & Verifiable Scientific Literature
          </h3>
        </div>

        <ol className="space-y-3 text-xs text-slate-600 font-mono">
          <li className="p-3 rounded-lg bg-white border border-slate-200/70">
            [1] <strong>Erlich, Y., & Zielinski, D. (2017).</strong> DNA Fountain enables a robust and efficient storage architecture. <em>Science</em>, 355(6328), 950–954. doi:10.1126/science.aaj2038
          </li>
          <li className="p-3 rounded-lg bg-white border border-slate-200/70">
            [2] <strong>Church, G. M., Gao, Y., & Kosuri, S. (2012).</strong> Next-generation digital information storage in DNA. <em>Science</em>, 337(6102), 1628. doi:10.1126/science.1226355
          </li>
          <li className="p-3 rounded-lg bg-white border border-slate-200/70">
            [3] <strong>Goldman, N., Bertone, P., Chen, S., et al. (2013).</strong> Towards practical, high-capacity, low-maintenance information storage in synthesized DNA. <em>Nature</em>, 494(7435), 77–80. doi:10.1038/nature11875
          </li>
          <li className="p-3 rounded-lg bg-white border border-slate-200/70">
            [4] <strong>Adleman, L. M. (1994).</strong> Molecular computation of solutions to combinatorial problems. <em>Science</em>, 266(5187), 1021–1024. doi:10.1126/science.7973651
          </li>
          <li className="p-3 rounded-lg bg-white border border-slate-200/70">
            [5] <strong>Organick, L., Ang, S. D., Chen, Y. J., et al. (2018).</strong> Random access in large-scale DNA data storage. <em>Nature Biotechnology</em>, 36(3), 242–248. doi:10.1038/nbt.4079
          </li>
          <li className="p-3 rounded-lg bg-white border border-slate-200/70">
            [6] <strong>Ceze, L., Nivala, J., & Strauss, K. (2019).</strong> Molecular digital data storage using DNA. <em>Nature Reviews Genetics</em>, 20(8), 456–466. doi:10.1038/s41576-019-0125-3
          </li>
        </ol>
      </section>
    </div>
  );
}
