import type { ReactNode } from "react";
import type { DiagramSpec } from "@/lib/course/types";
import { PALETTE, makeScales, asNum, asStr, asArr, asObj, type Frame, type Box } from "@/lib/diagrams/engine";
import { Figure, CartesianAxes, Lab, Dot, OpenDot } from "./Figure";

const BOX: Box = { x0: 46, y0: 18, w: 402, h: 236 };

type Term = { n: number; y: number };
const readTerms = (v: unknown): Term[] => asArr(v).map(asObj).map((o) => ({ n: asNum(o.n), y: asNum(o.y) }));

function frameFor(termSets: Term[][], extraY: number[] = [], nDefault = 8): Frame {
  let nMax = nDefault, yMin = Infinity, yMax = -Infinity;
  for (const ts of termSets) for (const t of ts) { nMax = Math.max(nMax, t.n); yMin = Math.min(yMin, t.y); yMax = Math.max(yMax, t.y); }
  for (const y of extraY) { yMin = Math.min(yMin, y); yMax = Math.max(yMax, y); }
  if (!isFinite(yMin)) { yMin = -1; yMax = 1; }
  yMin = Math.min(yMin, 0); yMax = Math.max(yMax, 0);
  const pad = (yMax - yMin) * 0.12 || 0.5;
  return { xMin: 0, xMax: nMax + 1, yMin: yMin - pad, yMax: yMax + pad };
}

function termDots(terms: Term[], sx: (n: number) => number, sy: (y: number) => number, color: string, connect = true): ReactNode {
  const sorted = [...terms].sort((a, b) => a.n - b.n);
  return (
    <g>
      {connect && sorted.length > 1 ? (
        <polyline fill="none" stroke={color} strokeWidth={1} opacity={0.4} points={sorted.map((t) => `${sx(t.n)},${sy(t.y)}`).join(" ")} />
      ) : null}
      {sorted.map((t, i) => <Dot key={i} x={sx(t.n)} y={sy(t.y)} color={color} r={3} />)}
    </g>
  );
}

/* ================= sequence-on-number-line ================= */
export function SequenceOnNumberLine({ diagram }: { diagram: DiagramSpec }) {
  const p = diagram.parameters;
  const a = asNum(asObj(p.limitPoint).x, 0);
  const eps = asNum(asObj(p.epsilon).value, 0.35);
  const thr = asNum(asObj(p.threshold).index, NaN);
  const terms = asArr(p.terms).map(asObj).map((o) => ({ n: asNum(o.n), x: asNum(o.x), inside: o.inside === true }));
  terms.sort((s, t) => s.n - t.n);

  const X0 = 70, X1 = 440, baseY = 250;
  const half = Math.max(Math.abs(a - eps), ...terms.map((t) => Math.abs(t.x - a))) + 0.2;
  const xMin = a - half, xMax = a + half;
  const sx = (x: number) => X0 + ((x - xMin) / (xMax - xMin)) * (X1 - X0);
  const rowTop = 34, rowGap = (baseY - 50 - rowTop) / Math.max(1, terms.length);
  const ty = (i: number) => rowTop + i * rowGap;

  return (
    <Figure diagram={diagram} viewBox="0 0 480 280">
      {/* ε 邻域竖带 */}
      <rect x={sx(a - eps)} y={20} width={sx(a + eps) - sx(a - eps)} height={baseY - 20} fill={PALETTE.curve} opacity={0.12} />
      <Lab x={(sx(a - eps) + sx(a + eps)) / 2} y={16} size={11} color={PALETTE.curve}>U(a;ε)</Lab>
      {/* 项：逐行向下，横向收敛进色带 */}
      {terms.map((t, i) => (
        <g key={i}>
          {i > 0 ? <line x1={sx(terms[i - 1].x)} y1={ty(i - 1)} x2={sx(t.x)} y2={ty(i)} stroke={PALETTE.inkFaint} strokeWidth={0.8} opacity={0.6} /> : null}
          <circle cx={sx(t.x)} cy={ty(i)} r={3.4} fill={t.inside ? PALETTE.accent : PALETTE.paperSunk} stroke={t.inside ? PALETTE.accent : PALETTE.inkSoft} strokeWidth={1.4} />
          <Lab x={sx(t.x) + 7} y={ty(i) + 3} anchor="start" italic size={10} color={PALETTE.inkFaint}>{`x_${t.n}`}</Lab>
        </g>
      ))}
      {/* 阈值线 */}
      {isFinite(thr) && terms.some((t) => t.n === thr) ? (
        <g>
          {(() => { const idx = terms.findIndex((t) => t.n > thr); const yLine = ty(idx) - rowGap / 2; return (
            <>
              <line x1={X0} y1={yLine} x2={X1} y2={yLine} stroke={PALETTE.gold} strokeWidth={1} strokeDasharray="5 3" />
              <Lab x={X1} y={yLine - 4} anchor="end" size={10} color={PALETTE.gold}>{`n>${asStr(asObj(p.threshold).symbol, "N")} 全部落入`}</Lab>
            </>
          ); })()}
        </g>
      ) : null}
      {/* 数轴 */}
      <line x1={X0 - 8} y1={baseY} x2={X1 + 8} y2={baseY} stroke={PALETTE.ink} strokeWidth={1.4} />
      <path d={`M${X1 + 8} ${baseY} l-7 -3.5 l0 7 z`} fill={PALETTE.ink} />
      <line x1={sx(a)} y1={baseY - 4} x2={sx(a)} y2={baseY + 4} stroke={PALETTE.accent} strokeWidth={1.6} />
      <Lab x={sx(a)} y={baseY + 18} italic size={13} color={PALETTE.accent}>{asStr(asObj(p.limitPoint).symbol, "a")}</Lab>
    </Figure>
  );
}

/* ================= two-panel-sequence-plot ================= */
export function TwoPanelSequence({ diagram }: { diagram: DiagramSpec }) {
  const panels = asArr(diagram.parameters.panels).map(asObj).slice(0, 2);
  const boxes: Box[] = [{ x0: 40, y0: 40, w: 168, h: 200 }, { x0: 272, y0: 40, w: 168, h: 200 }];

  return (
    <Figure diagram={diagram} viewBox="0 0 480 290">
      {panels.map((panel, pi) => {
        const box = boxes[pi];
        const terms = readTerms(panel.terms);
        const limitNum = Number(asStr(panel.limitLabel));
        const hasLimit = isFinite(limitNum);
        const frame = frameFor([terms], hasLimit ? [limitNum] : []);
        const { sx, sy } = makeScales(frame, box);
        return (
          <g key={pi}>
            <CartesianAxes frame={frame} box={box} xLabel="n" yLabel="" grid={false} />
            {hasLimit ? <line x1={box.x0} y1={sy(limitNum)} x2={box.x0 + box.w} y2={sy(limitNum)} stroke={PALETTE.gold} strokeWidth={1.2} strokeDasharray="5 3" /> : null}
            {termDots(terms, sx, sy, PALETTE.curve)}
            <Lab x={box.x0 + box.w / 2} y={box.y0 - 14} size={12} color={PALETTE.ink}>{asStr(panel.title)}</Lab>
            <Lab x={box.x0 + box.w / 2} y={box.y0 + box.h + 26} size={11} italic color={PALETTE.inkSoft}>{asStr(panel.limitLabel)}</Lab>
          </g>
        );
      })}
    </Figure>
  );
}

/* ================= bounded-strip ================= */
export function BoundedStrip({ diagram }: { diagram: DiagramSpec }) {
  const p = diagram.parameters;
  const prefix = readTerms(p.finitePrefix);
  const tail = readTerms(p.tailTerms);
  const nb = asObj(p.tailNeighborhood);
  const lower = asNum(nb.lower, -1), upper = asNum(nb.upper, 1);
  const M = Math.max(...prefix.map((t) => Math.abs(t.y)), ...tail.map((t) => Math.abs(t.y)), Math.abs(upper)) + 0.2;
  const frame = frameFor([prefix, tail], [M, -M, lower, upper]);
  const { sx, sy } = makeScales(frame, BOX);

  return (
    <Figure diagram={diagram}>
      <CartesianAxes frame={frame} box={BOX} xLabel="n" grid={false} />
      {/* 尾部邻域带 */}
      <rect x={BOX.x0} y={sy(upper)} width={BOX.w} height={sy(lower) - sy(upper)} fill={PALETTE.curve} opacity={0.12} />
      <Lab x={BOX.x0 + BOX.w - 4} y={sy(upper) - 4} anchor="end" size={11} color={PALETTE.curve}>{asStr(nb.label, "尾部邻域")}</Lab>
      {/* 全局界 ±M */}
      <line x1={BOX.x0} y1={sy(M)} x2={BOX.x0 + BOX.w} y2={sy(M)} stroke={PALETTE.accent} strokeWidth={1.1} strokeDasharray="6 4" />
      <line x1={BOX.x0} y1={sy(-M)} x2={BOX.x0 + BOX.w} y2={sy(-M)} stroke={PALETTE.accent} strokeWidth={1.1} strokeDasharray="6 4" />
      <Lab x={BOX.x0 + 4} y={sy(M) - 5} anchor="start" size={10} color={PALETTE.accent}>{asStr(p.globalBoundLabel, "±M")}</Lab>
      {/* 前段（空心）与尾段（实心） */}
      {prefix.map((t, i) => <OpenDot key={`p${i}`} x={sx(t.n)} y={sy(t.y)} color={PALETTE.inkSoft} />)}
      {termDots(tail, sx, sy, PALETTE.curve)}
    </Figure>
  );
}

/* ================= monotone-sequence-plot ================= */
export function MonotoneSequence({ diagram }: { diagram: DiagramSpec }) {
  const p = diagram.parameters;
  const terms = readTerms(p.terms);
  const sup = asObj(p.supremum), ub = asObj(p.upperBound);
  const supV = asNum(sup.value, 1), ubV = asNum(ub.value, 1.2);
  const frame = frameFor([terms], [supV, ubV]);
  const { sx, sy } = makeScales(frame, BOX);

  return (
    <Figure diagram={diagram}>
      <CartesianAxes frame={frame} box={BOX} xLabel="n" grid={false} />
      <line x1={BOX.x0} y1={sy(ubV)} x2={BOX.x0 + BOX.w} y2={sy(ubV)} stroke={PALETTE.inkSoft} strokeWidth={1.1} strokeDasharray="3 3" />
      <Lab x={BOX.x0 + BOX.w - 4} y={sy(ubV) - 5} anchor="end" size={11} color={PALETTE.inkSoft}>{asStr(ub.label, "上界")}</Lab>
      <line x1={BOX.x0} y1={sy(supV)} x2={BOX.x0 + BOX.w} y2={sy(supV)} stroke={PALETTE.accent} strokeWidth={1.3} strokeDasharray="6 4" />
      <Lab x={BOX.x0 + BOX.w - 4} y={sy(supV) - 5} anchor="end" size={11} italic color={PALETTE.accent}>{asStr(sup.label, "sup")}</Lab>
      {termDots(terms, sx, sy, PALETTE.curve)}
    </Figure>
  );
}

/* ================= subsequence-highlight ================= */
export function SubsequenceHighlight({ diagram }: { diagram: DiagramSpec }) {
  const p = diagram.parameters;
  const orig = asArr(p.originalSequence).map(asObj).map((o) => ({ n: asNum(o.n), y: asNum(o.y), sub: asStr(o.subsequence) }));
  const subs = asArr(p.subsequences).map(asObj);
  const palette = [PALETTE.accent, PALETTE.curve];
  const subColor: Record<string, string> = {};
  orig.forEach((t) => { if (!(t.sub in subColor)) subColor[t.sub] = palette[Object.keys(subColor).length % palette.length]; });

  const frame = frameFor([orig.map((t) => ({ n: t.n, y: t.y }))]);
  const { sx, sy } = makeScales(frame, BOX);

  return (
    <Figure diagram={diagram}>
      <CartesianAxes frame={frame} box={BOX} xLabel="n" grid={false} />
      {/* 各子列极限线 */}
      {subs.map((s, i) => {
        const lim = Number(asStr(s.limit));
        if (!isFinite(lim)) return null;
        return (
          <g key={`lim${i}`}>
            <line x1={BOX.x0} y1={sy(lim)} x2={BOX.x0 + BOX.w} y2={sy(lim)} stroke={palette[i % palette.length]} strokeWidth={1.1} strokeDasharray="5 3" opacity={0.8} />
            <Lab x={BOX.x0 + BOX.w - 4} y={sy(lim) - 5} anchor="end" size={11} color={palette[i % palette.length]}>{`${asStr(s.label)} → ${asStr(s.limit)}`}</Lab>
          </g>
        );
      })}
      {orig.map((t, i) => <Dot key={i} x={sx(t.n)} y={sy(t.y)} color={subColor[t.sub] ?? PALETTE.ink} r={3.4} />)}
    </Figure>
  );
}
