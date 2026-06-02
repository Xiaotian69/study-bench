import { existsSync, readFileSync } from "node:fs";

const clientPath = "lib/ai/tutorClient.ts";
const exercisePath = "components/course/ExercisePanel.tsx";
const pagePath = "app/page.tsx";

if (!existsSync(clientPath)) {
  throw new Error(`missing tutor client helper: ${clientPath}`);
}

const client = readFileSync(clientPath, "utf8");
const exercisePanel = readFileSync(exercisePath, "utf8");
const page = readFileSync(pagePath, "utf8");

for (const marker of ["buildTutorGradeEnvelope", "requestTutorGrade", "/api/tutor", "studentAnswer"]) {
  if (!client.includes(marker)) {
    throw new Error(`tutor client missing marker: ${marker}`);
  }
}

for (const marker of ["提交给 AI 批改", "grade-result-card", "requestTutorGrade", "loadTutorSettings", "gradingStatus"]) {
  if (!exercisePanel.includes(marker)) {
    throw new Error(`exercise panel missing marker: ${marker}`);
  }
}

for (const marker of ["courseId=", "chapterId=", "sectionId=", "knowledgePoint="]) {
  if (!page.includes(marker)) {
    throw new Error(`page does not pass tutor grading context marker: ${marker}`);
  }
}

console.log("exercise AI grading wiring ok");
