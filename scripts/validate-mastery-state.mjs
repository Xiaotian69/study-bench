import { readFileSync } from "node:fs";

const types = readFileSync("lib/progress/masteryTypes.ts", "utf8");
const model = readFileSync("lib/progress/masteryProgress.ts", "utf8");
const doc = readFileSync("docs/progress/mastery-state-spec.md", "utf8");

const states = ["not_started", "emerging", "proficient", "weak"];

// masteryTypes.ts must enumerate the four states (the masteryStates tuple).
for (const state of states) {
  if (!types.includes(`"${state}"`)) {
    throw new Error(`masteryTypes.ts missing state: ${state}`);
  }
}

// Canonical model (single source of truth) must define the states + records.
for (const marker of [...states, "CourseProgressRecord", "KnowledgePointProgressRecord", "ExerciseAttemptRecord"]) {
  if (!model.includes(marker)) {
    throw new Error(`masteryProgress.ts missing marker: ${marker}`);
  }
}

// Spec doc coverage.
for (const marker of [...states, "localStorage", "criteriaUnmet"]) {
  if (!doc.includes(marker)) {
    throw new Error(`mastery-state-spec.md missing marker: ${marker}`);
  }
}

const bannedPhrases = ["TO" + "DO", "T" + "BD", "以后" + "完善"];
for (const source of [types, doc]) {
  if (bannedPhrases.some((phrase) => source.includes(phrase))) {
    throw new Error("mastery state files contain unresolved placeholder language");
  }
}

console.log(`mastery state ok: ${states.length} states, types barrel + canonical model + spec present`);
