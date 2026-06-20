import { MathText } from "@/components/math/MathText";
import type { DiagramSpec } from "@/lib/course/types";
import { asArr, asStr } from "@/lib/diagrams/engine";

/** 表格图：type = "table"。columns + rows 渲染成对照表（支持单元格内 LaTeX）。 */
export function TableDiagram({ diagram }: { diagram: DiagramSpec }) {
  const columns = asArr(diagram.parameters.columns).map((c) => asStr(c));
  const rows = asArr(diagram.parameters.rows).map((r) => asArr(r).map((c) => asStr(c)));

  return (
    <figure className="diagram-card">
      <figcaption>
        <strong><MathText text={diagram.title} /></strong>
        <MathText text={diagram.description} />
      </figcaption>
      <div className="diagram-table-wrap">
        <table className="diagram-table">
          {columns.length ? (
            <thead>
              <tr>{columns.map((c, i) => <th key={i}><MathText text={c} /></th>)}</tr>
            </thead>
          ) : null}
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci}><MathText text={cell} /></td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      {diagram.studentPrompt ? (
        <p className="diagram-prompt"><MathText text={diagram.studentPrompt} /></p>
      ) : null}
    </figure>
  );
}
