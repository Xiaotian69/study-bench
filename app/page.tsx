import { CourseSidebar } from "@/components/course/CourseSidebar";
import { ExercisePanel } from "@/components/course/ExercisePanel";
import { LearningStepPanel } from "@/components/course/LearningStepPanel";
import { loadMathAnalysisCourse } from "@/lib/course/loadCourse";
import { getDiagramsForKnowledgePoint, getExercisesForKnowledgePoint, getFirstReadyKnowledgePoint } from "@/lib/course/selectors";

export default function HomePage() {
  const bundle = loadMathAnalysisCourse();
  const firstKnowledgePoint = getFirstReadyKnowledgePoint(bundle);
  const diagrams = getDiagramsForKnowledgePoint(bundle, firstKnowledgePoint.id);
  const exercises = getExercisesForKnowledgePoint(bundle, firstKnowledgePoint.id);

  return (
    <main className="workbench-shell">
      <CourseSidebar activeChapterId={bundle.chapter.id} volume={bundle.volume} />
      <div className="main-column">
        <LearningStepPanel diagrams={diagrams} knowledgePoint={firstKnowledgePoint} />
        <ExercisePanel exercises={exercises} />
      </div>
      <aside className="tutor-placeholder">
        <p className="eyebrow">AI 老师</p>
        <h2>短讲 + 追问 + 练习反馈</h2>
        <p>下一步接入题目、图示、提示和本地 API Key 设置。</p>
      </aside>
    </main>
  );
}
