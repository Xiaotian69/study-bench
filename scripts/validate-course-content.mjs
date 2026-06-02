import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const courseRoot = path.join(root, "content", "courses", "math-analysis");

function readJson(relativePath) {
  const filePath = path.join(courseRoot, relativePath);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const course = readJson("course.json");
const volume = readJson("volume-1.json");
const chapter = readJson(path.join("chapters", "sequence-limit.json"));
const exercises = readJson(path.join("exercises", "sequence-limit.json"));
const diagrams = readJson(path.join("diagrams", "sequence-limit.json"));

assert(course.id === "math-analysis", "course id must be math-analysis");
assert(volume.courseId === course.id, "volume courseId must match course id");
assert(chapter.courseId === course.id, "chapter courseId must match course id");

const knowledgePointIds = new Set(chapter.knowledgePoints.map((item) => item.id));
const exerciseIds = new Set(exercises.exercises.map((item) => item.id));
const diagramIds = new Set(diagrams.diagrams.map((item) => item.id));
const sequenceChapter = volume.chapters.find((item) => item.id === chapter.id);

assert(sequenceChapter, "volume must reference sequence-limit chapter");

for (const section of sequenceChapter.sections) {
  for (const knowledgePointId of section.knowledgePointIds ?? []) {
    assert(
      knowledgePointIds.has(knowledgePointId),
      `section ${section.id} references missing knowledge point ${knowledgePointId}`
    );
  }
}

for (const knowledgePoint of chapter.knowledgePoints) {
  for (const field of ["learningGoals", "socraticQuestions", "commonMistakes", "masteryCriteria"]) {
    assert(
      Array.isArray(knowledgePoint[field]) && knowledgePoint[field].length > 0,
      `knowledge point ${knowledgePoint.id} missing ${field}`
    );
  }

  for (const exerciseId of knowledgePoint.exerciseIds ?? []) {
    assert(exerciseIds.has(exerciseId), `knowledge point ${knowledgePoint.id} references missing exercise ${exerciseId}`);
  }

  for (const diagramId of knowledgePoint.diagramIds ?? []) {
    assert(diagramIds.has(diagramId), `knowledge point ${knowledgePoint.id} references missing diagram ${diagramId}`);
  }
}

for (const exercise of exercises.exercises) {
  for (const knowledgePointId of exercise.knowledgePointIds ?? []) {
    assert(
      knowledgePointIds.has(knowledgePointId),
      `exercise ${exercise.id} references missing knowledge point ${knowledgePointId}`
    );
  }

  for (const field of ["gradingRubric", "hints", "commonMistakes"]) {
    assert(
      Array.isArray(exercise[field]) && exercise[field].length > 0,
      `exercise ${exercise.id} missing ${field}`
    );
  }
}

for (const diagram of diagrams.diagrams) {
  assert(
    Array.isArray(diagram.knowledgePointIds) && diagram.knowledgePointIds.length > 0,
    `diagram ${diagram.id} missing knowledgePointIds`
  );
  for (const knowledgePointId of diagram.knowledgePointIds) {
    assert(
      knowledgePointIds.has(knowledgePointId),
      `diagram ${diagram.id} references missing knowledge point ${knowledgePointId}`
    );
  }
  assert(
    Array.isArray(diagram.teacherNotes) && diagram.teacherNotes.length > 0,
    `diagram ${diagram.id} missing teacherNotes`
  );
  assert(
    typeof diagram.studentPrompt === "string" && diagram.studentPrompt.length > 0,
    `diagram ${diagram.id} missing studentPrompt`
  );
}

console.log(
  `content ok: ${chapter.knowledgePoints.length} knowledge points, ${exercises.exercises.length} exercises, ${diagrams.diagrams.length} diagrams`
);
