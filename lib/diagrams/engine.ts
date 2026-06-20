// 图示渲染引擎 —— 纯函数，无 DOM 依赖。
// 负责：数学表达式求值、数据坐标↔像素坐标映射、曲线采样成 SVG path、
// 以及把 LaTeX 标注转成可直接放进 SVG <text> 的 Unicode。
//
// 设计目标：内容 JSON 里的 parameters（expr / 端点 / 区间 / 阈值等）能被
// 程序化地画成正确的图，而不是退化成一段说明文字。

/* ----------------------------------------------------------------
   配色（与 globals.css 主题一致：暖纸张 + 墨黑 + 暗红 + 金 + teal）
----------------------------------------------------------------- */
export const PALETTE = {
  ink: "#211c16",
  inkSoft: "#6c6151",
  inkFaint: "#b7ab92",
  accent: "#8a2b2b",
  accentDeep: "#5f1d1d",
  gold: "#9c7a2d",
  curve: "#2f6f68",
  curve2: "#9c7a2d",
  curve3: "#8a2b2b",
  paperSunk: "#efe7d6",
  paperPage: "#fbf7ee",
} as const;

export const CURVE_COLORS = [PALETTE.curve, PALETTE.curve2, PALETTE.accent, PALETTE.ink];

/* ----------------------------------------------------------------
   表达式求值：tokenize → shunting-yard(RPN) → eval
   支持 + - * / ^、一元负号、括号、变量 x，
   函数 sin cos tan asin acos atan sinh cosh tanh exp ln log sqrt abs sign，
   常量 pi e。
----------------------------------------------------------------- */
const FUNCS: Record<string, (x: number) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
  sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
  exp: Math.exp, ln: Math.log, log: (x) => Math.log(x) / Math.LN10,
  sqrt: Math.sqrt, abs: Math.abs, sign: Math.sign,
};
const CONSTS: Record<string, number> = { pi: Math.PI, e: Math.E };

type Tok =
  | { t: "num"; v: number }
  | { t: "id"; v: string }
  | { t: "op"; v: string }
  | { t: "lp" } | { t: "rp" } | { t: "comma" };

function tokenize(s: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === " " || c === "\t") { i++; continue; }
    if (/[0-9.]/.test(c)) {
      let j = i + 1;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      out.push({ t: "num", v: parseFloat(s.slice(i, j)) });
      i = j; continue;
    }
    if (/[a-zA-Z_]/.test(c)) {
      let j = i + 1;
      while (j < s.length && /[a-zA-Z0-9_]/.test(s[j])) j++;
      out.push({ t: "id", v: s.slice(i, j) });
      i = j; continue;
    }
    if (c === "(") { out.push({ t: "lp" }); i++; continue; }
    if (c === ")") { out.push({ t: "rp" }); i++; continue; }
    if (c === ",") { out.push({ t: "comma" }); i++; continue; }
    if ("+-*/^".includes(c)) { out.push({ t: "op", v: c }); i++; continue; }
    i++; // 忽略未知字符
  }
  return out;
}

type RPN = Array<
  | { k: "num"; v: number }
  | { k: "var" }
  | { k: "fn"; name: string }
  | { k: "op"; v: string }
  | { k: "neg" }
>;

const prec = (o: string) => (o === "+" || o === "-" ? 1 : o === "*" || o === "/" ? 2 : o === "^" ? 4 : 0);

function toRPN(toks: Tok[]): RPN {
  const out: RPN = [];
  type S = { s: "op"; v: string } | { s: "neg" } | { s: "fn"; name: string } | { s: "lp" };
  const stack: S[] = [];
  const flush = (t: S) => {
    if (t.s === "op") out.push({ k: "op", v: t.v });
    else if (t.s === "neg") out.push({ k: "neg" });
    else if (t.s === "fn") out.push({ k: "fn", name: t.name });
  };
  let prevValue = false;
  for (const tk of toks) {
    if (tk.t === "num") { out.push({ k: "num", v: tk.v }); prevValue = true; continue; }
    if (tk.t === "id") {
      const name = tk.v.toLowerCase();
      if (name === "x") { out.push({ k: "var" }); prevValue = true; }
      else if (name in CONSTS) { out.push({ k: "num", v: CONSTS[name] }); prevValue = true; }
      else if (name in FUNCS) { stack.push({ s: "fn", name }); prevValue = false; }
      else { out.push({ k: "num", v: NaN }); prevValue = true; }
      continue;
    }
    if (tk.t === "op") {
      if (!prevValue && tk.v === "-") { stack.push({ s: "neg" }); continue; }
      if (!prevValue && tk.v === "+") { continue; }
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.s === "op" && (prec(top.v) > prec(tk.v) || (prec(top.v) === prec(tk.v) && tk.v !== "^"))) { flush(stack.pop()!); }
        else if (top.s === "neg" && 3 >= prec(tk.v)) { flush(stack.pop()!); }
        else break;
      }
      stack.push({ s: "op", v: tk.v }); prevValue = false; continue;
    }
    if (tk.t === "lp") { stack.push({ s: "lp" }); prevValue = false; continue; }
    if (tk.t === "rp") {
      while (stack.length && stack[stack.length - 1].s !== "lp") flush(stack.pop()!);
      stack.pop();
      if (stack.length && stack[stack.length - 1].s === "fn") flush(stack.pop()!);
      prevValue = true; continue;
    }
    if (tk.t === "comma") {
      while (stack.length && stack[stack.length - 1].s !== "lp") flush(stack.pop()!);
      prevValue = false; continue;
    }
  }
  while (stack.length) { const t = stack.pop()!; if (t.s !== "lp") flush(t); }
  return out;
}

function evalRPN(rpn: RPN, x: number): number {
  const st: number[] = [];
  for (const it of rpn) {
    if (it.k === "num") st.push(it.v);
    else if (it.k === "var") st.push(x);
    else if (it.k === "neg") st.push(-(st.pop() ?? NaN));
    else if (it.k === "fn") { const a = st.pop() ?? NaN; const f = FUNCS[it.name]; st.push(f ? f(a) : NaN); }
    else if (it.k === "op") {
      const b = st.pop() ?? NaN, a = st.pop() ?? NaN;
      st.push(it.v === "+" ? a + b : it.v === "-" ? a - b : it.v === "*" ? a * b : it.v === "/" ? a / b : it.v === "^" ? Math.pow(a, b) : NaN);
    }
  }
  return st.pop() ?? NaN;
}

/** 把表达式字符串编译成 (x) => y 的函数；非法表达式返回恒 NaN。 */
export function compile(expr: string): (x: number) => number {
  let rpn: RPN;
  try { rpn = toRPN(tokenize(expr)); } catch { return () => NaN; }
  return (x) => { try { return evalRPN(rpn, x); } catch { return NaN; } };
}

/* ----------------------------------------------------------------
   坐标映射 + 曲线采样
----------------------------------------------------------------- */
export interface Frame { xMin: number; xMax: number; yMin: number; yMax: number; }
export interface Box { x0: number; y0: number; w: number; h: number; }

export function makeScales(frame: Frame, box: Box) {
  const sx = (x: number) => box.x0 + ((x - frame.xMin) / (frame.xMax - frame.xMin)) * box.w;
  const sy = (y: number) => box.y0 + box.h - ((y - frame.yMin) / (frame.yMax - frame.yMin)) * box.h;
  return { sx, sy };
}

/** 采样函数得到 y 值范围，用于在内容未给定 y 区间时自动取景。 */
export function autoYRange(fn: (x: number) => number, xMin: number, xMax: number, samples = 200): [number, number] {
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i <= samples; i++) {
    const y = fn(xMin + (i / samples) * (xMax - xMin));
    if (isFinite(y)) { if (y < lo) lo = y; if (y > hi) hi = y; }
  }
  if (!isFinite(lo) || !isFinite(hi)) return [-1, 1];
  if (lo === hi) { lo -= 1; hi += 1; }
  const pad = (hi - lo) * 0.15;
  return [lo - pad, hi + pad];
}

/** 把函数采样成 SVG path（"d" 属性）；在出界或不连续处断笔，避免渐近线被连成竖线。 */
export function plotPath(fn: (x: number) => number, frame: Frame, box: Box, samples = 260): string {
  const { sx, sy } = makeScales(frame, box);
  const span = frame.yMax - frame.yMin;
  let d = "";
  let pen = false;
  let prevY = NaN;
  for (let i = 0; i <= samples; i++) {
    const x = frame.xMin + (i / samples) * (frame.xMax - frame.xMin);
    const y = fn(x);
    const outOfView = !isFinite(y) || y < frame.yMin - span || y > frame.yMax + span;
    const jump = isFinite(prevY) && isFinite(y) && Math.abs(y - prevY) > span * 1.5;
    if (outOfView || jump) { pen = false; prevY = y; continue; }
    const yc = Math.min(frame.yMax + span * 0.02, Math.max(frame.yMin - span * 0.02, y));
    const px = sx(x).toFixed(1), py = sy(yc).toFixed(1);
    d += `${pen ? "L" : "M"}${px} ${py} `;
    pen = true;
    prevY = y;
  }
  return d.trim();
}

/* ----------------------------------------------------------------
   参数安全读取（parameters 是 Record<string,unknown>）
----------------------------------------------------------------- */
export const asNum = (v: unknown, def = 0): number => (typeof v === "number" && isFinite(v) ? v : def);
export const asStr = (v: unknown, def = ""): string => (typeof v === "string" ? v : def);
export const asArr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
export const asObj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

/* ----------------------------------------------------------------
   LaTeX 标注 → 可直接放进 SVG <text> 的 Unicode
   （SVG 内无法跑 KaTeX，这里做常用符号的轻量映射）
----------------------------------------------------------------- */
const TEX_SYMBOLS: Array<[RegExp, string]> = [
  [/\\varepsilon/g, "ε"], [/\\epsilon/g, "ε"], [/\\delta/g, "δ"], [/\\Delta/g, "Δ"],
  [/\\infty/g, "∞"], [/\\cdots/g, "⋯"], [/\\dots/g, "…"], [/\\ldots/g, "…"],
  [/\\leq?/g, "≤"], [/\\geq?/g, "≥"], [/\\neq/g, "≠"], [/\\to/g, "→"], [/\\pm/g, "±"],
  [/\\times/g, "×"], [/\\cdot/g, "·"], [/\\approx/g, "≈"], [/\\in/g, "∈"],
  [/\\alpha/g, "α"], [/\\beta/g, "β"], [/\\gamma/g, "γ"], [/\\theta/g, "θ"],
  [/\\lambda/g, "λ"], [/\\mu/g, "μ"], [/\\pi/g, "π"], [/\\rho/g, "ρ"], [/\\sigma/g, "σ"],
  [/\\sum/g, "Σ"], [/\\int/g, "∫"], [/\\sqrt/g, "√"], [/\\cos/g, "cos"], [/\\sin/g, "sin"],
  [/\\left/g, ""], [/\\right/g, ""], [/\\,/g, " "],
];
const SUP: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻", "+": "⁺", n: "ⁿ" };
const SUB: Record<string, string> = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉", "-": "₋", "+": "₊", n: "ₙ", k: "ₖ", i: "ᵢ", j: "ⱼ", x: "ₓ", a: "ₐ" };

export function texLabel(raw: string): string {
  if (!raw) return "";
  let s = raw.replace(/\$/g, "");
  for (const [re, rep] of TEX_SYMBOLS) s = s.replace(re, rep);
  // 上标：^2、^{-1}、^- ；下标：_0、_{n}、_n
  s = s.replace(/\^\{([^}]*)\}/g, (_, g: string) => mapScript(g, SUP));
  s = s.replace(/\^(\S)/g, (_, g: string) => mapScript(g, SUP));
  s = s.replace(/_\{([^}]*)\}/g, (_, g: string) => mapScript(g, SUB));
  s = s.replace(/_(\S)/g, (_, g: string) => mapScript(g, SUB));
  s = s.replace(/[{}]/g, "");
  return s.trim();
}

function mapScript(g: string, table: Record<string, string>): string {
  return g.split("").map((ch) => table[ch] ?? ch).join("");
}
