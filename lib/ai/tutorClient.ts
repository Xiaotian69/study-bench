"use client";

import type {
  TutorContextEnvelope,
  TutorExerciseContext,
  TutorGradeResponse,
  TutorKnowledgePointContext,
  TutorResponse
} from "@/lib/ai/tutor-contract";
import type { Exercise, KnowledgePoint } from "@/lib/course/types";
import type { TutorImageAttachmentPayload } from "@/lib/ai/tutorRuntime";
import type { TutorSettings } from "@/lib/tutor/tutorTypes";

interface GradeEnvelopeInput {
  courseId: string;
  chapterId: string;
  sectionId: string;
  knowledgePoint: KnowledgePoint;
  exercise: Exercise;
  studentAnswer: string;
  hintLevelUsed: number;
}

interface TutorApiResponse {
  result?: TutorResponse;
  error?: string;
}

type Fetcher = typeof fetch;

interface TutorImageAttachmentInput {
  id: string;
  name: string;
  file: File;
}

const maxImageBytes = 8 * 1024 * 1024;

function trimKnowledgePoint(knowledgePoint: KnowledgePoint): TutorKnowledgePointContext {
  return {
    id: knowledgePoint.id,
    title: knowledgePoint.title,
    coreExplanation: knowledgePoint.coreExplanation,
    keyDefinitions: knowledgePoint.keyDefinitions,
    keyTheorems: knowledgePoint.keyTheorems,
    proofIdeas: knowledgePoint.proofIdeas,
    socraticQuestions: knowledgePoint.socraticQuestions,
    commonMistakes: knowledgePoint.commonMistakes,
    masteryCriteria: knowledgePoint.masteryCriteria
  };
}

function trimExercise(exercise: Exercise): TutorExerciseContext {
  return {
    id: exercise.id,
    prompt: exercise.prompt,
    gradingRubric: exercise.gradingRubric,
    hints: exercise.hints,
    commonMistakes: exercise.commonMistakes
  };
}

function isTutorGradeResponse(result: TutorResponse | undefined): result is TutorGradeResponse {
  return Boolean(
    result &&
      "verdict" in result &&
      "score" in result &&
      "feedback" in result &&
      "missingKeyPoints" in result &&
      "nextHintLevel" in result
  );
}

export function buildTutorGradeEnvelope(input: GradeEnvelopeInput): TutorContextEnvelope {
  return {
    task: "grade",
    locale: "zh-CN",
    context: {
      courseId: input.courseId,
      chapterId: input.chapterId,
      sectionId: input.sectionId,
      knowledgePointId: input.knowledgePoint.id,
      currentStep: "basic-practice",
      knowledgePoint: trimKnowledgePoint(input.knowledgePoint),
      exercise: trimExercise(input.exercise),
      learnerHistory: {
        masteryState: "emerging",
        recentAnswers: input.studentAnswer.trim() ? [input.studentAnswer.trim()] : [],
        hintLevelUsed: input.hintLevelUsed
      }
    },
    payload: {
      exerciseId: input.exercise.id,
      studentAnswer: input.studentAnswer
    }
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("invalid_image_data_url"));
    });
    reader.addEventListener("error", () => reject(new Error("image_read_failed")));
    reader.readAsDataURL(file);
  });
}

export async function buildTutorImageAttachments(
  imageAttachments: TutorImageAttachmentInput[]
): Promise<TutorImageAttachmentPayload[]> {
  return Promise.all(
    imageAttachments.map(async (attachment) => {
      if (attachment.file.size > maxImageBytes) {
        throw new Error("image_too_large_8MB");
      }

      return {
        id: attachment.id,
        name: attachment.name,
        mimeType: attachment.file.type,
        sizeBytes: attachment.file.size,
        dataUrl: await readFileAsDataUrl(attachment.file)
      };
    })
  );
}

export async function requestTutorGrade(
  settings: TutorSettings,
  envelope: TutorContextEnvelope,
  options: { imageAttachments?: TutorImageAttachmentPayload[] } = {},
  fetcher: Fetcher = fetch
): Promise<TutorGradeResponse> {
  const response = await fetcher("/api/tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings, envelope, attachments: options.imageAttachments ?? [] })
  });

  const data = (await response.json()) as TutorApiResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "tutor_grade_request_failed");
  }

  if (!isTutorGradeResponse(data.result)) {
    throw new Error("invalid_tutor_grade_response");
  }

  return data.result;
}
