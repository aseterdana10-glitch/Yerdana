import React from 'react';
import { motion } from 'motion/react';
import { Delete } from 'lucide-react';
import { KeyButtonDef } from '../types';

interface KeypadProps {
  onKeyPress: (keyDef: KeyButtonDef) => void;
  activeKeyId?: string | null;
  hasInput: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onKeyPress,
  activeKeyId,
  hasInput,
}) => {
  const memoryButtons: KeyButtonDef[] = [
    { id: 'btn-mem-mc', label: 'MC', type: 'memory', className: 'text-amber-400 hover:bg-slate-800' },
    { id: 'btn-mem-mr', label: 'MR', type: 'memory', className: 'text-amber-400 hover:bg-slate-800' },
    { id: 'btn-mem-mplus', label: 'M+', type: 'memory', className: 'text-amber-400 hover:bg-slate-800' },
    { id: 'btn-mem-mminus', label: 'M-', type: 'memory', className: 'text-amber-400 hover:bg-slate-800' },
    { id: 'btn-mem-ms', label: 'MS', type: 'memory', className: 'text-amber-400 hover:bg-slate-800' },
  ];

  const mainButtons: KeyButtonDef[] = [
    // Row 1
    {
      id: 'btn-clear',
      label: hasInput ? 'C' : 'AC',
      type: 'action',
      className: 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border-rose-500/30 font-bold',
      shortcut: 'Escape',
    },
    {
      id: 'btn-backspace',
      label: '⌫',
      type: 'action',
      className: 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700/60',
      shortcut: 'Backspace',
    },
    {
      id: 'btn-percent',
      label: '%',
      value: '%',
      type: 'operator',
      className: 'bg-slate-800 text-amber-400 hover:bg-slate-700 border-slate-700/60 font-semibold',
      shortcut: '%',
    },
    {
      id: 'btn-divide',
      label: '÷',
      value: '÷',
      type: 'operator',
      className: 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-amber-500/30 font-bold text-lg sm:text-xl',
      shortcut: '/',
    },

    // Row 2
    { id: 'btn-7', label: '7', value: '7', type: 'digit', className: 'bg-slate-800/90 text-slate-100 hover:bg-slate-700/90 border-slate-700/60 font-semibold text-lg sm:text-xl', shortcut: '7' },
    { id: 'btn-8', label: '8', value: '8', type: 'digit', className: 'bg-slate-800/90 text-slate-100 hover:bg-slate-700/90 border-slate-700/60 font-semibold text-lg sm:text-xl', shortcut: '8' },
    { id: 'btn-9', label: '9', value: '9', type: 'digit', className: 'bg-slate-800/90 text-slate-100 hover:bg-slate-700/90 border-slate-700/60 font-semibold text-lg sm:text-xl', shortcut: '9' },
    {
      id: 'btn-multiply',
      label: '×',
      value: '×',
      type: 'operator',
      className: 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-amber-500/30 font-bold text-lg sm:text-xl',
      shortcut: '*',
    },

    // Row 3
    { id: 'btn-4', label: '4', value: '4', type: 'digit', className: 'bg-slate-800/90 text-slate-100 hover:bg-slate-700/90 border-slate-700/60 font-semibold text-lg sm:text-xl', shortcut: '4' },
    { id: 'btn-5', label: '5', value: '5', type: 'digit', className: 'bg-slate-800/90 text-slate-100 hover:bg-slate-700/90 border-slate-700/60 font-semibold text-lg sm:text-xl', shortcut: '5' },
    { id: 'btn-6', label: '6', value: '6', type: 'digit', className: 'bg-slate-800/90 text-slate-100 hover:bg-slate-700/90 border-slate-700/60 font-semibold text-lg sm:text-xl', shortcut: '6' },
    {
      id: 'btn-subtract',
      label: '−',
      value: '−',
      type: 'operator',
      className: 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-amber-500/30 font-bold text-lg sm:text-xl',
      shortcut: '-',
    },

    // Row 4
    { id: 'btn-1', label: '1', value: '1', type: 'digit', className: 'bg-slate-800/90 text-slate-100 hover:bg-slate-700/90 border-slate-700/60 font-semibold text-lg sm:text-xl', shortcut: '1' },
    { id: 'btn-2', label: '2', value: '2', type: 'digit', className: 'bg-slate-800/90 text-slate-100 hover:bg-slate-700/90 border-slate-700/60 font-semibold text-lg sm:text-xl', shortcut: '2' },
    { id: 'btn-3', label: '3', value: '3', type: 'digit', className: 'bg-slate-800/90 text-slate-100 hover:bg-slate-700/90 border-slate-700/60 font-semibold text-lg sm:text-xl', shortcut: '3' },
    {
      id: 'btn-add',
      label: '+',
      value: '+',
      type: 'operator',
      className: 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-amber-500/30 font-bold text-lg sm:text-xl',
      shortcut: '+',
    },

    // Row 5
    {
      id: 'btn-plusminus',
      label: '±',
      type: 'action',
      className: 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700/60 font-semibold',
    },
    { id: 'btn-0', label: '0', value: '0', type: 'digit', className: 'bg-slate-800/90 text-slate-100 hover:bg-slate-700/90 border-slate-700/60 font-semibold text-lg sm:text-xl', shortcut: '0' },
    { id: 'btn-decimal', label: '.', value: '.', type: 'digit', className: 'bg-slate-800/90 text-slate-100 hover:bg-slate-700/90 border-slate-700/60 font-bold text-xl', shortcut: '.' },
    {
      id: 'btn-equals',
      label: '=',
      type: 'equals',
      className: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl shadow-lg shadow-indigo-600/30 border-indigo-500',
      shortcut: 'Enter',
    },
  ];

  return (
    <div id="calculator-keypad-container" className="flex flex-col gap-3 p-4 bg-slate-900 rounded-b-2xl">
      {/* Memory Bar */}
      <div id="memory-buttons-row" className="grid grid-cols-5 gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/60">
        {memoryButtons.map((memBtn) => {
          const isActive = activeKeyId === memBtn.id;
          return (
            <motion.button
              key={memBtn.id}
              id={memBtn.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => onKeyPress(memBtn)}
              className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all border border-transparent ${
                memBtn.className
              } ${isActive ? 'bg-amber-500 text-slate-950' : ''}`}
            >
              {memBtn.label}
            </motion.button>
          );
        })}
      </div>

      {/* Main Standard Grid */}
      <div id="main-keypad-grid" className="grid grid-cols-4 gap-2">
        {mainButtons.map((btn) => {
          const isActive = activeKeyId === btn.id;

          return (
            <motion.button
              key={btn.id}
              id={btn.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => onKeyPress(btn)}
              className={`h-12 sm:h-14 rounded-xl flex items-center justify-center font-mono border transition-all duration-150 select-none shadow-sm ${
                btn.className
              } ${isActive ? 'ring-2 ring-indigo-400 bg-indigo-500 text-white' : ''}`}
            >
              {btn.label === '⌫' ? <Delete className="w-5 h-5" /> : btn.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
