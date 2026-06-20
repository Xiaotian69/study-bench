import type { DiagramSpec } from "@/lib/course/types";
import { ConceptDiagram } from "./ConceptDiagram";
import { NumberLineDiagram } from "./NumberLineDiagram";
import { TableDiagram } from "./TableDiagram";
import {
  FunctionPlotDiagram,
  EpsilonDeltaDiagram,
  AsymptoteDiagram,
  PiecewiseJumpDiagram,
  Region2DDiagram,
  GeometricDiagram,
} from "./CartesianDiagrams";
import {
  SequenceOnNumberLine,
  TwoPanelSequence,
  BoundedStrip,
  MonotoneSequence,
  SubsequenceHighlight,
} from "./SequenceDiagrams";

type Renderer = (props: { diagram: DiagramSpec }) => React.JSX.Element;

const REGISTRY: Record<string, Renderer> = {
  "number-line": NumberLineDiagram,
  "cartesian-epsilon-delta": EpsilonDeltaDiagram,
  "function-plot-asymptote": AsymptoteDiagram,
  "piecewise-function-plot": PiecewiseJumpDiagram,
  "multi-curve-plot": FunctionPlotDiagram,
  "function-plot": FunctionPlotDiagram,
  "area-under-curve": FunctionPlotDiagram,
  "region-2d": Region2DDiagram,
  "geometric": GeometricDiagram,
  "sequence-on-number-line": SequenceOnNumberLine,
  "two-panel-sequence-plot": TwoPanelSequence,
  "bounded-strip": BoundedStrip,
  "monotone-sequence-plot": MonotoneSequence,
  "subsequence-highlight": SubsequenceHighlight,
  "table": TableDiagram,
};

export function DiagramRenderer({ diagram }: { diagram: DiagramSpec }) {
  const Component = REGISTRY[diagram.type] ?? ConceptDiagram;
  return <Component diagram={diagram} />;
}
