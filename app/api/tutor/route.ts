import { NextResponse } from "next/server";
import { callOpenAICompatibleTutor, type TutorImageAttachmentPayload, type TutorModelSettings } from "@/lib/ai/tutorRuntime";
import type { TutorContextEnvelope } from "@/lib/ai/tutor-contract";

export const runtime = "nodejs";

interface TutorApiRequestBody {
  settings?: Partial<TutorModelSettings>;
  envelope?: TutorContextEnvelope;
  attachments?: TutorImageAttachmentPayload[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readSettings(settings: Partial<TutorModelSettings> | undefined): TutorModelSettings | null {
  if (!settings?.apiKey || !settings.baseUrl || !settings.model) return null;

  return {
    provider: settings.provider ?? "openai-compatible",
    model: settings.model,
    baseUrl: settings.baseUrl,
    apiKey: settings.apiKey
  };
}

export async function POST(request: Request) {
  let body: TutorApiRequestBody;

  try {
    body = (await request.json()) as TutorApiRequestBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const settings = readSettings(body.settings);
  const envelope = body.envelope;

  if (!settings) {
    return NextResponse.json({ error: "missing_model_settings" }, { status: 400 });
  }

  if (!isObject(envelope) || typeof envelope.task !== "string" || !isObject(envelope.context)) {
    return NextResponse.json({ error: "invalid_tutor_envelope" }, { status: 400 });
  }

  try {
    const attachments = Array.isArray(body.attachments) ? body.attachments : [];
    const result = await callOpenAICompatibleTutor(settings, envelope, fetch, attachments);
    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "tutor_request_failed";
    const status = message.startsWith("missing_") ? 400 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
