// Tutor runtime contract.
//
// TypeScript shapes for the five tutor tasks defined in
// docs/ai/tutor-prompt-spec.md. The main AI implements the real model API
// route against these types; the local mock tutor (lib/tutor/localTutor.ts)
// returns the same response shapes.
//
// Companion docs: docs/ai/tutor-runtime-contract.md
// Sample data:    lib/ai/tutor-fixtures.ts

import type { TutorMode } from "@/lib/tutor/tutorTypes";

export type TutorTask = "explain" | "ask" | "grade" | "hint" | "mastery";
export type TutorLocale = "zh-CN";
export type TutorVerdict = "correct" | "partially_correct" | "incorrect";
export type MasteryState = "not_started" | "emerging" | "proficient" | "weak";
export type MasteryRecommendation =
  | "advance"
  | "review-explanation"
  | "more-basic-practice"
  | "retry-exercise";

// TutorTask must stay in sync with the existing TutorMode union used by the UI
// layer. The assignment below fails to type-check if the two unions diverge.
const _taskMatchesMode: TutorMode = "explain" as TutorTask;
void _taskMatchesMode;

/**
 * Per-task payload shapes. The API route narrows `payload` by `task`.
 * All fields map directly to docs/ai/tutor-prompt-spec.md.
 */
export interface ExplainPayload {
  focus: "core" | "student-question" | string; // also "definition:<name>" | "theorem:<name>" | "example:<exerciseId>"
  studentQuestion?: string;
  depth: "brief" | "walkthrough";
}

export interface AskPayload {
  intent: "warmup" | "probe";
  lastAnswer?: string;
  askedQuestionIds: number[];
}

export interface GradePayload {
  studentAnswer: string;
  exerciseId: string;
}

export interface HintPayload {
  requestedLevel: number;
  exerciseId: string;
}

export interface MasteryPayload {
  gradeResults: TutorGradeResponse[];
  currentMastery: MasteryState;
}

export type TutorPayload =
  | ExplainPayload
  | AskPayload
  | GradePayload
  | HintPayload
  | MasteryPayload;

/**
 * Trimmed knowledge-point view injected into the envelope. The API route should
 * strip fields irrelevant to the current task before sending to the model
 * (see contract doc, "上下文裁剪").
 */
export interface TutorKnowledgePointContext {
  id: string;
  title: string;
  coreExplanation: string;
  keyDefinitions: Array<{ name: string; statement: string }>;
  keyTheorems: Array<{ name: string; statement: string }>;
  proofIdeas: string[];
  socraticQuestions: string[];
  commonMistakes: string[];
  masteryCriteria: string[];
}

/**
 * Trimmed exercise view injected when a task targets a specific exercise.
 */
export interface TutorExerciseContext {
  id: string;
  prompt: string;
  gradingRubric: string[];
  hints: string[];
  commonMistakes: string[];
}

export interface TutorLearnerHistory {
  masteryState: MasteryState;
  recentAnswers: string[];
  hintLevelUsed: number;
}

/**
 * The single request envelope every tutor call uses (spec section 1.3).
 * `knowledgePoint` and `exercise` are typed as the trimmed views above; they
 * are declared `unknown` in the task brief but narrowed here for safety.
 */
export interface TutorContextEnvelope {
  task: TutorTask;
  locale: TutorLocale;
  context: {
    courseId: string;
    chapterId: string;
    sectionId: string;
    knowledgePointId: string;
    currentStep: string;
    knowledgePoint: TutorKnowledgePointContext;
    exercise?: TutorExerciseContext;
    learnerHistory: TutorLearnerHistory;
  };
  payload: TutorPayload;
}

// ---- Response shapes ------------------------------------------------------

/**
 * `explain` returns natural-language text (not JSON). Wrapped for a uniform
 * return type from the API route.
 */
export interface TutorExplainResponse {
  text: string;
}

export interface TutorAskResponse {
  question: string;
  sourceQuestionIndex: number;
  expectedFocus: string;
}

export interface TutorGradeResponse {
  verdict: TutorVerdict;
  score: number;
  feedback: string;
  missingKeyPoints: string[];
  nextHintLevel: number;
  masterySuggestion: MasteryState;
}

export interface TutorHintResponse {
  level: number;
  maxLevel: number;
  hint: string;
  isFinalAnswerRevealed: boolean;
}

export interface TutorMasteryResponse {
  masteryState: MasteryState;
  criteriaMet: string[];
  criteriaUnmet: string[];
  recommendation: MasteryRecommendation;
  rationale: string;
}

export type TutorResponse =
  | TutorExplainResponse
  | TutorAskResponse
  | TutorGradeResponse
  | TutorHintResponse
  | TutorMasteryResponse;

/**
 * Maps each task to whether the model returns strict JSON or free text.
 * Used by the API route to pick a parsing path (see contract doc section 3).
 */
export const tutorTaskOutputKind: Record<TutorTask, "json" | "text"> = {
  explain: "text",
  ask: "json",
  grade: "json",
  hint: "json",
  mastery: "json"
};
