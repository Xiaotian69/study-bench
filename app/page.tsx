import { CourseSidebar } from "@/components/course/CourseSidebar";
import { ExercisePanel } from "@/components/course/ExercisePanel";
import { LearningStepPanel } from "@/components/course/LearningStepPanel";
import { TutorPanel } from "@/components/course/TutorPanel";
import { getAllVolumes, loadMathAnalysisCourse } from "@/lib/course/loadCourse";
import {
  getDiagramsForKnowledgePoint,
  getExercisesForKnowledgePoint,
  getFirstReadyKnowledgePoint,
  getSectionForKnowledgePoint
} from "@/lib/course/selectors";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ chapter?: string }> }) {
  const { chapter } = await searchParams;
  const bundle = loadMathAnalysisCourse(chapter);
  const volumes = getAllVolumes();
  const firstKnowledgePoint = getFirstReadyKnowledgePoint(bundle);
  const firstSection = getSectionForKnowledgePoint(bundle, firstKnowledgePoint.id);
  const diagrams = getDiagramsForKnowledgePoint(bundle, firstKnowledgePoint.id);
  const exercises = getExercisesForKnowledgePoint(bundle, firstKnowledgePoint.id);

  return (
    <main className="workbench-shell">
      <CourseSidebar activeChapterId={bundle.chapter.id} courseId={bundle.course.id} volumes={volumes} />
      <div className="main-column">
        <LearningStepPanel diagrams={diagrams} knowledgePoint={firstKnowledgePoint} />
        <ExercisePanel
          chapterId={bundle.chapter.id}
          courseId={bundle.course.id}
          exercises={exercises}
          knowledgePoint={firstKnowledgePoint}
          sectionId={firstSection.id}
          volumeId={bundle.volume.id}
        />
      </div>
      <TutorPanel knowledgePoint={firstKnowledgePoint} />
    </main>
  );
}
