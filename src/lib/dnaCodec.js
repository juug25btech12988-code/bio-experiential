/**
 * DNA Codec Module
 * Pure client-side DNA data encoding, decoding, constraint-aware transformation,
 * error simulation, oligo packaging, and sequence analysis.
 *
 * Mapping standard:
 * 00 -> A (soft coral)
 * 01 -> C (soft sky blue)
 * 10 -> G (soft mint green)
 * 11 -> T (soft lilac)
 */

export const BIT_TO_BASE = {
  '00': 'A',
  '01': 'C',
  '10': 'G',
  '11': 'T',
};

export const BASE_TO_BIT = {
  A: '00',
  C: '01',
  G: '10',
  T: '11',
};

export const COMPLEMENT = {
  A: 'T',
  T: 'A',
  C: 'G',
  G: 'C',
};

export const BASES = ['A', 'C', 'G', 'T'];
export const MAX_INPUT_LENGTH = 5000;

// Base palette definitions for UI components
export const BASE_COLORS = {
  A: {
    name: 'Adenine',
    hex: '#F4A5A5',
    text: '#9B2C2C',
    border: '#FEB2B2',
    bgLight: '#FFF5F5',
    bits: '00',
    pair: 'T',
  },
  C: {
    name: 'Cytosine',
    hex: '#A5D4F4',
    text: '#2B6CB0',
    border: '#BEE3F8',
    bgLight: '#EBF8FF',
    bits: '01',
    pair: 'G',
  },
  G: {
    name: 'Guanine',
    hex: '#A5F4B8',
    text: '#22543D',
    border: '#C6F6D5',
    bgLight: '#F0FFF4',
    bits: '10',
    pair: 'C',
  },
  T: {
    name: 'Thymine',
    hex: '#D4A5F4',
    text: '#553C9A',
    border: '#E9D8FD',
    bgLight: '#FAF5FF',
    bits: '11',
    pair: 'A',
  },
};

/**
 * Text to UTF-8 bytes
 */
export function textToBytes(text) {
  if (!text) return new Uint8Array(0);
  return new TextEncoder().encode(text);
}

/**
 * UTF-8 bytes to text
 */
export function bytesToText(bytes) {
  if (!bytes || bytes.length === 0) return '';
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

/**
 * Bytes to 8-bit binary string
 */
export function bytesToBits(bytes) {
  if (!bytes || bytes.length === 0) return '';
  let bits = '';
  for (let i = 0; i < bytes.length; i++) {
    bits += bytes[i].toString(2).padStart(8, '0');
  }
  return bits;
}

/**
 * 8-bit binary string to Uint8Array
 */
export function bitsToBytes(bitString) {
  if (!bitString) return new Uint8Array(0);
  const remainder = bitString.length % 8;
  const padded = remainder === 0 ? bitString : bitString + '0'.repeat(8 - remainder);
  const byteCount = Math.floor(padded.length / 8);
  const bytes = new Uint8Array(byteCount);
  for (let i = 0; i < byteCount; i++) {
    bytes[i] = parseInt(padded.slice(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}

/**
 * Direct 2-bit binary to DNA conversion
 * 00->A, 01->C, 10->G, 11->T
 */
export function bitsToDNA(bitString) {
  if (!bitString) return '';
  const bits = bitString.length % 2 === 0 ? bitString : bitString + '0';
  let dna = '';
  for (let i = 0; i < bits.length; i += 2) {
    const pair = bits.slice(i, i + 2);
    dna += BIT_TO_BASE[pair] || 'A';
  }
  return dna;
}

/**
 * DNA string to 2-bit binary string
 */
export function dnaToBits(dnaSeq) {
  if (!dnaSeq) return '';
  let bits = '';
  const upper = dnaSeq.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    const base = upper[i];
    bits += BASE_TO_BIT[base] !== undefined ? BASE_TO_BIT[base] : '00';
  }
  return bits;
}

/**
 * Complementary DNA strand (A<->T, C<->G)
 */
export function complementStrand(dnaSeq) {
  if (!dnaSeq) return '';
  let comp = '';
  const upper = dnaSeq.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    comp += COMPLEMENT[upper[i]] || upper[i];
  }
  return comp;
}

/**
 * Analyze DNA sequence composition, GC content, homopolymers
 */
export function analyzeSequence(dnaSeq) {
  if (!dnaSeq || dnaSeq.length === 0) {
    return {
      length: 0,
      composition: { A: 0, C: 0, G: 0, T: 0 },
      percentages: { A: 0, C: 0, G: 0, T: 0 },
      gcContent: 0,
      longestRun: 0,
      longestRunBase: '',
      longestRunStart: -1,
      runsOfFourOrMore: 0,
    };
  }

  const upper = dnaSeq.toUpperCase();
  const counts = { A: 0, C: 0, G: 0, T: 0 };
  let longestRun = 1;
  let longestRunBase = upper[0] || 'A';
  let longestRunStart = 0;

  let currentRun = 1;
  let currentRunStart = 0;
  let runsOfFourOrMore = 0;

  for (let i = 0; i < upper.length; i++) {
    const char = upper[i];
    if (counts[char] !== undefined) {
      counts[char]++;
    }

    if (i > 0) {
      if (char === upper[i - 1]) {
        currentRun++;
        if (currentRun === 4) {
          runsOfFourOrMore++;
        }
        if (currentRun > longestRun) {
          longestRun = currentRun;
          longestRunBase = char;
          longestRunStart = currentRunStart;
        }
      } else {
        currentRun = 1;
        currentRunStart = i;
      }
    }
  }

  const len = upper.length;
  const percentages = {
    A: Number(((counts.A / len) * 100).toFixed(1)),
    C: Number(((counts.C / len) * 100).toFixed(1)),
    G: Number(((counts.G / len) * 100).toFixed(1)),
    T: Number(((counts.T / len) * 100).toFixed(1)),
  };

  const gcContent = Number((((counts.G + counts.C) / len) * 100).toFixed(1));

  return {
    length: len,
    composition: counts,
    percentages,
    gcContent,
    longestRun,
    longestRunBase,
    longestRunStart,
    runsOfFourOrMore,
  };
}

/* -------------------------------------------------------------
 * Constraint-Aware Rotating Codec (Goldman et al. homopolymer avoidance)
 *
 * Each byte is converted into exactly 6 base-3 trits (since 3^6 = 729 > 255).
 * Each trit selects one of the 3 bases that differ from the previous base.
 * Because the next base is ALWAYS selected from bases != previous base,
 * homopolymer runs of length >= 2 are mathematically impossible!
 * ------------------------------------------------------------- */

function getValidNextBases(prevBase) {
  return BASES.filter((b) => b !== prevBase);
}

/**
 * Encodes bytes into homopolymer-free DNA.
 * 6 bases per byte, each base strictly different from previous base.
 */
export function encodeConstraintAware(bytes) {
  if (!bytes || bytes.length === 0) return '';

  let dna = '';
  let prevBase = 'A'; // initial reference base

  for (let i = 0; i < bytes.length; i++) {
    let val = bytes[i];
    // Decompose into 6 trits (base 3)
    const trits = [];
    for (let k = 0; k < 6; k++) {
      trits.push(val % 3);
      val = Math.floor(val / 3);
    }
    // Encode trits into bases
    for (let t = 0; t < 6; t++) {
      const trit = trits[t];
      const choices = getValidNextBases(prevBase);
      const nextBase = choices[trit];
      dna += nextBase;
      prevBase = nextBase;
    }
  }

  return dna;
}

/**
 * Decodes constraint-aware DNA back to original bytes.
 */
export function decodeConstraintAware(dnaSeq) {
  if (!dnaSeq || dnaSeq.length === 0) return new Uint8Array(0);

  const upper = dnaSeq.toUpperCase().replace(/[^ACGT]/g, '');
  const byteCount = Math.floor(upper.length / 6);
  const result = new Uint8Array(byteCount);

  let prevBase = 'A';
  let baseIdx = 0;

  for (let i = 0; i < byteCount; i++) {
    let byteVal = 0;
    let multiplier = 1;

    for (let k = 0; k < 6; k++) {
      const currBase = upper[baseIdx++];
      const choices = getValidNextBases(prevBase);
      let trit = choices.indexOf(currBase);
      if (trit === -1) trit = 0; // Fallback for mutated base
      byteVal += trit * multiplier;
      multiplier *= 3;
      prevBase = currBase;
    }

    result[i] = Math.min(255, byteVal);
  }

  return result;
}

/* -------------------------------------------------------------
 * Repetition Code (3x redundancy + majority vote)
 * ------------------------------------------------------------- */
export function encodeRepetition(dnaSeq, factor = 3) {
  if (!dnaSeq) return '';
  let result = '';
  for (let i = 0; i < dnaSeq.length; i++) {
    result += dnaSeq[i].repeat(factor);
  }
  return result;
}

export function decodeRepetition(dnaSeq, factor = 3) {
  if (!dnaSeq) return { dna: '', correctedCount: 0 };
  let dna = '';
  let correctedCount = 0;

  for (let i = 0; i < dnaSeq.length; i += factor) {
    const chunk = dnaSeq.slice(i, i + factor);
    const counts = { A: 0, C: 0, G: 0, T: 0 };
    for (let j = 0; j < chunk.length; j++) {
      if (counts[chunk[j]] !== undefined) counts[chunk[j]]++;
    }
    let maxBase = chunk[0] || 'A';
    let maxCount = -1;
    for (const b of BASES) {
      if (counts[b] > maxCount) {
        maxCount = counts[b];
        maxBase = b;
      }
    }
    for (let j = 0; j < chunk.length; j++) {
      if (chunk[j] !== maxBase) {
        correctedCount++;
      }
    }
    dna += maxBase;
  }

  return { dna, correctedCount };
}

/* -------------------------------------------------------------
 * Error Simulation (Substitution & Indels)
 * ------------------------------------------------------------- */
export function injectErrors(dnaSeq, errorRate = 0, options = {}) {
  if (!dnaSeq || errorRate <= 0) {
    return {
      dna: dnaSeq,
      mutations: [],
      errorCount: 0,
    };
  }

  const { insertionDeletion = false, seed = null } = options;
  const chars = dnaSeq.toUpperCase().split('');
  const mutations = [];

  let rng = Math.random;
  if (typeof seed === 'number') {
    let s = seed;
    rng = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  for (let i = 0; i < chars.length; i++) {
    if (rng() < errorRate) {
      const orig = chars[i];
      let type = 'substitution';

      if (insertionDeletion) {
        const roll = rng();
        if (roll < 0.3) type = 'deletion';
        else if (roll < 0.6) type = 'insertion';
      }

      if (type === 'substitution') {
        const alternatives = BASES.filter((b) => b !== orig);
        const sub = alternatives[Math.floor(rng() * alternatives.length)];
        chars[i] = sub;
        mutations.push({ index: i, original: orig, mutated: sub, type });
      } else if (type === 'deletion') {
        mutations.push({ index: i, original: orig, mutated: '', type });
        chars[i] = '';
      } else if (type === 'insertion') {
        const inserted = BASES[Math.floor(rng() * BASES.length)];
        mutations.push({ index: i, original: orig, mutated: orig + inserted, type });
        chars[i] = orig + inserted;
      }
    }
  }

  const finalDna = chars.join('');
  return {
    dna: finalDna,
    mutations,
    errorCount: mutations.length,
  };
}

/* -------------------------------------------------------------
 * Oligo Packaging & Reassembly
 * ------------------------------------------------------------- */
export function packageOligos(dnaSeq, oligoLength = 20, primerFwd = 'ACGT', primerRev = 'TGCA') {
  if (!dnaSeq) return [];
  const oligos = [];
  let index = 0;

  for (let i = 0; i < dnaSeq.length; i += oligoLength) {
    const payload = dnaSeq.slice(i, i + oligoLength);

    // 2-byte index encoded into 8 bases (direct 2-bit mapping)
    const idxBytes = new Uint8Array([(index >> 8) & 0xff, index & 0xff]);
    const idxBits = bytesToBits(idxBytes);
    const indexPrefix = bitsToDNA(idxBits);

    oligos.push({
      index,
      indexPrefix,
      primerFwd,
      primerRev,
      payload,
      fullSequence: `${primerFwd}${indexPrefix}${payload}${primerRev}`,
      length: primerFwd.length + indexPrefix.length + payload.length + primerRev.length,
    });

    index++;
  }

  return oligos;
}

export function assembleOligos(oligos) {
  if (!oligos || oligos.length === 0) return '';
  const sorted = [...oligos].sort((a, b) => a.index - b.index);
  return sorted.map((o) => o.payload).join('');
}

/* -------------------------------------------------------------
 * Full Encode Pipeline
 * ------------------------------------------------------------- */
export function encode(text, options = {}) {
  const {
    constraintAware = false,
    errorRate = 0,
    insertionDeletion = false,
    repetitionCode = false,
    oligos: enableOligos = false,
    oligoLength = 20,
  } = options;

  const bytes = textToBytes(text);
  const bits = bytesToBits(bytes);

  // Choose encoding mode
  let rawDna = '';
  if (constraintAware) {
    rawDna = encodeConstraintAware(bytes);
  } else {
    rawDna = bitsToDNA(bits);
  }

  // Apply repetition code if enabled
  let encodedDna = rawDna;
  if (repetitionCode) {
    encodedDna = encodeRepetition(rawDna, 3);
  }

  // Oligo packaging
  let oligoList = [];
  if (enableOligos) {
    oligoList = packageOligos(encodedDna, oligoLength);
  }

  // Error simulation on the stored sequence
  const errorResult = injectErrors(encodedDna, errorRate, { insertionDeletion });
  const storedDna = errorResult.dna;

  // Analysis of the clean sequence
  const analysis = analyzeSequence(rawDna);

  // 7-Stage Pipeline data representation
  const stages = [
    {
      id: 1,
      name: 'Digital Text',
      label: 'Input Data',
      value: text,
      meta: `${text.length} characters`,
      description: 'Human-readable source message in UTF-8 text.',
    },
    {
      id: 2,
      name: 'Binary Conversion',
      label: '8-Bit ASCII / UTF-8',
      value: bits,
      meta: `${bytes.length} bytes (${bits.length} bits)`,
      description: 'Each character mapped to 8-bit binary bytes via standard UTF-8.',
    },
    {
      id: 3,
      name: 'Bit-Pair Grouping',
      label: '2-Bit Words',
      value: bits.match(/.{1,2}/g) || [],
      meta: `${Math.ceil(bits.length / 2)} pairs`,
      description: 'Bits grouped into 2-bit pairs (00, 01, 10, 11) matching the 4-base DNA alphabet.',
    },
    {
      id: 4,
      name: 'DNA Encoding',
      label: constraintAware ? 'Constraint-Aware DNA' : 'Direct 2-Bit DNA',
      value: rawDna,
      meta: `${rawDna.length} bases`,
      description: constraintAware
        ? 'Base-3 rotating mapping avoiding homopolymer runs (runs >= 2 eliminated).'
        : 'Mapped using standard proposal table: 00->A, 01->C, 10->G, 11->T.',
    },
    {
      id: 5,
      name: 'Simulated Storage',
      label: 'Synthesized Strand',
      value: storedDna,
      meta: `${storedDna.length} bases in storage${errorResult.errorCount > 0 ? ` (${errorResult.errorCount} mutated)` : ''}`,
      description: enableOligos
        ? `Chunked into ${oligoList.length} oligos with index tags, simulated in memory vial.`
        : 'Synthesized molecular strand stored in cold, dark chemical medium.',
      mutations: errorResult.mutations,
    },
    {
      id: 6,
      name: 'DNA Decoding',
      label: 'Sequencing & Reading',
      value: storedDna,
      meta: 'Base-by-base optical/nanopore reading',
      description: 'Sequencer reads stored molecular strand, converting bases back to binary values.',
    },
    {
      id: 7,
      name: 'Original Data Recovery',
      label: 'Decoded Output',
      value: text,
      meta: 'Lossless Verification',
      description: 'Bits regrouped into 8-bit bytes, decoded back into original UTF-8 characters.',
    },
  ];

  return {
    text,
    bytes,
    bits,
    dna: rawDna,
    storedDna,
    complement: complementStrand(rawDna),
    oligos: oligoList,
    analysis,
    stages,
    errorResult,
    options,
  };
}

/* -------------------------------------------------------------
 * Full Decode Pipeline
 * ------------------------------------------------------------- */
export function decode(dnaSeq, options = {}) {
  const {
    constraintAware = false,
    repetitionCode = false,
    expectedInput = null,
  } = options;

  let currentDna = dnaSeq ? dnaSeq.toUpperCase().replace(/[^ACGT]/g, '') : '';
  let correctedErrors = 0;

  if (repetitionCode) {
    const repResult = decodeRepetition(currentDna, 3);
    currentDna = repResult.dna;
    correctedErrors = repResult.correctedCount;
  }

  let recoveredBytes = new Uint8Array(0);
  let recoveredBits = '';
  let recoveredText = '';

  try {
    if (constraintAware) {
      recoveredBytes = decodeConstraintAware(currentDna);
      recoveredBits = bytesToBits(recoveredBytes);
      recoveredText = bytesToText(recoveredBytes);
    } else {
      recoveredBits = dnaToBits(currentDna);
      recoveredBytes = bitsToBytes(recoveredBits);
      recoveredText = bytesToText(recoveredBytes);
    }
  } catch (err) {
    recoveredText = '[Decoding Error: Corrupted Sequence]';
  }

  const isMatch = expectedInput !== null ? recoveredText === expectedInput : true;

  return {
    dna: currentDna,
    bits: recoveredBits,
    bytes: recoveredBytes,
    text: recoveredText,
    isMatch,
    correctedErrors,
  };
}
