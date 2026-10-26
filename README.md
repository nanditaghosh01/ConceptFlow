# CONCEPTFLOW

> **Don't just learn the answer. See how it works.**  
> An interactive, step-by-step visual number systems laboratory built with **React 19**, **Next.js 16 (App Router)**, **Tailwind CSS v4**, and **TypeScript**.

---

## What's New

ConceptFlow transforms number-system conversions into a component-driven, tactile web application:

1. **Tactile 8-Bit Switchboard (`<InteractiveBitBoard />`)**:
   - Flip physical bits ($b_7$ down to $b_0$) with tactile audio feedback.
   - Live telemetry updates for **Decimal**, **Hexadecimal (`0x..`)**, **Octal**, **ASCII glyph**, and byte color representation.
   - Bitwise operations: **NOT (Invert)**, **Shift Left (`<< 1`)**, **Shift Right (`>> 1`)**, **Increment**, **Decrement**, and **Randomize**.
   - 1-click **"Load in Converter"** pipeline.

2. **Step-by-Step Interactive Converter Workspace (`<ConverterWorkspace />`)**:
   - Scrubbable timeline with play, pause, step forward/backward, and adjustable speed (0.5x – 2x).
   - Three dynamic mathematical scenes:
     - **Positional Powers Expansion**: $d \times \text{base}^{\text{pos}}$ cards with calculated contributions and cumulative summation.
     - **Euclidean Division Ladder**: Repeated division rows with remainder highlight chips and bottom-to-top reverse readout.
     - **Direct Bit Grouping**: 4-bit nibble groupings (Binary $\leftrightarrow$ Hex) and 3-bit octet groupings (Binary $\leftrightarrow$ Octal).
   - **Nova AI Companion**: Multi-lens explanations (Standard, Plain English, Real-world Analogy, Deep Technical Details).
      
3. **Synchronized 4-Way Radix Matrix (`<MultiBaseMatrix />`)**:
   - Bidirectional real-time typing across Binary, Octal, Decimal, and Hexadecimal.
   - 1-click copy with toast notifications.
   - Parity and bit-length diagnostics.

4. **Gamified Practice Lab (`<PracticeLab />`)**:
   - Dynamically generated conversion problems across Beginner, Intermediate, and Advanced tiers.
   - Active streak tracker and all-time best streak record.
   - Comprehensive **Game Guidelines & Rules** modal with how-to-play steps, scoring mechanics, radix cheat sheets, and pro speed tricks.
   - Confetti celebrations and audio feedback on correct answers.
   - Expandable worked step-by-step solution breakdown.

5. **Curated Noguchi Design Palette (Blue Beige)**:
   - **Canvas Requirements**: Strictly pure black (`#000000`) in dark mode and pure white (`#FFFFFF`) in light mode.
   - **Harmonious Color Palette**:
     - `#0A1E54` — Royal Navy Blue
     - `#B39A84` — Warm Sand Tan
     - `#CFC7C8` — Mineral Mist
     - `#F9F0EE` — Warm Alabaster
   - High-contrast typography optimized for WCAG accessibility across both dark and light modes.
   - Accessible keyboard controls (`Space` to play/pause, `Left` / `Right` arrows to step, `R` to restart).

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations & FX**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) & Web Audio API synthesizer

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── globals.css         # Tailwind v4 theme, adaptive light/dark tokens, Blue Beige palette
│   │   ├── layout.tsx          # Root layout with Google Fonts and SEO metadata
│   │   └── page.tsx            # Main application page with shared state
│   ├── components/
│   │   ├── Navbar.tsx          # Sticky navigation, audio toggle, theme toggle
│   │   ├── Hero.tsx            # Animated hero with live running binary simulation
│   │   ├── ConverterWorkspace.tsx # Interactive step-by-step conversion workspace & Nova guide
│   │   ├── InteractiveBitBoard.tsx # 8-bit switchboard with bitwise operations & live telemetry
│   │   ├── MultiBaseMatrix.tsx # 4-way synchronized radix matrix
│   │   ├── PracticeLab.tsx     # Practice challenges, game guidelines & streak system
│   │   ├── HowItWorks.tsx      # 5-stage learning methodology
│   │   ├── ConceptLibrary.tsx  # Catalog of conversion pairs with 1-click launch
│   │   └── Footer.tsx          # Keyboard shortcuts cheat sheet & links
│   ├── lib/
│   │   └── conversion-engine.ts# Math engine, steps generator, audio synthesizer
│   └── types/
│       └── index.ts            # TypeScript interfaces & types
└── legacy/                     # Archived original vanilla HTML/CSS/JS files
```

---

## License
Open educational resource for computer science learners worldwide.
