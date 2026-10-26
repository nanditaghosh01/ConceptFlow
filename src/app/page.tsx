'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ConverterWorkspace } from '@/components/ConverterWorkspace';
import { InteractiveBitBoard } from '@/components/InteractiveBitBoard';
import { MultiBaseMatrix } from '@/components/MultiBaseMatrix';
import { PracticeLab } from '@/components/PracticeLab';
import { HowItWorks } from '@/components/HowItWorks';
import { ConceptLibrary } from '@/components/ConceptLibrary';
import { Footer } from '@/components/Footer';
import { Base } from '@/types';
import { playTactileClick } from '@/lib/conversion-engine';

export default function Home() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [workspaceValue, setWorkspaceValue] = useState<string>('13');
  const [workspaceFromBase, setWorkspaceFromBase] = useState<Base>(10);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playTactileClick(800);
  };

  const handleSendToConverter = (valueStr: string, fromBase: Base) => {
    setWorkspaceValue(valueStr);
    setWorkspaceFromBase(fromBase);
  };

  const handleSelectLibraryPair = (from: Base, to: Base, sample: string) => {
    setWorkspaceFromBase(from);
    setWorkspaceValue(sample);
  };
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors duration-200">
      {/* Navigation */}
      <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Live Binary Demo */}
        <Hero soundEnabled={soundEnabled} />

        {/* Centerpiece Interactive Converter Workspace */}
        <ConverterWorkspace
          soundEnabled={soundEnabled}
          externalValue={workspaceValue}
          externalFromBase={workspaceFromBase}
        />

        {/* Tactile 8-Bit Interactive Switchboard */}
        <InteractiveBitBoard
          soundEnabled={soundEnabled}
          onSendToConverter={handleSendToConverter}
        />

        {/* 4-Way Real-time Radix Matrix */}
        <MultiBaseMatrix
          soundEnabled={soundEnabled}
          onSendToConverter={handleSendToConverter}
        />

        {/* Gamified Practice Challenges */}
        <PracticeLab soundEnabled={soundEnabled} />

        {/* 5-Step Learning Methodology */}
        <HowItWorks />

        {/* Radix Concept Library */}
        <ConceptLibrary
          soundEnabled={soundEnabled}
          onSelectPair={handleSelectLibraryPair}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
