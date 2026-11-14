import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  encode,
  decode,
  analyzeSequence,
  complementStrand,
  dnaToBits,
  bitsToBytes,
  bytesToText,
  BASE_COLORS,
  MAX_INPUT_LENGTH,
  BIT_TO_BASE,
  BASE_TO_BIT,
  COMPLEMENT,
} from '../lib/dnaCodec';
import HelixBuilder from '../components/HelixBuilder';
import BaseCard from '../components/BaseCard';
import PipelineStep from '../components/PipelineStep';
import AnalysisPanel from '../components/AnalysisPanel';
import HistoryModal from '../components/HistoryModal';

export default function SimulatorPage() {
  // Mode Tab: 'encode' | 'decode'
  const [activeTab, setActiveTab] = useState('encode');

  // ==========================================
  // ENCODING STATE
  // ==========================================
  const [inputText, setInputText] = useState('Hi');
  const [encodedResult, setEncodedResult] = useState(null);
  const [encodeDecodedResult, setEncodeDecodedResult] = useState(null);

  // Simulation controls & realism options for Encoding
  const [encodingMode, setEncodingMode] = useState('direct'); // 'direct' | 'constraint-aware'
  const [enableOligos, setEnableOligos] = useState(false);
  const [oligoLength, setOligoLength] = useState(24);
  const [showComplement, setShowComplement] = useState(false);
  const [groupByBytes, setGroupByBytes] = useState(true);

  // Error simulation options
  const [enableErrors, setEnableErrors] = useState(false);
  const [errorRate, setErrorRate] = useState(0.05); // 5%
  const [advancedIndels, setAdvancedIndels] = useState(false);
  const [repetitionCode, setRepetitionCode] = useState(false);

  // Interactive highlighting across encoding stages
  const [hoveredBaseIndex, setHoveredBaseIndex] = useState(null);

  // Stepper / Animation playback state for Encoding
  const [isStepping, setIsStepping] = useState(false);
  const [currentStage, setCurrentStage] = useState(7); // 1 to 7
  const [animSpeed, setAnimSpeed] = useState(1); // 0.5x to 3x
  const [helixBuiltCount, setHelixBuiltCount] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showRealismInfo, setShowRealismInfo] = useState(false);

  const stepTimerRef = useRef(null);

  // ==========================================
  // DECODING STATE (DNA -> TEXT)
  // ==========================================
  const [inputDna, setInputDna] = useState('CAGACGGC');
  const [decodeMode, setDecodeMode] = useState('direct'); // 'direct' | 'constraint-aware'
  const [decodeRepetition, setDecodeRepetition] = useState(false);
  const [decodeGroupByBytes, setDecodeGroupByBytes] = useState(true);
  const [decodeShowComplement, setDecodeShowComplement] = useState(false);
  const [decodeCurrentStage, setDecodeCurrentStage] = useState(4); // 1 to 4
  const [isDecodeStepping, setIsDecodeStepping] = useState(false);
  const [hoveredDecodeBaseIndex, setHoveredDecodeBaseIndex] = useState(null);
  const [decodeCopyFeedback, setDecodeCopyFeedback] = useState(false);

  const decodeStepTimerRef = useRef(null);

  // ==========================================
  // INPUT HISTORY STATE (localStorage)
  // ==========================================
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('dna_input_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [saveNotification, setSaveNotification] = useState(false);

  // ==========================================
  // ENCODE EXECUTION
  // ==========================================
  const runSimulation = useCallback(
    (textToEncode, targetStage = 7) => {
      if (textToEncode === undefined) textToEncode = inputText;

      const enc = encode(textToEncode, {
        constraintAware: encodingMode === 'constraint-aware',
        errorRate: enableErrors ? errorRate : 0,
        insertionDeletion: advancedIndels,
        repetitionCode: repetitionCode,
        oligos: enableOligos,
        oligoLength: Number(oligoLength),
      });

      const dec = decode(enc.storedDna, {
        constraintAware: encodingMode === 'constraint-aware',
        repetitionCode: repetitionCode,
        expectedInput: textToEncode,
      });

      setEncodedResult(enc);
      setEncodeDecodedResult(dec);
      setCurrentStage(targetStage);
      setHelixBuiltCount(enc.dna.length);
    },
    [
      inputText,
      encodingMode,
      enableErrors,
      errorRate,
      advancedIndels,
      repetitionCode,
      enableOligos,
      oligoLength,
    ]
  );

  useEffect(() => {
    runSimulation(inputText, 7);
  }, [runSimulation]);

  // ==========================================
  // DECODE COMPUTATIONS (DNA -> TEXT)
  // ==========================================
  const cleanInputDna = useMemo(() => {
    return inputDna.toUpperCase().replace(/[^ACGT]/g, '');
  }, [inputDna]);

  const hasInvalidDnaChars = useMemo(() => {
    return /[^ACGT\s]/i.test(inputDna);
  }, [inputDna]);

  const decodedResultData = useMemo(() => {
    if (!cleanInputDna) {
      return {
        text: '',
        bits: '',
        bytes: new Uint8Array(0),
        correctedErrors: 0,
        isMatch: true,
      };
    }

    return decode(cleanInputDna, {
      constraintAware: decodeMode === 'constraint-aware',
      repetitionCode: decodeRepetition,
    });
  }, [cleanInputDna, decodeMode, decodeRepetition]);

  const decodeAnalysis = useMemo(() => {
    return analyzeSequence(cleanInputDna);
  }, [cleanInputDna]);

  // Decode byte breakdown table data
  const decodeByteBreakdown = useMemo(() => {
    if (!decodedResultData?.bytes || decodedResultData.bytes.length === 0) return [];
    const items = [];
    const bytes = decodedResultData.bytes;

    for (let i = 0; i < bytes.length; i++) {
      const byteVal = bytes[i];
      const binaryStr = byteVal.toString(2).padStart(8, '0');
      const hexStr = '0x' + byteVal.toString(16).toUpperCase().padStart(2, '0');
      let charRep = String.fromCharCode(byteVal);
      if (byteVal < 32 || byteVal > 126) charRep = '•';

      // Corresponding 4 bases in direct mode
      const baseStart = i * 4;
      const bases = cleanInputDna.slice(baseStart, baseStart + 4);

      items.push({
        byteIndex: i,
        byteVal,
        binaryStr,
        hexStr,
        charRep,
        bases,
      });
    }
    return items;
  }, [decodedResultData, cleanInputDna]);

  // Handle Stepping for Encoding
  const handleStartStepThrough = () => {
    setIsStepping(true);
    setCurrentStage(1);
    setHelixBuiltCount(0);

    let stage = 1;
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);

    stepTimerRef.current = setInterval(() => {
      stage++;
      if (stage <= 7) {
        setCurrentStage(stage);
        if (stage === 5 && encodedResult) {
          let b = 0;
          const buildInterval = setInterval(() => {
            b += 2;
            setHelixBuiltCount(b);
            if (b >= encodedResult.dna.length) clearInterval(buildInterval);
          }, 60 / animSpeed);
        }
      } else {
        clearInterval(stepTimerRef.current);
        setIsStepping(false);
      }
    }, 1200 / animSpeed);
  };

  // Handle Stepping for Decoding
  const handleStartDecodeStepThrough = () => {
    setIsDecodeStepping(true);
    setDecodeCurrentStage(1);

    let stage = 1;
    if (decodeStepTimerRef.current) clearInterval(decodeStepTimerRef.current);

    decodeStepTimerRef.current = setInterval(() => {
      stage++;
      if (stage <= 4) {
        setDecodeCurrentStage(stage);
      } else {
        clearInterval(decodeStepTimerRef.current);
        setIsDecodeStepping(false);
      }
    }, 1200 / animSpeed);
  };

  const handleReset = () => {
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    setIsStepping(false);
    setInputText('Hi');
    runSimulation('Hi', 7);
  };

  const handleResetDecode = () => {
    if (decodeStepTimerRef.current) clearInterval(decodeStepTimerRef.current);
    setIsDecodeStepping(false);
    setInputDna('CAGACGGC');
    setDecodeCurrentStage(4);
  };

  // Save to history helper
  const handleSaveToHistory = () => {
    const isEncodingTab = activeTab === 'encode';
    const textToSave = isEncodingTab ? inputText : decodedResultData.text || inputDna;
    if (!textToSave || !textToSave.trim()) return;

    const currentDnaSeq = isEncodingTab ? encodedResult?.dna || '' : cleanInputDna;

    const newItem = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: textToSave,
      dna: currentDnaSeq,
      timestamp: Date.now(),
      dateString: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      charCount: textToSave.length,
      byteCount: new TextEncoder().encode(textToSave).length,
      mode: isEncodingTab ? encodingMode : decodeMode,
      dnaPreview: currentDnaSeq
        ? currentDnaSeq.length > 28
          ? currentDnaSeq.slice(0, 28) + '...'
          : currentDnaSeq
        : '',
      dnaLength: currentDnaSeq.length,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev.filter((h) => h.text !== textToSave)].slice(0, 50);
      try {
        localStorage.setItem('dna_input_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2200);
  };

  const handleDeleteHistoryItem = (id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('dna_input_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('dna_input_history');
    } catch (e) {}
  };

  const handleLoadHistoryItem = (item, targetMode = 'encode') => {
    if (targetMode === 'decode' && item.dna) {
      setInputDna(item.dna);
      if (item.mode) setDecodeMode(item.mode);
      setActiveTab('decode');
      setDecodeCurrentStage(4);
    } else {
      setInputText(item.text);
      if (item.mode) setEncodingMode(item.mode);
      setActiveTab('encode');
      runSimulation(item.text, 7);
    }
    setIsHistoryOpen(false);
  };

  // Transfer encoded DNA to decoder tab
  const handleTransferToDecoder = () => {
    if (encodedResult?.dna) {
      setInputDna(encodedResult.dna);
      setDecodeMode(encodingMode);
      setActiveTab('decode');
      setDecodeCurrentStage(4);
    }
  };

  // Transfer decoded text to encoder tab
  const handleTransferToEncoder = () => {
    if (decodedResultData?.text) {
      setInputText(decodedResultData.text);
      setEncodingMode(decodeMode);
      setActiveTab('encode');
      runSimulation(decodedResultData.text, 7);
    }
  };

  // Copy sequence to clipboard
  const handleCopySequence = () => {
    if (!encodedResult?.dna) return;
    navigator.clipboard.writeText(encodedResult.dna);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Copy decoded text to clipboard
  const handleCopyDecodedText = () => {
    if (!decodedResultData?.text) return;
    navigator.clipboard.writeText(decodedResultData.text);
    setDecodeCopyFeedback(true);
    setTimeout(() => setDecodeCopyFeedback(false), 2000);
  };

  // Download sequence as .txt
  const handleDownloadTxt = () => {
    if (!encodedResult?.dna) return;
    const blob = new Blob(
      [
        `# DNA Computing Project - Synthesized Strand\n# Input: "${inputText}"\n# Mode: ${encodingMode}\n# Length: ${encodedResult.dna.length} bases\n\n${encodedResult.dna}\n`,
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synthetic_dna_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download decoded text as .txt
  const handleDownloadDecodedTxt = () => {
    if (!decodedResultData?.text) return;
    const blob = new Blob(
      [
        `# DNA Computing Project - Decoded Plaintext\n# Source DNA: "${cleanInputDna}"\n# Mode: ${decodeMode}\n\n${decodedResultData.text}\n`,
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decoded_dna_text_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Char & Byte stats for encoding
  const inputCharCount = inputText.length;
  const inputByteCount = useMemo(() => {
    return new TextEncoder().encode(inputText).length;
  }, [inputText]);
  const isOverLimit = inputCharCount > MAX_INPUT_LENGTH;

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* ========================================================
          PAGE HEADER & BACK LINK
      ======================================================== */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>←</span> Back to Theory & Foundations
          </Link>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
            Interactive Architecture • DNA Storage Pipeline
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          DNA Data Storage Pipeline Simulator
        </h1>
        <p className="text-slate-600 mt-2 text-sm max-w-3xl leading-relaxed">
          Experience bi-directional molecular computing: convert digital text into synthetic DNA strands, or paste arbitrary nucleotide sequences to decode back into original data.
        </p>

        {/* Realism mapping callout */}
        <div className="mt-4 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <button
            type="button"
            onClick={() => setShowRealismInfo((p) => !p)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors text-left"
          >
            <span className="flex items-center gap-2">
              <span>🧬</span> How this software simulation maps to physical wet-lab DNA storage
            </span>
            <span className="text-indigo-500 font-mono">
              {showRealismInfo ? 'Hide ▲' : 'Read details ▼'}
            </span>
          </button>

          {showRealismInfo && (
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                In a biotechnology laboratory, physical synthesis replaces our software{' '}
                <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">encode()</span> function with
                microfluidic phosphoramidite cycling; physical sequencing replaces{' '}
                <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">decode()</span> using laser optical
                imaging (Illumina) or electric nanopore sensors.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/#section-pipeline" className="text-indigo-600 underline font-medium">
                  Review 7-Stage Theory & Stepper →
                </Link>
                <Link to="/#section-real-world" className="text-indigo-600 underline font-medium">
                  Read Real Synthesis & Homopolymer Rules →
                </Link>
                <Link to="/#section-computing" className="text-indigo-600 underline font-medium">
                  Explore Molecular Logic Gates →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          PRIMARY MODE SWITCHER TABS (ENCODE VS DECODE)
      ======================================================== */}
      <div className="flex items-center justify-center mb-8">
        <div className="inline-flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-xs max-w-md w-full">
          <button
            type="button"
            onClick={() => setActiveTab('encode')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'encode'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span className="text-base">🧬</span>
            <span>Encode (Text → DNA)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('decode')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'decode'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span className="text-base">🔍</span>
            <span>Decode (DNA → Text)</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: ENCODE MODE (TEXT -> DNA)
      ======================================================== */}
      {activeTab === 'encode' && (
        <div className="space-y-8">
          {/* INPUT & CONFIGURATION PANEL */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            {/* Text Area */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2.5">
                  <label
                    htmlFor="dna-input-text"
                    className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                  >
                    Source Data Input
                  </label>

                  {/* History buttons in input header */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleSaveToHistory}
                      disabled={!inputText.trim()}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors border border-slate-200/70 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                      title="Save current input text and settings to history"
                    >
                      <span>💾</span> Save
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsHistoryOpen(true)}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors border border-slate-200/70 flex items-center gap-1"
                      title="View saved input history"
                    >
                      <span>📜</span> History{' '}
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                        {history.length}
                      </span>
                    </button>

                    {saveNotification && (
                      <span className="text-[10px] font-mono font-bold text-emerald-700 animate-pulse px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded">
                        ✓ Saved!
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-500">
                  <span className={isOverLimit ? 'text-rose-600 font-bold' : ''}>
                    {inputCharCount}
                  </span>{' '}
                  / {MAX_INPUT_LENGTH} chars •{' '}
                  <span className="font-semibold text-slate-700">{inputByteCount} bytes</span>
                </div>
              </div>

              <textarea
                id="dna-input-text"
                rows={3}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  runSimulation(e.target.value, currentStage);
                }}
                placeholder="Type any text or paste characters to encode into synthetic DNA..."
                className={`w-full p-3.5 rounded-xl text-sm font-mono border transition-all focus:outline-hidden focus:ring-2 ${
                  isOverLimit
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 bg-slate-50/50'
                }`}
              />

              {isOverLimit && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  Input exceeds {MAX_INPUT_LENGTH} character safety cap. Please truncate text to ensure smooth
                  60fps rendering.
                </p>
              )}
            </div>

            {/* Quick Example Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Examples:</span>
              {[
                { label: 'Canonical "Hi"', val: 'Hi' },
                { label: 'DNA', val: 'DNA' },
                { label: 'Hello, World!', val: 'Hello, World!' },
                { label: 'Information', val: 'Information' },
                { label: 'Multi-byte Emoji 🧬💻', val: 'DNA 🧬 Tech 💻' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setInputText(chip.val);
                    runSimulation(chip.val, 7);
                  }}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors border border-slate-200/60"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Realism & Simulation Controls Row */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Option 1: Encoding Mode */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <span>Encoding Scheme</span>
                  <span
                    className="cursor-help text-slate-400 text-[10px]"
                    title="Direct 2-bit maps 00->A, 01->C, 10->G, 11->T. Constraint-aware uses Goldman-style base-3 rotation eliminating homopolymers."
                  >
                    ⓘ
                  </span>
                </label>
                <select
                  value={encodingMode}
                  onChange={(e) => {
                    setEncodingMode(e.target.value);
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-mono focus:outline-hidden focus:ring-1 focus:ring-indigo-400"
                >
                  <option value="direct">Direct 2-Bit Mapping (Proposal)</option>
                  <option value="constraint-aware">Constraint-Aware (Goldman Rotation)</option>
                </select>
              </div>

              {/* Option 2: Strand Packaging / Oligos */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Strand Packaging</label>
                  <input
                    type="checkbox"
                    checked={enableOligos}
                    onChange={(e) => setEnableOligos(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
                {enableOligos ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={16}
                      max={40}
                      step={4}
                      value={oligoLength}
                      onChange={(e) => setOligoLength(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                    <span className="text-[11px] font-mono text-slate-500 w-12 text-right">
                      {oligoLength} nt
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 pt-1">Single continuous strand</div>
                )}
              </div>

              {/* Option 3: Error Simulation */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Simulate Mutations</label>
                  <input
                    type="checkbox"
                    checked={enableErrors}
                    onChange={(e) => setEnableErrors(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </div>
                {enableErrors ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0.01}
                      max={0.15}
                      step={0.01}
                      value={errorRate}
                      onChange={(e) => setErrorRate(Number(e.target.value))}
                      className="w-full accent-rose-600"
                    />
                    <span className="text-[11px] font-mono text-rose-600 font-bold w-12 text-right">
                      {(errorRate * 100).toFixed(0)}%
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 pt-1">Perfect synthesis (0% error)</div>
                )}
              </div>

              {/* Option 4: 3x Repetition Code Toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">3x Repetition Code</label>
                  <input
                    type="checkbox"
                    checked={repetitionCode}
                    onChange={(e) => setRepetitionCode(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  {repetitionCode ? 'Majority voting active' : 'Off (No redundancy)'}
                </div>
              </div>
            </div>

            {/* Buttons and Animation Speed Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => runSimulation(inputText, 7)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>▶ Re-Encode</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartStepThrough}
                  disabled={isStepping}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border transition-all ${
                    isStepping
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 animate-pulse'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{isStepping ? 'Stepping...' : '⏭ Step Through (1→7)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToHistory}
                  disabled={!inputText.trim()}
                  className="px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-1.5 disabled:opacity-40"
                  title="Save current input to history"
                >
                  <span>💾 Save History</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                  title="View and reload saved inputs"
                >
                  <span>📜 History ({history.length})</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  ⟳ Reset
                </button>
              </div>

              {/* Speed slider */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Speed:</span>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.5}
                  value={animSpeed}
                  onChange={(e) => setAnimSpeed(Number(e.target.value))}
                  className="w-24 accent-indigo-600"
                />
                <span className="text-xs font-mono text-slate-600">{animSpeed}x</span>
              </div>
            </div>
          </div>

          {/* 7 PIPELINE STAGES */}
          {encodedResult && (
            <div className="space-y-6">
              {/* STAGE 1: DIGITAL TEXT */}
              <PipelineStep
                stageNum={1}
                title="Stage 1: Digital Text Representation"
                label="Input Serialization"
                meta={`${inputText.length} characters`}
                description="The original human-readable plaintext message ready to be serialized."
                isActive={currentStage === 1}
                isComplete={currentStage > 1}
              >
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm text-slate-800 break-all">
                  {inputText || <span className="text-slate-400 italic">[Empty String]</span>}
                </div>
              </PipelineStep>

              {/* STAGE 2: BINARY CONVERSION */}
              {currentStage >= 2 && (
                <PipelineStep
                  stageNum={2}
                  title="Stage 2: 8-Bit ASCII / UTF-8 Binary Conversion"
                  label="Binary Bitstream"
                  meta={`${encodedResult.bytes.length} bytes • ${encodedResult.bits.length} bits`}
                  description="Each UTF-8 character is converted into its 8-bit byte representation."
                  isActive={currentStage === 2}
                  isComplete={currentStage > 2}
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                      {Array.from(inputText).map((char, charIdx) => {
                        const charBytes = new TextEncoder().encode(char);
                        let charBits = '';
                        for (let i = 0; i < charBytes.length; i++) {
                          charBits += charBytes[i].toString(2).padStart(8, '0');
                        }

                        return (
                          <div
                            key={charIdx}
                            className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono flex flex-col items-center"
                          >
                            <span className="font-bold text-slate-700 text-sm mb-1">
                              {char === ' ' ? '␣' : char}
                            </span>
                            <div className="flex gap-1">
                              {charBits.match(/.{1,2}/g)?.map((pair, pIdx) => {
                                const globalBaseIdx = charIdx * 4 + pIdx;
                                const isHov = hoveredBaseIndex === globalBaseIdx;

                                return (
                                  <span
                                    key={pIdx}
                                    onMouseEnter={() => setHoveredBaseIndex(globalBaseIdx)}
                                    onMouseLeave={() => setHoveredBaseIndex(null)}
                                    className={`px-1 rounded text-[11px] transition-colors cursor-pointer ${
                                      isHov
                                        ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400'
                                        : 'bg-white text-slate-600 border border-slate-200'
                                    }`}
                                  >
                                    {pair}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </PipelineStep>
              )}

              {/* STAGE 3: BIT-PAIR GROUPING */}
              {currentStage >= 3 && (
                <PipelineStep
                  stageNum={3}
                  title="Stage 3: Bit-Pair Grouping & Base Mapping"
                  label="2-Bit Words"
                  meta={`${Math.ceil(encodedResult.bits.length / 2)} bit-pairs`}
                  description="Grouped into 2-bit words (00, 01, 10, 11), each pair bijectively mapping to a nucleotide."
                  isActive={currentStage === 3}
                  isComplete={currentStage > 3}
                >
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 max-h-44 overflow-y-auto">
                    {(encodedResult.bits.match(/.{1,2}/g) || []).map((pair, idx) => {
                      const mappedBase = BIT_TO_BASE[pair] || 'A';
                      const isHov = hoveredBaseIndex === idx;

                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoveredBaseIndex(idx)}
                          onMouseLeave={() => setHoveredBaseIndex(null)}
                          className={`inline-flex flex-col items-center px-1.5 py-1 rounded-md font-mono text-xs cursor-pointer transition-all ${
                            isHov ? 'scale-110 shadow-md ring-2 ring-indigo-500' : ''
                          }`}
                          style={{
                            backgroundColor: isHov
                              ? '#6366F1'
                              : BASE_COLORS[mappedBase]?.bgLight || '#F8FAFC',
                            borderColor: BASE_COLORS[mappedBase]?.border || '#E2E8F0',
                            color: isHov ? '#FFFFFF' : BASE_COLORS[mappedBase]?.text || '#1E293B',
                          }}
                        >
                          <span className="font-bold text-[11px]">{pair}</span>
                          <span className="text-[9px] opacity-75">↓ {mappedBase}</span>
                        </div>
                      );
                    })}
                  </div>
                </PipelineStep>
              )}

              {/* STAGE 4: DNA SEQUENCE */}
              {currentStage >= 4 && (
                <PipelineStep
                  stageNum={4}
                  title="Stage 4: Synthesized DNA Sequence"
                  label={encodingMode === 'constraint-aware' ? 'Goldman Rotated DNA' : 'Proposal Standard DNA'}
                  meta={`${encodedResult.dna.length} bases`}
                  description="The complete synthesized nucleic acid strand. Colored by nucleotide base identity."
                  isActive={currentStage === 4}
                  isComplete={currentStage > 4}
                >
                  <div className="space-y-4">
                    {/* Sequence Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setGroupByBytes((p) => !p)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors"
                        >
                          {groupByBytes ? 'Grouped by Byte (4 nt)' : 'Continuous Stream'}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowComplement((p) => !p)}
                          className={`px-2.5 py-1 rounded-lg font-mono transition-colors ${
                            showComplement
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-300 font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {showComplement ? '✓ Complement Visible' : '+ Complement Strand'}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleTransferToDecoder}
                          className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono font-semibold border border-indigo-200 transition-colors flex items-center gap-1"
                          title="Open this generated DNA in the Decoder tab"
                        >
                          <span>🔍 Test in Decoder →</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleCopySequence}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors flex items-center gap-1"
                        >
                          <span>{copyFeedback ? '✓ Copied' : '📋 Copy'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadTxt}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors flex items-center gap-1"
                        >
                          <span>💾 Download .txt</span>
                        </button>
                      </div>
                    </div>

                    {/* Primary DNA Strand Display */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono max-h-52 overflow-y-auto space-y-3">
                      <div>
                        <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                          <span>5' Forward Coding Strand →</span>
                          <span>{encodedResult.dna.length} nucleotides</span>
                        </div>

                        <div className="flex flex-wrap gap-1 leading-relaxed">
                          {encodedResult.dna.split('').map((base, idx) => {
                            const isByteEnd = groupByBytes && (idx + 1) % 4 === 0;
                            const isHov = hoveredBaseIndex === idx;

                            return (
                              <React.Fragment key={idx}>
                                <span
                                  onMouseEnter={() => setHoveredBaseIndex(idx)}
                                  onMouseLeave={() => setHoveredBaseIndex(null)}
                                  className={`px-1 rounded font-bold cursor-pointer transition-all ${
                                    isHov ? 'scale-125 ring-2 ring-white z-10' : ''
                                  }`}
                                  style={{
                                    color: BASE_COLORS[base]?.hex || '#FFFFFF',
                                    backgroundColor: isHov ? '#4338CA' : 'transparent',
                                  }}
                                >
                                  {base}
                                </span>
                                {isByteEnd && <span className="text-slate-600 px-0.5 select-none">•</span>}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>

                      {/* Complementary Strand (Toggleable) */}
                      {showComplement && (
                        <div className="pt-2 border-t border-slate-800">
                          <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                            <span>3' Antiparallel Complementary Strand ←</span>
                            <span className="text-indigo-400">Watson-Crick Template</span>
                          </div>

                          <div className="flex flex-wrap gap-1 leading-relaxed">
                            {encodedResult.complement.split('').map((base, idx) => {
                              const isByteEnd = groupByBytes && (idx + 1) % 4 === 0;
                              const isHov = hoveredBaseIndex === idx;

                              return (
                                <React.Fragment key={idx}>
                                  <span
                                    onMouseEnter={() => setHoveredBaseIndex(idx)}
                                    onMouseLeave={() => setHoveredBaseIndex(null)}
                                    className={`px-1 rounded font-bold opacity-80 cursor-pointer transition-all ${
                                      isHov ? 'scale-125 ring-2 ring-white opacity-100 z-10' : ''
                                    }`}
                                    style={{
                                      color: BASE_COLORS[base]?.hex || '#FFFFFF',
                                      backgroundColor: isHov ? '#4338CA' : 'transparent',
                                    }}
                                  >
                                    {base}
                                  </span>
                                  {isByteEnd && <span className="text-slate-700 px-0.5 select-none">•</span>}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Oligo Packaging Tube View (if enabled) */}
                    {enableOligos && encodedResult.oligos.length > 0 && (
                      <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-indigo-900">
                          <span>🧪 Oligonucleotide Tube Library ({encodedResult.oligos.length} strands)</span>
                          <span className="font-mono text-indigo-600">Fixed chunk: {oligoLength} nt</span>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {encodedResult.oligos.map((oligo) => (
                            <div
                              key={oligo.index}
                              className="p-2 rounded-lg bg-white border border-indigo-100 flex items-center gap-2 text-xs font-mono"
                            >
                              <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                                #{oligo.index}
                              </span>
                              <span className="text-emerald-600 font-semibold" title="Forward Primer">
                                {oligo.primerFwd}
                              </span>
                              <span className="text-purple-600 font-bold" title="Index Prefix">
                                {oligo.indexPrefix}
                              </span>
                              <span className="text-slate-800 break-all flex-1" title="Payload">
                                {oligo.payload}
                              </span>
                              <span className="text-emerald-600 font-semibold" title="Reverse Primer">
                                {oligo.primerRev}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </PipelineStep>
              )}

              {/* STAGE 5: SIMULATED STORAGE */}
              {currentStage >= 5 && (
                <PipelineStep
                  stageNum={5}
                  title="Stage 5: Simulated Chemical Storage"
                  label="Synthesized Molecular Medium"
                  meta={`${encodedResult.storedDna.length} bases in storage`}
                  description="The strand is preserved in a simulated cold, dark microtube medium."
                  isActive={currentStage === 5}
                  isComplete={currentStage > 5}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-5 flex justify-center">
                      <HelixBuilder
                        sequence={encodedResult.storedDna}
                        currentIndex={helixBuiltCount}
                        mode="build"
                      />
                    </div>

                    <div className="md:col-span-7 space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                        <div className="w-12 h-16 rounded-b-2xl rounded-t-sm border-2 border-slate-300 bg-gradient-to-b from-white via-indigo-50 to-indigo-100 flex items-center justify-center shadow-inner relative">
                          <span className="text-lg">💧</span>
                          <div className="absolute bottom-1 w-8 h-4 rounded-b-xl bg-indigo-300/40" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">
                            In-Memory DNA Microtube Archive
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Conditions: 4°C, dehydrated pellet, ambient radiation shielding.
                          </p>
                        </div>
                      </div>

                      {encodedResult.errorResult.errorCount > 0 ? (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                            <span>⚠️ Biochemical Mutation Event Injected!</span>
                            <span>{encodedResult.errorResult.errorCount} corrupted bases</span>
                          </div>
                          <p className="text-xs text-rose-700 leading-relaxed">
                            Simulating synthesis/storage radiation noise. Inspect how errors affect downstream
                            sequencing below.
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {encodedResult.errorResult.mutations.slice(0, 12).map((m, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-white text-rose-800 border border-rose-300 text-[11px] font-mono font-bold"
                              >
                                Pos {m.index}: {m.original} → {m.mutated}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                          <span>✓</span>
                          <span>Zero mutations detected — perfect synthesis stability.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </PipelineStep>
              )}

              {/* STAGE 6: DNA DECODING */}
              {currentStage >= 6 && (
                <PipelineStep
                  stageNum={6}
                  title="Stage 6: DNA Sequencing & Reading"
                  label="Flow Cell Sequencing"
                  meta="Base-by-base optical/nanopore reading"
                  description="High-throughput sequencer reads the stored strand, unzipping the double helix and converting bases back to bits."
                  isActive={currentStage === 6}
                  isComplete={currentStage > 6}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-5 flex justify-center">
                      <HelixBuilder
                        sequence={encodedResult.storedDna}
                        currentIndex={encodedResult.storedDna.length}
                        mode="unzip"
                      />
                    </div>

                    <div className="md:col-span-7 space-y-3 font-mono text-xs">
                      <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          Sequenced Bits Stream:
                        </span>
                        <div className="break-all text-indigo-300 font-bold leading-relaxed max-h-32 overflow-y-auto">
                          {encodeDecodedResult?.bits || '...'}
                        </div>
                      </div>

                      {repetitionCode && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                          <strong>3x Repetition Majority Vote:</strong> Successfully corrected{' '}
                          {encodeDecodedResult?.correctedErrors || 0} base errors during decoding!
                        </div>
                      )}
                    </div>
                  </div>
                </PipelineStep>
              )}

              {/* STAGE 7: RECOVERED DATA & VERIFICATION */}
              {currentStage >= 7 && (
                <PipelineStep
                  stageNum={7}
                  title="Stage 7: Original Data Recovery & Lossless Verification"
                  label="Decoded Output"
                  meta={encodeDecodedResult?.isMatch ? 'Match Verified' : 'Corruption Detected'}
                  description="Bitstream regrouped into 8-bit bytes and decoded via UTF-8."
                  isActive={currentStage === 7}
                  isComplete={true}
                >
                  <div className="space-y-4">
                    {encodeDecodedResult?.isMatch ? (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-emerald-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg">
                            ✓
                          </div>
                          <div>
                            <h4 className="font-bold text-sm sm:text-base">
                              Match ✓ — Lossless Recovery Verified
                            </h4>
                            <p className="text-xs text-emerald-700">
                              The decoded text matches the input data with 100% bit-exact accuracy.
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
                          Lossless 0-error
                        </span>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 flex items-center justify-between text-rose-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-lg">
                            ✗
                          </div>
                          <div>
                            <h4 className="font-bold text-sm sm:text-base">
                              Corruption Detected — Data Mismatch
                            </h4>
                            <p className="text-xs text-rose-700">
                              Simulated mutation errors corrupted the decoded text. Enable 3x Repetition Code to
                              recover corrupted bits!
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold bg-rose-100 text-rose-800 px-3 py-1 rounded-full border border-rose-300">
                          Bit Mismatch
                        </span>
                      </div>
                    )}

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm text-slate-800 break-all">
                      <div className="text-[10px] text-slate-400 mb-1">Decoded Plaintext:</div>
                      {encodeDecodedResult?.text || (
                        <span className="text-slate-400 italic">[Empty String]</span>
                      )}
                    </div>
                  </div>
                </PipelineStep>
              )}
            </div>
          )}

          {/* ANALYSIS & METRICS PANEL (MATCHING PROPOSAL) */}
          {encodedResult && (
            <AnalysisPanel
              analysis={encodedResult.analysis}
              inputBytes={encodedResult.bytes.length}
              inputBits={encodedResult.bits.length}
              isConstraintAware={encodingMode === 'constraint-aware'}
              isOligos={enableOligos}
              isRepetition={repetitionCode}
            />
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: DECODE MODE (DNA -> TEXT)
      ======================================================== */}
      {activeTab === 'decode' && (
        <div className="space-y-8">
          {/* DECODER INPUT PANEL */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2.5">
                  <label
                    htmlFor="dna-sequence-input"
                    className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                  >
                    Raw DNA Sequence Input (A, C, G, T)
                  </label>

                  {/* History button in header */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleSaveToHistory}
                      disabled={!cleanInputDna}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors border border-slate-200/70 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                      title="Save current DNA sequence to history"
                    >
                      <span>💾</span> Save
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsHistoryOpen(true)}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors border border-slate-200/70 flex items-center gap-1"
                      title="View saved history"
                    >
                      <span>📜</span> History{' '}
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                        {history.length}
                      </span>
                    </button>

                    {saveNotification && (
                      <span className="text-[10px] font-mono font-bold text-emerald-700 animate-pulse px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded">
                        ✓ Saved!
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-500">
                  <span className="font-bold text-indigo-600">{cleanInputDna.length}</span> bases (nt) •{' '}
                  <span className="font-semibold text-slate-700">
                    {Math.floor(cleanInputDna.length / (decodeMode === 'constraint-aware' ? 6 : 4))} bytes
                  </span>
                </div>
              </div>

              {/* DNA Textarea */}
              <textarea
                id="dna-sequence-input"
                rows={3}
                value={inputDna}
                onChange={(e) => setInputDna(e.target.value)}
                placeholder="Paste or type nucleotide sequence (e.g. CAGACGGC)..."
                className="w-full p-3.5 rounded-xl text-sm font-mono tracking-wider uppercase border border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 bg-slate-50/50"
              />

              {/* Warnings & Sanitization Helper */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5 text-xs">
                {hasInvalidDnaChars && (
                  <div className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
                    <span>⚠️ Invalid non-ACGT characters detected.</span>
                    <button
                      type="button"
                      onClick={() => setInputDna(cleanInputDna)}
                      className="font-bold underline hover:text-amber-900"
                    >
                      Click to Clean
                    </button>
                  </div>
                )}

                {decodeMode === 'direct' && cleanInputDna.length > 0 && cleanInputDna.length % 4 !== 0 && (
                  <div className="text-slate-500 text-[11px] font-mono">
                    ⓘ Note: {cleanInputDna.length} bases is not a multiple of 4. Trailing{' '}
                    {cleanInputDna.length % 4} base(s) will be zero-padded.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Example Chips for Decoding */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Presets:</span>
              {[
                { label: 'Canonical "Hi" (CAGACGGC)', val: 'CAGACGGC' },
                { label: 'Short "DNA" (CAGACAGCCGAA)', val: 'CAGACAGCCGAA' },
                { label: 'Word "OK" (CGAACGAT)', val: 'CGAACGAT' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setInputDna(chip.val);
                    setDecodeCurrentStage(4);
                  }}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors border border-slate-200/60"
                >
                  {chip.label}
                </button>
              ))}

              {encodedResult?.dna && (
                <button
                  type="button"
                  onClick={() => {
                    setInputDna(encodedResult.dna);
                    setDecodeMode(encodingMode);
                    setDecodeCurrentStage(4);
                  }}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200 font-semibold"
                  title="Use DNA currently synthesized in the Encode tab"
                >
                  ↳ Pre-fill from Current Encoder
                </button>
              )}
            </div>

            {/* Decoder Options Row */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Option 1: Scheme */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Decoding Scheme</label>
                <select
                  value={decodeMode}
                  onChange={(e) => setDecodeMode(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-mono focus:outline-hidden focus:ring-1 focus:ring-indigo-400"
                >
                  <option value="direct">Direct 2-Bit (A=00, C=01, G=10, T=11)</option>
                  <option value="constraint-aware">Constraint-Aware (Goldman Rotation)</option>
                </select>
              </div>

              {/* Option 2: 3x Repetition */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">3x Repetition Recovery</label>
                  <input
                    type="checkbox"
                    checked={decodeRepetition}
                    onChange={(e) => setDecodeRepetition(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  {decodeRepetition ? 'Majority voting active' : 'Off (Standard read)'}
                </div>
              </div>

              {/* Option 3: Group by Byte */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Group by Byte</label>
                  <input
                    type="checkbox"
                    checked={decodeGroupByBytes}
                    onChange={(e) => setDecodeGroupByBytes(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  {decodeGroupByBytes ? '4 bases per block' : 'Continuous stream'}
                </div>
              </div>

              {/* Option 4: Complement Strand */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Complement Strand</label>
                  <input
                    type="checkbox"
                    checked={decodeShowComplement}
                    onChange={(e) => setDecodeShowComplement(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  {decodeShowComplement ? 'Show 3\'→5\' template' : 'Hidden'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDecodeCurrentStage(4)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>▶ Decode DNA</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartDecodeStepThrough}
                  disabled={isDecodeStepping || !cleanInputDna}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border transition-all ${
                    isDecodeStepping
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 animate-pulse'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{isDecodeStepping ? 'Decoding Step...' : '⏭ Step Through (1→4)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToHistory}
                  disabled={!cleanInputDna}
                  className="px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-1.5 disabled:opacity-40"
                  title="Save current DNA sequence to history"
                >
                  <span>💾 Save History</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                  title="View and reload saved inputs"
                >
                  <span>📜 History ({history.length})</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDecode}
                  className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  ⟳ Reset
                </button>
              </div>

              {/* Speed slider */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Speed:</span>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.5}
                  value={animSpeed}
                  onChange={(e) => setAnimSpeed(Number(e.target.value))}
                  className="w-24 accent-indigo-600"
                />
                <span className="text-xs font-mono text-slate-600">{animSpeed}x</span>
              </div>
            </div>
          </div>

          {/* DECODING PIPELINE (4 STAGES) */}
          <div className="space-y-6">
            {/* STAGE 1: RAW DNA SEQUENCE */}
            <PipelineStep
              stageNum={1}
              title="Stage 1: Stored DNA Strand Input"
              label="Source Molecular Polymer"
              meta={`${cleanInputDna.length} bases (nt)`}
              description="The physical nucleotide sequence to be read and decoded back into binary data."
              isActive={decodeCurrentStage === 1}
              isComplete={decodeCurrentStage > 1}
            >
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-900 text-white font-mono max-h-52 overflow-y-auto space-y-3">
                  <div>
                    <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                      <span>5' Forward Reading Strand →</span>
                      <span>{cleanInputDna.length} nucleotides</span>
                    </div>

                    <div className="flex flex-wrap gap-1 leading-relaxed">
                      {cleanInputDna ? (
                        cleanInputDna.split('').map((base, idx) => {
                          const isByteEnd = decodeGroupByBytes && (idx + 1) % 4 === 0;
                          const isHov = hoveredDecodeBaseIndex === idx;

                          return (
                            <React.Fragment key={idx}>
                              <span
                                onMouseEnter={() => setHoveredDecodeBaseIndex(idx)}
                                onMouseLeave={() => setHoveredDecodeBaseIndex(null)}
                                className={`px-1 rounded font-bold cursor-pointer transition-all ${
                                  isHov ? 'scale-125 ring-2 ring-white z-10' : ''
                                }`}
                                style={{
                                  color: BASE_COLORS[base]?.hex || '#FFFFFF',
                                  backgroundColor: isHov ? '#4338CA' : 'transparent',
                                }}
                              >
                                {base}
                              </span>
                              {isByteEnd && <span className="text-slate-600 px-0.5 select-none">•</span>}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <span className="text-slate-400 italic">[Empty sequence]</span>
                      )}
                    </div>
                  </div>

                  {decodeShowComplement && cleanInputDna && (
                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                        <span>3' Antiparallel Complementary Strand ←</span>
                        <span className="text-indigo-400">Template Base-Pairs</span>
                      </div>

                      <div className="flex flex-wrap gap-1 leading-relaxed">
                        {complementStrand(cleanInputDna)
                          .split('')
                          .map((base, idx) => {
                            const isByteEnd = decodeGroupByBytes && (idx + 1) % 4 === 0;
                            const isHov = hoveredDecodeBaseIndex === idx;

                            return (
                              <React.Fragment key={idx}>
                                <span
                                  onMouseEnter={() => setHoveredDecodeBaseIndex(idx)}
                                  onMouseLeave={() => setHoveredDecodeBaseIndex(null)}
                                  className={`px-1 rounded font-bold opacity-80 cursor-pointer transition-all ${
                                    isHov ? 'scale-125 ring-2 ring-white opacity-100 z-10' : ''
                                  }`}
                                  style={{
                                    color: BASE_COLORS[base]?.hex || '#FFFFFF',
                                    backgroundColor: isHov ? '#4338CA' : 'transparent',
                                  }}
                                >
                                  {base}
                                </span>
                                {isByteEnd && <span className="text-slate-700 px-0.5 select-none">•</span>}
                              </React.Fragment>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </PipelineStep>

            {/* STAGE 2: SEQUENCING & BASE-TO-BIT TRANSLATION */}
            {decodeCurrentStage >= 2 && (
              <PipelineStep
                stageNum={2}
                title="Stage 2: Sequencing & Base-to-Bits Translation"
                label="Molecular Optical / Nanopore Reading"
                meta={`${cleanInputDna.length} bases → ${decodedResultData.bits.length} bits`}
                description="The sequencer unzips the DNA duplex and converts each nucleotide base back into its 2-bit binary equivalent."
                isActive={decodeCurrentStage === 2}
                isComplete={decodeCurrentStage > 2}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 flex justify-center">
                    <HelixBuilder
                      sequence={cleanInputDna}
                      currentIndex={cleanInputDna.length}
                      mode="unzip"
                    />
                  </div>

                  <div className="md:col-span-7 space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>Base → 2-Bit Translation</span>
                        <span className="font-mono text-slate-400 text-[11px]">
                          00=A, 01=C, 10=G, 11=T
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                        {cleanInputDna.split('').map((base, idx) => {
                          const pair = BASE_TO_BIT[base] || '00';
                          const isHov = hoveredDecodeBaseIndex === idx;

                          return (
                            <div
                              key={idx}
                              onMouseEnter={() => setHoveredDecodeBaseIndex(idx)}
                              onMouseLeave={() => setHoveredDecodeBaseIndex(null)}
                              className={`inline-flex flex-col items-center px-2 py-1 rounded-md font-mono text-xs cursor-pointer transition-all ${
                                isHov ? 'scale-115 ring-2 ring-indigo-500 shadow-md' : 'shadow-2xs'
                              }`}
                              style={{
                                backgroundColor: isHov
                                  ? '#6366F1'
                                  : BASE_COLORS[base]?.bgLight || '#F8FAFC',
                                borderColor: BASE_COLORS[base]?.border || '#E2E8F0',
                                color: isHov ? '#FFFFFF' : BASE_COLORS[base]?.text || '#1E293B',
                              }}
                            >
                              <span className="font-bold">{base}</span>
                              <span className="text-[10px] opacity-80 leading-none mt-0.5">
                                {pair}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {decodeRepetition && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                        <strong>3x Repetition Active:</strong> Corrected{' '}
                        {decodedResultData.correctedErrors} triplet error(s) via majority voting.
                      </div>
                    )}
                  </div>
                </div>
              </PipelineStep>
            )}

            {/* STAGE 3: BYTE OCTET ASSEMBLY */}
            {decodeCurrentStage >= 3 && (
              <PipelineStep
                stageNum={3}
                title="Stage 3: Byte Octet Assembly (8-Bit Chunks)"
                label="Binary Byte Framing"
                meta={`${decodedResultData.bytes.length} bytes assembled`}
                description="Every 4 bases (8 bits) are reassembled into byte octets and mapped to ASCII/UTF-8 character codes."
                isActive={decodeCurrentStage === 3}
                isComplete={decodeCurrentStage > 3}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto p-1">
                    {decodeByteBreakdown.map((b) => (
                      <div
                        key={b.byteIndex}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono flex flex-col items-center hover:border-indigo-300 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-sm text-indigo-700 mb-1.5">
                          {b.charRep}
                        </div>
                        <span className="font-bold text-slate-800 text-[11px]">{b.binaryStr}</span>
                        <div className="flex items-center justify-between w-full mt-1 text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                          <span>{b.hexStr}</span>
                          <span>Dec: {b.byteVal}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PipelineStep>
            )}

            {/* STAGE 4: RECOVERED PLAINTEXT OUTPUT */}
            {decodeCurrentStage >= 4 && (
              <PipelineStep
                stageNum={4}
                title="Stage 4: Recovered Plaintext & Lossless Verification"
                label="Decoded Output"
                meta={`${decodedResultData.text.length} chars • ${decodedResultData.bytes.length} bytes`}
                description="The byte stream is decoded through UTF-8 to reconstruct the original plaintext message."
                isActive={decodeCurrentStage === 4}
                isComplete={true}
              >
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-wrap items-center justify-between gap-3 text-emerald-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg">
                        ✓
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base">
                          Decoded Successfully
                        </h4>
                        <p className="text-xs text-emerald-700">
                          Reconstructed {decodedResultData.text.length} character(s) from{' '}
                          {cleanInputDna.length} DNA base(s).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTransferToEncoder}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-100 transition-colors"
                        title="Send this decoded text into the Encoder tab"
                      >
                        🧬 Test in Encoder →
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyDecodedText}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                      >
                        {decodeCopyFeedback ? '✓ Copied' : '📋 Copy Text'}
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadDecodedTxt}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-100 transition-colors"
                      >
                        💾 Download .txt
                      </button>
                    </div>
                  </div>

                  {/* Decoded Plaintext Box */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm text-slate-800 break-all">
                    <div className="text-[10px] text-slate-400 mb-1 uppercase font-semibold">
                      Decoded Plaintext String:
                    </div>
                    {decodedResultData.text || (
                      <span className="text-slate-400 italic">[Empty String]</span>
                    )}
                  </div>
                </div>
              </PipelineStep>
            )}
          </div>

          {/* SEQUENCE ANALYSIS PANEL FOR DECODED DNA */}
          {cleanInputDna && (
            <AnalysisPanel
              analysis={decodeAnalysis}
              inputBytes={decodedResultData.bytes.length}
              inputBits={cleanInputDna.length * 2}
              isConstraintAware={decodeMode === 'constraint-aware'}
              isOligos={false}
              isRepetition={decodeRepetition}
            />
          )}
        </div>
      )}

      {/* ========================================================
          INPUT HISTORY MODAL
      ======================================================== */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadItem={handleLoadHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
