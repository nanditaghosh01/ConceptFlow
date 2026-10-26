'use client';

import React, { useState } from 'react';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { Base } from '@/types';
import { CONCEPT_PAIRS, playTactileClick } from '@/lib/conversion-engine';

interface ConceptLibraryProps {
  soundEnabled: boolean;
  onSelectPair: (from: Base, to: Base, sample: string) => void;
}

export const ConceptLibrary: React.FC<ConceptLibraryProps> = ({ soundEnabled, onSelectPair }) => {
  const [filter, setFilter] = useState<'all' | 'direct' | 'shortcut' | 'decimal-bridge'>('all');

  const filteredPairs = CONCEPT_PAIRS.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  const handleSelect = (from: Base, to: Base, sample: string) => {
    if (soundEnabled) playTactileClick(600);
    onSelectPair(from, to, sample);
    const el = document.getElementById('converter');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-20 relative" id="library">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-accent)] font-mono text-xs font-semibold mb-3 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-[#B39A84]" />
              <span>RADIX CONVERSION CATALOG</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
              Concept Library
            </h2>
            <p className="text-[var(--text-muted)] text-sm sm:text-base mt-2 max-w-xl">
              Select any number system pair to load an instant walkthrough with full positional breakdown and animation.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 theme-inner-box p-1.5 rounded-xl border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                filter === 'all' ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-bold shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              All Pairs
            </button>

            <button
              type="button"
              onClick={() => setFilter('direct')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                filter === 'direct' ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-bold shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Direct
            </button>

            <button
              type="button"
              onClick={() => setFilter('shortcut')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                filter === 'shortcut' ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-bold shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Shortcuts (2ⁿ)
            </button>

            <button
              type="button"
              onClick={() => setFilter('decimal-bridge')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                filter === 'decimal-bridge' ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-bold shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Bridge
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredPairs.map((pair, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(pair.from, pair.to, pair.sample)}
              className="p-5 rounded-2xl theme-card border border-[var(--border-subtle)] hover:border-[#B39A84] transition-all text-left flex flex-col justify-between group shadow-md hover:scale-[1.02] focus:outline-none"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#B39A84]/20 border border-[var(--border-strong)] text-[var(--text-main)]">
                    BASE {pair.from} → {pair.to}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-main)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="font-mono font-bold text-base text-[var(--text-main)] group-hover:text-[var(--text-accent)] transition-colors mb-1.5">
                  {pair.label}
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                  {pair.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[var(--text-muted)]">Sample:</span>
                <span className="text-[var(--text-accent)] font-semibold">{pair.sample}</span>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
