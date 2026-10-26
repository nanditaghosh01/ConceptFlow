'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Cpu, CheckCircle2, ChevronRight } from 'lucide-react';
import { playTactileClick } from '@/lib/conversion-engine';

interface HeroProps {
  soundEnabled: boolean;
}

export const Hero: React.FC<HeroProps> = ({ soundEnabled }) => {
  // Demo states for 1011 (binary) -> 11 (decimal)
  const bits = ['1', '0', '1', '1'];
  const powers = [3, 2, 1, 0];
  const weights = [8, 4, 2, 1];
  const contributions = [8, 0, 2, 1];
  
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6);
    }, 1300);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden" id="top">
      {/* Background ambient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[360px] bg-gradient-to-tr from-[#0A1E54]/20 via-[#B39A84]/15 to-[#CFC7C8]/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-main)] text-xs font-mono font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#B39A84] animate-ping" />
              <span>INTERACTIVE NUMBER SYSTEMS ENGINE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-main)] leading-[1.1] mb-6">
              Understand how <br className="hidden sm:inline" />
              <span className="hero-gradient-text">
                conversions actually work.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl mb-8 leading-relaxed">
              CONCEPTFLOW transforms abstract number-system mathematics into an intuitive, tactile playground.
              Watch digits multiply into positional powers, follow remainder ladders in reverse, and flip individual physical bits in real time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <a
                href="#converter"
                onClick={() => soundEnabled && playTactileClick(600)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-md hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
              >
                <span>Launch Converter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#bitboard"
                onClick={() => soundEnabled && playTactileClick(500)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border border-[var(--border-subtle)] bg-[var(--btn-secondary-bg)] text-[var(--text-main)] hover:border-[#B39A84] transition-all duration-200"
              >
                <Cpu className="w-4 h-4 text-[#B39A84]" />
                <span>Tactile Bit Board</span>
              </a>
            </div>

            {/* Highlights row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6 border-t border-[var(--border-subtle)]">
              <div>
                <div className="text-xs font-mono text-[var(--text-accent)] font-semibold mb-0.5">BASE 2</div>
                <div className="text-sm font-semibold text-[var(--text-main)]">Binary Bits</div>
              </div>
              <div>
                <div className="text-xs font-mono text-[var(--text-accent)] font-semibold mb-0.5">BASE 8</div>
                <div className="text-sm font-semibold text-[var(--text-main)]">Octal Radix</div>
              </div>
              <div>
                <div className="text-xs font-mono text-[var(--text-accent)] font-semibold mb-0.5">BASE 10</div>
                <div className="text-sm font-semibold text-[var(--text-main)]">Decimal Core</div>
              </div>
              <div>
                <div className="text-xs font-mono text-[var(--text-accent)] font-semibold mb-0.5">BASE 16</div>
                <div className="text-sm font-semibold text-[var(--text-main)]">Hexadecimal</div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Demo Box */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl p-6 theme-card border shadow-xl">
              
              {/* Demo Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#B39A84] shadow-sm" />
                  <span className="text-xs font-mono font-semibold tracking-wider uppercase text-[var(--text-main)]">
                    Live Simulation: Binary to Decimal
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded theme-inner-box border text-[var(--text-main)]">
                  Auto-playing
                </span>
              </div>

              {/* Live Bit Cells */}
              <div className="mb-6">
                <div className="text-xs font-mono text-[var(--text-muted)] mb-2">Input Binary Digits:</div>
                <div className="grid grid-cols-4 gap-2.5">
                  {bits.map((bit, idx) => {
                    const isHighlighted = activeStep === idx;
                    const isPassed = activeStep > idx;
                    return (
                      <div
                        key={idx}
                        className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
                          isHighlighted
                            ? 'bg-[#B39A84]/25 border-[#B39A84] shadow-md scale-105 text-[var(--text-main)]'
                            : isPassed
                            ? 'theme-inner-box border-[var(--border-strong)] text-[var(--text-main)]'
                            : 'theme-inner-box border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60'
                        }`}
                      >
                        <span className="text-2xl font-mono font-bold">
                          {bit}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--text-muted)] mt-1">
                          2<sup>{powers[idx]}</sup> ({weights[idx]})
                        </span>
                        {isHighlighted && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B39A84] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#B39A84]"></span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step Formula / Live Math Output */}
              <div className="p-4 rounded-xl theme-inner-box border font-mono text-xs mb-6 min-h-[72px] flex flex-col justify-center">
                <div className="text-[var(--text-muted)] text-[11px] uppercase tracking-wider mb-1">
                  {activeStep < 4 ? `Step ${activeStep + 1}: Calculating Digit ${bits[activeStep]}` : activeStep === 4 ? "Step 5: Summing Contributions" : "Final Answer Ready"}
                </div>
                <div className="text-[var(--text-main)] font-semibold text-sm">
                  {activeStep < 4 ? (
                    <span>{bits[activeStep]} × 2<sup>{powers[activeStep]}</sup> = {bits[activeStep]} × {weights[activeStep]} = <span className="text-[var(--text-accent)] font-bold">{contributions[activeStep]}</span></span>
                  ) : activeStep === 4 ? (
                    <span>8 + 0 + 2 + 1 = <span className="text-[var(--text-accent)] font-bold">11</span></span>
                  ) : (
                    <span className="text-[var(--text-accent)] flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> (1011)₂ = (11)₁₀
                    </span>
                  )}
                </div>
              </div>

              {/* Result Readout */}
              <div className="flex items-center justify-between p-3.5 rounded-xl theme-inner-box border">
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Decimal Result</span>
                  <span className="text-2xl font-mono font-extrabold text-[var(--text-main)]">
                    {activeStep >= 4 ? "11" : "..."}
                  </span>
                </div>

                <a
                  href="#converter"
                  onClick={() => soundEnabled && playTactileClick(500)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-accent)] hover:underline transition-colors"
                >
                  <span>Test any number</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
