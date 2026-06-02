export type CourseStatus = "planned" | "sample-ready" | "draft";
export type Difficulty = "basic" | "medium" | "hard";
export type ExerciseType = "definition-understanding" | "computation" | "proof" | "counterexample" | "comprehensive";

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  audience: string;
  defaultVolumeId: string;
  volumes: string[];
  schemaVersion: number;
  status: CourseStatus;
}

export interface VolumeSection {
  id: string;
  title: string;
  status: CourseStatus;
  knowledgePointIds?: string[];
}

export interface VolumeChapter {
  id: string;
  number: number;
  title: string;
  status: CourseStatus;
  chapterFile?: string;
  exercisesFile?: string;
  sections: VolumeSection[];
}

export interface Volume {
  id: string;
  courseId: string;
  title: string;
  chapters: VolumeChapter[];
}

export interface NamedStatement {
  name: string;
  statement: string;
}

export interface KnowledgePoint {
  id: string;
  title: string;
  learningGoals: string[];
  coreExplanation: string;
  textbookRefs: string[];
  keyDefinitions: NamedStatement[];
  keyTheorems: NamedStatement[];
  proofIdeas: string[];
  socraticQuestions: string[];
  commonMistakes: string[];
  exampleIds: string[];
  exerciseIds: string[];
  diagramIds: string[];
  masteryCriteria: string[];
}

export interface ChapterContent {
  id: string;
  courseId: string;
  volumeId: string;
  number: number;
  title: string;
  status: CourseStatus;
  overview: string;
  knowledgePoints: KnowledgePoint[];
}

export interface Exercise {
  id: string;
  sourceType: string;
  sourceRef: string;
  knowledgePointIds: string[];
  difficulty: Difficulty;
  type: ExerciseType;
  recommendedTiming: string;
  prompt: string;
  gradingRubric: string[];
  hints: string[];
  commonMistakes: string[];
}

export interface DiagramSpec {
  id: string;
  title: string;
  type: string;
  knowledgePointIds: string[];
  description: string;
  parameters: Record<string, unknown>;
  teacherNotes: string[];
  studentPrompt: string;
  renderHints?: Record<string, unknown>;
}

export interface CourseBundle {
  course: Course;
  volume: Volume;
  chapter: ChapterContent;
  exercises: Exercise[];
  diagrams: DiagramSpec[];
}
