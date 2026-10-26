'use client';

import React, { useState } from 'react';
import { Grid, Copy, Check, Send } from 'lucide-react';
import { Base } from '@/types';
import { computeAllBases, playTactileClick } from '@/lib/conversion-engine';

interface MultiBaseMatrixProps {
  soundEnabled: boolean;
  onSendToConverter: (val: string, base: Base) => void;
}

export const MultiBaseMatrix: React.FC<MultiBaseMatrixProps> = ({ soundEnabled, onSendToConverter }) => {
  const [activeBase, setActiveBase] = useState<Base>(10);
  const [activeValue, setActiveValue] = useState<string>('42');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const data = computeAllBases(activeValue, activeBase);

  const handleCopy = (text: string, key: string) => {
    if (soundEnabled) playTactileClick(700);
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleSend = (val: string, base: Base) => {
    if (soundEnabled) playTactileClick(600);
    onSendToConverter(val, base);
    const el = document.getElementById('converter');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-20 relative" id="matrix">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-main)] font-mono text-xs font-semibold mb-3 shadow-sm">
            <Grid className="w-3.5 h-3.5 text-[#B39A84]" />
            <span>INSTANT MULTI-RADIX SYNCHRONIZATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
            Live 4-Way Number Matrix
          </h2>
          <p className="text-[var(--text-muted)] text-sm sm:text-base mt-2">
            Type into any field below. Watch all four number representations sync live in real-time with byte formatting and ASCII decoding.
          </p>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* BINARY CARD */}
          <div className="p-6 rounded-2xl theme-card border shadow-xl relative group hover:border-[#B39A84] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[var(--text-accent)] uppercase tracking-wider">
                BINARY (BASE 2)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(data.binary, 'bin')}
                className="p-1.5 rounded-lg border border-[var(--border-subtle)] theme-inner-box text-[var(--text-main)] hover:border-[#B39A84] transition-colors"
                title="Copy binary"
              >
                {copiedKey === 'bin' ? <Check className="w-3.5 h-3.5 text-[#B39A84]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={activeBase === 2 ? activeValue : data.binary}
                onChange={(e) => {
                  setActiveBase(2);
                  setActiveValue(e.target.value);
                }}
                className="w-full font-mono text-2xl font-bold theme-input border rounded-xl px-3.5 py-2.5 focus:outline-none"
                placeholder="0"
                spellCheck={false}
              />
            </div>

            <div className="text-xs font-mono text-[var(--text-muted)] space-y-1 pt-3 border-t border-[var(--border-subtle)]">
              <div className="flex justify-between">
                <span>Nibbles:</span>
                <span className="text-[var(--text-main)] font-semibold">{data.formattedBinary}</span>
              </div>
              <div className="flex justify-between">
                <span>Bits:</span>
                <span className="text-[var(--text-accent)] font-bold">{data.binary.length} bit(s)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSend(data.binary, 2)}
              className="mt-4 w-full py-2 rounded-xl text-xs font-mono font-semibold theme-inner-box border text-[var(--text-accent)] hover:text-[var(--text-main)] hover:border-[#B39A84] transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              <span>Step-by-step inspect</span>
            </button>
          </div>

          {/* OCTAL CARD */}
          <div className="p-6 rounded-2xl theme-card border shadow-xl relative group hover:border-[#B39A84] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[var(--text-accent)] uppercase tracking-wider">
                OCTAL (BASE 8)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(data.octal, 'oct')}
                className="p-1.5 rounded-lg border border-[var(--border-subtle)] theme-inner-box text-[var(--text-main)] hover:border-[#B39A84] transition-colors"
                title="Copy octal"
              >
                {copiedKey === 'oct' ? <Check className="w-3.5 h-3.5 text-[#B39A84]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={activeBase === 8 ? activeValue : data.octal}
                onChange={(e) => {
                  setActiveBase(8);
                  setActiveValue(e.target.value);
                }}
                className="w-full font-mono text-2xl font-bold theme-input border rounded-xl px-3.5 py-2.5 focus:outline-none"
                placeholder="0"
                spellCheck={false}
              />
            </div>

            <div className="text-xs font-mono text-[var(--text-muted)] space-y-1 pt-3 border-t border-[var(--border-subtle)]">
              <div className="flex justify-between">
                <span>Digits:</span>
                <span className="text-[var(--text-main)] font-semibold">{data.octal.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Radix:</span>
                <span className="text-[var(--text-accent)] font-bold">8 (0–7)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSend(data.octal, 8)}
              className="mt-4 w-full py-2 rounded-xl text-xs font-mono font-semibold theme-inner-box border text-[var(--text-accent)] hover:text-[var(--text-main)] hover:border-[#B39A84] transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              <span>Step-by-step inspect</span>
            </button>
          </div>

          {/* DECIMAL CARD */}
          <div className="p-6 rounded-2xl theme-card border shadow-xl relative group hover:border-[#B39A84] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[var(--text-accent)] uppercase tracking-wider">
                DECIMAL (BASE 10)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(String(data.decimal), 'dec')}
                className="p-1.5 rounded-lg border border-[var(--border-subtle)] theme-inner-box text-[var(--text-main)] hover:border-[#B39A84] transition-colors"
                title="Copy decimal"
              >
                {copiedKey === 'dec' ? <Check className="w-3.5 h-3.5 text-[#B39A84]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={activeBase === 10 ? activeValue : String(data.decimal)}
                onChange={(e) => {
                  setActiveBase(10);
                  setActiveValue(e.target.value);
                }}
                className="w-full font-mono text-2xl font-bold theme-input border rounded-xl px-3.5 py-2.5 focus:outline-none"
                placeholder="0"
                spellCheck={false}
              />
            </div>

            <div className="text-xs font-mono text-[var(--text-muted)] space-y-1 pt-3 border-t border-[var(--border-subtle)]">
              <div className="flex justify-between">
                <span>Parity:</span>
                <span className="text-[var(--text-main)] font-semibold">{data.decimal % 2 === 0 ? 'Even' : 'Odd'}</span>
              </div>
              <div className="flex justify-between">
                <span>ASCII:</span>
                <span className="text-[var(--text-accent)] font-bold">{data.asciiChar}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSend(String(data.decimal), 10)}
              className="mt-4 w-full py-2 rounded-xl text-xs font-mono font-semibold theme-inner-box border text-[var(--text-accent)] hover:text-[var(--text-main)] hover:border-[#B39A84] transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              <span>Step-by-step inspect</span>
            </button>
          </div>

          {/* HEXADECIMAL CARD */}
          <div className="p-6 rounded-2xl theme-card border shadow-xl relative group hover:border-[#B39A84] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[var(--text-accent)] uppercase tracking-wider">
                HEXADECIMAL (BASE 16)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(data.hexadecimal, 'hex')}
                className="p-1.5 rounded-lg border border-[var(--border-subtle)] theme-inner-box text-[var(--text-main)] hover:border-[#B39A84] transition-colors"
                title="Copy hexadecimal"
              >
                {copiedKey === 'hex' ? <Check className="w-3.5 h-3.5 text-[#B39A84]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={activeBase === 16 ? activeValue : data.hexadecimal}
                onChange={(e) => {
                  setActiveBase(16);
                  setActiveValue(e.target.value);
                }}
                className="w-full font-mono text-2xl font-bold theme-input border rounded-xl px-3.5 py-2.5 focus:outline-none"
                placeholder="0"
                spellCheck={false}
              />
            </div>

            <div className="text-xs font-mono text-[var(--text-muted)] space-y-1 pt-3 border-t border-[var(--border-subtle)]">
              <div className="flex justify-between">
                <span>Prefix:</span>
                <span className="text-[var(--text-main)] font-semibold">0x{data.hexadecimal}</span>
              </div>
              <div className="flex justify-between">
                <span>Bytes:</span>
                <span className="text-[var(--text-accent)] font-bold">{Math.ceil(data.hexadecimal.length / 2)} Byte(s)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSend(data.hexadecimal, 16)}
              className="mt-4 w-full py-2 rounded-xl text-xs font-mono font-semibold theme-inner-box border text-[var(--text-accent)] hover:text-[var(--text-main)] hover:border-[#B39A84] transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              <span>Step-by-step inspect</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
