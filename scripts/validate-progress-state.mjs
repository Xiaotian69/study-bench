import { existsSync, readFileSync } from "node:fs";

const progressPath = "lib/progress/masteryProgress.ts";
if (!existsSync(progressPath)) {
  throw new Error(`missing progress model: ${progressPath}`);
}

const progress = readFileSync(progressPath, "utf8");
const sidebar = readFileSync("components/course/CourseSidebar.tsx", "utf8");
const exercisePanel = readFileSync("components/course/ExercisePanel.tsx", "utf8");

for (const marker of [
  "CourseProgressRecord",
  "ExerciseAttemptRecord",
  "loadCourseProgress",
  "saveExerciseAttempt",
  "ai-math-tutor-progress",
  "ai-math-tutor-progress-updated"
]) {
  if (!progress.includes(marker)) {
    throw new Error(`progress model missing marker: ${marker}`);
  }
}

for (const marker of ["use client", "loadCourseProgress", "getChapterMasteryState", "progress-pill"]) {
  if (!sidebar.includes(marker)) {
    throw new Error(`sidebar missing progress marker: ${marker}`);
  }
}

for (const marker of ["saveExerciseAttempt", "masteryState", "mastery-summary", "volumeId"]) {
  if (!exercisePanel.includes(marker)) {
    throw new Error(`exercise panel missing progress marker: ${marker}`);
  }
}

console.log("progress state wiring ok");
