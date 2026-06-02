import { existsSync, readFileSync } from "node:fs";

const runtimePath = "lib/ai/tutorRuntime.ts";
const routePath = "app/api/tutor/route.ts";

for (const filePath of [runtimePath, routePath]) {
  if (!existsSync(filePath)) {
    throw new Error(`missing tutor API file: ${filePath}`);
  }
}

const runtime = readFileSync(runtimePath, "utf8");
const route = readFileSync(routePath, "utf8");

const requiredRuntimeExports = [
  "buildTutorMessages",
  "buildOpenAIChatCompletionRequest",
  "callOpenAICompatibleTutor",
  "parseTutorModelOutput",
  "buildTutorFallbackResponse"
];

for (const exportName of requiredRuntimeExports) {
  if (!runtime.includes(`export function ${exportName}`) && !runtime.includes(`export async function ${exportName}`)) {
    throw new Error(`missing runtime export ${exportName}`);
  }
}

for (const value of ["Authorization", "chat/completions", "tutorTaskOutputKind", "JSON.parse"]) {
  if (!runtime.includes(value)) {
    throw new Error(`tutor runtime missing expected behavior marker: ${value}`);
  }
}

for (const value of ["export async function POST", "apiKey", "baseUrl", "envelope", "NextResponse.json"]) {
  if (!route.includes(value)) {
    throw new Error(`tutor route missing expected behavior marker: ${value}`);
  }
}

for (const source of [runtime, route]) {
  if (source.includes("console.log") || source.includes("console.error")) {
    throw new Error("tutor API must not log request data or API keys");
  }
}

console.log("tutor API structure ok");
