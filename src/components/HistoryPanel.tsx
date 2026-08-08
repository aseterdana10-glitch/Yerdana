import React from 'react';
import { History, Trash2, X, ArrowUpRight } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  onSelectHistoryItem: (item: HistoryItem) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  isOpen,
  onClose,
  onClear,
  onSelectHistoryItem,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="history-panel-overlay"
      className="absolute inset-0 z-20 bg-slate-900/95 backdrop-blur-md rounded-2xl flex flex-col p-4 border border-slate-700/50 shadow-2xl transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <History className="w-4 h-4 text-indigo-400" />
          <span>Calculation History</span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
            {history.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <button
              id="btn-clear-history"
              onClick={onClear}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Clear all history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            id="btn-close-history"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            title="Close history"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
            <History className="w-8 h-8 stroke-1 mb-2 opacity-50" />
            <p className="text-sm font-medium">No calculation history yet</p>
            <p className="text-xs opacity-70 mt-1">Calculations will appear here as you solve</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              className="w-full text-right p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 hover:border-indigo-500/40 transition-all group flex flex-col items-end gap-1"
            >
              <div className="flex items-center justify-between w-full text-xs text-slate-400 font-mono">
                <span className="text-[10px] text-slate-500">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <div className="flex items-center gap-1 group-hover:text-indigo-400">
                  <span>{item.expression} =</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="text-lg font-mono font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                {item.result}
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer hint */}
      {history.length > 0 && (
        <div className="pt-2 border-t border-slate-800 text-center text-[11px] text-slate-500">
          Click any calculation to reuse its result in your math
        </div>
      )}
    </div>
  );
};
