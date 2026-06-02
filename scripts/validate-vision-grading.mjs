import { readFileSync } from "node:fs";

const runtime = readFileSync("lib/ai/tutorRuntime.ts", "utf8");
const client = readFileSync("lib/ai/tutorClient.ts", "utf8");
const route = readFileSync("app/api/tutor/route.ts", "utf8");
const exercisePanel = readFileSync("components/course/ExercisePanel.tsx", "utf8");

for (const marker of ["TutorImageAttachmentPayload", "image_url", "dataUrl", "attachments"]) {
  if (!runtime.includes(marker)) {
    throw new Error(`runtime missing vision marker: ${marker}`);
  }
}

for (const marker of ["buildTutorImageAttachments", "FileReader", "imageAttachments", "sizeBytes"]) {
  if (!client.includes(marker)) {
    throw new Error(`client missing vision marker: ${marker}`);
  }
}

for (const marker of ["attachments", "callOpenAICompatibleTutor(settings, envelope, fetch, attachments)"]) {
  if (!route.includes(marker)) {
    throw new Error(`route missing vision marker: ${marker}`);
  }
}

for (const marker of ["file:", "buildTutorImageAttachments", "8MB", "手写答案照片"]) {
  if (!exercisePanel.includes(marker)) {
    throw new Error(`exercise panel missing vision marker: ${marker}`);
  }
}

console.log("vision grading wiring ok");
