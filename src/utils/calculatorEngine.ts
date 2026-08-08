import { AngleUnit } from '../types';

export function formatResultNumber(num: number): string {
  if (isNaN(num)) return 'Error';
  if (!isFinite(num)) {
    return num > 0 ? 'Infinity' : '-Infinity';
  }

  // Handle precision issues like 0.1 + 0.2 = 0.30000000000000004
  const precisionClean = parseFloat(num.toPrecision(12));

  // If the number is zero
  if (Math.abs(precisionClean) < 1e-12 && precisionClean !== 0) {
    return precisionClean.toExponential(4);
  }

  // Check if number is very large or very small
  if (Math.abs(precisionClean) >= 1e12 || (Math.abs(precisionClean) < 1e-6 && precisionClean !== 0)) {
    return precisionClean.toExponential(6).replace(/\+/, '');
  }

  // Format with thousand separators if sensible, otherwise string
  const str = precisionClean.toString();
  const parts = str.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function cleanExpressionForDisplay(expr: string): string {
  return expr
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' ÷ ')
    .replace(/\+/g, ' + ')
    .replace(/-/g, ' - ')
    .replace(/\^/g, ' ^ ')
    .replace(/\s+/g, ' ')
    .trim();
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // Overflow boundary for double precision
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export function evaluateExpression(expression: string, angleUnit: AngleUnit = 'DEG'): { result: string; numericValue: number; error?: string } {
  if (!expression || expression.trim() === '') {
    return { result: '0', numericValue: 0 };
  }

  try {
    // Sanitize and prepare expression for evaluation
    let sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, ' Math.PI ')
      .replace(/e(?![a-zA-Z0-9_])/g, ' Math.E ');

    // Handle percentage (e.g., 50% -> (50/100))
    // Replace trailing % or % after digits
    sanitized = sanitized.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

    // Implicit multiplication: e.g., 2(3) -> 2*(3), 2Math.PI -> 2*Math.PI, (2)(3) -> (2)*(3)
    sanitized = sanitized
      .replace(/(\d|\))\s*(\(|Math\.PI|Math\.E|sin|cos|tan|asin|acos|atan|log|ln|sqrt)/g, '$1*$2')
      .replace(/(Math\.PI|Math\.E)\s*(\d|\()/g, '$1*$2');

    // Tokenize / Replace mathematical functions with JS Math calls or safe helper functions
    const isDeg = angleUnit === 'DEG';
    const degToRad = (deg: number) => (deg * Math.PI) / 180;
    const radToDeg = (rad: number) => (rad * 180) / Math.PI;

    // We can define custom math context functions
    const ctx = {
      sin: (x: number) => {
        const rad = isDeg ? degToRad(x) : x;
        const val = Math.sin(rad);
        return Math.abs(val) < 1e-15 ? 0 : val;
      },
      cos: (x: number) => {
        const rad = isDeg ? degToRad(x) : x;
        const val = Math.cos(rad);
        return Math.abs(val) < 1e-15 ? 0 : val;
      },
      tan: (x: number) => {
        const rad = isDeg ? degToRad(x) : x;
        if (isDeg && Math.abs((x % 180)) === 90) return NaN;
        return Math.tan(rad);
      },
      asin: (x: number) => {
        const val = Math.asin(x);
        return isDeg ? radToDeg(val) : val;
      },
      acos: (x: number) => {
        const val = Math.acos(x);
        return isDeg ? radToDeg(val) : val;
      },
      atan: (x: number) => {
        const val = Math.atan(x);
        return isDeg ? radToDeg(val) : val;
      },
      log: (x: number) => Math.log10(x),
      ln: (x: number) => Math.log(x),
      sqrt: (x: number) => Math.sqrt(x),
      cbrt: (x: number) => Math.cbrt(x),
      abs: (x: number) => Math.abs(x),
      fact: (x: number) => factorial(x),
      pow: (x: number, y: number) => Math.pow(x, y),
      PI: Math.PI,
      E: Math.E,
    };

    // Replace factorials like 5! -> fact(5)
    // Supports (expr)! or digit!
    let factProcessed = sanitized;
    const factRegex = /(\d+(?:\.\d+)?|\([^\(\)]+\))!/g;
    while (factRegex.test(factProcessed)) {
      factProcessed = factProcessed.replace(factRegex, 'ctx.fact($1)');
    }

    // Replace function names
    let jsExpr = factProcessed
      .replace(/\bsin\b/g, 'ctx.sin')
      .replace(/\bcos\b/g, 'ctx.cos')
      .replace(/\btan\b/g, 'ctx.tan')
      .replace(/\basin\b/g, 'ctx.asin')
      .replace(/\bacos\b/g, 'ctx.acos')
      .replace(/\batan\b/g, 'ctx.atan')
      .replace(/\blog\b/g, 'ctx.log')
      .replace(/\bln\b/g, 'ctx.ln')
      .replace(/\bsqrt\b/g, 'ctx.sqrt')
      .replace(/\bcbrt\b/g, 'ctx.cbrt')
      .replace(/\babs\b/g, 'ctx.abs')
      .replace(/Math\.PI/g, 'ctx.PI')
      .replace(/Math\.E/g, 'ctx.E');

    // Exponentiation ^ replacement to pow or Math.pow operator
    // Standard JS supports ** for exponentiation
    jsExpr = jsExpr.replace(/\^/g, '**');

    // Safe execution using Function constructor with restricted scope
    const evalFunc = new Function('ctx', `"use strict"; return (${jsExpr});`);
    const numericResult = Number(evalFunc(ctx));

    if (isNaN(numericResult)) {
      return { result: 'Domain Error', numericValue: NaN, error: 'Invalid operation' };
    }

    if (!isFinite(numericResult)) {
      return { result: 'Cannot divide by zero', numericValue: numericResult, error: 'Division by zero' };
    }

    return {
      result: formatResultNumber(numericResult),
      numericValue: numericResult,
    };
  } catch (err) {
    return {
      result: 'Syntax Error',
      numericValue: NaN,
      error: err instanceof Error ? err.message : 'Invalid expression',
    };
  }
}
