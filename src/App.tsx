import { useState, useEffect, useCallback } from 'react';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { ScientificPanel } from './components/ScientificPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { AngleUnit, CalculatorMode, HistoryItem, KeyButtonDef } from './types';
import { evaluateExpression } from './utils/calculatorEngine';

const STORAGE_KEY_HISTORY = 'calculator_history_v1';
const STORAGE_KEY_MEMORY = 'calculator_memory_v1';

export default function App() {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MEMORY);
    return saved ? parseFloat(saved) : 0;
  });
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('DEG');
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [activeKeyId, setActiveKeyId] = useState<string | null>(null);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }, [history]);

  // Save memory to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MEMORY, memory.toString());
  }, [memory]);

  // Live evaluation preview
  useEffect(() => {
    if (!expression || isEvaluated) return;
    const evalRes = evaluateExpression(expression, angleUnit);
    if (!evalRes.error && evalRes.result) {
      setResult(evalRes.result);
    }
  }, [expression, angleUnit, isEvaluated]);

  const handleEvaluate = useCallback(() => {
    if (!expression) return;
    const evalRes = evaluateExpression(expression, angleUnit);
    
    setResult(evalRes.result);
    setIsEvaluated(true);

    if (!evalRes.error && evalRes.result !== 'Error') {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression,
        result: evalRes.result,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 49)]); // Keep last 50
    }
  }, [expression, angleUnit]);

  const handleClear = useCallback(() => {
    setExpression('');
    setResult('0');
    setIsEvaluated(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (isEvaluated) {
      setExpression('');
      setResult('0');
      setIsEvaluated(false);
      return;
    }
    
    if (!expression) return;

    // Remove function blocks if ending with a function like 'asin(' or 'sin('
    const fnMatch = expression.match(/(asin\(|acos\(|atan\(|sin\(|cos\(|tan\(|log\(|ln\(|sqrt\(|cbrt\()$/);
    if (fnMatch) {
      setExpression((prev) => prev.slice(0, prev.length - fnMatch[0].length));
      return;
    }

    setExpression((prev) => prev.slice(0, -1));
  }, [expression, isEvaluated]);

  const handleKeyPress = useCallback((keyDef: KeyButtonDef) => {
    // Flash key UI highlight
    setActiveKeyId(keyDef.id);
    setTimeout(() => setActiveKeyId(null), 150);

    const { id, type, value, label } = keyDef;

    // Handle Equals
    if (type === 'equals') {
      handleEvaluate();
      return;
    }

    // Handle Clear
    if (id === 'btn-clear') {
      handleClear();
      return;
    }

    // Handle Backspace
    if (id === 'btn-backspace') {
      handleBackspace();
      return;
    }

    // Handle Toggle Plus/Minus ±
    if (id === 'btn-plusminus') {
      if (!expression && result && result !== '0') {
        const negated = result.startsWith('-') ? result.slice(1) : `-${result}`;
        setExpression(negated);
        setResult(negated);
        return;
      }
      if (!expression) return;

      // If expression ends with a digit sequence, toggle minus
      if (/(-?\d+(?:\.\d+)?)$/.test(expression)) {
        setExpression((prev) =>
          prev.replace(/(-?\d+(?:\.\d+)?)$/, (match) => {
            return match.startsWith('-') ? match.slice(1) : `-${match}`;
          })
        );
      } else {
        setExpression((prev) => `${prev}-`);
      }
      return;
    }

    // Handle Memory operations
    if (type === 'memory') {
      const currentNum = parseFloat(result.replace(/,/g, '')) || 0;
      switch (id) {
        case 'btn-mem-mc':
          setMemory(0);
          break;
        case 'btn-mem-mr':
          if (isEvaluated) {
            setExpression(memory.toString());
            setIsEvaluated(false);
          } else {
            setExpression((prev) => `${prev}${memory}`);
          }
          break;
        case 'btn-mem-mplus':
          setMemory((prev) => prev + currentNum);
          break;
        case 'btn-mem-mminus':
          setMemory((prev) => prev - currentNum);
          break;
        case 'btn-mem-ms':
          setMemory(currentNum);
          break;
      }
      return;
    }

    // Handle DEG/RAD in scientific panel
    if (id === 'btn-sci-deg-rad') {
      setAngleUnit((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
      return;
    }

    // Handle digits, operators, scientific inputs
    let valToAppend = value || label;

    if (isEvaluated) {
      // If user presses an operator right after evaluation, chain the previous result
      if (['+', '−', '×', '÷', '^', '%', '!'].includes(valToAppend)) {
        const cleanedResult = result.replace(/,/g, '');
        if (cleanedResult !== 'Error' && cleanedResult !== 'Syntax Error') {
          setExpression(`${cleanedResult}${valToAppend}`);
        } else {
          setExpression(valToAppend);
        }
      } else {
        // Start fresh expression
        setExpression(valToAppend);
      }
      setIsEvaluated(false);
      return;
    }

    // Prevent multiple consecutive decimal points in same token
    if (valToAppend === '.') {
      const lastNumberToken = expression.split(/[\+\−\×\÷\^\(\)]/).pop() || '';
      if (lastNumberToken.includes('.')) return;
    }

    setExpression((prev) => `${prev}${valToAppend}`);
  }, [expression, result, isEvaluated, memory, handleEvaluate, handleClear, handleBackspace]);

  // Global Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input fields if any
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key;

      if (key >= '0' && key <= '9') {
        e.preventDefault();
        handleKeyPress({ id: `btn-${key}`, label: key, value: key, type: 'digit' });
      } else if (key === '.') {
        e.preventDefault();
        handleKeyPress({ id: 'btn-decimal', label: '.', value: '.', type: 'digit' });
      } else if (key === '+') {
        e.preventDefault();
        handleKeyPress({ id: 'btn-add', label: '+', value: '+', type: 'operator' });
      } else if (key === '-') {
        e.preventDefault();
        handleKeyPress({ id: 'btn-subtract', label: '−', value: '−', type: 'operator' });
      } else if (key === '*') {
        e.preventDefault();
        handleKeyPress({ id: 'btn-multiply', label: '×', value: '×', type: 'operator' });
      } else if (key === '/') {
        e.preventDefault();
        handleKeyPress({ id: 'btn-divide', label: '÷', value: '÷', type: 'operator' });
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleKeyPress({ id: 'btn-equals', label: '=', type: 'equals' });
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleKeyPress({ id: 'btn-backspace', label: '⌫', type: 'action' });
      } else if (key === 'Escape') {
        e.preventDefault();
        handleKeyPress({ id: 'btn-clear', label: 'C', type: 'action' });
      } else if (key === '(') {
        e.preventDefault();
        handleKeyPress({ id: 'btn-sci-lparen', label: '(', value: '(', type: 'scientific' });
      } else if (key === ')') {
        e.preventDefault();
        handleKeyPress({ id: 'btn-sci-rparen', label: ')', value: ')', type: 'scientific' });
      } else if (key === '^') {
        e.preventDefault();
        handleKeyPress({ id: 'btn-sci-pow-y', label: 'xʸ', value: '^', type: 'scientific' });
      } else if (key === '%') {
        e.preventDefault();
        handleKeyPress({ id: 'btn-percent', label: '%', value: '%', type: 'operator' });
      } else if (key === '!') {
        e.preventDefault();
        handleKeyPress({ id: 'btn-sci-fact', label: 'x!', value: '!', type: 'scientific' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setExpression(item.result);
    setResult(item.result);
    setIsEvaluated(true);
    setShowHistory(false);
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 selection:bg-indigo-500 selection:text-white">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 -z-10" />

      {/* Main Container Card */}
      <div
        id="calculator-app-card"
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300"
      >
        {/* Top Display */}
        <Display
          expression={expression}
          result={result}
          angleUnit={angleUnit}
          mode={mode}
          memoryActive={memory !== 0}
          isEvaluated={isEvaluated}
          historyCount={history.length}
          onToggleAngleUnit={() => setAngleUnit((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'))}
          onToggleMode={() => setMode((prev) => (prev === 'standard' ? 'scientific' : 'standard'))}
          onToggleHistory={() => setShowHistory((prev) => !prev)}
          showHistory={showHistory}
        />

        {/* Overlay History Drawer */}
        <HistoryPanel
          history={history}
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onClear={() => setHistory([])}
          onSelectHistoryItem={handleSelectHistoryItem}
        />

        {/* Keypad section */}
        <div className="p-2 sm:p-3 bg-slate-900 flex-1 flex flex-col justify-end">
          {/* Scientific Panel conditionally shown if mode === 'scientific' */}
          {mode === 'scientific' && (
            <ScientificPanel
              onKeyPress={handleKeyPress}
              activeKeyId={activeKeyId}
            />
          )}

          {/* Main Keypad */}
          <Keypad
            onKeyPress={handleKeyPress}
            activeKeyId={activeKeyId}
            hasInput={expression.length > 0}
          />
        </div>

        {/* Minimal Footer */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 text-center text-[11px] text-slate-500 font-sans flex items-center justify-between">
          <span>Keyboard active</span>
          <span className="font-mono text-[10px] text-slate-600">Enter = solve | Esc = clear</span>
        </div>
      </div>
    </div>
  );
}
