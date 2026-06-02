import { loadMathAnalysisCourse } from "@/lib/course/loadCourse";
import { getFirstReadyKnowledgePoint } from "@/lib/course/selectors";

export default function HomePage() {
  const bundle = loadMathAnalysisCourse();
  const firstKnowledgePoint = getFirstReadyKnowledgePoint(bundle);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">{bundle.volume.title}</p>
        <h1>{bundle.course.title} AI 同步学习助手</h1>
        <p>{bundle.chapter.overview}</p>
        <p>
          当前样板知识点：<strong>{firstKnowledgePoint.title}</strong>
        </p>
      </section>
    </main>
  );
}
