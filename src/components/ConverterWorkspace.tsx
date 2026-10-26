'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeftRight, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Lightbulb, 
  Bot,
  AlertCircle
} from 'lucide-react';
import { Base, Difficulty, ConversionResult } from '@/types';
import { 
  convert, 
  BASE_NAMES, 
  getSimplifiedExplanation, 
  getAnalogy, 
  getBaseShortcutTip,
  playTactileClick 
} from '@/lib/conversion-engine';

interface ConverterWorkspaceProps {
  soundEnabled: boolean;
  externalValue?: string;
  externalFromBase?: Base;
}

export const ConverterWorkspace: React.FC<ConverterWorkspaceProps> = ({ 
  soundEnabled, 
  externalValue, 
  externalFromBase 
}) => {
  const [fromBase, setFromBase] = useState<Base>(externalFromBase || 10);
  const [toBase, setToBase] = useState<Base>(2);
  const [inputValue, setInputValue] = useState<string>(externalValue || '13');
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [preferDirectGrouping, setPreferDirectGrouping] = useState<boolean>(true);
  
  // Animation / Stepper state
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [novaMode, setNovaMode] = useState<'standard' | 'simple' | 'analogy' | 'technical'>('standard');
  const [showNovaGuide, setShowNovaGuide] = useState<boolean>(true);

  // Sync external value when passed from BitBoard or Library
  useEffect(() => {
    if (externalValue !== undefined) {
      setInputValue(externalValue);
    }
    if (externalFromBase !== undefined) {
      setFromBase(externalFromBase);
    }
  }, [externalValue, externalFromBase]);

  // Compute conversion
  const conversionResult: ConversionResult = useMemo(() => {
    return convert(inputValue, fromBase, toBase, preferDirectGrouping);
  }, [inputValue, fromBase, toBase, preferDirectGrouping]);

  const totalSteps = conversionResult.steps.length;

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [inputValue, fromBase, toBase, preferDirectGrouping]);

  // Playback timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && totalSteps > 0) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          if (soundEnabled) playTactileClick(500 + prev * 40);
          return prev + 1;
        });
      }, 1400 / playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, totalSteps, playbackSpeed, soundEnabled]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepForward();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepBackward();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        restart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSteps, isPlaying]);

  const togglePlay = () => {
    if (soundEnabled) playTactileClick(650);
    if (totalSteps <= 0) return;
    if (stepIndex >= totalSteps - 1) {
      setStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const stepForward = () => {
    setIsPlaying(false);
    if (stepIndex < totalSteps - 1) {
      if (soundEnabled) playTactileClick(600);
      setStepIndex(stepIndex + 1);
    }
  };

  const stepBackward = () => {
    setIsPlaying(false);
    if (stepIndex > 0) {
      if (soundEnabled) playTactileClick(500);
      setStepIndex(stepIndex - 1);
    }
  };

  const restart = () => {
    setIsPlaying(false);
    if (soundEnabled) playTactileClick(400);
    setStepIndex(0);
  };

  const handleSwap = () => {
    if (soundEnabled) playTactileClick(700);
    const oldFrom = fromBase;
    const oldTo = toBase;
    setFromBase(oldTo);
    setToBase(oldFrom);
    if (conversionResult.result && !conversionResult.error) {
      setInputValue(conversionResult.result);
    }
  };

  const currentStep = conversionResult.steps[stepIndex] || null;
  const progressPercent = totalSteps <= 1 ? 100 : Math.round((stepIndex / (totalSteps - 1)) * 100);
  const canDirectGroup = (fromBase === 2 && (toBase === 16 || toBase === 8));

  const getNovaExplanation = () => {
    if (!currentStep) return "Enter a valid number to begin visual breakdown.";
    if (novaMode === 'simple') {
      return getSimplifiedExplanation(currentStep);
    }
    if (novaMode === 'analogy') {
      return getAnalogy(fromBase, toBase);
    }
    if (novaMode === 'technical') {
      return `Radix ${fromBase} to ${toBase}. Positional base polynomials evaluate each glyph $x_i \\in [0, b-1]$ weighted by radix powers $b^i$. Current state phase: "${currentStep.phase}".`;
    }
    return currentStep.detail;
  };

  return (
    <section className="py-16 sm:py-20 relative" id="converter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-main)] font-mono text-xs font-semibold mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B39A84]" />
            <span>INTERACTIVE STEP-BY-STEP WORKSPACE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] tracking-tight">
            Watch Every Digit Do Its Work
          </h2>
          <p className="text-[var(--text-muted)] text-sm sm:text-base mt-3">
            Choose your starting base and target radix. Step through each mathematical operation at your own pace or hit play for automated animated walkthroughs.
          </p>
        </div>

        {/* Workspace Shell */}
        <div className="rounded-2xl theme-card border shadow-xl overflow-hidden">
          
          {/* Workspace Top Status Header */}
          <div className="px-6 py-4 theme-inner-box border-b flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-base text-[var(--text-main)] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B39A84] animate-pulse" />
                {BASE_NAMES[fromBase]} → {BASE_NAMES[toBase]}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full theme-card border text-[var(--text-main)] font-semibold">
                {difficulty} Mode
              </span>
            </div>

            {/* Stepper Progress Indicator */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-[var(--text-muted)]">
                Step <span className="text-[var(--text-main)] font-bold">{totalSteps > 0 ? stepIndex + 1 : 0}</span> of {totalSteps}
              </span>
              <div className="w-28 sm:w-40 h-2 theme-card rounded-full overflow-hidden border border-[var(--border-subtle)]">
                <div 
                  className="h-full bg-[var(--btn-primary-bg)] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Three-Column Workspace Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle)]">
            
            {/* COLUMN 1: Inputs & Controls (Col span 3) */}
            <div className="lg:col-span-3 p-6 flex flex-col gap-5 theme-card">
              
              {/* From / To Base Selectors */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                    From Radix
                  </label>
                  <select
                    value={fromBase}
                    onChange={(e) => {
                      if (soundEnabled) playTactileClick(500);
                      setFromBase(Number(e.target.value) as Base);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl theme-input border font-mono text-sm focus:outline-none transition-colors"
                  >
                    <option value={2}>Base 2 — Binary</option>
                    <option value={8}>Base 8 — Octal</option>
                    <option value={10}>Base 10 — Decimal</option>
                    <option value={16}>Base 16 — Hexadecimal</option>
                  </select>
                </div>

                {/* Swap Bases Button */}
                <div className="flex justify-center -my-1">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="p-2 rounded-lg border border-[var(--border-subtle)] theme-inner-box text-[#B39A84] hover:text-[var(--text-main)] hover:rotate-180 transition-all duration-300 focus:outline-none shadow-sm"
                    title="Swap From and To Bases"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                    To Radix
                  </label>
                  <select
                    value={toBase}
                    onChange={(e) => {
                      if (soundEnabled) playTactileClick(500);
                      setToBase(Number(e.target.value) as Base);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl theme-input border font-mono text-sm focus:outline-none transition-colors"
                  >
                    <option value={2}>Base 2 — Binary</option>
                    <option value={8}>Base 8 — Octal</option>
                    <option value={10}>Base 10 — Decimal</option>
                    <option value={16}>Base 16 — Hexadecimal</option>
                  </select>
                </div>
              </div>

              {/* Value Input */}
              <div>
                <label className="block text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Value to Convert
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g. 13 or 1011"
                    spellCheck={false}
                    className={`w-full px-3.5 py-2.5 rounded-xl font-mono text-base font-bold theme-input border transition-colors focus:outline-none ${
                      conversionResult.error 
                        ? 'border-rose-400 text-rose-500 focus:border-rose-400' 
                        : ''
                    }`}
                  />
                </div>
                {conversionResult.error && (
                  <div className="mt-2 text-xs font-mono text-rose-500 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{conversionResult.error}</span>
                  </div>
                )}
              </div>

              {/* Direct Grouping Toggle */}
              {canDirectGroup && (
                <div className="p-3 rounded-xl theme-inner-box border flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-semibold text-[var(--text-main)]">
                      Direct Bit Grouping
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {toBase === 16 ? '4 bits per hex character' : '3 bits per octal digit'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferDirectGrouping}
                    onChange={(e) => setPreferDirectGrouping(e.target.checked)}
                    className="w-4 h-4 accent-[#B39A84] rounded cursor-pointer"
                  />
                </div>
              )}

              {/* Difficulty selector */}
              <div>
                <label className="block text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Explanation Depth
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full px-3 py-2 rounded-xl theme-input border font-mono text-xs focus:outline-none"
                >
                  <option value="Beginner">Beginner (Intuitive & friendly)</option>
                  <option value="Intermediate">Intermediate (Formulas & steps)</option>
                  <option value="Advanced">Advanced (Mathematical rigour)</option>
                </select>
              </div>

              {/* Nova Guide Toggle */}
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--text-main)] flex items-center gap-1.5 font-semibold">
                  <Bot className="w-3.5 h-3.5 text-[#B39A84]" />
                  Nova Companion
                </span>
                <input
                  type="checkbox"
                  checked={showNovaGuide}
                  onChange={(e) => setShowNovaGuide(e.target.checked)}
                  className="w-4 h-4 accent-[#B39A84] rounded cursor-pointer"
                />
              </div>

            </div>

            {/* COLUMN 2: Visual Simulation Stage (Col span 6) */}
            <div className="lg:col-span-6 p-6 flex flex-col justify-between min-h-[380px] theme-inner-box">
              
              {/* Dynamic Visual Stage Area */}
              <div className="w-full flex-1 flex flex-col justify-center items-center py-4">
                
                {conversionResult.error ? (
                  <div className="text-center p-6 text-[var(--text-muted)] font-mono text-xs">
                    Please correct the input value to activate visual simulation.
                  </div>
                ) : conversionResult.steps[0]?.type === 'trivial' ? (
                  <div className="text-center p-8 theme-card rounded-2xl border shadow-sm">
                    <div className="text-3xl font-mono font-bold text-[var(--text-main)] mb-2">{conversionResult.result}</div>
                    <div className="text-xs font-mono text-[var(--text-accent)]">Values with identical bases require no transformation.</div>
                  </div>
                ) : conversionResult.groupingData ? (
                  
                  /* SCENE: DIRECT BIT GROUPING */
                  <div className="w-full flex flex-col items-center">
                    <div className="text-xs font-mono text-[var(--text-muted)] mb-4">
                      Direct {conversionResult.groupingData.groupSize}-Bit Grouping:
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                      {conversionResult.groupingData.groups.map((grp, gIdx) => {
                        const isRevealed = stepIndex >= gIdx + 1;
                        return (
                          <div 
                            key={gIdx}
                            className={`flex flex-col items-center p-4 rounded-xl border transition-all duration-300 ${
                              isRevealed 
                                ? 'bg-[#B39A84]/40 border-[#B39A84] shadow-md scale-105 text-[var(--text-main)]' 
                                : 'theme-card border-[var(--border-subtle)] opacity-40 text-[var(--text-muted)]'
                            }`}
                          >
                            <span className="text-xs font-mono text-[var(--text-muted)] mb-1">
                              {grp.rawBits}
                            </span>
                            <div className="w-8 h-[1px] bg-[var(--border-subtle)] my-1" />
                            <span className="text-2xl font-mono font-bold text-[var(--text-main)]">
                              {isRevealed ? grp.targetDigit : '?'}
                            </span>
                            <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1">
                              ={grp.decimalVal}₁₀
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {stepIndex >= conversionResult.steps.length - 1 && (
                      <div className="px-5 py-2.5 rounded-xl theme-card border font-mono text-sm text-[var(--text-main)] font-semibold shadow-sm">
                        Result: <span className="text-[var(--text-accent)] font-bold text-lg">{conversionResult.result}</span>
                      </div>
                    )}
                  </div>

                ) : (
                  
                  /* SCENE: EXPAND (TO DECIMAL) OR DIVIDE (FROM DECIMAL) */
                  <div className="w-full flex flex-col items-center">
                    
                    {/* EXPAND DIGITS (Powers of base) */}
                    {conversionResult.digits && (
                      <div className="w-full mb-6">
                        <div className="text-xs font-mono text-[var(--text-muted)] mb-3 text-center">
                          Positional Powers Expansion (Base {fromBase}):
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                          {conversionResult.digits.map((digit, dIdx) => {
                            const pos = conversionResult.digits!.length - 1 - dIdx;
                            const power = Math.pow(fromBase, pos);
                            const isRevealed = stepIndex >= dIdx;
                            const isCurrent = stepIndex === dIdx;

                            return (
                              <div
                                key={dIdx}
                                className={`flex flex-col items-center p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
                                  isCurrent
                                    ? 'bg-[#B39A84]/40 border-[#B39A84] shadow-md scale-105 text-[var(--text-main)]'
                                    : isRevealed
                                    ? 'theme-card border-[var(--border-strong)] text-[var(--text-main)]'
                                    : 'theme-card border-[var(--border-subtle)] opacity-40 text-[var(--text-muted)]'
                                }`}
                              >
                                <span className="text-2xl sm:text-3xl font-mono font-bold text-[var(--text-main)] mb-1">
                                  {digit}
                                </span>
                                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                                  {fromBase}<sup>{pos}</sup> ({power})
                                </span>
                                <span className="text-xs font-mono font-semibold text-[var(--text-accent)] mt-2">
                                  {isRevealed ? `= ${conversionResult.contributions![dIdx]}` : '...'}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Summation Row */}
                        <div className={`mt-4 p-3 rounded-xl theme-card border font-mono text-xs sm:text-sm text-center transition-all ${
                          stepIndex >= conversionResult.digits.length ? 'opacity-100 text-[var(--text-main)] font-semibold' : 'opacity-40 text-[var(--text-muted)]'
                        }`}>
                          <span>{conversionResult.contributions?.join(' + ')}</span>
                          <span className="mx-2 text-[var(--text-muted)]">=</span>
                          <span className="text-[var(--text-accent)] font-bold text-base">
                            {stepIndex >= conversionResult.digits.length 
                              ? (conversionResult.steps.find(s => s.type === 'expand-sum')?.result || conversionResult.result)
                              : '?'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* BRIDGE STEP (If converting through decimal) */}
                    {conversionResult.steps.some(s => s.type === 'bridge') && (
                      <div className={`py-2 px-4 rounded-full text-xs font-mono my-2 border transition-all ${
                        stepIndex >= (conversionResult.digits?.length || 0) + 1
                          ? 'bg-[#B39A84]/25 border-[#B39A84]/50 text-[var(--text-main)] font-bold'
                          : 'opacity-20 border-[var(--border-subtle)] text-[var(--text-muted)]'
                      }`}>
                        ↓ Bridging via Decimal {conversionResult.steps.find(s => s.type === 'bridge')?.title} ↓
                      </div>
                    )}

                    {/* REPEATED DIVISION (FROM DECIMAL) */}
                    {conversionResult.rows && conversionResult.rows.length > 0 && (
                      <div className="w-full mt-2">
                        <div className="text-xs font-mono text-[var(--text-muted)] mb-2 text-center">
                          Repeated Division by Radix {toBase}:
                        </div>
                        <div className="flex flex-col gap-1.5 max-w-sm mx-auto">
                          {conversionResult.rows.map((row, rIdx) => {
                            const divStepIdx = conversionResult.steps.findIndex(
                              s => s.type === 'divide' && s.title.includes(`${row.dividend}`)
                            );
                            const isRevealed = stepIndex >= divStepIdx && divStepIdx !== -1;
                            const isCurrent = stepIndex === divStepIdx;

                            return (
                              <div
                                key={rIdx}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg font-mono text-xs border transition-all ${
                                  isCurrent
                                    ? 'bg-[#B39A84]/40 border-[#B39A84] text-[var(--text-main)] shadow-sm'
                                    : isRevealed
                                    ? 'theme-card border-[var(--border-subtle)] text-[var(--text-main)]'
                                    : 'theme-inner-box border-[var(--border-subtle)] opacity-30 text-[var(--text-muted)]'
                                }`}
                              >
                                <span>{row.dividend} ÷ {toBase} = <span className="font-bold">{row.quotient}</span></span>
                                <span className={`px-2 py-0.5 rounded font-bold ${
                                  isRevealed ? 'bg-[#B39A84]/40 text-[var(--text-main)] border border-[#B39A84]/50' : 'theme-inner-box text-[var(--text-muted)]'
                                }`}>
                                  Remainder: {row.digit}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Reverse Readout Indicator */}
                        <div className={`mt-4 p-3 rounded-xl theme-card border flex items-center justify-center gap-2 font-mono text-xs transition-all ${
                          stepIndex >= conversionResult.steps.length - 1 ? 'opacity-100' : 'opacity-30'
                        }`}>
                          <span className="text-[var(--text-muted)]">Read remainders bottom-to-top:</span>
                          <span className="text-[var(--text-accent)] font-bold text-sm tracking-widest">
                            {conversionResult.rows.map(r => r.digit).reverse().join('')}
                          </span>
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* Bottom Result Banner */}
              <div className="p-3.5 rounded-xl theme-card border flex items-center justify-between shadow-sm">
                <span className="text-xs font-mono text-[var(--text-muted)]">Final Converted Representation:</span>
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-[var(--text-main)]">
                  {stepIndex >= totalSteps - 1 ? (conversionResult.result || '0') : '...'}
                </span>
              </div>

            </div>

            {/* COLUMN 3: Nova AI Companion & Explanations (Col span 3) */}
            <div className="lg:col-span-3 p-6 flex flex-col justify-between theme-card">
              
              {showNovaGuide ? (
                <div>
                  {/* Nova Status Header */}
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border-subtle)] mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0A1E54] via-[#B39A84] to-[#F9F0EE] p-[1.5px] shadow-sm">
                      <div className="w-full h-full bg-[#0A1E54] rounded-[7px] flex items-center justify-center text-[#F9F0EE]">
                        <Bot className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-[var(--text-main)] flex items-center gap-1.5">
                        Nova Assistant
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B39A84]" />
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">Contextual Explainer</div>
                    </div>
                  </div>

                  {/* Active Step Title */}
                  <div className="text-sm font-semibold text-[var(--text-accent)] font-mono mb-2">
                    {currentStep ? currentStep.title : 'Ready to start'}
                  </div>

                  {/* Dynamic Explanation Text */}
                  <p className="text-xs text-[var(--text-main)] leading-relaxed min-h-[90px] mb-5">
                    {getNovaExplanation()}
                  </p>

                  {/* Lens / Explanation style chips */}
                  <div className="space-y-1.5 mb-6">
                    <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-wider">
                      Explanation Lens:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setNovaMode('standard')}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-mono text-left border transition-colors ${
                          novaMode === 'standard' 
                            ? 'bg-[#B39A84]/40 border-[#B39A84] text-[var(--text-main)] font-bold' 
                            : 'theme-inner-box text-[var(--text-muted)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        Standard Step
                      </button>

                      <button
                        type="button"
                        onClick={() => setNovaMode('simple')}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-mono text-left border transition-colors ${
                          novaMode === 'simple' 
                            ? 'bg-[#B39A84]/40 border-[#B39A84] text-[var(--text-main)] font-bold' 
                            : 'theme-inner-box text-[var(--text-muted)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        Plain English
                      </button>

                      <button
                        type="button"
                        onClick={() => setNovaMode('analogy')}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-mono text-left border transition-colors ${
                          novaMode === 'analogy' 
                            ? 'bg-[#B39A84]/40 border-[#B39A84] text-[var(--text-main)] font-bold' 
                            : 'theme-inner-box text-[var(--text-muted)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        Analogy
                      </button>

                      <button
                        type="button"
                        onClick={() => setNovaMode('technical')}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-mono text-left border transition-colors ${
                          novaMode === 'technical' 
                            ? 'bg-[#B39A84]/40 border-[#B39A84] text-[var(--text-main)] font-bold' 
                            : 'theme-inner-box text-[var(--text-muted)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        Technical Detail
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-10 text-[var(--text-muted)] text-xs font-mono">
                  Nova guide hidden. Toggle on above to view explanations.
                </div>
              )}

              {/* Shortcut Tip Card at bottom */}
              <div className="p-3 rounded-xl theme-inner-box border text-[11px] text-[var(--text-main)] leading-relaxed flex items-start gap-2 shadow-sm">
                <Lightbulb className="w-4 h-4 text-[#B39A84] shrink-0 mt-0.5" />
                <span>{getBaseShortcutTip(fromBase, toBase)}</span>
              </div>

            </div>

          </div>

          {/* Timeline & Scrubber Bar (Bottom) */}
          <div className="px-6 py-4 theme-inner-box border-t flex flex-wrap items-center justify-between gap-4">
            
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={restart}
                className="p-2 rounded-xl border border-[var(--border-subtle)] theme-card text-[var(--text-main)] hover:border-[#B39A84] transition-colors"
                title="Restart from Step 1 (R)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={stepBackward}
                disabled={stepIndex <= 0}
                className="p-2 rounded-xl border border-[var(--border-subtle)] theme-card text-[var(--text-main)] hover:border-[#B39A84] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Previous Step (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-90"
                title="Play / Pause (Space)"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                type="button"
                onClick={stepForward}
                disabled={stepIndex >= totalSteps - 1}
                className="p-2 rounded-xl border border-[var(--border-subtle)] theme-card text-[var(--text-main)] hover:border-[#B39A84] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Next Step (Right Arrow)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Clickable Scrubber Track */}
            <div className="flex-1 max-w-md mx-2 flex items-center gap-3">
              <div 
                className="flex-1 h-3 theme-card border border-[var(--border-subtle)] rounded-full cursor-pointer relative overflow-hidden group shadow-inner"
                onClick={(e) => {
                  if (totalSteps <= 0) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  setStepIndex(Math.round(pct * (totalSteps - 1)));
                  setIsPlaying(false);
                }}
              >
                <div 
                  className="h-full bg-[var(--btn-primary-bg)] rounded-full transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)] shrink-0">
                {totalSteps > 0 ? stepIndex + 1 : 0} / {totalSteps}
              </span>
            </div>

            {/* Playback Speed Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--text-muted)]">Speed:</span>
              <div className="flex items-center gap-1">
                {[0.5, 1, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                      playbackSpeed === spd
                        ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-bold'
                        : 'theme-card border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
