import { describe, it, expect } from 'vitest';
import {
  textToBytes,
  bytesToText,
  bytesToBits,
  bitsToBytes,
  bitsToDNA,
  dnaToBits,
  complementStrand,
  analyzeSequence,
  encode,
  decode,
  encodeConstraintAware,
  decodeConstraintAware,
  encodeRepetition,
  decodeRepetition,
  packageOligos,
  assembleOligos,
  injectErrors,
} from './dnaCodec';

describe('DNA Codec Core Functions', () => {
  it('encodes the canonical proposal example "Hi" -> "CAGACGGC"', () => {
    // 'H' (72) = 01001000 -> 01 00 10 00 -> C A G A
    // 'i' (105) = 01101001 -> 01 10 10 01 -> C G G C
    // Total = CAGACGGC
    const encoded = encode('Hi');
    expect(encoded.dna).toBe('CAGACGGC');

    const decoded = decode(encoded.dna);
    expect(decoded.text).toBe('Hi');
    expect(decoded.isMatch).toBe(true);
  });

  it('performs lossless round-trip for empty string', () => {
    const encoded = encode('');
    expect(encoded.dna).toBe('');
    const decoded = decode(encoded.dna);
    expect(decoded.text).toBe('');
  });

  it('performs lossless round-trip for standard ASCII "Hello, World!"', () => {
    const text = 'Hello, World!';
    const encoded = encode(text);
    const decoded = decode(encoded.dna, { expectedInput: text });
    expect(decoded.text).toBe(text);
    expect(decoded.isMatch).toBe(true);
  });

  it('handles multi-byte UTF-8 emojis losslessly', () => {
    const text = 'DNA 🧬 Storage 💻!';
    const encoded = encode(text);
    const decoded = decode(encoded.dna, { expectedInput: text });
    expect(decoded.text).toBe(text);
    expect(decoded.isMatch).toBe(true);
  });

  it('handles multiline text with newlines and tabs', () => {
    const text = "Line 1: Engineering Biology\nLine 2:\tDNA Computing\nLine 3: Group 1";
    const encoded = encode(text);
    const decoded = decode(encoded.dna, { expectedInput: text });
    expect(decoded.text).toBe(text);
    expect(decoded.isMatch).toBe(true);
  });

  it('computes correct DNA complementary strand (A<->T, C<->G)', () => {
    expect(complementStrand('CAGACGGC')).toBe('GTCTGCCG');
    expect(complementStrand('AAAA')).toBe('TTTT');
    expect(complementStrand('ATGC')).toBe('TACG');
  });

  it('analyzes sequence composition, GC content, and longest homopolymer run', () => {
    // Sequence: AAAA CC GG TT -> 4 A, 2 C, 2 G, 2 T = 10 total
    // GC = 4 / 10 = 40%
    const analysis = analyzeSequence('AAAACCGGTT');
    expect(analysis.length).toBe(10);
    expect(analysis.composition.A).toBe(4);
    expect(analysis.composition.C).toBe(2);
    expect(analysis.composition.G).toBe(2);
    expect(analysis.composition.T).toBe(2);
    expect(analysis.gcContent).toBe(40.0);
    expect(analysis.longestRun).toBe(4);
    expect(analysis.longestRunBase).toBe('A');
    expect(analysis.runsOfFourOrMore).toBe(1);
  });
});

describe('Constraint-Aware Mode (Goldman-style Homopolymer Avoidance)', () => {
  it('encodes and decodes losslessly with no consecutive identical bases', () => {
    const text = 'Cybersecurity Group 1';
    const bytes = textToBytes(text);
    const dna = encodeConstraintAware(bytes);

    // Verify homopolymer property: no adjacent bases should be identical
    for (let i = 1; i < dna.length; i++) {
      expect(dna[i]).not.toBe(dna[i - 1]);
    }

    // Verify lossless decoding
    const decodedBytes = decodeConstraintAware(dna);
    const decodedText = bytesToText(decodedBytes);
    expect(decodedText).toBe(text);
  });

  it('works via the unified encode/decode pipeline with constraintAware flag', () => {
    const text = 'Engineering Biology 2024';
    const encoded = encode(text, { constraintAware: true });
    const analysis = analyzeSequence(encoded.dna);
    expect(analysis.longestRun).toBeLessThanOrEqual(1);

    const decoded = decode(encoded.dna, { constraintAware: true, expectedInput: text });
    expect(decoded.text).toBe(text);
    expect(decoded.isMatch).toBe(true);
  });
});

describe('Oligo Packaging & Reassembly', () => {
  it('packages long DNA into indexed oligos and reassembles correctly', () => {
    const text = 'Testing oligo synthesis chunking for high density long term storage.';
    const encoded = encode(text);
    const oligos = packageOligos(encoded.dna, 24);

    expect(oligos.length).toBeGreaterThan(1);
    expect(oligos[0].payload.length).toBeLessThanOrEqual(24);
    expect(oligos[0].primerFwd).toBe('ACGT');

    const reassembled = assembleOligos(oligos);
    expect(reassembled).toBe(encoded.dna);
    const decoded = decode(reassembled);
    expect(decoded.text).toBe(text);
  });
});

describe('Error Simulation and Repetition Code Recovery', () => {
  it('injects errors when errorRate > 0', () => {
    const text = 'Super Long Stable String For Testing Mutation Rate In Storage Simulation';
    const encoded = encode(text, { errorRate: 0.15 });
    expect(encoded.errorResult.errorCount).toBeGreaterThan(0);
    expect(encoded.storedDna).not.toBe(encoded.dna);
  });

  it('corrects errors using 3x repetition code with majority voting', () => {
    const rawDna = 'ACGT';
    const repeated = encodeRepetition(rawDna, 3); // 'AAACCCGGGTTT'
    expect(repeated).toBe('AAACCCGGGTTT');

    // Mutate 1 base in each triplet: 'AAT' -> 'A', 'GCC' -> 'C', etc.
    const corrupted = 'AAT' + 'GCC' + 'GAG' + 'ATT';
    const recovered = decodeRepetition(corrupted, 3);
    expect(recovered.dna).toBe('ACGT');
    expect(recovered.correctedCount).toBe(4);
  });
});
