'use client';

import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Plus, 
  Minus, 
  Shuffle, 
  Send,
  Zap
} from 'lucide-react';
import { playTactileClick } from '@/lib/conversion-engine';

interface BitBoardProps {
  soundEnabled: boolean;
  onSendToConverter: (valueStr: string, fromBase: 2 | 8 | 10 | 16) => void;
}

export const InteractiveBitBoard: React.FC<BitBoardProps> = ({ soundEnabled, onSendToConverter }) => {
  // 8 bits: index 0 is MSB (bit 7, value 128), index 7 is LSB (bit 0, value 1)
  const [bits, setBits] = useState<number[]>([0, 1, 0, 0, 1, 0, 1, 1]); // default: 75 (01001011)

  const weights = [128, 64, 32, 16, 8, 4, 2, 1];
  const powers = [7, 6, 5, 4, 3, 2, 1, 0];

  // Calculate current decimal value
  const decimalValue = bits.reduce((acc, bit, idx) => acc + bit * weights[idx], 0);
  const hexValue = decimalValue.toString(16).toUpperCase().padStart(2, '0');
  const octalValue = decimalValue.toString(8).padStart(3, '0');
  const formattedBinary = `${bits.slice(0, 4).join('')} ${bits.slice(4, 8).join('')}`;

  // ASCII character if printable
  let asciiChar = '—';
  if (decimalValue >= 32 && decimalValue <= 126) {
    asciiChar = `'${String.fromCharCode(decimalValue)}'`;
  } else if (decimalValue === 0) {
    asciiChar = 'NUL';
  } else if (decimalValue === 10) {
    asciiChar = 'LF (\\n)';
  } else if (decimalValue === 32) {
    asciiChar = 'Space';
  }

  // Toggle a single bit
  const toggleBit = (idx: number) => {
    if (soundEnabled) {
      playTactileClick(400 + (7 - idx) * 80);
    }
    setBits((prev) => {
      const next = [...prev];
      next[idx] = next[idx] === 1 ? 0 : 1;
      return next;
    });
  };

  const invertAll = () => {
    if (soundEnabled) playTactileClick(700);
    setBits((prev) => prev.map((b) => (b === 1 ? 0 : 1)));
  };

  const shiftLeft = () => {
    if (soundEnabled) playTactileClick(850);
    setBits((prev) => [...prev.slice(1), 0]);
  };

  const shiftRight = () => {
    if (soundEnabled) playTactileClick(550);
    setBits((prev) => [0, ...prev.slice(0, 7)]);
  };

  const clearAll = () => {
    if (soundEnabled) playTactileClick(350);
    setBits([0, 0, 0, 0, 0, 0, 0, 0]);
  };

  const setAll = () => {
    if (soundEnabled) playTactileClick(950);
    setBits([1, 1, 1, 1, 1, 1, 1, 1]);
  };

  const randomize = () => {
    if (soundEnabled) playTactileClick(650);
    setBits(Array.from({ length: 8 }, () => (Math.random() > 0.5 ? 1 : 0)));
  };

  const increment = () => {
    if (soundEnabled) playTactileClick(600);
    const nextVal = (decimalValue + 1) % 256;
    const nextBin = nextVal.toString(2).padStart(8, '0').split('').map(Number);
    setBits(nextBin);
  };

  const decrement = () => {
    if (soundEnabled) playTactileClick(500);
    const nextVal = (decimalValue - 1 + 256) % 256;
    const nextBin = nextVal.toString(2).padStart(8, '0').split('').map(Number);
    setBits(nextBin);
  };

  const handleSend = () => {
    if (soundEnabled) playTactileClick(800);
    onSendToConverter(decimalValue.toString(), 10);
    const el = document.getElementById('converter');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-20 relative" id="bitboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-main)] font-mono text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5 text-[#B39A84]" />
              <span>TACTILE 8-BIT SWITCHBOARD</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
              Interactive Bit Playground
            </h2>
            <p className="text-[var(--text-muted)] text-sm sm:text-base mt-2 max-w-xl">
              Click individual switches to flip bits 0 and 1. Watch how powers of two combine to instantly create Decimal, Hexadecimal, Octal, and ASCII characters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSend}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-md hover:opacity-90 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Load in Converter</span>
            </button>
          </div>
        </div>

        {/* Main Bitboard Shell */}
        <div className="rounded-2xl p-6 sm:p-8 theme-card border shadow-xl relative overflow-hidden">
          
          {/* Top Status Bar: Live Values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-8 mb-8 border-b border-[var(--border-subtle)]">
            
            {/* Decimal Box */}
            <div className="p-4 rounded-xl theme-inner-box border flex flex-col">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-accent)] font-semibold mb-1">
                <span>DECIMAL (BASE 10)</span>
                <span className="text-[10px] text-[var(--text-muted)]">0–255</span>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-[var(--text-main)] tracking-tight">
                {decimalValue}
              </div>
            </div>

            {/* Hex Box */}
            <div className="p-4 rounded-xl theme-inner-box border flex flex-col">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-accent)] font-semibold mb-1">
                <span>HEXADECIMAL (BASE 16)</span>
                <span className="text-[10px] text-[var(--text-muted)]">0x00–0xFF</span>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-[var(--text-main)] tracking-tight flex items-baseline gap-1">
                <span className="text-[var(--text-muted)] text-lg">0x</span>
                {hexValue}
              </div>
            </div>

            {/* Octal Box */}
            <div className="p-4 rounded-xl theme-inner-box border flex flex-col">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-accent)] font-semibold mb-1">
                <span>OCTAL (BASE 8)</span>
                <span className="text-[10px] text-[var(--text-muted)]">000–377</span>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-[var(--text-main)] tracking-tight">
                {octalValue}
              </div>
            </div>

            {/* ASCII & Character Preview */}
            <div className="p-4 rounded-xl theme-inner-box border flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-accent)] font-semibold mb-1">
                <span>ASCII GLYPH</span>
                <div 
                  className="w-4 h-4 rounded-full border border-[var(--border-strong)] shadow-sm"
                  style={{ backgroundColor: `rgb(${Math.min(220, 10 + decimalValue)}, ${Math.min(220, 30 + decimalValue / 2)}, ${Math.min(220, 84 + (decimalValue % 100))})` }}
                  title="Color preview from byte value"
                />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-[var(--text-main)]">
                {asciiChar}
              </div>
            </div>

          </div>

          {/* Interactive 8-Bit Cards Grid */}
          <div className="mb-8">
            <div className="text-xs font-mono text-[var(--text-muted)] mb-3 flex items-center justify-between">
              <span>8-BIT POSITIONAL ARCHITECTURE (MSB → LSB):</span>
              <span className="text-[var(--text-accent)] font-semibold">Click any card to flip its bit</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3">
              {bits.map((bit, idx) => {
                const isActive = bit === 1;
                const weight = weights[idx];
                const power = powers[idx];

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleBit(idx)}
                    className={`relative group flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-xl border text-center transition-all duration-200 focus:outline-none ${
                      isActive
                        ? 'bg-[#B39A84]/25 border-[#B39A84] text-[var(--text-main)] shadow-md scale-[1.02]'
                        : 'theme-inner-box border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[#B39A84]/50'
                    }`}
                  >
                    {/* Bit position tag */}
                    <div className="text-[10px] font-mono font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">
                      b{power}
                    </div>

                    {/* Big Bit State */}
                    <div className={`my-2 font-mono text-3xl sm:text-4xl font-extrabold transition-all duration-150 ${
                      isActive ? 'text-[var(--text-main)] drop-shadow-sm' : 'text-[var(--text-muted)] opacity-50'
                    }`}>
                      {bit}
                    </div>

                    {/* Weight and Power */}
                    <div className="flex flex-col items-center gap-0.5">
                      <span className={`text-xs font-mono font-bold ${isActive ? 'text-[var(--text-accent)]' : 'text-[var(--text-muted)]'}`}>
                        +{isActive ? weight : 0}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        2<sup>{power}</sup> ({weight})
                      </span>
                    </div>

                    {/* Active Led Dot */}
                    <div className={`w-1.5 h-1.5 rounded-full mt-2 transition-all ${
                      isActive ? 'bg-[#B39A84] shadow-sm' : 'bg-[var(--border-subtle)]'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mathematical Formula Accumulator */}
          <div className="p-4 rounded-xl theme-inner-box border font-mono text-xs sm:text-sm text-[var(--text-main)] mb-8 overflow-x-auto">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-[var(--text-muted)] uppercase text-xs">Accumulated Sum:</span>
              <span className="text-[var(--text-accent)] font-bold">
                {weights
                  .map((w, idx) => (bits[idx] ? `${w}` : null))
                  .filter(Boolean)
                  .join(' + ') || '0'}
              </span>
              <span className="text-[var(--text-muted)]">=</span>
              <span className="text-[var(--text-main)] font-bold text-base">{decimalValue}</span>
              <span className="text-[var(--border-subtle)] ml-2">|</span>
              <span className="text-[var(--text-muted)] text-xs ml-2">
                Nibbles: <span className="text-[var(--text-main)] font-mono font-bold">{formattedBinary}</span>
              </span>
            </div>
          </div>

          {/* Switchboard Quick Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={invertAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] theme-inner-box text-xs font-mono text-[var(--text-main)] hover:border-[#B39A84] transition-colors"
                title="Bitwise NOT (flip 0s and 1s)"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#B39A84]" />
                <span>NOT (Invert)</span>
              </button>

              <button
                type="button"
                onClick={shiftLeft}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] theme-inner-box text-xs font-mono text-[var(--text-main)] hover:border-[#B39A84] transition-colors"
                title="Shift bits left (Multiply by 2)"
              >
                <span>&lt;&lt; Left</span>
              </button>

              <button
                type="button"
                onClick={shiftRight}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] theme-inner-box text-xs font-mono text-[var(--text-main)] hover:border-[#B39A84] transition-colors"
                title="Shift bits right (Divide by 2)"
              >
                <span>Right &gt;&gt;</span>
              </button>

              <button
                type="button"
                onClick={randomize}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] theme-inner-box text-xs font-mono text-[var(--text-main)] hover:border-[#B39A84] transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5 text-[#B39A84]" />
                <span>Random</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={decrement}
                className="p-2 rounded-lg border border-[var(--border-subtle)] theme-inner-box text-[var(--text-main)] hover:border-[#B39A84] transition-colors"
                title="Decrement (-1)"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={increment}
                className="p-2 rounded-lg border border-[var(--border-subtle)] theme-inner-box text-[var(--text-main)] hover:border-[#B39A84] transition-colors"
                title="Increment (+1)"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] theme-inner-box text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              >
                Clear (0)
              </button>

              <button
                type="button"
                onClick={setAll}
                className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] theme-inner-box text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              >
                Max (255)
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
