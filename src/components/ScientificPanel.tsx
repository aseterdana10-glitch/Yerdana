import React, { useState } from 'react';
import { motion } from 'motion/react';
import { KeyButtonDef } from '../types';

interface ScientificPanelProps {
  onKeyPress: (keyDef: KeyButtonDef) => void;
  activeKeyId?: string | null;
}

export const ScientificPanel: React.FC<ScientificPanelProps> = ({
  onKeyPress,
  activeKeyId,
}) => {
  const [isSecond, setIsSecond] = useState(false);

  const handleButtonClick = (button: KeyButtonDef) => {
    onKeyPress(button);
  };

  const buttons: KeyButtonDef[] = [
    // Row 1
    {
      id: 'btn-sci-2nd',
      label: '2nd',
      type: 'action',
      className: isSecond
        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
        : 'bg-slate-800 text-amber-400 hover:bg-slate-700 border-slate-700/60',
    },
    {
      id: 'btn-sci-deg-rad',
      label: 'DEG/RAD',
      type: 'action',
      className: 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700/60',
    },
    {
      id: 'btn-sci-fact',
      label: 'x!',
      value: '!',
      type: 'scientific',
      className: 'bg-slate-800/80 text-amber-300 hover:bg-slate-700 border-slate-700/60',
    },
    {
      id: 'btn-sci-lparen',
      label: '(',
      value: '(',
      type: 'scientific',
      className: 'bg-slate-800/80 text-indigo-300 hover:bg-slate-700 border-slate-700/60',
      shortcut: '(',
    },
    {
      id: 'btn-sci-rparen',
      label: ')',
      value: ')',
      type: 'scientific',
      className: 'bg-slate-800/80 text-indigo-300 hover:bg-slate-700 border-slate-700/60',
      shortcut: ')',
    },

    // Row 2
    {
      id: 'btn-sci-sin',
      label: isSecond ? 'sin⁻¹' : 'sin',
      value: isSecond ? 'asin(' : 'sin(',
      type: 'scientific',
      className: 'bg-slate-800/80 text-cyan-300 hover:bg-slate-700 border-slate-700/60',
    },
    {
      id: 'btn-sci-cos',
      label: isSecond ? 'cos⁻¹' : 'cos',
      value: isSecond ? 'acos(' : 'acos(',
      type: 'scientific',
      className: 'bg-slate-800/80 text-cyan-300 hover:bg-slate-700 border-slate-700/60',
    },
    {
      id: 'btn-sci-tan',
      label: isSecond ? 'tan⁻¹' : 'tan',
      value: isSecond ? 'atan(' : 'tan(',
      type: 'scientific',
      className: 'bg-slate-800/80 text-cyan-300 hover:bg-slate-700 border-slate-700/60',
    },
    {
      id: 'btn-sci-pi',
      label: 'π',
      value: 'π',
      type: 'scientific',
      className: 'bg-slate-800/80 text-emerald-300 hover:bg-slate-700 border-slate-700/60',
    },
    {
      id: 'btn-sci-e',
      label: 'e',
      value: 'e',
      type: 'scientific',
      className: 'bg-slate-800/80 text-emerald-300 hover:bg-slate-700 border-slate-700/60',
    },

    // Row 3
    {
      id: 'btn-sci-pow2',
      label: isSecond ? 'x³' : 'x²',
      value: isSecond ? '^3' : '^2',
      type: 'scientific',
      className: 'bg-slate-800/80 text-indigo-300 hover:bg-slate-700 border-slate-700/60',
    },
    {
      id: 'btn-sci-pow-y',
      label: 'xʸ',
      value: '^',
      type: 'scientific',
      className: 'bg-slate-800/80 text-indigo-300 hover:bg-slate-700 border-slate-700/60',
      shortcut: '^',
    },
    {
      id: 'btn-sci-sqrt',
      label: isSecond ? '∛x' : '√x',
      value: isSecond ? 'cbrt(' : 'sqrt(',
      type: 'scientific',
      className: 'bg-slate-800/80 text-indigo-300 hover:bg-slate-700 border-slate-700/60',
    },
    {
      id: 'btn-sci-ln',
      label: isSecond ? 'eˣ' : 'ln',
      value: isSecond ? 'e^' : 'ln(',
      type: 'scientific',
      className: 'bg-slate-800/80 text-cyan-300 hover:bg-slate-700 border-slate-700/60',
    },
    {
      id: 'btn-sci-log',
      label: isSecond ? '10ˣ' : 'log',
      value: isSecond ? '10^' : 'log(',
      type: 'scientific',
      className: 'bg-slate-800/80 text-cyan-300 hover:bg-slate-700 border-slate-700/60',
    },
  ];

  return (
    <div id="scientific-keypad-panel" className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 mb-3 transition-all">
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {buttons.map((btn) => {
          const isActive = activeKeyId === btn.id;

          return (
            <motion.button
              key={btn.id}
              id={btn.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                if (btn.id === 'btn-sci-2nd') {
                  setIsSecond(!isSecond);
                } else {
                  handleButtonClick(btn);
                }
              }}
              className={`py-2 px-1 rounded-lg text-xs sm:text-sm font-semibold font-mono border transition-colors shadow-sm flex items-center justify-center select-none ${
                btn.className
              } ${isActive ? 'ring-2 ring-indigo-400 bg-indigo-600 text-white' : ''}`}
            >
              {btn.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
