import type { DiagramSpec } from "@/lib/course/types";
import { NumberLineDiagram } from "./NumberLineDiagram";
import { SequencePlotDiagram } from "./SequencePlotDiagram";

export function DiagramRenderer({ diagram }: { diagram: DiagramSpec }) {
  if (diagram.type === "number-line" || diagram.type === "sequence-on-number-line") {
    return <NumberLineDiagram diagram={diagram} />;
  }

  return <SequencePlotDiagram diagram={diagram} />;
}
