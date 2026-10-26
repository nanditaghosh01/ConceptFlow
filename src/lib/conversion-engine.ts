import { Base, Difficulty, ConversionResult, ConversionStep, DivisionRow, GroupingData, PracticeProblem, ConceptPair } from '@/types';

export const DIGITS = "0123456789ABCDEF";

export const BASE_NAMES: Record<Base, string> = {
  2: "Binary",
  8: "Octal",
  10: "Decimal",
  16: "Hexadecimal"
};

export const BASE_RADIX_NAMES: Record<Base, string> = {
  2: "Base 2 (Bits 0, 1)",
  8: "Base 8 (Digits 0–7)",
  10: "Base 10 (Digits 0–9)",
  16: "Base 16 (Digits 0–9, A–F)"
};

export const BASE_COLORS: Record<Base, { text: string; bg: string; border: string; glow: string; name: string; hex: string }> = {
  2: {
    text: "text-[#CFC7C8]",
    bg: "bg-[#0A1E54]/50",
    border: "border-[#CFC7C8]/40",
    glow: "shadow-[0_0_20px_rgba(10,30,84,0.55)]",
    name: "Navy Mist (Base 2)",
    hex: "#0A1E54"
  },
  8: {
    text: "text-[#B39A84]",
    bg: "bg-[#B39A84]/25",
    border: "border-[#B39A84]/45",
    glow: "shadow-[0_0_20px_rgba(179,154,132,0.4)]",
    name: "Sand Tan (Base 8)",
    hex: "#B39A84"
  },
  10: {
    text: "text-[#F9F0EE]",
    bg: "bg-[#F9F0EE]/15",
    border: "border-[#F9F0EE]/35",
    glow: "shadow-[0_0_20px_rgba(249,240,238,0.3)]",
    name: "Warm Alabaster (Base 10)",
    hex: "#F9F0EE"
  },
  16: {
    text: "text-[#CFC7C8]",
    bg: "bg-[#CFC7C8]/25",
    border: "border-[#CFC7C8]/45",
    glow: "shadow-[0_0_20px_rgba(207,199,200,0.35)]",
    name: "Mineral Mist (Base 16)",
    hex: "#CFC7C8"
  }
};

export function isValidDigit(ch: string, base: Base): boolean {
  const v = DIGITS.indexOf(ch.toUpperCase());
  return v !== -1 && v < base;
}

export function validateNumber(str: string, base: Base): string | null {
  if (!str || !str.trim()) return "Please enter a value to convert.";
  const clean = str.trim().toUpperCase();
  for (const ch of clean) {
    if (!isValidDigit(ch, base)) {
      const allowed = DIGITS.slice(0, base).split("").join(", ");
      return `Digit "${ch}" is invalid in base ${base}. Base ${base} (${BASE_NAMES[base]}) only accepts: ${allowed}.`;
    }
  }
  return null;
}

export function toDecimalSteps(str: string, base: Base): {
  steps: ConversionStep[];
  result: number;
  digits: string[];
  contributions: number[];
} {
  const clean = str.toUpperCase().replace(/^0+(?=.)/, "") || "0";
  const digits = clean.split("");
  const n = digits.length;
  const steps: ConversionStep[] = [];
  const contributions: number[] = [];
  let sum = 0;

  digits.forEach((d, i) => {
    const pos = n - 1 - i;
    const val = DIGITS.indexOf(d);
    const power = Math.pow(base, pos);
    const contribution = val * power;
    contributions.push(contribution);
    sum += contribution;

    steps.push({
      idx: 0,
      type: "expand-digit",
      phase: "to-decimal",
      digitIndex: i,
      title: `Digit "${d}" at position ${pos}`,
      detail: `Value ${val} × ${base}^${pos} (${base} to the power of ${pos} is ${power}) = ${contribution}`,
      formula: `${val} × ${base}^${pos} = ${contribution}`
    });
  });

  steps.push({
    idx: 0,
    type: "expand-sum",
    phase: "to-decimal",
    title: "Sum all positional values",
    detail: `Add up each digit's contribution: ${contributions.join(" + ")} = ${sum}`,
    result: sum,
    formula: `${contributions.join(" + ")} = ${sum}`
  });

  return { steps, result: sum, digits, contributions };
}

export function fromDecimalSteps(value: number, base: Base): {
  steps: ConversionStep[];
  result: string;
  rows: DivisionRow[];
} {
  const steps: ConversionStep[] = [];
  const rows: DivisionRow[] = [];

  if (value === 0) {
    steps.push({
      idx: 0,
      type: "divide-zero",
      phase: "from-decimal",
      title: "Decimal value is 0",
      detail: `0 in base ${base} is simply "0".`,
      result: "0"
    });
    return { steps, result: "0", rows };
  }

  let v = value;
  while (v > 0) {
    const q = Math.floor(v / base);
    const r = v % base;
    const digit = DIGITS[r];
    rows.push({ dividend: v, quotient: q, remainder: r, digit });

    steps.push({
      idx: 0,
      type: "divide",
      phase: "from-decimal",
      title: `Divide ${v} by ${base}`,
      detail: `${v} ÷ ${base} = ${q} with remainder ${r} (maps to digit "${digit}")`,
      formula: `${v} ÷ ${base} = ${q} R ${r} → '${digit}'`
    });
    v = q;
  }

  const result = rows.map(r => r.digit).reverse().join("");

  steps.push({
    idx: 0,
    type: "divide-result",
    phase: "from-decimal",
    title: "Collect remainders from bottom to top",
    detail: `Reading remainders in reverse order of division: ${rows.map(r => r.digit).reverse().join(" → ")} gives ${result}`,
    result,
    formula: rows.map(r => r.digit).reverse().join("")
  });

  return { steps, result, rows };
}

export function directGroupingSteps(str: string, fromBase: Base, toBase: Base): ConversionResult | null {
  const clean = str.toUpperCase().replace(/^0+(?=.)/, "") || "0";

  // Binary to Hex (group of 4)
  if (fromBase === 2 && toBase === 16) {
    const groupSize = 4;
    const padLength = (groupSize - (clean.length % groupSize)) % groupSize;
    const padded = "0".repeat(padLength) + clean;
    const groups: { rawBits: string; targetDigit: string; decimalVal: number }[] = [];
    const steps: ConversionStep[] = [];

    steps.push({
      idx: 0,
      type: "group-nibble",
      phase: "direct-group",
      title: "Nibble Grouping (4 bits per Hex digit)",
      detail: `Because 2^4 = 16, each group of 4 binary bits directly corresponds to one hexadecimal digit.${padLength > 0 ? ` Added ${padLength} leading zero(s) for full 4-bit alignment.` : ""}`
    });

    for (let i = 0; i < padded.length; i += groupSize) {
      const bits = padded.slice(i, i + groupSize);
      const dec = parseInt(bits, 2);
      const hexChar = DIGITS[dec];
      groups.push({ rawBits: bits, targetDigit: hexChar, decimalVal: dec });

      steps.push({
        idx: 0,
        type: "group-nibble",
        phase: "direct-group",
        title: `Group: ${bits} → Hex '${hexChar}'`,
        detail: `Binary "${bits}" = ${parseInt(bits[0]) * 8} + ${parseInt(bits[1]) * 4} + ${parseInt(bits[2]) * 2} + ${parseInt(bits[3]) * 1} = ${dec} in decimal, which is "${hexChar}" in Hex.`,
        formula: `${bits}₂ = ${dec}₁₀ = ${hexChar}₁₆`
      });
    }

    const finalResult = groups.map(g => g.targetDigit).join("");
    steps.push({
      idx: 0,
      type: "group-result",
      phase: "direct-group",
      title: "Direct Mapping Complete",
      detail: `Combine each converted group in order: ${groups.map(g => g.targetDigit).join(" ")} = ${finalResult}`,
      result: finalResult
    });

    steps.forEach((s, idx) => s.idx = idx);
    return {
      input: clean,
      fromBase,
      toBase,
      result: finalResult,
      steps,
      groupingData: { groupSize: 4, groups }
    };
  }

  // Binary to Octal (group of 3)
  if (fromBase === 2 && toBase === 8) {
    const groupSize = 3;
    const padLength = (groupSize - (clean.length % groupSize)) % groupSize;
    const padded = "0".repeat(padLength) + clean;
    const groups: { rawBits: string; targetDigit: string; decimalVal: number }[] = [];
    const steps: ConversionStep[] = [];

    steps.push({
      idx: 0,
      type: "group-nibble",
      phase: "direct-group",
      title: "Octet Grouping (3 bits per Octal digit)",
      detail: `Because 2^3 = 8, each group of 3 binary bits directly corresponds to one octal digit.${padLength > 0 ? ` Added ${padLength} leading zero(s) for 3-bit alignment.` : ""}`
    });

    for (let i = 0; i < padded.length; i += groupSize) {
      const bits = padded.slice(i, i + groupSize);
      const dec = parseInt(bits, 2);
      const octChar = DIGITS[dec];
      groups.push({ rawBits: bits, targetDigit: octChar, decimalVal: dec });

      steps.push({
        idx: 0,
        type: "group-nibble",
        phase: "direct-group",
        title: `Group: ${bits} → Octal '${octChar}'`,
        detail: `Binary "${bits}" = ${parseInt(bits[0]) * 4} + ${parseInt(bits[1]) * 2} + ${parseInt(bits[2]) * 1} = ${dec} in decimal, which is "${octChar}" in Octal.`,
        formula: `${bits}₂ = ${dec}₁₀ = ${octChar}₈`
      });
    }

    const finalResult = groups.map(g => g.targetDigit).join("");
    steps.push({
      idx: 0,
      type: "group-result",
      phase: "direct-group",
      title: "Direct Mapping Complete",
      detail: `Combine each converted octal digit: ${groups.map(g => g.targetDigit).join(" ")} = ${finalResult}`,
      result: finalResult
    });

    steps.forEach((s, idx) => s.idx = idx);
    return {
      input: clean,
      fromBase,
      toBase,
      result: finalResult,
      steps,
      groupingData: { groupSize: 3, groups }
    };
  }

  return null;
}

export function convert(valueStr: string, fromBase: Base, toBase: Base, preferDirectGrouping = false): ConversionResult {
  const err = validateNumber(valueStr, fromBase);
  if (err) {
    return {
      error: err,
      input: valueStr,
      fromBase,
      toBase,
      result: "",
      steps: []
    };
  }

  const clean = valueStr.trim().toUpperCase().replace(/^0+(?=.)/, "") || "0";

  if (fromBase === toBase) {
    return {
      input: clean,
      fromBase,
      toBase,
      result: clean,
      steps: [{
        idx: 0,
        type: "trivial",
        phase: "same",
        title: "Identical Bases",
        detail: `The number "${clean}" is already represented in base ${toBase}. No transformation is required.`
      }]
    };
  }

  // Check if direct grouping is requested for 2 <-> 16 or 2 <-> 8
  if (preferDirectGrouping && ((fromBase === 2 && (toBase === 16 || toBase === 8)))) {
    const directRes = directGroupingSteps(clean, fromBase, toBase);
    if (directRes) return directRes;
  }

  let out: ConversionResult;

  if (fromBase === 10) {
    const dec = parseInt(clean, 10);
    const f = fromDecimalSteps(dec, toBase);
    out = {
      input: clean,
      fromBase,
      toBase,
      result: f.result,
      steps: f.steps,
      rows: f.rows
    };
  } else if (toBase === 10) {
    const t = toDecimalSteps(clean, fromBase);
    out = {
      input: clean,
      fromBase,
      toBase,
      result: String(t.result),
      steps: t.steps,
      digits: t.digits,
      contributions: t.contributions
    };
  } else {
    // Cross-base conversion via decimal bridge
    const t = toDecimalSteps(clean, fromBase);
    const f = fromDecimalSteps(t.result, toBase);
    const bridge: ConversionStep = {
      idx: 0,
      type: "bridge",
      phase: "bridge",
      title: `Decimal Bridge: ${clean} (base ${fromBase}) = ${t.result} (base 10)`,
      detail: `Now convert the decimal value ${t.result} into base ${toBase} through repeated division.`
    };
    out = {
      input: clean,
      fromBase,
      toBase,
      result: f.result,
      steps: [...t.steps, bridge, ...f.steps],
      digits: t.digits,
      contributions: t.contributions,
      rows: f.rows
    };
  }

  out.steps.forEach((s, i) => s.idx = i);
  return out;
}

export function computeAllBases(valueStr: string, fromBase: Base): {
  binary: string;
  octal: string;
  decimal: number;
  hexadecimal: string;
  formattedBinary: string;
  asciiChar: string;
  isValid: boolean;
  error?: string;
} {
  const err = validateNumber(valueStr, fromBase);
  if (err) {
    return {
      binary: "0",
      octal: "0",
      decimal: 0,
      hexadecimal: "0",
      formattedBinary: "0000 0000",
      asciiChar: "—",
      isValid: false,
      error: err
    };
  }

  const clean = valueStr.trim().toUpperCase().replace(/^0+(?=.)/, "") || "0";
  const dec = parseInt(clean, fromBase);
  if (isNaN(dec)) {
    return {
      binary: "0",
      octal: "0",
      decimal: 0,
      hexadecimal: "0",
      formattedBinary: "0000 0000",
      asciiChar: "—",
      isValid: false,
      error: "Invalid number"
    };
  }

  const bin = dec.toString(2);
  const oct = dec.toString(8);
  const hex = dec.toString(16).toUpperCase();

  // Format binary into 4-bit nibbles
  const paddedBin = bin.padStart(Math.ceil(bin.length / 4) * 4 || 4, "0");
  const formattedBinary = paddedBin.match(/.{1,4}/g)?.join(" ") || bin;

  // ASCII preview (printable chars 32-126)
  let asciiChar = "—";
  if (dec >= 32 && dec <= 126) {
    asciiChar = `'${String.fromCharCode(dec)}'`;
  } else if (dec === 0) {
    asciiChar = "NUL (0)";
  } else if (dec === 10) {
    asciiChar = "LF (\\n)";
  } else if (dec === 13) {
    asciiChar = "CR (\\r)";
  }

  return {
    binary: bin,
    octal: oct,
    decimal: dec,
    hexadecimal: hex,
    formattedBinary,
    asciiChar,
    isValid: true
  };
}

export function getSimplifiedExplanation(step?: ConversionStep): string {
  if (!step) return "Select a step to view plain-language breakdown.";
  switch (step.type) {
    case "expand-digit":
      return "Look at how far this digit is from the right edge. Each step left multiplies the value by another power of the base.";
    case "expand-sum":
      return "Now that we know the exact value each individual digit brings to the table, we simply add them together to get the total.";
    case "divide":
      return "We slice our number into groups of the target base. The quotient is how many full groups fit, and whatever is left over becomes a digit.";
    case "divide-result":
      return "Because our first division gave the smallest unit (the ones place), we must read our remainders in reverse order to form the final number.";
    case "bridge":
      return "Base 10 is our universal translator. We convert our starting base into decimal first, and then translate decimal into our target base.";
    case "group-nibble":
      return "Since 16 is 2⁴, exactly 4 binary bits always form one hexadecimal character without needing intermediate division.";
    default:
      return "This step completes the conversion pipeline. Every digit is in place.";
  }
}

export function getAnalogy(fromBase: Base, toBase: Base): string {
  if (toBase === 10) {
    return `Imagine coins where denomination values aren't 1¢, 5¢, 10¢, but powers of ${fromBase} (1, ${fromBase}, ${fromBase * fromBase}, ...). Each digit tells you how many of that denomination coin you have in your pocket!`;
  }
  if (fromBase === 10) {
    return `Imagine packing items into boxes of size ${toBase}. You fill as many large crates as possible, and whatever loose items remain at each packing station become the digits of your new number!`;
  }
  if ((fromBase === 2 && toBase === 16) || (fromBase === 16 && toBase === 2)) {
    return `Think of binary bits like syllables and hexadecimal like words: exactly 4 bits always snap cleanly into one hex symbol, just like 4 quarters make 1 dollar!`;
  }
  return `Think of decimal as an international airport where travelers switch planes: you land in Decimal City from Base ${fromBase}, then take a connecting flight straight to Base ${toBase}.`;
}

export function getBaseShortcutTip(fromBase: Base, toBase: Base): string {
  const pairKey = `${fromBase}-${toBase}`;
  switch (pairKey) {
    case "2-16":
      return "Shortcut: Group bits into 4s from the right. Each 4-bit nibble (e.g. 1111 = F, 1010 = A) translates directly without division.";
    case "16-2":
      return "Shortcut: Expand each Hex digit into 4 bits (e.g. F → 1111, 7 → 0111).";
    case "2-8":
      return "Shortcut: Group bits into 3s from the right. 3 bits (000 to 111) map directly to octal digits 0 to 7.";
    case "8-2":
      return "Shortcut: Expand each Octal digit into 3 bits (e.g. 5 → 101, 7 → 111).";
    case "10-2":
      return "Tip: Powers of 2 are easy to remember: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024.";
    case "2-10":
      return "Quick trick: Add powers of two corresponding to only the '1' bits.";
    default:
      return "Decimal acts as the universal bridge when direct power-of-two groupings aren't available.";
  }
}

export const CONCEPT_PAIRS: ConceptPair[] = [
  { from: 2, to: 10, label: "Binary → Decimal", desc: "Powers of two expansion and summation.", sample: "1011", badge: "Core", category: "direct" },
  { from: 10, to: 2, label: "Decimal → Binary", desc: "Repeated division by 2; remainders read backwards.", sample: "13", badge: "Core", category: "direct" },
  { from: 16, to: 10, label: "Hex → Decimal", desc: "Powers of 16 with letters A–F mapped to 10–15.", sample: "1F", badge: "Popular", category: "direct" },
  { from: 10, to: 16, label: "Decimal → Hex", desc: "Repeated division by 16; remainders 10–15 become A–F.", sample: "254", badge: "Popular", category: "direct" },
  { from: 2, to: 16, label: "Binary → Hex", desc: "Fast 4-bit nibble grouping or decimal bridge.", sample: "11011110", badge: "Shortcut", category: "shortcut" },
  { from: 16, to: 2, label: "Hex → Binary", desc: "Direct 4-bit expansion per hex digit.", sample: "B5", badge: "Shortcut", category: "shortcut" },
  { from: 8, to: 10, label: "Octal → Decimal", desc: "Powers of eight expansion.", sample: "73", badge: "Classic", category: "direct" },
  { from: 10, to: 8, label: "Decimal → Octal", desc: "Repeated division by 8.", sample: "89", badge: "Classic", category: "direct" },
  { from: 2, to: 8, label: "Binary → Octal", desc: "Fast 3-bit octet grouping.", sample: "101110", badge: "Shortcut", category: "shortcut" },
  { from: 8, to: 16, label: "Octal → Hex", desc: "Convert through decimal or 3-bit/4-bit binary bridge.", sample: "377", badge: "Advanced", category: "decimal-bridge" }
];

export function generatePracticeProblem(difficulty: Difficulty): PracticeProblem {
  let fromBase: Base = 10;
  let toBase: Base = 2;
  let val = "13";

  if (difficulty === "Beginner") {
    const pairs: [Base, Base][] = [[10, 2], [2, 10], [10, 8], [8, 10]];
    const [fb, tb] = pairs[Math.floor(Math.random() * pairs.length)];
    fromBase = fb;
    toBase = tb;
    const num = Math.floor(Math.random() * 30) + 3; // 3 to 32
    val = num.toString(fromBase).toUpperCase();
  } else if (difficulty === "Intermediate") {
    const pairs: [Base, Base][] = [[10, 16], [16, 10], [2, 16], [16, 2], [2, 8]];
    const [fb, tb] = pairs[Math.floor(Math.random() * pairs.length)];
    fromBase = fb;
    toBase = tb;
    const num = Math.floor(Math.random() * 180) + 20; // 20 to 199
    val = num.toString(fromBase).toUpperCase();
  } else {
    // Advanced
    const pairs: [Base, Base][] = [[8, 16], [16, 8], [16, 2], [2, 16], [10, 16]];
    const [fb, tb] = pairs[Math.floor(Math.random() * pairs.length)];
    fromBase = fb;
    toBase = tb;
    const num = Math.floor(Math.random() * 800) + 120; // 120 to 920
    val = num.toString(fromBase).toUpperCase();
  }

  const c = convert(val, fromBase, toBase);

  return {
    id: Math.random().toString(36).substring(2, 9),
    fromBase,
    toBase,
    value: val,
    result: c.result,
    difficulty,
    hint: getBaseShortcutTip(fromBase, toBase),
    steps: c.steps
  };
}

// Web Audio API tactile mechanical click synthesizer
let audioCtx: AudioContext | null = null;

export function playTactileClick(frequency = 800, type: OscillatorType = "sine", duration = 0.03): void {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Audio contexts can be blocked if user hasn't interacted
  }
}

export function playSuccessChime(): void {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const startTime = audioCtx.currentTime + i * 0.08;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  } catch {
    // Ignore audio permission error
  }
}
