import { MathText } from "@/components/math/MathText";
import type { DiagramSpec } from "@/lib/course/types";

export function NumberLineDiagram({ diagram }: { diagram: DiagramSpec }) {
  return (
    <figure className="diagram-card">
      <figcaption>
        <strong>{diagram.title}</strong>
        <MathText text={diagram.description} />
      </figcaption>
      <svg aria-label={diagram.title} role="img" viewBox="0 0 640 180">
        <line stroke="currentColor" strokeWidth="2" x1="64" x2="576" y1="96" y2="96" />
        <line opacity="0.28" stroke="#2f6f68" strokeLinecap="round" strokeWidth="12" x1="224" x2="416" y1="96" y2="96" />
        <circle cx="320" cy="96" fill="#194d47" r="7" />
        <text textAnchor="middle" x="320" y="58">
          a
        </text>
        <text textAnchor="middle" x="224" y="130">
          a-ε
        </text>
        <text textAnchor="middle" x="416" y="130">
          a+ε
        </text>
        <text textAnchor="middle" x="320" y="156">
          |xₙ-a| &lt; ε
        </text>
      </svg>
      <p className="diagram-prompt">
        <MathText text={diagram.studentPrompt} />
      </p>
    </figure>
  );
}
