import {
  tutorTaskOutputKind,
  type AskPayload,
  type GradePayload,
  type HintPayload,
  type MasteryPayload,
  type TutorAskResponse,
  type TutorContextEnvelope,
  type TutorExplainResponse,
  type TutorGradeResponse,
  type TutorHintResponse,
  type TutorMasteryResponse,
  type TutorResponse
} from "@/lib/ai/tutor-contract";

export interface TutorModelSettings {
  provider: string;
  model: string;
  baseUrl: string;
  apiKey: string;
}

interface TutorChatMessage {
  role: "system" | "user";
  content: string;
}

interface OpenAIChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
}

type Fetcher = typeof fetch;

function compactJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function stripJsonFence(raw: string) {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced?.[1]?.trim() ?? trimmed;
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.trim().replace(/\/+$/, "");
}

function buildChatCompletionsUrl(baseUrl: string) {
  const normalized = normalizeBaseUrl(baseUrl);
  if (normalized.endsWith("/chat/completions")) return normalized;
  return `${normalized}/chat/completions`;
}

function buildSystemPrompt(envelope: TutorContextEnvelope) {
  const outputKind = tutorTaskOutputKind[envelope.task];

  return [
    "你是一个数学分析课程的 AI 老师，只在开发者预制的课程脚本范围内工作。",
    "你只能围绕当前知识点和当前题目回答，不得扩展到其他章节或编造题目。",
    "数学符号一律使用 LaTeX。不得泄露或索要 API Key。",
    "在提示任务中，除最后一级提示外不得直接给完整答案。",
    "在批改任务中，只依据注入的 gradingRubric、commonMistakes 与 masteryCriteria。",
    outputKind === "json" ? "本次任务必须只输出一个 JSON 对象，不要 Markdown 围栏或额外解释。" : "本次任务输出面向学生的自然语言文本。",
    "",
    `任务：${envelope.task}`,
    `当前步骤：${envelope.context.currentStep}`,
    `课程上下文：${compactJson({
      courseId: envelope.context.courseId,
      chapterId: envelope.context.chapterId,
      sectionId: envelope.context.sectionId,
      knowledgePointId: envelope.context.knowledgePointId,
      learnerHistory: envelope.context.learnerHistory
    })}`,
    `知识点：${compactJson(envelope.context.knowledgePoint)}`,
    envelope.context.exercise ? `当前题目：${compactJson(envelope.context.exercise)}` : "当前题目：无"
  ].join("\n");
}

function buildUserPrompt(envelope: TutorContextEnvelope) {
  return [
    "请按照任务类型处理下面 payload。",
    `payload：${compactJson(envelope.payload)}`,
    "",
    "输出格式要求：",
    buildOutputInstruction(envelope)
  ].join("\n");
}

function buildOutputInstruction(envelope: TutorContextEnvelope) {
  if (envelope.task === "explain") {
    return "输出自然语言讲解，不要给练习题完整答案。";
  }

  if (envelope.task === "ask") {
    return compactJson({
      question: "面向学生的一个问题，可含 LaTeX",
      sourceQuestionIndex: 0,
      expectedFocus: "本问题考察点"
    });
  }

  if (envelope.task === "grade") {
    return compactJson({
      verdict: "correct | partially_correct | incorrect",
      score: 0,
      feedback: "先肯定再指出问题",
      missingKeyPoints: [],
      nextHintLevel: 1,
      masterySuggestion: "not_started | emerging | proficient | weak"
    });
  }

  if (envelope.task === "hint") {
    return compactJson({
      level: 1,
      maxLevel: envelope.context.exercise?.hints.length ?? 0,
      hint: "当前层级提示",
      isFinalAnswerRevealed: false
    });
  }

  return compactJson({
    masteryState: "not_started | emerging | proficient | weak",
    criteriaMet: [],
    criteriaUnmet: [],
    recommendation: "advance | review-explanation | more-basic-practice | retry-exercise",
    rationale: "判定理由"
  });
}

export function buildTutorMessages(envelope: TutorContextEnvelope): TutorChatMessage[] {
  return [
    { role: "system", content: buildSystemPrompt(envelope) },
    { role: "user", content: buildUserPrompt(envelope) }
  ];
}

export function buildOpenAIChatCompletionRequest(settings: TutorModelSettings, envelope: TutorContextEnvelope) {
  return {
    model: settings.model,
    messages: buildTutorMessages(envelope),
    temperature: tutorTaskOutputKind[envelope.task] === "json" ? 0.2 : 0.4
  };
}

export function buildTutorFallbackResponse(envelope: TutorContextEnvelope): TutorResponse {
  if (envelope.task === "explain") {
    return {
      text: "当前模型暂时不可用。你可以先按讲义核心解释复述一遍，再尝试回答右侧追问。"
    } satisfies TutorExplainResponse;
  }

  if (envelope.task === "ask") {
    const payload = envelope.payload as AskPayload;
    const asked = new Set(payload.askedQuestionIds ?? []);
    const index = envelope.context.knowledgePoint.socraticQuestions.findIndex((_, questionIndex) => !asked.has(questionIndex));
    const sourceQuestionIndex = index >= 0 ? index : 0;
    const question = envelope.context.knowledgePoint.socraticQuestions[sourceQuestionIndex] ?? "你能先复述这个知识点的核心定义吗？";

    return {
      question,
      sourceQuestionIndex,
      expectedFocus: "回到当前知识点的核心理解。"
    } satisfies TutorAskResponse;
  }

  if (envelope.task === "grade") {
    const exercise = envelope.context.exercise;
    const nextHintLevel = exercise ? Math.min(envelope.context.learnerHistory.hintLevelUsed + 1, exercise.hints.length) : 1;

    return {
      verdict: "partially_correct",
      score: 0,
      feedback: "暂时无法完成自动批改。请检查模型设置或网络状态；当前不会编造评分结果。",
      missingKeyPoints: exercise?.gradingRubric ?? [],
      nextHintLevel,
      masterySuggestion: envelope.context.learnerHistory.masteryState
    } satisfies TutorGradeResponse;
  }

  if (envelope.task === "hint") {
    const payload = envelope.payload as HintPayload;
    const hints = envelope.context.exercise?.hints ?? [];
    const maxLevel = hints.length;
    const level = maxLevel > 0 ? clampNumber(payload.requestedLevel, 1, maxLevel, 1) : 0;

    return {
      level,
      maxLevel,
      hint: level > 0 ? hints[level - 1] : "当前题目还没有录入提示。",
      isFinalAnswerRevealed: maxLevel > 0 && level === maxLevel
    } satisfies TutorHintResponse;
  }

  const payload = envelope.payload as MasteryPayload;
  return {
    masteryState: payload.currentMastery,
    criteriaMet: [],
    criteriaUnmet: envelope.context.knowledgePoint.masteryCriteria,
    recommendation: "review-explanation",
    rationale: "自动掌握度判定暂时不可用，建议复看讲义并重试当前知识点。"
  } satisfies TutorMasteryResponse;
}

export function parseTutorModelOutput(envelope: TutorContextEnvelope, rawContent: string): TutorResponse {
  if (tutorTaskOutputKind[envelope.task] === "text") {
    return { text: rawContent.trim() || "我会围绕当前知识点继续讲解。" } satisfies TutorExplainResponse;
  }

  try {
    const parsed = JSON.parse(stripJsonFence(rawContent)) as Record<string, unknown>;

    if (envelope.task === "ask") {
      return {
        question: typeof parsed.question === "string" ? parsed.question : "",
        sourceQuestionIndex: clampNumber(parsed.sourceQuestionIndex, 0, envelope.context.knowledgePoint.socraticQuestions.length - 1, 0),
        expectedFocus: typeof parsed.expectedFocus === "string" ? parsed.expectedFocus : ""
      } satisfies TutorAskResponse;
    }

    if (envelope.task === "grade") {
      const verdicts = ["correct", "partially_correct", "incorrect"];
      const masteryStates = ["not_started", "emerging", "proficient", "weak"];

      return {
        verdict: verdicts.includes(String(parsed.verdict)) ? (parsed.verdict as TutorGradeResponse["verdict"]) : "partially_correct",
        score: clampNumber(parsed.score, 0, 100, 0),
        feedback: typeof parsed.feedback === "string" ? parsed.feedback : "模型未返回可用反馈。",
        missingKeyPoints: asStringArray(parsed.missingKeyPoints),
        nextHintLevel: clampNumber(parsed.nextHintLevel, 0, envelope.context.exercise?.hints.length ?? 1, 1),
        masterySuggestion: masteryStates.includes(String(parsed.masterySuggestion))
          ? (parsed.masterySuggestion as TutorGradeResponse["masterySuggestion"])
          : envelope.context.learnerHistory.masteryState
      } satisfies TutorGradeResponse;
    }

    if (envelope.task === "hint") {
      const maxLevel = envelope.context.exercise?.hints.length ?? clampNumber(parsed.maxLevel, 0, 99, 0);
      const level = maxLevel > 0 ? clampNumber(parsed.level, 1, maxLevel, 1) : 0;

      return {
        level,
        maxLevel,
        hint: typeof parsed.hint === "string" ? parsed.hint : "",
        isFinalAnswerRevealed: Boolean(parsed.isFinalAnswerRevealed) && level === maxLevel
      } satisfies TutorHintResponse;
    }

    const states = ["not_started", "emerging", "proficient", "weak"];
    const recommendations = ["advance", "review-explanation", "more-basic-practice", "retry-exercise"];
    return {
      masteryState: states.includes(String(parsed.masteryState))
        ? (parsed.masteryState as TutorMasteryResponse["masteryState"])
        : envelope.context.learnerHistory.masteryState,
      criteriaMet: asStringArray(parsed.criteriaMet),
      criteriaUnmet: asStringArray(parsed.criteriaUnmet),
      recommendation: recommendations.includes(String(parsed.recommendation))
        ? (parsed.recommendation as TutorMasteryResponse["recommendation"])
        : "review-explanation",
      rationale: typeof parsed.rationale === "string" ? parsed.rationale : "模型未返回可用判定理由。"
    } satisfies TutorMasteryResponse;
  } catch {
    return buildTutorFallbackResponse(envelope);
  }
}

export async function callOpenAICompatibleTutor(
  settings: TutorModelSettings,
  envelope: TutorContextEnvelope,
  fetcher: Fetcher = fetch
): Promise<TutorResponse> {
  if (!settings.apiKey.trim()) {
    throw new Error("missing_api_key");
  }

  if (!settings.baseUrl.trim()) {
    throw new Error("missing_base_url");
  }

  if (!settings.model.trim()) {
    throw new Error("missing_model");
  }

  const response = await fetcher(buildChatCompletionsUrl(settings.baseUrl), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(buildOpenAIChatCompletionRequest(settings, envelope))
  });

  if (!response.ok) {
    throw new Error(`provider_error_${response.status}`);
  }

  const data = (await response.json()) as OpenAIChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    return buildTutorFallbackResponse(envelope);
  }

  return parseTutorModelOutput(envelope, content);
}
