import { CourseSidebar } from "@/components/course/CourseSidebar";
import { ExercisePanel } from "@/components/course/ExercisePanel";
import { LearningStepPanel } from "@/components/course/LearningStepPanel";
import { TutorPanel } from "@/components/course/TutorPanel";
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
      <TutorPanel knowledgePoint={firstKnowledgePoint} />
    </main>
  );
}
