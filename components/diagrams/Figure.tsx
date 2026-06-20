import type { ReactNode } from "react";
import { MathText } from "@/components/math/MathText";
import type { DiagramSpec } from "@/lib/course/types";
import { PALETTE, makeScales, texLabel, type Box, type Frame } from "@/lib/diagrams/engine";

/** 统一的图示外壳：标题 + 描述 + SVG 画布 + 思考提示。 */
export function Figure({
  diagram,
  viewBox = "0 0 480 300",
  variant,
  children,
}: {
  diagram: DiagramSpec;
  viewBox?: string;
  variant?: "concept";
  children: ReactNode;
}) {
  return (
    <figure className={`diagram-card${variant === "concept" ? " diagram-card--concept" : ""}`}>
      <figcaption>
        <strong><MathText text={diagram.title} /></strong>
        <MathText text={diagram.description} />
      </figcaption>
      <svg className="diagram-svg" role="img" aria-label={diagram.title} viewBox={viewBox}>
        {children}
      </svg>
      {diagram.studentPrompt ? (
        <p className="diagram-prompt">
          <MathText text={diagram.studentPrompt} />
        </p>
      ) : null}
    </figure>
  );
}

/** SVG 文本标注（衬线、可选斜体，自动把 LaTeX 转 Unicode）。 */
export function Lab({
  x, y, children, anchor = "middle", italic = false, size = 13, color = PALETTE.ink, dy,
}: {
  x: number; y: number; children: string; anchor?: "start" | "middle" | "end";
  italic?: boolean; size?: number; color?: string; dy?: number;
}) {
  return (
    <text
      x={x} y={y} dy={dy} textAnchor={anchor} fill={color}
      fontFamily='"Spectral", "Noto Serif SC", Georgia, serif'
      fontStyle={italic ? "italic" : "normal"} fontSize={size}
    >
      {texLabel(children)}
    </text>
  );
}

/** 实心点（取到的值 / 数据点）。 */
export function Dot({ x, y, r = 3.4, color = PALETTE.accent }: { x: number; y: number; r?: number; color?: string }) {
  return <circle cx={x} cy={y} r={r} fill={color} />;
}

/** 空心点（去心 / 不取到的极限值）。 */
export function OpenDot({ x, y, r = 3.6, color = PALETTE.accent }: { x: number; y: number; r?: number; color?: string }) {
  return <circle cx={x} cy={y} r={r} fill={PALETTE.paperSunk} stroke={color} strokeWidth={1.6} />;
}

/**
 * 直角坐标系：浅网格 + 坐标轴 + 箭头 + 轴标。
 * 当 0 落在取景范围内时轴画在 0 处，否则贴边。
 */
export function CartesianAxes({
  frame, box, xLabel = "x", yLabel = "y", grid = true,
}: {
  frame: Frame; box: Box; xLabel?: string; yLabel?: string; grid?: boolean;
}) {
  const { sx, sy } = makeScales(frame, box);
  const xAxisY = frame.yMin <= 0 && frame.yMax >= 0 ? sy(0) : sy(frame.yMin);
  const yAxisX = frame.xMin <= 0 && frame.xMax >= 0 ? sx(0) : sx(frame.xMin);

  const gridLines: ReactNode[] = [];
  if (grid) {
    for (let gx = Math.ceil(frame.xMin); gx <= frame.xMax; gx++) {
      const px = sx(gx);
      gridLines.push(<line key={`gx${gx}`} x1={px} y1={box.y0} x2={px} y2={box.y0 + box.h} stroke={PALETTE.inkFaint} strokeWidth={0.5} opacity={0.45} />);
    }
    for (let gy = Math.ceil(frame.yMin); gy <= frame.yMax; gy++) {
      const py = sy(gy);
      gridLines.push(<line key={`gy${gy}`} x1={box.x0} y1={py} x2={box.x0 + box.w} y2={py} stroke={PALETTE.inkFaint} strokeWidth={0.5} opacity={0.45} />);
    }
  }

  return (
    <g>
      {gridLines}
      {/* x 轴 */}
      <line x1={box.x0} y1={xAxisY} x2={box.x0 + box.w + 6} y2={xAxisY} stroke={PALETTE.ink} strokeWidth={1.3} />
      <path d={`M${box.x0 + box.w + 6} ${xAxisY} l-7 -3.5 l0 7 z`} fill={PALETTE.ink} />
      <Lab x={box.x0 + box.w + 12} y={xAxisY + 4} anchor="start" italic size={13}>{xLabel}</Lab>
      {/* y 轴 */}
      <line x1={yAxisX} y1={box.y0 + box.h} x2={yAxisX} y2={box.y0 - 6} stroke={PALETTE.ink} strokeWidth={1.3} />
      <path d={`M${yAxisX} ${box.y0 - 6} l-3.5 7 l7 0 z`} fill={PALETTE.ink} />
      <Lab x={yAxisX - 6} y={box.y0 - 2} anchor="end" italic size={13}>{yLabel}</Lab>
      {/* 原点 */}
      {frame.xMin <= 0 && frame.xMax >= 0 && frame.yMin <= 0 && frame.yMax >= 0 ? (
        <Lab x={yAxisX - 5} y={xAxisY + 14} anchor="end" italic size={12} color={PALETTE.inkSoft}>O</Lab>
      ) : null}
    </g>
  );
}
