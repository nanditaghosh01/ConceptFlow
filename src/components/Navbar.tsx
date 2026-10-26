'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Volume2, VolumeX, Sparkles, Binary, Sliders, Grid, BookOpen, Award } from 'lucide-react';
import { playTactileClick } from '@/lib/conversion-engine';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ soundEnabled, onToggleSound }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (soundEnabled) playTactileClick(600);
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-sm' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand */}
          <a 
            href="#top" 
            className="flex items-center gap-3 group focus:outline-none"
            onClick={() => soundEnabled && playTactileClick(500)}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#0A1E54] via-[#B39A84] to-[#F9F0EE] p-[1.5px] shadow-[0_0_15px_rgba(10,30,84,0.25)] group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-[#0A1E54] rounded-[10px] flex items-center justify-center font-mono font-bold text-sm tracking-tighter text-[#F9F0EE]">
                CF
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-lg sm:text-xl font-mono flex items-center gap-1 text-[var(--text-main)]">
                CONCEPT<span className="text-[var(--text-accent)]">FLOW</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-muted)] -mt-1 hidden sm:block">
                Visual Number Systems
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <a 
              href="#converter" 
              className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-subtle)] transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4 text-[var(--text-accent)]" />
              Converter
            </a>
            <a 
              href="#bitboard" 
              className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-subtle)] transition-colors flex items-center gap-1.5"
            >
              <Binary className="w-4 h-4 text-[var(--text-accent)]" />
              Bit Board
            </a>
            <a 
              href="#matrix" 
              className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-subtle)] transition-colors flex items-center gap-1.5"
            >
              <Grid className="w-4 h-4 text-[var(--text-accent)]" />
              Live Matrix
            </a>
            <a 
              href="#practice" 
              className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-subtle)] transition-colors flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-[var(--text-accent)]" />
              Practice Lab
            </a>
            <a 
              href="#library" 
              className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-subtle)] transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-[var(--text-accent)]" />
              Library
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? "Mute audio feedback" : "Enable tactile sound feedback"}
              aria-label="Toggle sound"
              className="p-2 sm:p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] transition-all focus:outline-none"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#B39A84]" /> : <VolumeX className="w-4 h-4 text-[var(--text-muted)]" />}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme"
              className="p-2 sm:p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] transition-all focus:outline-none shadow-sm"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-[#B39A84]" /> : <Sun className="w-4 h-4 text-[#B39A84]" />}
            </button>

            {/* CTA */}
            <a
              href="#converter"
              className="relative inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-md hover:scale-[1.02] transition-all"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Lab</span>
              </span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};
