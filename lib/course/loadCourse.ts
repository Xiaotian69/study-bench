import { getRegisteredCourse, getVolumesForCourse } from "./courseRegistry";
import type { ChapterContent, CourseBundle, DiagramSpec, Exercise, Volume, VolumeChapter } from "./types";

const DEFAULT_COURSE_ID = "math-analysis";
const DEFAULT_CHAPTER_ID = "ch-sequence-limit";
const DEFAULT_GD_CHAPTER_ID = "ch-gd-function-limit";

const DEFAULT_CHAPTER_BY_COURSE: Record<string, string> = {
  "math-analysis": DEFAULT_CHAPTER_ID,
  "gaodeng-shuxue": DEFAULT_GD_CHAPTER_ID,
};

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

function findVolumeChapter(courseId: string, chapterId: string): { volume: Volume; volumeChapter: VolumeChapter } | undefined {
  const registered = getRegisteredCourse(courseId);
  if (!registered) return undefined;

  for (const volume of registered.volumes) {
    const volumeChapter = volume.chapters.find((c) => c.id === chapterId);
    if (volumeChapter) {
      return { volume, volumeChapter };
    }
  }
  return undefined;
}

export function loadCourse(courseId: string = DEFAULT_COURSE_ID, chapterId?: string): CourseBundle {
  const registered = getRegisteredCourse(courseId);
  if (!registered) {
    return loadCourse(DEFAULT_COURSE_ID, DEFAULT_CHAPTER_ID);
  }

  const fallbackChapterId = DEFAULT_CHAPTER_BY_COURSE[courseId];
  const targetId = chapterId ?? fallbackChapterId;
  if (!targetId) {
    throw new Error(`chapterId is required for course ${courseId}`);
  }

  const located = findVolumeChapter(courseId, targetId);
  if (!located) {
    if (fallbackChapterId && targetId !== fallbackChapterId) {
      return loadCourse(DEFAULT_COURSE_ID, fallbackChapterId);
    }
    throw new Error(`chapter ${targetId} not found in course ${courseId}`);
  }

  const { volume, volumeChapter } = located;
  const entry = registered.chapterRegistry[targetId];
  if (!entry) {
    if (fallbackChapterId && targetId !== fallbackChapterId) {
      return loadCourse(DEFAULT_COURSE_ID, fallbackChapterId);
    }
    throw new Error(`chapter content not registered for ${targetId} in course ${courseId}`);
  }

  const chapter = adaptChapter(entry.chapter, volumeChapter);
  const exercises = (entry.exercises.exercises as unknown[]).map(adaptExercise);
  const diagrams = (entry.diagrams.diagrams as unknown[]).map(adaptDiagram);

  return { course: registered.course, volume, chapter, exercises, diagrams };
}

export function loadMathAnalysisCourse(chapterId?: string): CourseBundle {
  return loadCourse(DEFAULT_COURSE_ID, chapterId ?? DEFAULT_CHAPTER_ID);
}

export function loadGaodengShuxueCourse(chapterId?: string): CourseBundle {
  return loadCourse("gaodeng-shuxue", chapterId ?? DEFAULT_GD_CHAPTER_ID);
}

export function getAllVolumes(courseId: string = DEFAULT_COURSE_ID): Volume[] {
  return getVolumesForCourse(courseId);
}
