import { readFileSync } from "node:fs";

const source = readFileSync("lib/tutor/modelProviders.ts", "utf8");

const requiredProviders = [
  {
    id: "openai-compatible",
    label: "OpenAI-compatible",
    model: "gpt-4.1-mini",
    baseUrl: "https://api.openai.com/v1"
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    model: "deepseek-v4-flash",
    baseUrl: "https://api.deepseek.com"
  },
  {
    id: "xiaomi-mimo",
    label: "Xiaomi MiMo",
    model: "mimo-v2.5-pro",
    baseUrl: "https://api.xiaomimimo.com/v1"
  },
  {
    id: "gemini",
    label: "Gemini",
    model: "gemini-1.5-flash",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai"
  }
];

for (const provider of requiredProviders) {
  for (const value of Object.values(provider)) {
    if (!source.includes(value)) {
      throw new Error(`missing tutor provider preset value: ${value}`);
    }
  }
}

if (!source.includes("export const tutorModelProviders")) {
  throw new Error("missing exported tutorModelProviders preset list");
}

console.log(`tutor providers ok: ${requiredProviders.length} presets`);
