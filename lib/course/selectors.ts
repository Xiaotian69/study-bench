import type { CourseBundle, DiagramSpec, Exercise, KnowledgePoint } from "./types";

export function getFirstReadyKnowledgePoint(bundle: CourseBundle): KnowledgePoint {
  const first = bundle.chapter.knowledgePoints[0];
  if (!first) {
    throw new Error("sequence-limit chapter has no knowledge points");
  }
  return first;
}

export function getExercisesForKnowledgePoint(bundle: CourseBundle, knowledgePointId: string): Exercise[] {
  return bundle.exercises.filter((exercise) => exercise.knowledgePointIds.includes(knowledgePointId));
}

export function getDiagramsForKnowledgePoint(bundle: CourseBundle, knowledgePointId: string): DiagramSpec[] {
  return bundle.diagrams.filter((diagram) => diagram.knowledgePointIds.includes(knowledgePointId));
}
