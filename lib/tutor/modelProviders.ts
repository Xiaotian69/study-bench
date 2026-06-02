export const tutorModelProviders = [
  {
    id: "openai-compatible",
    label: "OpenAI-compatible",
    defaultModel: "gpt-4.1-mini",
    baseUrl: "https://api.openai.com/v1",
    modelPlaceholder: "例如 gpt-4.1-mini"
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    defaultModel: "deepseek-v4-flash",
    baseUrl: "https://api.deepseek.com",
    modelPlaceholder: "例如 deepseek-v4-flash"
  },
  {
    id: "xiaomi-mimo",
    label: "Xiaomi MiMo",
    defaultModel: "mimo-v2.5-pro",
    baseUrl: "https://api.xiaomimimo.com/v1",
    modelPlaceholder: "例如 mimo-v2.5-pro"
  },
  {
    id: "gemini",
    label: "Gemini",
    defaultModel: "gemini-1.5-flash",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    modelPlaceholder: "例如 gemini-1.5-flash"
  }
] as const;

export type TutorProviderId = (typeof tutorModelProviders)[number]["id"];

export function getTutorProviderPreset(provider: string | undefined) {
  return tutorModelProviders.find((candidate) => candidate.id === provider) ?? tutorModelProviders[0];
}
