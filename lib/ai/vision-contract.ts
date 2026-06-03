// Vision answer-review contract.
//
// Types for the "手写答案 -> 视觉批改" pipeline described in
// docs/ai/vision-answer-review-spec.md.
//
// Relationship to the already-implemented direct-vision path:
//   The shipped flow (lib/ai/tutorRuntime.ts -> TutorImageAttachmentPayload,
//   lib/ai/tutorClient.ts -> buildTutorImageAttachments) sends the image
//   inline to a vision model together with the grade request, collapsing
//   transcription + grading into a single call. The types below describe the
//   richer staged contract (OCR/transcription -> merge -> grade) that the main
//   AI can grow into when transcription needs to be inspected or corrected
//   before grading. They are intentionally transport-agnostic and DO NOT
//   replace TutorImageAttachmentPayload.

export type AnswerAttachmentKind = "image";
export type VisionReviewStage = "ocr" | "math-transcription" | "grading";

/**
 * Client-side metadata about an uploaded answer image.
 *
 * Note: this carries no pixel data or data URL on purpose. Answer images are
 * the student's own work, kept in the browser; only the bytes needed for a
 * single grading call are encoded transiently (see TutorImageAttachmentPayload).
 * Nothing here is persisted to disk or git.
 */
export interface AnswerImageAttachment {
  id: string;
  kind: AnswerAttachmentKind;
  fileName: string;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
  sizeBytes: number;
  width?: number;
  height?: number;
}

/**
 * Request to review a (possibly image-backed) answer.
 * `expectedRubric` mirrors the exercise's gradingRubric so the final grade
 * stays anchored to course data rather than free model judgement.
 */
export interface VisionAnswerReviewRequest {
  exerciseId: string;
  knowledgePointId: string;
  textAnswer: string;
  attachments: AnswerImageAttachment[];
  expectedRubric: string[];
}

/**
 * Result of the transcription stage(s). `transcribedAnswer` is the merged,
 * LaTeX-normalized reading of the image(s); `uncertainSegments` lists parts the
 * model could not read confidently and must surface rather than guess.
 * Grading itself still flows through the tutor `grade` task (see spec).
 */
export interface VisionAnswerReviewResult {
  transcribedAnswer: string;
  uncertainSegments: string[];
  stage: VisionReviewStage;
  feedback: string;
}

/** Recommended client-side limits, matching the shipped ExercisePanel. */
export const visionAttachmentLimits = {
  maxBytes: 8 * 1024 * 1024,
  allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"] as const
};
