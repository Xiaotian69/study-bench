import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = process.cwd();
const dataPath = path.join(root, "wx-miniprogram/data/all-chapters.js");
const studyJsonPath = path.join(root, "wx-miniprogram/pages/study/study.json");
const studyWxmlPath = path.join(root, "wx-miniprogram/pages/study/study.wxml");
const componentPath = path.join(root, "wx-miniprogram/components/diagram-card/diagram-card.js");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(fs.existsSync(dataPath), "wx data bundle is missing; run scripts/build-wx-data.js first");

const data = require(dataPath);
const sequenceChapter = data.chapters["ch-sequence-limit"];
assert(sequenceChapter, "sequence-limit chapter missing from wx data");

const epsilonKp = sequenceChapter.knowledgePoints.find((kp) => kp.id === "epsilon-n-definition");
assert(epsilonKp, "epsilon-n-definition KP missing from wx data");
assert(Array.isArray(epsilonKp.diagrams), "knowledge point diagrams must be an array");
assert(
  epsilonKp.diagrams.some((diagram) => diagram.id === "epsilon-neighborhood-on-number-line"),
  "epsilon-neighborhood-on-number-line diagram missing from epsilon-n-definition"
);
assert(
  epsilonKp.diagrams.every((diagram) => diagram.title && diagram.type && diagram.displayKind),
  "each wx diagram must include title, type, and displayKind"
);

const functionChapter = data.chapters["ch-function-limit"];
const functionKp = functionChapter?.knowledgePoints.find((kp) => kp.id === "x-to-x0-limit-definition");
assert(functionKp?.diagrams?.length > 0, "function-limit definition KP should include epsilon-delta diagrams");

const studyJson = JSON.parse(fs.readFileSync(studyJsonPath, "utf-8"));
assert(
  studyJson.usingComponents?.["diagram-card"] === "/components/diagram-card/diagram-card",
  "study page must register diagram-card component"
);

const studyWxml = fs.readFileSync(studyWxmlPath, "utf-8");
assert(studyWxml.includes("<diagram-card"), "study page must render diagram-card");
assert(fs.existsSync(componentPath), "diagram-card component JS file is missing");

console.log("[validate:wx-diagrams] ok");
