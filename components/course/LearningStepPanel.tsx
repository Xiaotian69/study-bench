import { DiagramRenderer } from "@/components/diagrams/DiagramRenderer";
import type { DiagramSpec, KnowledgePoint } from "@/lib/course/types";

export function LearningStepPanel({ diagrams, knowledgePoint }: { diagrams: DiagramSpec[]; knowledgePoint: KnowledgePoint }) {
  return (
    <article className="learning-panel">
      <p className="eyebrow">当前知识点</p>
      <h2>{knowledgePoint.title}</h2>
      <p>{knowledgePoint.coreExplanation}</p>

      <section className="learning-block">
        <h3>教学图示</h3>
        <div className="diagram-grid">
          {diagrams.map((diagram) => (
            <DiagramRenderer diagram={diagram} key={diagram.id} />
          ))}
        </div>
      </section>

      <section className="learning-block">
        <h3>学习目标</h3>
        <ul>
          {knowledgePoint.learningGoals.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
      </section>

      <section className="learning-block">
        <h3>AI 追问</h3>
        <ol>
          {knowledgePoint.socraticQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </section>
    </article>
  );
}
