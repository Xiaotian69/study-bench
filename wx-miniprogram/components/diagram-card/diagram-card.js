function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toPercent(value, min, max) {
  if (max === min) return 50;
  return clamp(Math.round(((value - min) / (max - min)) * 100), 4, 96);
}

function getDiagramTypeGroup(type, displayKind) {
  if (displayKind) return displayKind;
  if (type === 'table') return 'table';
  if (type === 'number-line') return 'number-line';
  if (type && (type.includes('sequence') || type === 'bounded-strip' || type === 'subsequence-highlight')) return 'sequence';
  if (type && (type.includes('function') || type.includes('epsilon') || type.includes('curve') || type.includes('asymptote'))) return 'cartesian';
  if (type === 'geometric' || type === 'region-2d') return 'geometric';
  return 'concept';
}

function getNumberLineView(parameters) {
  const axisMin = Number(parameters.axisMin ?? -1);
  const axisMax = Number(parameters.axisMax ?? 1);
  const epsilon = parameters.epsilon || {};
  const limitPoint = parameters.limitPoint || {};
  const highlight = parameters.highlightInterval || {};
  const from = Number(highlight.from ?? (Number(limitPoint.x ?? 0) - Number(epsilon.value ?? 0.35)));
  const to = Number(highlight.to ?? (Number(limitPoint.x ?? 0) + Number(epsilon.value ?? 0.35)));

  return {
    axisMin,
    axisMax,
    intervalLeft: toPercent(from, axisMin, axisMax),
    intervalWidth: Math.max(8, toPercent(to, axisMin, axisMax) - toPercent(from, axisMin, axisMax)),
    markers: [
      { label: epsilon.leftEndpointLabel || 'a-ε', left: toPercent(from, axisMin, axisMax), tone: 'edge' },
      { label: limitPoint.symbol || 'a', left: toPercent(Number(limitPoint.x ?? 0), axisMin, axisMax), tone: 'limit' },
      { label: epsilon.rightEndpointLabel || 'a+ε', left: toPercent(to, axisMin, axisMax), tone: 'edge' },
    ],
  };
}

function getSequenceTerms(parameters) {
  const rawTerms =
    parameters.terms ||
    parameters.tailTerms ||
    parameters.originalSequence ||
    (parameters.panels && parameters.panels[0] && parameters.panels[0].terms) ||
    [];
  if (!Array.isArray(rawTerms)) return [];

  const ys = rawTerms.map((term) => Number(term.y ?? term.x ?? 0));
  const minY = Math.min(...ys, -1);
  const maxY = Math.max(...ys, 1);
  const maxN = Math.max(...rawTerms.map((term, index) => Number(term.n ?? index + 1)), 1);

  return rawTerms.slice(0, 12).map((term, index) => {
    const n = Number(term.n ?? index + 1);
    const y = Number(term.y ?? term.x ?? 0);
    return {
      n,
      label: term.inside === false ? '外' : term.selected ? '子' : String(n),
      left: toPercent(n, 1, maxN),
      top: 100 - toPercent(y, minY, maxY),
      tone: term.inside === false ? 'outside' : term.selected ? 'selected' : 'inside',
    };
  });
}

function getCartesianView(parameters) {
  const curves = Array.isArray(parameters.curves) ? parameters.curves : [];
  const panels = Array.isArray(parameters.panels) ? parameters.panels : [];
  const labels = curves.length
    ? curves.map((curve) => curve.label || curve.expr).filter(Boolean)
    : panels.map((panel) => panel.title).filter(Boolean);

  const bands = [];
  if (parameters.epsilonBand) bands.push(parameters.epsilonBand.symbol || 'ε 带');
  if (parameters.deltaInterval) bands.push(parameters.deltaInterval.symbol || 'δ 区间');
  if (parameters.asymptote) bands.push((parameters.asymptote.symbol || 'A') + ' 渐近线');
  if (parameters.threshold) bands.push((parameters.threshold.symbol || 'M') + ' 门槛');

  return {
    labels: labels.slice(0, 4),
    bands,
  };
}

function getTableView(parameters) {
  const columns = Array.isArray(parameters.columns) ? parameters.columns : [];
  const rows = Array.isArray(parameters.rows) ? parameters.rows : [];
  return {
    columns,
    rows: rows.slice(0, 8),
  };
}

function deriveDiagramView(diagram) {
  const safeDiagram = diagram || {};
  const parameters = safeDiagram.parameters || {};
  const kind = getDiagramTypeGroup(safeDiagram.type || '', safeDiagram.displayKind);

  return {
    kind,
    typeLabel: safeDiagram.typeLabel || '教学图示',
    numberLine: getNumberLineView(parameters),
    sequenceTerms: getSequenceTerms(parameters),
    cartesian: getCartesianView(parameters),
    table: getTableView(parameters),
    notesPreview: Array.isArray(safeDiagram.teacherNotes) ? safeDiagram.teacherNotes.slice(0, 2) : [],
  };
}

Component({
  properties: {
    diagram: {
      type: Object,
      value: {},
    },
  },
  data: {
    view: deriveDiagramView({}),
    notesOpen: false,
  },
  observers: {
    diagram(diagram) {
      this.setData({
        view: deriveDiagramView(diagram),
        notesOpen: false,
      });
    },
  },
  methods: {
    toggleNotes() {
      this.setData({ notesOpen: !this.data.notesOpen });
    },
  },
});

module.exports = { deriveDiagramView };
