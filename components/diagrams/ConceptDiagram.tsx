import { MathText } from "@/components/math/MathText";
import type { DiagramSpec } from "@/lib/course/types";

export function ConceptDiagram({ diagram }: { diagram: DiagramSpec }) {
  return (
    <figure className="diagram-card diagram-card--concept">
      <figcaption>
        <strong><MathText text={diagram.title} /></strong>
        <MathText text={diagram.description} />
      </figcaption>
      <p className="diagram-prompt">
        <MathText text={diagram.studentPrompt} />
      </p>
    </figure>
  );
}
