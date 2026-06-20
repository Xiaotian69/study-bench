import type { ReactNode } from "react";
import type { DiagramSpec } from "@/lib/course/types";
import {
  PALETTE, CURVE_COLORS, compile, makeScales, plotPath, autoYRange,
  asNum, asStr, asArr, asObj, type Frame, type Box,
} from "@/lib/diagrams/engine";
import { Figure, CartesianAxes, Lab, Dot, OpenDot } from "./Figure";

const BOX: Box = { x0: 46, y0: 18, w: 402, h: 236 };

/* ================================================================
   函数曲线：multi-curve-plot / function-plot / area-under-curve
================================================================ */
export function FunctionPlotDiagram({ diagram }: { diagram: DiagramSpec }) {
  const p = diagram.parameters;
  const domain = asObj(p.domain);
  const xRange = asArr(p.xRange);
  const xMin = xRange.length === 2 ? asNum(xRange[0]) : asNum(domain.from, -1);
  const xMax = xRange.length === 2 ? asNum(xRange[1]) : asNum(domain.to, 1);

  // 收集曲线：curves[] 或单个 expr
  const rawCurves = asArr(p.curves);
  const curves = rawCurves.length
    ? rawCurves.map((c) => ({ expr: asStr(asObj(c).expr), label: asStr(asObj(c).label) }))
    : asStr(p.expr) ? [{ expr: asStr(p.expr), label: asStr(p.label) }] : [];

  const fns = curves.map((c) => compile(c.expr));

  // y 取景：合并所有曲线范围，并保证含 0
  let yMin = Infinity, yMax = -Infinity;
  for (const fn of fns) {
    const [lo, hi] = autoYRange(fn, xMin, xMax);
    yMin = Math.min(yMin, lo); yMax = Math.max(yMax, hi);
  }
  if (!isFinite(yMin)) { yMin = -1; yMax = 1; }
  yMin = Math.min(yMin, 0); yMax = Math.max(yMax, 0);
  const frame: Frame = { xMin, xMax, yMin, yMax };
  const { sx, sy } = makeScales(frame, BOX);

  // 定积分面积填充
  const fillFrom = p.fillFrom !== undefined ? asNum(p.fillFrom) : null;
  const fillTo = p.fillTo !== undefined ? asNum(p.fillTo) : null;
  let areaPath = "";
  if (fillFrom !== null && fillTo !== null && fns[0]) {
    const N = 80;
    const pts: string[] = [];
    for (let i = 0; i <= N; i++) {
      const x = fillFrom + (i / N) * (fillTo - fillFrom);
      pts.push(`${sx(x).toFixed(1)} ${sy(fns[0](x)).toFixed(1)}`);
    }
    areaPath = `M${sx(fillFrom).toFixed(1)} ${sy(0).toFixed(1)} L` + pts.join(" L") + ` L${sx(fillTo).toFixed(1)} ${sy(0).toFixed(1)} Z`;
  }

  const marks = asArr(p.marks);

  return (
    <Figure diagram={diagram}>
      <CartesianAxes frame={frame} box={BOX} />
      {areaPath ? <path d={areaPath} fill={PALETTE.accent} opacity={0.14} /> : null}
      {fns.map((fn, i) => (
        <path key={i} d={plotPath(fn, frame, BOX)} fill="none" stroke={CURVE_COLORS[i % CURVE_COLORS.length]} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {marks.map((m, i) => {
        const mo = asObj(m);
        const mx = asNum(mo.x);
        const fy = fns[0] ? fns[0](mx) : 0;
        return (
          <g key={`mk${i}`}>
            <Dot x={sx(mx)} y={sy(fy)} />
            {asStr(mo.label) ? <Lab x={sx(mx)} y={sy(fy) - 8} italic size={12}>{asStr(mo.label)}</Lab> : null}
          </g>
        );
      })}
      {/* 图例 */}
      {curves.length > 1 ? (
        <g>
          {curves.map((c, i) => (
            <g key={`lg${i}`} transform={`translate(${BOX.x0 + 8}, ${BOX.y0 + 12 + i * 18})`}>
              <line x1={0} y1={0} x2={20} y2={0} stroke={CURVE_COLORS[i % CURVE_COLORS.length]} strokeWidth={2.4} />
              <Lab x={26} y={4} anchor="start" size={12} color={PALETTE.inkSoft}>{c.label || c.expr}</Lab>
            </g>
          ))}
        </g>
      ) : null}
    </Figure>
  );
}

/* ================================================================
   ε-δ 几何定义：cartesian-epsilon-delta
================================================================ */
export function EpsilonDeltaDiagram({ diagram }: { diagram: DiagramSpec }) {
  const p = diagram.parameters;
  const x0 = asNum(asObj(p.limitPointX).x, 2);
  const A = asNum(asObj(p.limitValueY).y, 3);
  const band = asObj(p.epsilonBand);
  const eps = asNum(band.value, 0.5);
  const interval = asObj(p.deltaInterval);
  const delta = asNum(interval.value, 0.4);

  const frame: Frame = { xMin: x0 - 1.7, xMax: x0 + 1.7, yMin: A - 1.3, yMax: A + 1.3 };
  const { sx, sy } = makeScales(frame, BOX);
  // 代表性单调曲线，斜率取 ε/δ 使其恰好充满色带，过 (x0, A) 并在该处挖空
  const slope = eps / delta;
  const fn = (x: number) => A + slope * (x - x0) * 0.8;

  return (
    <Figure diagram={diagram}>
      {/* 取景边框 */}
      <rect x={BOX.x0} y={BOX.y0} width={BOX.w} height={BOX.h} fill="none" stroke={PALETTE.inkFaint} strokeWidth={0.8} opacity={0.6} />
      {/* ε 水平带 */}
      <rect x={BOX.x0} y={sy(A + eps)} width={BOX.w} height={sy(A - eps) - sy(A + eps)} fill={PALETTE.gold} opacity={0.13} />
      {/* δ 竖直带 */}
      <rect x={sx(x0 - delta)} y={BOX.y0} width={sx(x0 + delta) - sx(x0 - delta)} height={BOX.h} fill={PALETTE.curve} opacity={0.12} />
      {/* 曲线 */}
      <path d={plotPath(fn, frame, BOX)} fill="none" stroke={PALETTE.curve} strokeWidth={2.2} />
      {/* 投影虚线 */}
      <line x1={sx(x0)} y1={sy(A)} x2={sx(x0)} y2={sy(frame.yMin)} stroke={PALETTE.accent} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
      <line x1={sx(x0)} y1={sy(A)} x2={sx(frame.xMin)} y2={sy(A)} stroke={PALETTE.accent} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
      {/* 关键点（去心） */}
      <OpenDot x={sx(x0)} y={sy(A)} />
      {/* y 轴标注 */}
      <Lab x={BOX.x0 - 4} y={sy(A) + 4} anchor="end" italic size={12}>{asStr(asObj(p.limitValueY).symbol, "A")}</Lab>
      <Lab x={BOX.x0 - 4} y={sy(A + eps) + 4} anchor="end" size={11} color={PALETTE.gold}>{asStr(band.upperLabel, "A+ε")}</Lab>
      <Lab x={BOX.x0 - 4} y={sy(A - eps) + 4} anchor="end" size={11} color={PALETTE.gold}>{asStr(band.lowerLabel, "A-ε")}</Lab>
      {/* x 轴标注 */}
      <Lab x={sx(x0)} y={BOX.y0 + BOX.h + 16} italic size={12}>{asStr(asObj(p.limitPointX).symbol, "x_0")}</Lab>
      <Lab x={sx(x0 - delta)} y={BOX.y0 + BOX.h + 16} size={11} color={PALETTE.curve}>{asStr(interval.leftLabel, "x_0-δ")}</Lab>
      <Lab x={sx(x0 + delta)} y={BOX.y0 + BOX.h + 16} size={11} color={PALETTE.curve}>{asStr(interval.rightLabel, "x_0+δ")}</Lab>
    </Figure>
  );
}

/* ================================================================
   趋于水平渐近线：function-plot-asymptote
================================================================ */
export function AsymptoteDiagram({ diagram }: { diagram: DiagramSpec }) {
  const p = diagram.parameters;
  const A = asNum(asObj(p.asymptote).y, 1);
  const eps = asNum(asObj(p.epsilonBand).value, 0.3);
  const M = asNum(asObj(p.threshold).x, 5);

  const xMax = M * 1.7;
  const frame: Frame = { xMin: 0, xMax, yMin: Math.min(0, A - 1), yMax: A + 1.4 };
  const { sx, sy } = makeScales(frame, BOX);
  const fn = (x: number) => A + 1.3 / (x + 0.35); // 自上方单调贴近 y=A

  return (
    <Figure diagram={diagram}>
      <CartesianAxes frame={frame} box={BOX} />
      {/* ε 带 */}
      <rect x={BOX.x0} y={sy(A + eps)} width={BOX.w} height={sy(A - eps) - sy(A + eps)} fill={PALETTE.gold} opacity={0.13} />
      {/* 渐近线 */}
      <line x1={BOX.x0} y1={sy(A)} x2={BOX.x0 + BOX.w} y2={sy(A)} stroke={PALETTE.gold} strokeWidth={1.4} strokeDasharray="6 4" />
      <Lab x={BOX.x0 + BOX.w} y={sy(A) - 6} anchor="end" italic size={12} color={PALETTE.gold}>{`y=${asStr(asObj(p.asymptote).symbol, "A")}`}</Lab>
      {/* 阈值 M */}
      <line x1={sx(M)} y1={BOX.y0} x2={sx(M)} y2={sy(frame.yMin)} stroke={PALETTE.accent} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
      <Lab x={sx(M)} y={BOX.y0 + BOX.h + 16} italic size={12} color={PALETTE.accent}>{asStr(asObj(p.threshold).symbol, "M")}</Lab>
      {/* 曲线 */}
      <path d={plotPath(fn, frame, BOX)} fill="none" stroke={PALETTE.curve} strokeWidth={2.2} />
    </Figure>
  );
}

/* ================================================================
   跳跃间断：piecewise-function-plot
================================================================ */
export function PiecewiseJumpDiagram({ diagram }: { diagram: DiagramSpec }) {
  const p = diagram.parameters;
  const x0 = asNum(asObj(p.breakPointX).x, 0);
  const leftY = asNum(asObj(p.leftBranch).y, -1);
  const rightY = asNum(asObj(p.rightBranch).y, 1);
  const lo = Math.min(leftY, rightY), hi = Math.max(leftY, rightY);
  const frame: Frame = { xMin: x0 - 2.6, xMax: x0 + 2.6, yMin: lo - 1.2, yMax: hi + 1.2 };
  const { sx, sy } = makeScales(frame, BOX);

  return (
    <Figure diagram={diagram}>
      <CartesianAxes frame={frame} box={BOX} />
      {/* 左支：略向右上靠近 (x0, leftY) */}
      <path d={`M${sx(x0 - 2.3)} ${sy(leftY - 0.35)} Q${sx(x0 - 0.8)} ${sy(leftY)} ${sx(x0)} ${sy(leftY)}`} fill="none" stroke={PALETTE.curve} strokeWidth={2.2} />
      {/* 右支 */}
      <path d={`M${sx(x0)} ${sy(rightY)} Q${sx(x0 + 0.8)} ${sy(rightY)} ${sx(x0 + 2.3)} ${sy(rightY + 0.35)}`} fill="none" stroke={PALETTE.curve} strokeWidth={2.2} />
      {/* 跳跃量标注 */}
      <line x1={sx(x0)} y1={sy(leftY)} x2={sx(x0)} y2={sy(rightY)} stroke={PALETTE.accent} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
      <OpenDot x={sx(x0)} y={sy(leftY)} color={PALETTE.curve} />
      <OpenDot x={sx(x0)} y={sy(rightY)} color={PALETTE.curve} />
      <Lab x={sx(x0) + 8} y={sy((leftY + rightY) / 2) + 4} anchor="start" size={11} color={PALETTE.accent}>跳跃</Lab>
      <Lab x={sx(x0)} y={BOX.y0 + BOX.h + 16} italic size={12}>{asStr(asObj(p.breakPointX).symbol, "x_0")}</Lab>
    </Figure>
  );
}

/* ================================================================
   二维区域：region-2d（为高数重积分等内容预备）
================================================================ */
export function Region2DDiagram({ diagram }: { diagram: DiagramSpec }) {
  const p = diagram.parameters;
  const xr = asArr(p.xRange), yr = asArr(p.yRange);
  const frame: Frame = {
    xMin: xr.length === 2 ? asNum(xr[0]) : -1, xMax: xr.length === 2 ? asNum(xr[1]) : 3,
    yMin: yr.length === 2 ? asNum(yr[0]) : -1, yMax: yr.length === 2 ? asNum(yr[1]) : 3,
  };
  const { sx, sy } = makeScales(frame, BOX);
  const boundaries = asArr(p.boundaries).map((b) => ({ expr: asStr(asObj(b).expr), label: asStr(asObj(b).label), fn: compile(asStr(asObj(b).expr)) }));

  let fillPath = "";
  if (boundaries.length >= 1) {
    const a = Math.max(frame.xMin, 0), b = frame.xMax;
    const N = 60;
    const top = boundaries[0].fn;
    const bottom = boundaries[1]?.fn ?? (() => 0);
    const up: string[] = [], down: string[] = [];
    for (let i = 0; i <= N; i++) {
      const x = a + (i / N) * (b - a);
      up.push(`${sx(x).toFixed(1)} ${sy(top(x)).toFixed(1)}`);
      down.push(`${sx(x).toFixed(1)} ${sy(bottom(x)).toFixed(1)}`);
    }
    fillPath = `M${up.join(" L")} L${down.reverse().join(" L")} Z`;
  }

  return (
    <Figure diagram={diagram}>
      <CartesianAxes frame={frame} box={BOX} />
      {fillPath ? <path d={fillPath} fill={PALETTE.curve} opacity={0.14} /> : null}
      {boundaries.map((bd, i) => (
        <g key={i}>
          <path d={plotPath(bd.fn, frame, BOX)} fill="none" stroke={CURVE_COLORS[i % CURVE_COLORS.length]} strokeWidth={2} />
          {bd.label ? <Lab x={BOX.x0 + BOX.w - 6} y={sy(bd.fn(frame.xMax)) - 6} anchor="end" italic size={12} color={CURVE_COLORS[i % CURVE_COLORS.length]}>{bd.label}</Lab> : null}
        </g>
      ))}
    </Figure>
  );
}

/* ================================================================
   纯几何：geometric（向量 / 多边形 / 圆 / 点 / 线段）
================================================================ */
export function GeometricDiagram({ diagram }: { diagram: DiagramSpec }) {
  const p = diagram.parameters;
  const shapes = asArr(p.shapes).map(asObj);

  // 自动取景：扫描所有坐标
  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  const consider = (x: number, y: number) => { xMin = Math.min(xMin, x); xMax = Math.max(xMax, x); yMin = Math.min(yMin, y); yMax = Math.max(yMax, y); };
  for (const s of shapes) {
    for (const ptName of ["from", "to", "center"]) {
      const pt = asObj(s[ptName]);
      if (pt.x !== undefined) consider(asNum(pt.x), asNum(pt.y));
    }
    for (const pt of asArr(s.points)) { const o = asObj(pt); consider(asNum(o.x), asNum(o.y)); }
    if (s.kind === "circle") { const c = asObj(s.center); const r = asNum(s.r, 1); consider(asNum(c.x) - r, asNum(c.y) - r); consider(asNum(c.x) + r, asNum(c.y) + r); }
  }
  if (!isFinite(xMin)) { xMin = -1; xMax = 3; yMin = -1; yMax = 3; }
  const padX = (xMax - xMin) * 0.18 || 1, padY = (yMax - yMin) * 0.18 || 1;
  const frame: Frame = { xMin: xMin - padX, xMax: xMax + padX, yMin: yMin - padY, yMax: yMax + padY };
  const { sx, sy } = makeScales(frame, BOX);

  const nodes: ReactNode[] = [];
  shapes.forEach((s, i) => {
    const color = asStr(s.color) || CURVE_COLORS[i % CURVE_COLORS.length];
    const label = asStr(s.label);
    if (s.kind === "vector") {
      const f = asObj(s.from), t = asObj(s.to);
      const x1 = sx(asNum(f.x)), y1 = sy(asNum(f.y)), x2 = sx(asNum(t.x)), y2 = sy(asNum(t.y));
      const ang = Math.atan2(y2 - y1, x2 - x1);
      nodes.push(
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.2} />
          <path d={`M${x2} ${y2} L${(x2 - 9 * Math.cos(ang - 0.4)).toFixed(1)} ${(y2 - 9 * Math.sin(ang - 0.4)).toFixed(1)} L${(x2 - 9 * Math.cos(ang + 0.4)).toFixed(1)} ${(y2 - 9 * Math.sin(ang + 0.4)).toFixed(1)} Z`} fill={color} />
          {label ? <Lab x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} italic size={12} color={color}>{label}</Lab> : null}
        </g>,
      );
    } else if (s.kind === "circle") {
      const c = asObj(s.center);
      nodes.push(<circle key={i} cx={sx(asNum(c.x))} cy={sy(asNum(c.y))} r={Math.abs(sx(asNum(c.x) + asNum(s.r, 1)) - sx(asNum(c.x)))} fill="none" stroke={color} strokeWidth={2} />);
    } else if (s.kind === "polygon") {
      const pts = asArr(s.points).map(asObj).map((o) => `${sx(asNum(o.x)).toFixed(1)},${sy(asNum(o.y)).toFixed(1)}`).join(" ");
      nodes.push(<polygon key={i} points={pts} fill={color} fillOpacity={0.1} stroke={color} strokeWidth={2} />);
    } else if (s.kind === "line") {
      const f = asObj(s.from), t = asObj(s.to);
      const x1 = sx(asNum(f.x)), y1 = sy(asNum(f.y)), x2 = sx(asNum(t.x)), y2 = sy(asNum(t.y));
      nodes.push(
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
          {label ? <Lab x={(x1 + x2) / 2 + asNum(s.labelDx)} y={(y1 + y2) / 2 + asNum(s.labelDy, -6)} italic size={12} color={color}>{label}</Lab> : null}
        </g>,
      );
    } else if (s.kind === "point") {
      const pt = asArr(s.points)[0] ? asObj(asArr(s.points)[0]) : s;
      nodes.push(
        <g key={i}>
          <Dot x={sx(asNum(pt.x))} y={sy(asNum(pt.y))} color={color} />
          {label ? <Lab x={sx(asNum(pt.x)) + 6} y={sy(asNum(pt.y)) - 6} anchor="start" italic size={12} color={color}>{label}</Lab> : null}
        </g>,
      );
    }
  });

  return (
    <Figure diagram={diagram}>
      <CartesianAxes frame={frame} box={BOX} />
      {nodes}
    </Figure>
  );
}
