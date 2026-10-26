'use client';

import React from 'react';
import { HelpCircle, Brain, Eye, MousePointerClick, Trophy, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Ask",
      desc: "Select your input and output radix — whether binary, octal, decimal, or hex.",
      icon: HelpCircle,
    },
    {
      num: "02",
      title: "Understand",
      desc: "Learn why positional weights work and why grouping or repeated division succeeds.",
      icon: Brain,
    },
    {
      num: "03",
      title: "Visualize",
      desc: "Step through mathematical animations digit by digit with real-time feedback.",
      icon: Eye,
    },
    {
      num: "04",
      title: "Interact",
      desc: "Flip bits on the tactile switchboard and scrub backward or forward in time.",
      icon: MousePointerClick,
    },
    {
      num: "05",
      title: "Practice",
      desc: "Reinforce intuition with generated problem sets, streaks, and worked solutions.",
      icon: Trophy,
    }
  ];

  return (
    <section className="py-16 sm:py-20 relative bg-transparent border-y border-[var(--border-subtle)]" id="how">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-accent)] font-mono text-xs font-semibold mb-3 shadow-sm">
            <span>THE 5-STAGE LEARNING LOOP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
            How ConceptFlow Works
          </h2>
          <p className="text-[var(--text-muted)] text-sm sm:text-base mt-2">
            Every concept follows an intentional pedagogical pipeline designed to build deep, intuitive mental models.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl theme-card border border-[var(--border-subtle)] flex flex-col justify-between group hover:border-[#B39A84] transition-all hover:scale-[1.02] shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[var(--text-accent)] group-hover:text-[var(--text-main)] transition-colors">
                      {st.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0A1E54] via-[#B39A84] to-[#F9F0EE] p-[1px]">
                      <div className="w-full h-full bg-[var(--bg-inner)] rounded-[7px] flex items-center justify-center text-[var(--text-accent)]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <h3 className="font-mono font-bold text-lg text-[var(--text-main)] mb-2 group-hover:text-[var(--text-accent)] transition-colors">
                    {st.title}
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-accent)] transition-colors">
                  <span>Phase {idx + 1}</span>
                  {idx < steps.length - 1 && <ArrowRight className="w-3 h-3 ml-1" />}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
