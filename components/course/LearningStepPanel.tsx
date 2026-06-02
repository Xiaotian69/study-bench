import type { KnowledgePoint } from "@/lib/course/types";

export function LearningStepPanel({ knowledgePoint }: { knowledgePoint: KnowledgePoint }) {
  return (
    <article className="learning-panel">
      <p className="eyebrow">当前知识点</p>
      <h2>{knowledgePoint.title}</h2>
      <p>{knowledgePoint.coreExplanation}</p>

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
