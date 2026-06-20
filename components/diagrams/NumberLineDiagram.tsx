import type { ReactNode } from "react";
import type { DiagramSpec } from "@/lib/course/types";
import { PALETTE, asNum, asStr, asArr, asObj } from "@/lib/diagrams/engine";
import { Figure, Lab, Dot, OpenDot } from "./Figure";

/**
 * 数轴图：type = "number-line"。
 * 读取 axisMin/axisMax、limitPoint、epsilon、highlightInterval、points、intervals，
 * 真正按参数画出邻域、区间（开/闭端点）与标注。
 */
export function NumberLineDiagram({ diagram }: { diagram: DiagramSpec }) {
  const p = diagram.parameters;
  const axisMin = asNum(p.axisMin, -1.5);
  const axisMax = asNum(p.axisMax, 1.5);
  const X0 = 50, X1 = 440, baseY = 92;
  const sx = (x: number) => X0 + ((x - axisMin) / (axisMax - axisMin)) * (X1 - X0);

  const limit = asObj(p.limitPoint);
  const hasLimit = limit.x !== undefined;
  const eps = asObj(p.epsilon);
  const epsVal = asNum(eps.value, NaN);

  const hi = asObj(p.highlightInterval);
  const intervals = asArr(p.intervals).map(asObj);
  if (hi.from !== undefined) intervals.unshift(hi);
  // 由 limit + epsilon 推出邻域区间
  if (hasLimit && isFinite(epsVal) && intervals.length === 0) {
    intervals.push({ from: asNum(limit.x) - epsVal, to: asNum(limit.x) + epsVal, label: "U(a;ε)", open: true });
  }

  const extraPoints = asArr(p.points).map(asObj);

  const nodes: ReactNode[] = [];
  intervals.forEach((iv, i) => {
    const from = asNum(iv.from), to = asNum(iv.to);
    const open = iv.open !== false;
    nodes.push(<line key={`iv${i}`} x1={sx(from)} y1={baseY} x2={sx(to)} y2={baseY} stroke={PALETTE.curve} strokeWidth={9} opacity={0.28} strokeLinecap="round" />);
    const EP = open ? OpenDot : Dot;
    nodes.push(<EP key={`l${i}`} x={sx(from)} y={baseY} color={PALETTE.curve} />);
    nodes.push(<EP key={`r${i}`} x={sx(to)} y={baseY} color={PALETTE.curve} />);
    if (asStr(iv.leftEndpointLabel ?? iv.leftLabel)) nodes.push(<Lab key={`ll${i}`} x={sx(from)} y={baseY + 22} size={12}>{asStr(iv.leftEndpointLabel ?? iv.leftLabel)}</Lab>);
    if (asStr(iv.rightEndpointLabel ?? iv.rightLabel)) nodes.push(<Lab key={`rl${i}`} x={sx(to)} y={baseY + 22} size={12}>{asStr(iv.rightEndpointLabel ?? iv.rightLabel)}</Lab>);
    if (asStr(iv.label)) nodes.push(<Lab key={`il${i}`} x={(sx(from) + sx(to)) / 2} y={baseY - 16} size={12} italic color={PALETTE.curve}>{asStr(iv.label)}</Lab>);
  });

  return (
    <Figure diagram={diagram} viewBox="0 0 480 150">
      {/* 轴线 + 双向箭头 */}
      <line x1={X0 - 8} y1={baseY} x2={X1 + 8} y2={baseY} stroke={PALETTE.ink} strokeWidth={1.4} />
      <path d={`M${X1 + 8} ${baseY} l-7 -3.5 l0 7 z`} fill={PALETTE.ink} />
      <path d={`M${X0 - 8} ${baseY} l7 -3.5 l0 7 z`} fill={PALETTE.ink} />
      {nodes}
      {hasLimit ? (
        <g>
          <Dot x={sx(asNum(limit.x))} y={baseY} color={PALETTE.accent} r={3.8} />
          <Lab x={sx(asNum(limit.x))} y={baseY - 16} italic size={14}>{asStr(limit.symbol, "a")}</Lab>
        </g>
      ) : null}
      {extraPoints.map((pt, i) => (
        <g key={`pt${i}`}>
          <Dot x={sx(asNum(pt.x))} y={baseY} />
          {asStr(pt.label) ? <Lab x={sx(asNum(pt.x))} y={baseY - 14} italic size={12}>{asStr(pt.label)}</Lab> : null}
        </g>
      ))}
    </Figure>
  );
}
