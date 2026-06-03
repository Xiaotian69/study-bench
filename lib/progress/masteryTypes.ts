// Types-only surface for the learning-progress model.
//
// The canonical model + localStorage store live in
// lib/progress/masteryProgress.ts. This module re-exports just the types so
// non-UI code (and future server code) can import them without pulling in the
// browser store, and exposes the ordered state list for legends/iteration.
//
// Do NOT redefine these interfaces here — masteryProgress.ts is the single
// source of truth. Spec: docs/progress/mastery-state-spec.md

import type { MasteryState } from "@/lib/progress/masteryProgress";

export type {
  MasteryState,
  ExerciseAttemptVerdict,
  ExerciseAttemptRecord,
  KnowledgePointProgressRecord,
  CourseProgressRecord
} from "@/lib/progress/masteryProgress";

/**
 * The four mastery states in display order (worst-known last is intentional:
 * this is learning order, not severity). Typed against MasteryState so it can
 * never drift to an invalid value.
 */
export const masteryStates = [
  "not_started",
  "emerging",
  "proficient",
  "weak"
] as const satisfies readonly MasteryState[];
