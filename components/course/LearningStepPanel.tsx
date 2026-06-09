"use client";

import { useState } from "react";
import { DiagramRenderer } from "@/components/diagrams/DiagramRenderer";
import { MathText } from "@/components/math/MathText";
import type { DiagramSpec, KnowledgePoint } from "@/lib/course/types";

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`learning-block ${open ? "is-open" : "is-collapsed"}`}>
      <button
        aria-expanded={open}
        className="learning-block-toggle"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <h3>{title}</h3>
        <span className="toggle-indicator">{open ? "收起 ▲" : "展开 ▼"}</span>
      </button>
      {open && <div className="learning-block-body">{children}</div>}
    </section>
  );
}

export function LearningStepPanel({
  diagrams,
  knowledgePoint,
}: {
  diagrams: DiagramSpec[];
  knowledgePoint: KnowledgePoint;
}) {
  return (
    <article className="learning-panel">
      <p className="eyebrow">当前知识点</p>
      <h2>{knowledgePoint.title}</h2>

      {knowledgePoint.learningGoals.length > 0 && (
        <div className="goals-callout">
          <p className="goals-callout-label">本节你将掌握</p>
          <ul>
            {knowledgePoint.learningGoals.map((goal) => (
              <li key={goal}>
                <MathText text={goal} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="explanation-body">
        <MathText text={knowledgePoint.coreExplanation} />
      </div>

      {diagrams.length > 0 && (
        <CollapsibleSection title="教学图示">
          <div className="diagram-grid">
            {diagrams.map((diagram) => (
              <DiagramRenderer diagram={diagram} key={diagram.id} />
            ))}
          </div>
        </CollapsibleSection>
      )}

      {knowledgePoint.socraticQuestions.length > 0 && (
        <CollapsibleSection title="思考题 · 检验理解">
          <ol>
            {knowledgePoint.socraticQuestions.map((question) => (
              <li key={question}>
                <MathText text={question} />
              </li>
            ))}
          </ol>
        </CollapsibleSection>
      )}

      {knowledgePoint.commonMistakes.length > 0 && (
        <CollapsibleSection title="易错提醒">
          <ul className="mistake-list">
            {knowledgePoint.commonMistakes.map((mistake) => (
              <li key={mistake}>
                <MathText text={mistake} />
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      )}
    </article>
  );
}
