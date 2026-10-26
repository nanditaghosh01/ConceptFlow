'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  HelpCircle,
  BookOpen,
  Target,
  Zap,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Difficulty, PracticeProblem } from '@/types';
import { generatePracticeProblem, BASE_NAMES, playTactileClick, playSuccessChime } from '@/lib/conversion-engine';

interface PracticeLabProps {
  soundEnabled: boolean;
}

export const PracticeLab: React.FC<PracticeLabProps> = ({ soundEnabled }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [problem, setProblem] = useState<PracticeProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showGuidelines, setShowGuidelines] = useState<boolean>(false);
  const [guidelineTab, setGuidelineTab] = useState<'rules' | 'scoring' | 'cheatsheet' | 'tips'>('rules');
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [totalSolved, setTotalSolved] = useState<number>(0);

  useEffect(() => {
    loadNewProblem();
  }, [difficulty]);

  const loadNewProblem = () => {
    if (soundEnabled) playTactileClick(450);
    const p = generatePracticeProblem(difficulty);
    setProblem(p);
    setUserAnswer('');
    setStatus('idle');
    setShowSolution(false);
  };

  const handleCheck = () => {
    if (!problem || !userAnswer.trim()) return;

    const cleanUser = userAnswer.trim().toUpperCase().replace(/^0+(?=.)/, '');
    const cleanExpected = problem.result.toUpperCase().replace(/^0+(?=.)/, '');

    if (cleanUser === cleanExpected) {
      setStatus('correct');
      if (soundEnabled) playSuccessChime();
      
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#0A1E54', '#B39A84', '#CFC7C8', '#F9F0EE']
      });

      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);
      setTotalSolved((prev) => prev + 1);
    } else {
      setStatus('wrong');
      if (soundEnabled) playTactileClick(250, 'sawtooth', 0.1);
      setStreak(0);
    }
    setShowSolution(true);
  };

  return (
    <section className="py-16 sm:py-20 relative" id="practice">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-main)] font-mono text-xs font-semibold mb-3 shadow-sm">
            <Award className="w-3.5 h-3.5 text-[#B39A84]" />
            <span>GAMIFIED PRACTICE LAB</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
            Test Your Understanding
          </h2>
          <p className="text-[var(--text-muted)] text-sm sm:text-base mt-2">
            Fresh conversions generated dynamically on demand. Work out the problem, check your result, and study the worked steps.
          </p>
          
          {/* Quick Guidelines Launcher */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) playTactileClick(600);
                setShowGuidelines(!showGuidelines);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] text-xs font-mono font-semibold text-[var(--text-main)] hover:border-[#B39A84] hover:scale-105 transition-all shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5 text-[var(--text-accent)]" />
              <span>{showGuidelines ? 'Close Game Guidelines' : 'How to Play & Guidelines'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Game Guidelines Modal/Drawer */}
        {showGuidelines && (
          <div className="max-w-3xl mx-auto mb-8 rounded-2xl theme-card border shadow-xl p-6 sm:p-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0A1E54] via-[#B39A84] to-[#F9F0EE] p-[1.5px] shadow-sm">
                  <div className="w-full h-full bg-[var(--bg-inner)] rounded-[7px] flex items-center justify-center text-[var(--text-accent)]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-mono font-bold text-base text-[var(--text-main)]">
                    Practice Lab Game Guidelines
                  </h3>
                  <p className="text-[11px] font-mono text-[var(--text-muted)]">
                    Official rules, scoring mechanics, radix cheat sheets & shortcut tricks
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playTactileClick(500);
                  setShowGuidelines(false);
                }}
                className="p-1.5 rounded-lg border border-[var(--border-subtle)] theme-inner-box text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[#B39A84] transition-colors"
                title="Close Guidelines"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 theme-inner-box p-1.5 rounded-xl border border-[var(--border-subtle)] mb-6">
              <button
                type="button"
                onClick={() => setGuidelineTab('rules')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  guidelineTab === 'rules'
                    ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>How to Play</span>
              </button>

              <button
                type="button"
                onClick={() => setGuidelineTab('scoring')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  guidelineTab === 'scoring'
                    ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Scoring & Streaks</span>
              </button>

              <button
                type="button"
                onClick={() => setGuidelineTab('cheatsheet')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  guidelineTab === 'cheatsheet'
                    ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Radix Cheat Sheet</span>
              </button>

              <button
                type="button"
                onClick={() => setGuidelineTab('tips')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  guidelineTab === 'tips'
                    ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Speed Tricks</span>
              </button>
            </div>

            {/* TAB 1: HOW TO PLAY */}
            {guidelineTab === 'rules' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl theme-inner-box border border-[var(--border-subtle)] flex flex-col justify-between">
                  <div>
                    <div className="text-[var(--text-accent)] font-bold text-xs mb-1.5 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center text-[10px]">1</span>
                      <span>Read the Target</span>
                    </div>
                    <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                      Examine the generated expression (e.g. <code>1011 (Base 2) → Base 10</code>). You are converting from the source radix into the requested target radix.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-accent)] font-semibold">
                    Supported: Bases 2, 8, 10, 16
                  </div>
                </div>

                <div className="p-4 rounded-xl theme-inner-box border border-[var(--border-subtle)] flex flex-col justify-between">
                  <div>
                    <div className="text-[var(--text-accent)] font-bold text-xs mb-1.5 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center text-[10px]">2</span>
                      <span>Type Your Answer</span>
                    </div>
                    <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                      Enter the digits into the answer box. Hexadecimal letters <code>A–F</code> can be uppercase or lowercase. Leading zeros are optional.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-accent)] font-semibold">
                    e.g. "2F" or "2f" both match
                  </div>
                </div>

                <div className="p-4 rounded-xl theme-inner-box border border-[var(--border-subtle)] flex flex-col justify-between">
                  <div>
                    <div className="text-[var(--text-accent)] font-bold text-xs mb-1.5 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center text-[10px]">3</span>
                      <span>Check & Learn</span>
                    </div>
                    <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                      Press <kbd className="px-1.5 py-0.5 rounded theme-card border text-[10px]">Enter</kbd> or click <strong>Check</strong>. If stuck, expand the <strong>Worked Solution</strong> accordion below to see every formula step.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-accent)] font-semibold">
                    Instant mathematical proof
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SCORING & STREAKS */}
            {guidelineTab === 'scoring' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl theme-inner-box border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2 text-[var(--text-accent)] font-bold mb-2">
                    <Flame className="w-4 h-4 fill-current" />
                    <span>Streak Combos & Audio Feedback</span>
                  </div>
                  <p className="text-[var(--text-muted)] text-[11px] leading-relaxed mb-3">
                    Every consecutive problem you solve adds +1 to your active streak and fires a celebratory particle confetti burst.
                  </p>
                  <ul className="space-y-1.5 text-[11px] text-[var(--text-main)]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)]" />
                      <span><strong>Streak Record</strong>: Your session's highest streak is saved as <code>Best Streak</code>.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)]" />
                      <span><strong>Missed Answers</strong>: Reset current streak to 0, but never erase your best record.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)]" />
                      <span><strong>Total Solved</strong>: Tracks lifetime problems mastered during your session.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl theme-inner-box border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2 text-[var(--text-accent)] font-bold mb-2">
                    <Award className="w-4 h-4" />
                    <span>Difficulty Tiers</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="p-2.5 rounded-lg theme-card border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[var(--text-accent)]" />
                        <span>Beginner</span>
                      </div>
                      <div className="text-[var(--text-muted)] text-[10px] mt-0.5">3–4 bit numbers (0–15), single hex digits. Great for fast mental drills.</div>
                    </div>
                    <div className="p-2.5 rounded-lg theme-card border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#7B9DF2]" />
                        <span>Intermediate</span>
                      </div>
                      <div className="text-[var(--text-muted)] text-[10px] mt-0.5">6–8 bit values (up to 120), octal grouping, two-digit hex values.</div>
                    </div>
                    <div className="p-2.5 rounded-lg theme-card border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#B39A84]" />
                        <span>Advanced</span>
                      </div>
                      <div className="text-[var(--text-muted)] text-[10px] mt-0.5">Full byte range (0–255), decimal bridge conversions, and long remainder chains.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: RADIX CHEAT SHEET */}
            {guidelineTab === 'cheatsheet' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl theme-inner-box border border-[var(--border-subtle)]">
                    <div className="text-[#7B9DF2] font-bold text-xs mb-1">BASE 2 (Binary)</div>
                    <div className="text-[var(--text-muted)] text-[10px] mb-2">Digits: <code>0, 1</code></div>
                    <div className="text-[10px] text-[var(--text-main)] space-y-0.5">
                      <div>2⁰ = 1</div>
                      <div>2¹ = 2</div>
                      <div>2² = 4</div>
                      <div>2³ = 8</div>
                      <div>2⁴ = 16</div>
                      <div>2⁵ = 32</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl theme-inner-box border border-[var(--border-subtle)]">
                    <div className="text-[var(--text-accent)] font-bold text-xs mb-1">BASE 8 (Octal)</div>
                    <div className="text-[var(--text-muted)] text-[10px] mb-2">Digits: <code>0 to 7</code></div>
                    <div className="text-[10px] text-[var(--text-main)] space-y-0.5">
                      <div>8⁰ = 1</div>
                      <div>8¹ = 8</div>
                      <div>8² = 64</div>
                      <div>8³ = 512</div>
                      <div className="text-[var(--text-accent)] font-semibold mt-1">Group: 3 bits</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl theme-inner-box border border-[var(--border-subtle)]">
                    <div className="text-[var(--text-main)] font-bold text-xs mb-1">BASE 10 (Decimal)</div>
                    <div className="text-[var(--text-muted)] text-[10px] mb-2">Digits: <code>0 to 9</code></div>
                    <div className="text-[10px] text-[var(--text-main)] space-y-0.5">
                      <div>10⁰ = 1</div>
                      <div>10¹ = 10</div>
                      <div>10² = 100</div>
                      <div>10³ = 1000</div>
                      <div className="text-[var(--text-muted)] mt-1">Everyday Base</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl theme-inner-box border border-[var(--border-subtle)]">
                    <div className="text-[var(--text-accent)] font-bold text-xs mb-1">BASE 16 (Hex)</div>
                    <div className="text-[var(--text-muted)] text-[10px] mb-2">Digits: <code>0–9, A–F</code></div>
                    <div className="text-[10px] text-[var(--text-main)] space-y-0.5">
                      <div>A=10, B=11</div>
                      <div>C=12, D=13</div>
                      <div>E=14, F=15</div>
                      <div>16¹ = 16, 16² = 256</div>
                      <div className="text-[var(--text-accent)] font-semibold mt-1">Group: 4 bits</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PRO SPEED TRICKS */}
            {guidelineTab === 'tips' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl theme-inner-box border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2 text-[var(--text-accent)] font-bold mb-1.5">
                    <Zap className="w-4 h-4" />
                    <span>The 8-4-2-1 Hex Nibble Rule</span>
                  </div>
                  <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                    Convert 4 bits to hex in seconds by adding weights:
                    <br />
                    <code>1101₂ = 8 + 4 + 0 + 1 = 13 = D₁₆</code>.
                    <br />
                    Never convert through decimal multiplication when grouping bits directly!
                  </p>
                </div>

                <div className="p-4 rounded-xl theme-inner-box border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2 text-[var(--text-accent)] font-bold mb-1.5">
                    <Zap className="w-4 h-4" />
                    <span>The 4-2-1 Octal Grouping Rule</span>
                  </div>
                  <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                    Because $2^3 = 8$, group binary bits into triplets of 3 from right to left:
                    <br />
                    <code>101₂ = 4 + 0 + 1 = 5₈</code>.
                    <br />
                    Combine triplets directly to form octal numbers with zero division.
                  </p>
                </div>

                <div className="p-4 rounded-xl theme-inner-box border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2 text-[var(--text-accent)] font-bold mb-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Even / Odd Binary Detection</span>
                  </div>
                  <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                    The least significant bit ($2^0=1$) is the only odd power. If a binary number ends in <code>1</code>, it is always odd; if it ends in <code>0</code>, it is always even.
                  </p>
                </div>

                <div className="p-4 rounded-xl theme-inner-box border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2 text-[var(--text-accent)] font-bold mb-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Bottom-to-Top Remainder Reading</span>
                  </div>
                  <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                    When doing repeated division from decimal to base $B$, the last remainder produced is your <strong>Most Significant Digit (MSD)</strong>. Always write remainders in reverse order!
                  </p>
                </div>
              </div>
            )}

            {/* Ready Action */}
            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Ready to play? Good luck on your streak!
              </span>
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playTactileClick(600);
                  setShowGuidelines(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <span>Got It! Let's Play</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Practice Container */}
        <div className="max-w-3xl mx-auto rounded-2xl theme-card border shadow-xl p-6 sm:p-10 relative overflow-hidden">
          
          {/* Top Bar: Difficulty Tabs & Streaks */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[var(--border-subtle)]">
            {/* Difficulty Tabs */}
            <div className="flex items-center gap-1.5 theme-inner-box p-1 rounded-xl border border-[var(--border-subtle)]">
              {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    difficulty === diff
                      ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Guidelines Toggle & Streak Stats */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playTactileClick(500);
                  setShowGuidelines(!showGuidelines);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] theme-inner-box text-[var(--text-main)] hover:border-[#B39A84] transition-all"
                title="View Game Guidelines"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[var(--text-accent)]" />
                <span className="hidden sm:inline">{showGuidelines ? 'Hide Rules' : 'Guidelines'}</span>
              </button>

              <div className="flex items-center gap-1.5 text-[var(--text-accent)] font-bold theme-inner-box px-3 py-1.5 rounded-xl border border-[var(--border-subtle)]">
                <Flame className="w-4 h-4 text-[var(--text-accent)] fill-[var(--text-accent)]" />
                <span>{streak} Streak</span>
              </div>
              <div className="text-[var(--text-muted)] hidden sm:block">
                Best: <span className="text-[var(--text-main)] font-bold">{bestStreak}</span> | Total: <span className="text-[var(--text-accent)] font-bold">{totalSolved}</span>
              </div>
            </div>
          </div>

          {/* Problem Display Box */}
          {problem && (
            <div className="flex flex-col items-center text-center mb-8">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Convert the following value:
              </span>

              {/* Big Math Expression */}
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] my-3 flex items-baseline gap-2">
                <span className="text-[var(--text-accent)]">{problem.value}</span>
                <span className="text-xs text-[var(--text-muted)] font-normal">
                  (Base {problem.fromBase} — {BASE_NAMES[problem.fromBase]})
                </span>
                <span className="text-[var(--text-muted)] mx-2">→</span>
                <span>Base {problem.toBase}</span>
              </div>

              {/* Hint */}
              <div className="text-xs font-mono text-[var(--text-main)] max-w-md mt-2 flex items-center gap-1.5 theme-inner-box px-3.5 py-2 rounded-lg border border-[var(--border-subtle)] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[var(--text-accent)] shrink-0" />
                <span>{problem.hint}</span>
              </div>
            </div>
          )}

          {/* Input & Check Actions */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCheck();
                }}
                placeholder={`Answer in base ${problem?.toBase || '...'}`}
                spellCheck={false}
                className="w-full px-4 py-3 rounded-xl font-mono text-lg font-bold theme-input border focus:outline-none text-center sm:text-left"
              />

              <button
                type="button"
                onClick={handleCheck}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-sm font-bold bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-md hover:opacity-90 transition-all shrink-0"
              >
                Check
              </button>

              <button
                type="button"
                onClick={loadNewProblem}
                className="p-3 rounded-xl border border-[var(--border-subtle)] theme-inner-box text-[var(--text-main)] hover:border-[#B39A84] transition-colors shrink-0"
                title="Generate new problem"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {/* Feedback Message */}
            {status === 'correct' && (
              <div className="mt-4 p-3 rounded-xl theme-inner-box border border-emerald-500/50 text-emerald-600 dark:text-emerald-300 font-mono text-xs sm:text-sm flex items-center justify-center gap-2 font-bold shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Outstanding! Your answer is correct.</span>
              </div>
            )}

            {status === 'wrong' && (
              <div className="mt-4 p-3 rounded-xl theme-inner-box border border-rose-500/50 text-rose-600 dark:text-rose-300 font-mono text-xs sm:text-sm flex items-center justify-center gap-2 font-bold shadow-sm">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Not quite. Expected: <strong className="ml-1">{problem?.result}</strong></span>
              </div>
            )}
          </div>

          {/* Worked Solution Steps Accordion */}
          {problem && showSolution && (
            <div className="pt-6 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setShowSolution(!showSolution)}
                className="w-full flex items-center justify-between text-xs font-mono font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] mb-4"
              >
                <span>WORKED STEP-BY-STEP SOLUTION:</span>
                {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <div className="space-y-2 theme-inner-box border p-4 rounded-xl">
                {problem.steps.map((step, idx) => (
                  <div key={idx} className="font-mono text-xs text-[var(--text-main)] flex items-start gap-2">
                    <span className="text-[var(--text-accent)] font-bold shrink-0">{idx + 1}.</span>
                    <div>
                      <div className="font-semibold">{step.title}</div>
                      <div className="text-[var(--text-muted)] text-[11px] mt-0.5">{step.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
