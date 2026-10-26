'use client';

import React from 'react';
import { Keyboard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="pt-16 pb-12 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] text-[var(--text-muted)] font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top: Shortcuts Bar */}
        <div className="p-4 sm:p-5 rounded-2xl theme-card border mb-12 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--text-main)] font-semibold">
            <Keyboard className="w-4 h-4 text-[#B39A84]" />
            <span>Keyboard Shortcuts:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 rounded theme-inner-box border border-[var(--border-strong)] text-[var(--text-main)] font-bold shadow-xs">Space</kbd>
              <span className="text-[var(--text-muted)]">Play / Pause</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 rounded theme-inner-box border border-[var(--border-strong)] text-[var(--text-main)] font-bold shadow-xs">←</kbd>
              <kbd className="px-2 py-0.5 rounded theme-inner-box border border-[var(--border-strong)] text-[var(--text-main)] font-bold shadow-xs">→</kbd>
              <span className="text-[var(--text-muted)]">Previous / Next Step</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 rounded theme-inner-box border border-[var(--border-strong)] text-[var(--text-main)] font-bold shadow-xs">R</kbd>
              <span className="text-[var(--text-muted)]">Restart Animation</span>
            </div>
          </div>
        </div>

        {/* Middle: Links and Tech */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[var(--border-subtle)]">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0A1E54] via-[#B39A84] to-[#F9F0EE] flex items-center justify-center font-mono font-bold text-xs text-[#0A1E54]">
                CF
              </div>
              <span className="font-extrabold text-[var(--text-main)] text-base">CONCEPTFLOW</span>
            </div>
            <div className="text-xs font-mono text-[var(--text-accent)] font-semibold mb-2">
              Designed & Built by Nandita Ghosh
            </div>
            <p className="text-[var(--text-muted)] text-xs max-w-sm leading-relaxed mb-4">
              "Don't just learn the answer. See how it works." Learning should be experienced, not memorized. An interactive educational number systems engine.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-[var(--text-muted)]">
              <span className="px-2 py-0.5 rounded theme-inner-box border border-[var(--border-subtle)]">Next.js 16</span>
              <span className="px-2 py-0.5 rounded theme-inner-box border border-[var(--border-subtle)]">React 19</span>
              <span className="px-2 py-0.5 rounded theme-inner-box border border-[var(--border-subtle)]">Tailwind CSS v4</span>
              <span className="px-2 py-0.5 rounded theme-inner-box border border-[var(--border-subtle)]">Blue Beige Palette</span>
            </div>
          </div>

          <div>
            <div className="text-[var(--text-main)] font-bold text-xs uppercase tracking-wider mb-3">
              Modules
            </div>
            <ul className="space-y-2 text-xs">
              <li><a href="#converter" className="hover:text-[#B39A84] transition-colors">Converter Workspace</a></li>
              <li><a href="#bitboard" className="hover:text-[#B39A84] transition-colors">Tactile Bit Board</a></li>
              <li><a href="#matrix" className="hover:text-[#B39A84] transition-colors">Live Radix Matrix</a></li>
              <li><a href="#practice" className="hover:text-[#B39A84] transition-colors">Practice Challenges</a></li>
              <li><a href="#library" className="hover:text-[#B39A84] transition-colors">Radix Concept Library</a></li>
            </ul>
          </div>

          <div>
            <div className="text-[var(--text-main)] font-bold text-xs uppercase tracking-wider mb-3">
              Bases Supported
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7B9DF2]" />
                <span className="text-[var(--text-main)]">Base 2 (Binary)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B39A84]" />
                <span className="text-[var(--text-main)]">Base 8 (Octal)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B39A84] border border-[var(--border-strong)]" />
                <span className="text-[var(--text-main)]">Base 10 (Decimal)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0A1E54] border border-[var(--border-strong)]" />
                <span className="text-[var(--text-main)]">Base 16 (Hexadecimal)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Rights & Builder Socials */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-muted)]">
          <div className="text-center md:text-left">
            © 2026 <strong className="text-[var(--text-main)] font-semibold">Nandita Ghosh</strong>. All Rights Reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <span className="text-[var(--text-muted)] hidden sm:inline">Builder:</span>

            <a 
              href="https://github.com/nanditaghosh01" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[var(--text-accent)] transition-colors flex items-center gap-1.5 font-medium"
              title="Nandita Ghosh GitHub Profile"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>

            <a 
              href="https://www.linkedin.com/in/nandita-ghosh-828a96327/" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[var(--text-accent)] transition-colors flex items-center gap-1.5 font-medium"
              title="Nandita Ghosh LinkedIn Profile"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6c0-.89-.72-1.6-1.6-1.6z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
