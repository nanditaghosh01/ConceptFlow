export type Base = 2 | 8 | 10 | 16;

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type StepType =
  | 'expand-digit'
  | 'expand-sum'
  | 'divide'
  | 'divide-result'
  | 'divide-zero'
  | 'bridge'
  | 'trivial'
  | 'group-nibble'
  | 'group-result';

export interface DivisionRow {
  dividend: number;
  quotient: number;
  remainder: number;
  digit: string;
}

export interface ConversionStep {
  idx: number;
  type: StepType;
  phase: 'to-decimal' | 'from-decimal' | 'bridge' | 'same' | 'direct-group';
  title: string;
  detail: string;
  digitIndex?: number;
  result?: string | number;
  highlightDigits?: number[];
  formula?: string;
}

export interface GroupingData {
  groupSize: number;
  groups: {
    rawBits: string;
    targetDigit: string;
    decimalVal: number;
  }[];
}

export interface ConversionResult {
  error?: string;
  input: string;
  fromBase: Base;
  toBase: Base;
  result: string;
  steps: ConversionStep[];
  digits?: string[];
  contributions?: number[];
  rows?: DivisionRow[];
  groupingData?: GroupingData;
}

export interface PracticeProblem {
  id: string;
  fromBase: Base;
  toBase: Base;
  value: string;
  result: string;
  difficulty: Difficulty;
  hint: string;
  steps: ConversionStep[];
}

export interface ConceptPair {
  from: Base;
  to: Base;
  label: string;
  desc: string;
  sample: string;
  badge: string;
  category: 'direct' | 'decimal-bridge' | 'shortcut';
}
