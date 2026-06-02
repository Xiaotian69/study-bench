import { MathText } from "@/components/math/MathText";
import type { DiagramSpec } from "@/lib/course/types";

const points = [
  [70, 120],
  [130, 86],
  [190, 68],
  [250, 56],
  [310, 48],
  [370, 42],
  [430, 38]
];

export function SequencePlotDiagram({ diagram }: { diagram: DiagramSpec }) {
  return (
    <figure className="diagram-card">
      <figcaption>
        <strong>{diagram.title}</strong>
        <MathText text={diagram.description} />
      </figcaption>
      <svg aria-label={diagram.title} role="img" viewBox="0 0 520 190">
        <line stroke="currentColor" strokeWidth="2" x1="48" x2="480" y1="150" y2="150" />
        <line stroke="currentColor" strokeWidth="2" x1="48" x2="48" y1="24" y2="150" />
        <line stroke="#c18a2d" strokeDasharray="6 6" strokeWidth="2" x1="48" x2="480" y1="36" y2="36" />
        <text x="486" y="40">
          limit
        </text>
        <polyline fill="none" points={points.map(([x, y]) => `${x},${y}`).join(" ")} stroke="#2f6f68" strokeWidth="3" />
        {points.map(([x, y], index) => (
          <circle cx={x} cy={y} fill="#194d47" key={`${x}-${y}-${index}`} r="5" />
        ))}
      </svg>
      <p className="diagram-prompt">
        <MathText text={diagram.studentPrompt} />
      </p>
    </figure>
  );
}
