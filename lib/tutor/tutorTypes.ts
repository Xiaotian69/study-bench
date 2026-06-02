import type { TutorProviderId } from "@/lib/tutor/modelProviders";

export type TutorMode = "explain" | "ask" | "grade" | "hint" | "mastery";

export interface TutorMessage {
  id: string;
  role: "teacher" | "student";
  content: string;
}

export interface TutorSettings {
  provider: TutorProviderId;
  model: string;
  baseUrl: string;
  apiKey: string;
}
