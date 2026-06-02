import { CourseSidebar } from "@/components/course/CourseSidebar";
import { LearningStepPanel } from "@/components/course/LearningStepPanel";
import { loadMathAnalysisCourse } from "@/lib/course/loadCourse";
import { getFirstReadyKnowledgePoint } from "@/lib/course/selectors";

export default function HomePage() {
  const bundle = loadMathAnalysisCourse();
  const firstKnowledgePoint = getFirstReadyKnowledgePoint(bundle);

  return (
    <main className="workbench-shell">
      <CourseSidebar activeChapterId={bundle.chapter.id} volume={bundle.volume} />
      <LearningStepPanel knowledgePoint={firstKnowledgePoint} />
      <aside className="tutor-placeholder">
        <p className="eyebrow">AI 老师</p>
        <h2>短讲 + 追问 + 练习反馈</h2>
        <p>下一步接入题目、图示、提示和本地 API Key 设置。</p>
      </aside>
    </main>
  );
}
