export type AngleUnit = 'DEG' | 'RAD';

export type CalculatorMode = 'standard' | 'scientific';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type ButtonType = 'digit' | 'operator' | 'action' | 'scientific' | 'memory' | 'equals';

export interface KeyButtonDef {
  id: string;
  label: string;
  subLabel?: string;
  type: ButtonType;
  value?: string;
  className?: string;
  ariaLabel?: string;
  shortcut?: string;
}
