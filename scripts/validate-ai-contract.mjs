import { readFileSync } from "node:fs";

const contract = readFileSync("lib/ai/tutor-contract.ts", "utf8");
const fixtures = readFileSync("lib/ai/tutor-fixtures.ts", "utf8");
const docs = readFileSync("docs/ai/tutor-runtime-contract.md", "utf8");

const taskNames = ["explain", "ask", "grade", "hint", "mastery"];
const fixtureNames = [
  "sampleExplainRequest",
  "sampleGradeRequest",
  "sampleAskResponse",
  "sampleGradeResponse",
  "sampleHintResponse",
  "sampleMasteryResponse"
];

for (const taskName of taskNames) {
  if (!contract.includes(`"${taskName}"`)) {
    throw new Error(`contract missing task ${taskName}`);
  }

  if (!docs.includes(taskName)) {
    throw new Error(`runtime contract docs missing task ${taskName}`);
  }
}

for (const fixtureName of fixtureNames) {
  if (!fixtures.includes(`export const ${fixtureName}`)) {
    throw new Error(`fixtures missing export ${fixtureName}`);
  }
}

const bannedPhrases = ["TO" + "DO", "T" + "BD", "以后" + "完善"];

for (const source of [contract, fixtures, docs]) {
  if (bannedPhrases.some((phrase) => source.includes(phrase))) {
    throw new Error("AI contract files contain unresolved placeholder language");
  }
}

console.log(`ai contract ok: ${taskNames.length} tasks, ${fixtureNames.length} fixtures`);
