import { NextResponse } from "next/server";
import type { TutorModelSettings } from "@/lib/ai/tutorRuntime";
import type { KnowledgePoint } from "@/lib/course/types";

export const runtime = "nodejs";

interface ChatMessage {
  role: "teacher" | "student";
  content: string;
}

interface ChatRequestBody {
  settings?: Partial<TutorModelSettings>;
  knowledgePoint?: Partial<KnowledgePoint>;
  messages?: ChatMessage[];
}

function normalizeBaseUrl(url: string) {
  const trimmed = url.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/chat/completions") ? trimmed : `${trimmed}/chat/completions`;
}

function readSettings(raw: Partial<TutorModelSettings> | undefined): TutorModelSettings | null {
  if (!raw?.apiKey?.trim() || !raw.baseUrl?.trim() || !raw.model?.trim()) return null;
  return { provider: raw.provider ?? "openai-compatible", model: raw.model, baseUrl: raw.baseUrl, apiKey: raw.apiKey };
}

function buildSystemPrompt(kp: Partial<KnowledgePoint>): string {
  const lines = [
    "你是一位数学分析苏格拉底式助教，正在辅导一名大学生。",
    "核心原则：优先提问引导而非直接给出答案；一次只问一个问题；语气友好鼓励；数学符号使用 LaTeX。",
    "",
  ];
  if (kp.title) lines.push(`当前知识点：${kp.title}`);
  if (kp.learningGoals?.length) lines.push(`\n学习目标：\n${kp.learningGoals.map((g, i) => `${i + 1}. ${g}`).join("\n")}`);
  if (kp.coreExplanation) lines.push(`\n核心概念：\n${kp.coreExplanation.slice(0, 600)}${kp.coreExplanation.length > 600 ? "…" : ""}`);
  if (kp.socraticQuestions?.length) lines.push(`\n追问示例（可灵活选用）：\n${kp.socraticQuestions.map((q) => `· ${q}`).join("\n")}`);
  if (kp.commonMistakes?.length) lines.push(`\n常见误区：\n${kp.commonMistakes.map((m) => `· ${m}`).join("\n")}`);
  return lines.join("\n");
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const settings = readSettings(body.settings);
  if (!settings) {
    return NextResponse.json({ error: "missing_model_settings" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "empty_messages" }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt(body.knowledgePoint ?? {});
  const openAiMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === "teacher" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  try {
    const response = await fetch(normalizeBaseUrl(settings.baseUrl), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${settings.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: settings.model, messages: openAiMessages, temperature: 0.5 }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `provider_error_${response.status}` }, { status: 502 });
    }

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "empty_response_from_model" }, { status: 502 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "chat_request_failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
