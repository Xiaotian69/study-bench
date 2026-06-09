import { CourseSidebar } from "@/components/course/CourseSidebar";
import { ExercisePanel } from "@/components/course/ExercisePanel";
import { KnowledgePointNav } from "@/components/course/KnowledgePointNav";
import { LearningStepPanel } from "@/components/course/LearningStepPanel";
import { TutorPanel } from "@/components/course/TutorPanel";
import { getAllVolumes, loadMathAnalysisCourse } from "@/lib/course/loadCourse";
import {
  getDiagramsForKnowledgePoint,
  getExercisesForKnowledgePoint,
  getSectionForKnowledgePoint
} from "@/lib/course/selectors";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ chapter?: string; kp?: string }> }) {
  const { chapter, kp } = await searchParams;
  const bundle = loadMathAnalysisCourse(chapter);
  const volumes = getAllVolumes();

  const allKPs = bundle.chapter.knowledgePoints;
  const kpIndex = Math.max(0, Math.min(parseInt(kp ?? "0") || 0, allKPs.length - 1));
  const activeKP = allKPs[kpIndex] ?? allKPs[0];

  let sectionId = "section-unknown";
  try {
    sectionId = getSectionForKnowledgePoint(bundle, activeKP.id).id;
  } catch {
    // draft chapters may not have all KP IDs registered in volume sections
  }

  const diagrams = getDiagramsForKnowledgePoint(bundle, activeKP.id);
  const exercises = getExercisesForKnowledgePoint(bundle, activeKP.id);

  return (
    <main className="workbench-shell">
      <CourseSidebar activeChapterId={bundle.chapter.id} courseId={bundle.course.id} volumes={volumes} />
      <div className="main-column">
        <KnowledgePointNav
          activeKpIndex={kpIndex}
          chapterId={bundle.chapter.id}
          knowledgePoints={allKPs}
        />
        <LearningStepPanel diagrams={diagrams} knowledgePoint={activeKP} />
        <ExercisePanel
          chapterId={bundle.chapter.id}
          courseId={bundle.course.id}
          exercises={exercises}
          knowledgePoint={activeKP}
          sectionId={sectionId}
          volumeId={bundle.volume.id}
        />
      </div>
      <TutorPanel knowledgePoint={activeKP} />
    </main>
  );
}
