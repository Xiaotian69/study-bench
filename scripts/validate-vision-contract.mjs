import { readFileSync } from "node:fs";

const contract = readFileSync("lib/ai/vision-contract.ts", "utf8");
const doc = readFileSync("docs/ai/vision-answer-review-spec.md", "utf8");

for (const typeName of ["VisionAnswerReviewRequest", "VisionAnswerReviewResult", "AnswerImageAttachment"]) {
  if (!contract.includes(typeName)) {
    throw new Error(`vision-contract.ts missing type: ${typeName}`);
  }
}

for (const marker of ["OCR", "LaTeX", "uncertainSegments", "gradingRubric"]) {
  if (!doc.includes(marker)) {
    throw new Error(`vision-answer-review-spec.md missing marker: ${marker}`);
  }
}

const bannedPhrases = ["TO" + "DO", "T" + "BD", "以后" + "完善"];
for (const source of [contract, doc]) {
  if (bannedPhrases.some((phrase) => source.includes(phrase))) {
    throw new Error("vision contract files contain unresolved placeholder language");
  }
}

console.log("vision contract ok");
