export type TutorMode = "explain" | "ask" | "grade" | "hint" | "mastery";

export interface TutorMessage {
  id: string;
  role: "teacher" | "student";
  content: string;
}

export interface TutorSettings {
  provider: "openai-compatible" | "gemini";
  model: string;
  apiKey: string;
}
