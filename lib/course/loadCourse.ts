import course from "@/content/courses/math-analysis/course.json";
import volume1 from "@/content/courses/math-analysis/volume-1.json";
import volume2 from "@/content/courses/math-analysis/volume-2.json";
import { chapterRegistry } from "./chapterRegistry";
import type { ChapterContent, CourseBundle, DiagramSpec, Exercise, Volume, VolumeChapter } from "./types";

const DEFAULT_CHAPTER_ID = "ch-sequence-limit";

function adaptChapter(raw: Record<string, unknown>, volumeChapter: VolumeChapter): ChapterContent {
  if ("id" in raw) {
    return raw as unknown as ChapterContent;
  }
  return {
    ...raw,
    id: raw.chapterId as string,
    number: volumeChapter.number,
    title: volumeChapter.title,
    status: volumeChapter.status,
    overview: typeof raw.overview === "string" ? raw.overview : "",
  } as unknown as ChapterContent;
}

function adaptExercise(raw: unknown): Exercise {
  const e = raw as Record<string, unknown>;
  const knowledgePointIds = Array.isArray(e.knowledgePointIds)
    ? (e.knowledgePointIds as string[])
    : typeof e.knowledgePointId === "string"
      ? [e.knowledgePointId]
      : [];
  const prompt =
    typeof e.prompt === "string" ? e.prompt :
    typeof e.problem === "string" ? e.problem :
    typeof e.problemStatement === "string" ? e.problemStatement : "";
  const gradingRubric = Array.isArray(e.gradingRubric)
    ? (e.gradingRubric as unknown[]).map((r) =>
        typeof r === "string" ? r : typeof (r as Record<string, unknown>).criterion === "string" ? ((r as Record<string, unknown>).criterion as string) : JSON.stringify(r)
      )
    : [];
  return { ...e, knowledgePointIds, prompt, gradingRubric } as unknown as Exercise;
}

function adaptDiagram(raw: unknown): DiagramSpec {
  const d = raw as Record<string, unknown>;
  return {
    ...d,
    type: typeof d.type === "string" ? d.type : typeof d.diagramType === "string" ? d.diagramType : "graph",
    description: typeof d.description === "string" ? d.description : "",
    studentPrompt: typeof d.studentPrompt === "string" ? d.studentPrompt : typeof d.mathContext === "string" ? d.mathContext : typeof d.description === "string" ? d.description : "",
    parameters: (d.parameters ?? {}) as Record<string, unknown>,
    teacherNotes: Array.isArray(d.teacherNotes) ? (d.teacherNotes as string[]) : [],
    knowledgePointIds: Array.isArray(d.knowledgePointIds) ? (d.knowledgePointIds as string[]) : [],
  } as unknown as DiagramSpec;
}

export function loadMathAnalysisCourse(chapterId?: string): CourseBundle {
  const targetId = chapterId ?? DEFAULT_CHAPTER_ID;

  const vol1Chapter = (volume1 as unknown as Volume).chapters.find((c) => c.id === targetId);
  const vol2Chapter = (volume2 as unknown as Volume).chapters.find((c) => c.id === targetId);
  const volumeChapter = vol1Chapter ?? vol2Chapter;
  const volume = vol1Chapter ? (volume1 as unknown as Volume) : (volume2 as unknown as Volume);

  if (!volumeChapter) {
    return loadMathAnalysisCourse(DEFAULT_CHAPTER_ID);
  }

  const entry = chapterRegistry[targetId];
  if (!entry) {
    return loadMathAnalysisCourse(DEFAULT_CHAPTER_ID);
  }

  const chapter = adaptChapter(entry.chapter, volumeChapter);
  const exercises = (entry.exercises.exercises as unknown[]).map(adaptExercise);
  const diagrams = (entry.diagrams.diagrams as unknown[]).map(adaptDiagram);

  return { course: course as CourseBundle["course"], volume, chapter, exercises, diagrams };
}

export function getAllVolumes(): Volume[] {
  return [volume1 as unknown as Volume, volume2 as unknown as Volume];
}
