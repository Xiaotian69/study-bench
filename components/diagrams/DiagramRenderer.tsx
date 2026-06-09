import type { DiagramSpec } from "@/lib/course/types";
import { ConceptDiagram } from "./ConceptDiagram";
import { NumberLineDiagram } from "./NumberLineDiagram";
import { SequencePlotDiagram } from "./SequencePlotDiagram";

const SEQUENCE_TYPES = new Set([
  "sequence-on-number-line",
  "two-panel-sequence-plot",
  "bounded-strip",
  "monotone-sequence-plot",
  "subsequence-highlight",
]);

export function DiagramRenderer({ diagram }: { diagram: DiagramSpec }) {
  if (diagram.type === "number-line") return <NumberLineDiagram diagram={diagram} />;
  if (SEQUENCE_TYPES.has(diagram.type)) return <SequencePlotDiagram diagram={diagram} />;
  return <ConceptDiagram diagram={diagram} />;
}
