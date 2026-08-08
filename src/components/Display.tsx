import React, { useState } from 'react';
import { Copy, Check, History, Calculator as CalcIcon, FlaskConical, CornerDownLeft } from 'lucide-react';
import { AngleUnit, CalculatorMode } from '../types';

interface DisplayProps {
  expression: string;
  result: string;
  angleUnit: AngleUnit;
  mode: CalculatorMode;
  memoryActive: boolean;
  isEvaluated: boolean;
  historyCount: number;
  onToggleAngleUnit: () => void;
  onToggleMode: () => void;
  onToggleHistory: () => void;
  showHistory: boolean;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  angleUnit,
  mode,
  memoryActive,
  isEvaluated,
  historyCount,
  onToggleAngleUnit,
  onToggleMode,
  onToggleHistory,
  showHistory,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = result && result !== 'Error' && result !== 'Syntax Error' ? result : expression;
    if (!textToCopy) return;
    
    // Clean formatted result before copying (remove thousand separators for plain copying)
    const plainText = textToCopy.replace(/,/g, '');
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div id="calculator-display-container" className="bg-slate-900 text-slate-100 p-5 rounded-t-2xl border-b border-slate-800 flex flex-col justify-between shadow-inner transition-colors duration-200">
      {/* Header controls bar */}
      <div id="calculator-header-bar" className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          {/* Scientific vs Standard Mode Toggle */}
          <button
            id="btn-toggle-mode"
            onClick={onToggleMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              mode === 'scientific'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Scientific Mode"
          >
            {mode === 'scientific' ? <FlaskConical className="w-3.5 h-3.5" /> : <CalcIcon className="w-3.5 h-3.5" />}
            <span>{mode === 'scientific' ? 'Scientific' : 'Standard'}</span>
          </button>

          {/* DEG / RAD toggle (only relevant or highlighted in scientific, but useful anytime) */}
          <button
            id="btn-toggle-angle"
            onClick={onToggleAngleUnit}
            className={`px-2 py-1 rounded-md text-xs font-semibold tracking-wider transition-colors ${
              angleUnit === 'DEG'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
            }`}
            title={`Switch to ${angleUnit === 'DEG' ? 'Radians (RAD)' : 'Degrees (DEG)'}`}
          >
            {angleUnit}
          </button>

          {/* Memory Indicator */}
          {memoryActive && (
            <span
              id="memory-indicator-badge"
              className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest bg-amber-500 text-slate-950 uppercase animate-pulse"
              title="Memory stored (M)"
            >
              M
            </span>
          )}
        </div>

        {/* History Toggle & Copy Button */}
        <div className="flex items-center gap-1">
          <button
            id="btn-copy-result"
            onClick={handleCopy}
            disabled={!result && !expression}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors relative"
            title="Copy Result"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied && (
              <span className="absolute -top-7 right-0 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow">
                Copied!
              </span>
            )}
          </button>

          <button
            id="btn-toggle-history-panel"
            onClick={onToggleHistory}
            className={`p-1.5 rounded-lg transition-colors relative ${
              showHistory
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
            title="Calculation History"
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && !showHistory && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Screen Area */}
      <div id="calculator-screen-area" className="flex flex-col items-end justify-end min-h-[96px] text-right overflow-x-auto select-text pr-1 scrollbar-none">
        {/* Upper expression / formula line */}
        <div
          id="calculator-expression-line"
          className="text-slate-400 text-sm font-mono tracking-wide mb-1 break-all max-w-full min-h-[20px] transition-all"
        >
          {expression ? (
            <div className="flex items-center justify-end gap-1">
              <span>{expression}</span>
              {isEvaluated && <CornerDownLeft className="w-3 h-3 text-emerald-500 inline shrink-0" />}
            </div>
          ) : (
            <span className="opacity-0">0</span>
          )}
        </div>

        {/* Main large result line */}
        <div
          id="calculator-result-line"
          className={`font-mono font-bold tracking-tight text-right w-full break-all transition-all ${
            result.length > 16
              ? 'text-2xl sm:text-3xl'
              : result.length > 10
              ? 'text-3xl sm:text-4xl'
              : 'text-4xl sm:text-5xl'
          } ${
            result.includes('Error') || result.includes('Cannot')
              ? 'text-rose-400 font-sans text-2xl sm:text-3xl'
              : 'text-slate-100'
          }`}
        >
          {result || '0'}
        </div>
      </div>
    </div>
  );
};
