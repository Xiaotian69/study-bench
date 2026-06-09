import type { CourseBundle, DiagramSpec, Exercise, KnowledgePoint, VolumeSection } from "./types";

export function getFirstReadyKnowledgePoint(bundle: CourseBundle): KnowledgePoint {
  const first = bundle.chapter.knowledgePoints[0];
  if (!first) {
    throw new Error("chapter has no knowledge points");
  }
  return first;
}

export function getExercisesForKnowledgePoint(bundle: CourseBundle, knowledgePointId: string): Exercise[] {
  return bundle.exercises.filter((exercise) => exercise.knowledgePointIds.includes(knowledgePointId));
}

export function getDiagramsForKnowledgePoint(bundle: CourseBundle, knowledgePointId: string): DiagramSpec[] {
  return bundle.diagrams.filter((diagram) => diagram.knowledgePointIds.includes(knowledgePointId));
}

export function getSectionForKnowledgePoint(bundle: CourseBundle, knowledgePointId: string): VolumeSection {
  for (const chapter of bundle.volume.chapters) {
    const section = chapter.sections.find((candidate) => candidate.knowledgePointIds?.includes(knowledgePointId));
    if (section) return section;
  }

  throw new Error(`missing section for knowledge point ${knowledgePointId}`);
}
