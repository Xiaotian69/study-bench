import type { TutorGradeResponse } from "@/lib/ai/tutor-contract";

export type MasteryState = "not_started" | "emerging" | "proficient" | "weak";
export type ExerciseAttemptVerdict = "correct" | "partially_correct" | "incorrect";

export interface ExerciseAttemptRecord {
  exerciseId: string;
  knowledgePointIds: string[];
  submittedAt: string;
  answerText: string;
  attachmentCount: number;
  hintLevelUsed: number;
  verdict: ExerciseAttemptVerdict;
  score: number;
  missingKeyPoints: string[];
}

export interface KnowledgePointProgressRecord {
  knowledgePointId: string;
  masteryState: MasteryState;
  startedAt?: string;
  lastStudiedAt?: string;
  completedAt?: string;
  attempts: ExerciseAttemptRecord[];
  criteriaMet: string[];
  criteriaUnmet: string[];
}

export interface CourseProgressRecord {
  courseId: string;
  volumeId: string;
  updatedAt: string;
  knowledgePoints: Record<string, KnowledgePointProgressRecord>;
}

interface SaveExerciseAttemptInput {
  courseId: string;
  volumeId: string;
  knowledgePointId: string;
  knowledgePointIds: string[];
  exerciseId: string;
  answerText: string;
  attachmentCount: number;
  hintLevelUsed: number;
  result: TutorGradeResponse;
}

export const progressUpdatedEventName = "ai-math-tutor-progress-updated";

function getProgressStorageKey(courseId: string, volumeId: string) {
  return `ai-math-tutor-progress:${courseId}:${volumeId}`;
}

function getDefaultCourseProgress(courseId: string, volumeId: string): CourseProgressRecord {
  return {
    courseId,
    volumeId,
    updatedAt: new Date(0).toISOString(),
    knowledgePoints: {}
  };
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function loadCourseProgress(courseId: string, volumeId: string): CourseProgressRecord {
  if (!canUseStorage()) {
    return getDefaultCourseProgress(courseId, volumeId);
  }

  const raw = window.localStorage.getItem(getProgressStorageKey(courseId, volumeId));
  if (!raw) {
    return getDefaultCourseProgress(courseId, volumeId);
  }

  try {
    const parsed = JSON.parse(raw) as CourseProgressRecord;
    return {
      courseId,
      volumeId,
      updatedAt: parsed.updatedAt ?? new Date(0).toISOString(),
      knowledgePoints: parsed.knowledgePoints ?? {}
    };
  } catch {
    return getDefaultCourseProgress(courseId, volumeId);
  }
}

export function saveCourseProgress(progress: CourseProgressRecord) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(getProgressStorageKey(progress.courseId, progress.volumeId), JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent(progressUpdatedEventName, { detail: progress }));
}

export function getKnowledgePointProgress(progress: CourseProgressRecord, knowledgePointId: string) {
  return progress.knowledgePoints[knowledgePointId];
}

export function getMasteryLabel(masteryState: MasteryState) {
  const labels: Record<MasteryState, string> = {
    not_started: "未学",
    emerging: "初步掌握",
    proficient: "熟练",
    weak: "薄弱"
  };
  return labels[masteryState];
}

export function getChapterMasteryState(progress: CourseProgressRecord, knowledgePointIds: string[]): MasteryState {
  if (knowledgePointIds.length === 0) return "not_started";

  const states = knowledgePointIds.map((id) => progress.knowledgePoints[id]?.masteryState ?? "not_started");
  if (states.some((state) => state === "weak")) return "weak";
  if (states.every((state) => state === "proficient")) return "proficient";
  if (states.some((state) => state === "emerging" || state === "proficient")) return "emerging";
  return "not_started";
}

export function saveExerciseAttempt(input: SaveExerciseAttemptInput): CourseProgressRecord {
  const progress = loadCourseProgress(input.courseId, input.volumeId);
  const now = new Date().toISOString();
  const existing = progress.knowledgePoints[input.knowledgePointId];
  const masteryState = input.result.masterySuggestion;

  const nextRecord: KnowledgePointProgressRecord = {
    knowledgePointId: input.knowledgePointId,
    masteryState,
    startedAt: existing?.startedAt ?? now,
    lastStudiedAt: now,
    completedAt: masteryState === "proficient" ? now : existing?.completedAt,
    attempts: [
      ...(existing?.attempts ?? []),
      {
        exerciseId: input.exerciseId,
        knowledgePointIds: input.knowledgePointIds,
        submittedAt: now,
        answerText: input.answerText,
        attachmentCount: input.attachmentCount,
        hintLevelUsed: input.hintLevelUsed,
        verdict: input.result.verdict,
        score: input.result.score,
        missingKeyPoints: input.result.missingKeyPoints
      }
    ],
    criteriaMet: existing?.criteriaMet ?? [],
    criteriaUnmet: input.result.missingKeyPoints
  };

  const nextProgress = {
    ...progress,
    updatedAt: now,
    knowledgePoints: {
      ...progress.knowledgePoints,
      [input.knowledgePointId]: nextRecord
    }
  };

  saveCourseProgress(nextProgress);
  return nextProgress;
}
