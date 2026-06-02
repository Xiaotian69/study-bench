# AI Math Tutor MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first usable Web MVP for an AI-assisted Math Analysis learning workbench focused on the sequence-limit sample chapter.

**Architecture:** Use a Next.js app with structured course content stored in `content/courses/`, a typed course loader in `lib/course/`, programmatic diagram rendering in `components/diagrams/`, and a constrained tutor layer in `lib/tutor/`. User API keys stay in browser local storage for the MVP; course PDFs remain local and ignored by git.

**Tech Stack:** Next.js, React, TypeScript, CSS Modules or global CSS, KaTeX or MathJax, Node.js content validation scripts, GitHub for collaboration.

---

## Coordination Rules

Partner AI owns odd-numbered partner task packages:

- Task package A: course content structure. Completed in commit `5d2324e`.
- Task package C: AI tutor prompt docs. Expected files under `docs/ai/` and possibly `lib/ai/prompt-templates.md`.
- Task package E: UI information architecture docs. Expected files under `docs/ui/`.

Main AI owns even-numbered partner task packages and the app implementation:

- Task package B: diagram specs. Completed in commit `849125e`.
- Task package D: ExamPass reference notes. Completed in commit `ae338ba`.
- Next.js app scaffold, course loader, renderer, learning flow, verification, and dev server.

Do not touch partner-owned untracked files unless the user explicitly asks for integration. In the current workspace, `docs/ai/tutor-prompt-spec.md` may be partner work; leave it alone.

## File Structure Map

Create or modify these files during implementation:

```text
package.json                                  Project scripts and dependencies
tsconfig.json                                 TypeScript config
next.config.ts                                Next config
app/layout.tsx                                Root app layout
app/page.tsx                                  Course workbench first screen
app/globals.css                               Global visual system
components/course/CourseSidebar.tsx           Course navigation and progress
components/course/LearningStepPanel.tsx       Current knowledge point content
components/course/ExercisePanel.tsx           Exercise, hints, and answer area
components/course/TutorPanel.tsx              AI tutor conversation shell
components/diagrams/DiagramRenderer.tsx       Dispatch diagram rendering by type
components/diagrams/NumberLineDiagram.tsx     Number-line SVG diagrams
components/diagrams/SequencePlotDiagram.tsx   Sequence plot SVG diagrams
lib/course/types.ts                           Course data TypeScript types
lib/course/loadCourse.ts                      Load and validate course JSON
lib/course/selectors.ts                       Select chapter, knowledge point, exercises, diagrams
lib/progress/progressStore.ts                 Browser-local learning progress
lib/tutor/tutorTypes.ts                       Tutor task and response types
lib/tutor/localTutor.ts                       Non-network fallback tutor behavior
scripts/validate-course-content.mjs           Content consistency checks
docs/development.md                           How to run and verify the MVP
```

Existing content files:

```text
content/courses/math-analysis/course.json
content/courses/math-analysis/volume-1.json
content/courses/math-analysis/chapters/sequence-limit.json
content/courses/math-analysis/exercises/sequence-limit.json
content/courses/math-analysis/diagrams/sequence-limit.json
```

## Task 1: Scaffold Next.js App

**Files:**

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

- [ ] **Step 1: Create the app package**

Write `package.json`:

```json
{
  "name": "ai-math-tutor",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "validate:content": "node scripts/validate-course-content.mjs"
  },
  "dependencies": {
    "@next/env": "^15.0.0",
    "katex": "^0.16.11",
    "lucide-react": "^0.468.0",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Create TypeScript and Next config**

Write `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Write `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true
};

export default nextConfig;
```

- [ ] **Step 3: Create root layout**

Write `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "数学分析 AI 同步学习助手",
  description: "按教材顺序学习数学分析，配合 AI 追问、练习和反馈。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Create temporary first screen**

Write `app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">数学分析 上册</p>
        <h1>AI 同步学习助手</h1>
        <p>
          第一版聚焦数列极限：按教材小节推进，训练定义、证明、例题和基础题。
        </p>
      </section>
    </main>
  );
}
```

Write `app/globals.css`:

```css
:root {
  color-scheme: light;
  --bg: #f6f7f4;
  --panel: #ffffff;
  --ink: #1f2933;
  --muted: #667085;
  --line: #d9e0dc;
  --accent: #2f6f68;
  --accent-strong: #194d47;
  --gold: #c18a2d;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: Arial, "Microsoft YaHei", sans-serif;
}

.app-shell {
  min-height: 100vh;
  padding: 32px;
}

.hero-panel {
  max-width: 920px;
  margin: 0 auto;
  padding: 32px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--accent);
  font-size: 14px;
  font-weight: 700;
}

h1 {
  margin: 0 0 12px;
  font-size: 36px;
  line-height: 1.2;
}

p {
  line-height: 1.8;
}
```

- [ ] **Step 5: Install dependencies**

Run:

```powershell
npm install
```

Expected: `package-lock.json` is created and install completes without dependency resolution errors.

- [ ] **Step 6: Verify first build**

Run:

```powershell
npm run build
```

Expected: Next.js production build completes.

- [ ] **Step 7: Commit scaffold**

Run:

```powershell
git add package.json package-lock.json tsconfig.json next.config.ts app
git commit -m "Create Next.js learning workbench scaffold"
```

## Task 2: Add Content Validation Script

**Files:**

- Create: `scripts/validate-course-content.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write validation script**

Write `scripts/validate-course-content.mjs`:

```js
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
  assert(Array.isArray(diagram.knowledgePointIds) && diagram.knowledgePointIds.length > 0, `diagram ${diagram.id} missing knowledgePointIds`);
  assert(Array.isArray(diagram.teacherNotes) && diagram.teacherNotes.length > 0, `diagram ${diagram.id} missing teacherNotes`);
  assert(typeof diagram.studentPrompt === "string" && diagram.studentPrompt.length > 0, `diagram ${diagram.id} missing studentPrompt`);
}

console.log(
  `content ok: ${chapter.knowledgePoints.length} knowledge points, ${exercises.exercises.length} exercises, ${diagrams.diagrams.length} diagrams`
);
```

- [ ] **Step 2: Run validation**

Run:

```powershell
npm run validate:content
```

Expected:

```text
content ok: 8 knowledge points, 8 exercises, 6 diagrams
```

- [ ] **Step 3: Commit validation**

Run:

```powershell
git add scripts/validate-course-content.mjs package.json package-lock.json
git commit -m "Add course content validation"
```

## Task 3: Implement Typed Course Loader

**Files:**

- Create: `lib/course/types.ts`
- Create: `lib/course/loadCourse.ts`
- Create: `lib/course/selectors.ts`
- Modify: `app/page.tsx`

- [ ] **Step 1: Add course types**

Write `lib/course/types.ts`:

```ts
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
```

- [ ] **Step 2: Add loader**

Write `lib/course/loadCourse.ts`:

```ts
import course from "@/content/courses/math-analysis/course.json";
import volume from "@/content/courses/math-analysis/volume-1.json";
import chapter from "@/content/courses/math-analysis/chapters/sequence-limit.json";
import exercises from "@/content/courses/math-analysis/exercises/sequence-limit.json";
import diagrams from "@/content/courses/math-analysis/diagrams/sequence-limit.json";
import type { CourseBundle } from "./types";

export function loadMathAnalysisCourse(): CourseBundle {
  return {
    course,
    volume,
    chapter,
    exercises: exercises.exercises,
    diagrams: diagrams.diagrams
  } as CourseBundle;
}
```

- [ ] **Step 3: Add selectors**

Write `lib/course/selectors.ts`:

```ts
import type { CourseBundle, DiagramSpec, Exercise, KnowledgePoint } from "./types";

export function getFirstReadyKnowledgePoint(bundle: CourseBundle): KnowledgePoint {
  const first = bundle.chapter.knowledgePoints[0];
  if (!first) {
    throw new Error("sequence-limit chapter has no knowledge points");
  }
  return first;
}

export function getExercisesForKnowledgePoint(bundle: CourseBundle, knowledgePointId: string): Exercise[] {
  return bundle.exercises.filter((exercise) => exercise.knowledgePointIds.includes(knowledgePointId));
}

export function getDiagramsForKnowledgePoint(bundle: CourseBundle, knowledgePointId: string): DiagramSpec[] {
  return bundle.diagrams.filter((diagram) => diagram.knowledgePointIds.includes(knowledgePointId));
}
```

- [ ] **Step 4: Render loaded course title**

Modify `app/page.tsx`:

```tsx
import { loadMathAnalysisCourse } from "@/lib/course/loadCourse";
import { getFirstReadyKnowledgePoint } from "@/lib/course/selectors";

export default function HomePage() {
  const bundle = loadMathAnalysisCourse();
  const firstKnowledgePoint = getFirstReadyKnowledgePoint(bundle);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">{bundle.volume.title}</p>
        <h1>{bundle.course.title} AI 同步学习助手</h1>
        <p>{bundle.chapter.overview}</p>
        <p>
          当前样板知识点：<strong>{firstKnowledgePoint.title}</strong>
        </p>
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Verify**

Run:

```powershell
npm run validate:content
npm run build
```

Expected: content validation and build pass.

- [ ] **Step 6: Commit loader**

Run:

```powershell
git add lib/course app/page.tsx
git commit -m "Load structured math analysis course content"
```

## Task 4: Build Learning Workbench Layout

**Files:**

- Create: `components/course/CourseSidebar.tsx`
- Create: `components/course/LearningStepPanel.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Create sidebar**

Write `components/course/CourseSidebar.tsx`:

```tsx
import type { Volume } from "@/lib/course/types";

export function CourseSidebar({ volume, activeChapterId }: { volume: Volume; activeChapterId: string }) {
  return (
    <aside className="course-sidebar">
      <div className="sidebar-heading">
        <span>课程目录</span>
        <strong>{volume.title}</strong>
      </div>
      <nav className="chapter-list" aria-label="课程章节">
        {volume.chapters.map((chapter) => (
          <section className={`chapter-item ${chapter.id === activeChapterId ? "is-active" : ""}`} key={chapter.id}>
            <div className="chapter-title">
              <span>{chapter.number}</span>
              <strong>{chapter.title}</strong>
            </div>
            <small>{chapter.status === "sample-ready" ? "样板完成" : "待整理"}</small>
          </section>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Create learning panel**

Write `components/course/LearningStepPanel.tsx`:

```tsx
import type { KnowledgePoint } from "@/lib/course/types";

export function LearningStepPanel({ knowledgePoint }: { knowledgePoint: KnowledgePoint }) {
  return (
    <article className="learning-panel">
      <p className="eyebrow">当前知识点</p>
      <h2>{knowledgePoint.title}</h2>
      <p>{knowledgePoint.coreExplanation}</p>

      <section className="learning-block">
        <h3>学习目标</h3>
        <ul>
          {knowledgePoint.learningGoals.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
      </section>

      <section className="learning-block">
        <h3>AI 追问</h3>
        <ol>
          {knowledgePoint.socraticQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </section>
    </article>
  );
}
```

- [ ] **Step 3: Compose workbench page**

Modify `app/page.tsx`:

```tsx
import { CourseSidebar } from "@/components/course/CourseSidebar";
import { LearningStepPanel } from "@/components/course/LearningStepPanel";
import { loadMathAnalysisCourse } from "@/lib/course/loadCourse";
import { getFirstReadyKnowledgePoint } from "@/lib/course/selectors";

export default function HomePage() {
  const bundle = loadMathAnalysisCourse();
  const firstKnowledgePoint = getFirstReadyKnowledgePoint(bundle);

  return (
    <main className="workbench-shell">
      <CourseSidebar volume={bundle.volume} activeChapterId={bundle.chapter.id} />
      <LearningStepPanel knowledgePoint={firstKnowledgePoint} />
      <aside className="tutor-placeholder">
        <p className="eyebrow">AI 老师</p>
        <h2>短讲 + 追问 + 练习反馈</h2>
        <p>下一步接入题目、图示、提示和本地 API Key 设置。</p>
      </aside>
    </main>
  );
}
```

- [ ] **Step 4: Add workbench CSS**

Append to `app/globals.css`:

```css
.workbench-shell {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 340px;
  gap: 18px;
  min-height: 100vh;
  padding: 18px;
}

.course-sidebar,
.learning-panel,
.tutor-placeholder {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
}

.course-sidebar {
  padding: 18px;
  overflow: auto;
}

.sidebar-heading {
  display: grid;
  gap: 4px;
  margin-bottom: 18px;
}

.chapter-list {
  display: grid;
  gap: 8px;
}

.chapter-item {
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
}

.chapter-item.is-active {
  border-color: var(--accent);
  background: #eef7f4;
}

.chapter-title {
  display: flex;
  gap: 10px;
  align-items: center;
}

.learning-panel,
.tutor-placeholder {
  padding: 24px;
}

.learning-panel h2,
.tutor-placeholder h2 {
  margin-top: 0;
}

.learning-block {
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

@media (max-width: 1000px) {
  .workbench-shell {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Verify**

Run:

```powershell
npm run build
```

Expected: build passes and no text overflows in obvious shell layout.

- [ ] **Step 6: Commit layout**

Run:

```powershell
git add app components/course
git commit -m "Build learning workbench layout"
```

## Task 5: Render Mathematical Diagrams

**Files:**

- Create: `components/diagrams/DiagramRenderer.tsx`
- Create: `components/diagrams/NumberLineDiagram.tsx`
- Create: `components/diagrams/SequencePlotDiagram.tsx`
- Modify: `components/course/LearningStepPanel.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Create renderer dispatch**

Write `components/diagrams/DiagramRenderer.tsx`:

```tsx
import type { DiagramSpec } from "@/lib/course/types";
import { NumberLineDiagram } from "./NumberLineDiagram";
import { SequencePlotDiagram } from "./SequencePlotDiagram";

export function DiagramRenderer({ diagram }: { diagram: DiagramSpec }) {
  if (diagram.type === "number-line" || diagram.type === "sequence-on-number-line") {
    return <NumberLineDiagram diagram={diagram} />;
  }

  return <SequencePlotDiagram diagram={diagram} />;
}
```

- [ ] **Step 2: Create number line diagram**

Write `components/diagrams/NumberLineDiagram.tsx`:

```tsx
import type { DiagramSpec } from "@/lib/course/types";

export function NumberLineDiagram({ diagram }: { diagram: DiagramSpec }) {
  return (
    <figure className="diagram-card">
      <figcaption>
        <strong>{diagram.title}</strong>
        <span>{diagram.description}</span>
      </figcaption>
      <svg viewBox="0 0 640 180" role="img" aria-label={diagram.title}>
        <line x1="64" y1="96" x2="576" y2="96" stroke="currentColor" strokeWidth="2" />
        <line x1="224" y1="96" x2="416" y2="96" stroke="#2f6f68" strokeWidth="12" strokeLinecap="round" opacity="0.28" />
        <circle cx="320" cy="96" r="7" fill="#194d47" />
        <text x="320" y="58" textAnchor="middle">a</text>
        <text x="224" y="130" textAnchor="middle">a-ε</text>
        <text x="416" y="130" textAnchor="middle">a+ε</text>
        <text x="320" y="156" textAnchor="middle">|xₙ-a| &lt; ε</text>
      </svg>
      <p className="diagram-prompt">{diagram.studentPrompt}</p>
    </figure>
  );
}
```

- [ ] **Step 3: Create sequence plot diagram**

Write `components/diagrams/SequencePlotDiagram.tsx`:

```tsx
import type { DiagramSpec } from "@/lib/course/types";

const points = [
  [70, 120],
  [130, 86],
  [190, 68],
  [250, 56],
  [310, 48],
  [370, 42],
  [430, 38]
];

export function SequencePlotDiagram({ diagram }: { diagram: DiagramSpec }) {
  return (
    <figure className="diagram-card">
      <figcaption>
        <strong>{diagram.title}</strong>
        <span>{diagram.description}</span>
      </figcaption>
      <svg viewBox="0 0 520 190" role="img" aria-label={diagram.title}>
        <line x1="48" y1="150" x2="480" y2="150" stroke="currentColor" strokeWidth="2" />
        <line x1="48" y1="24" x2="48" y2="150" stroke="currentColor" strokeWidth="2" />
        <line x1="48" y1="36" x2="480" y2="36" stroke="#c18a2d" strokeWidth="2" strokeDasharray="6 6" />
        <text x="486" y="40">limit</text>
        <polyline points={points.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke="#2f6f68" strokeWidth="3" />
        {points.map(([x, y], index) => (
          <circle cx={x} cy={y} r="5" fill="#194d47" key={`${x}-${y}-${index}`} />
        ))}
      </svg>
      <p className="diagram-prompt">{diagram.studentPrompt}</p>
    </figure>
  );
}
```

- [ ] **Step 4: Pass diagrams into learning panel**

Modify `components/course/LearningStepPanel.tsx` to accept diagrams:

```tsx
import { DiagramRenderer } from "@/components/diagrams/DiagramRenderer";
import type { DiagramSpec, KnowledgePoint } from "@/lib/course/types";

export function LearningStepPanel({
  knowledgePoint,
  diagrams
}: {
  knowledgePoint: KnowledgePoint;
  diagrams: DiagramSpec[];
}) {
  return (
    <article className="learning-panel">
      <p className="eyebrow">当前知识点</p>
      <h2>{knowledgePoint.title}</h2>
      <p>{knowledgePoint.coreExplanation}</p>

      <section className="learning-block">
        <h3>教学图示</h3>
        <div className="diagram-grid">
          {diagrams.map((diagram) => (
            <DiagramRenderer diagram={diagram} key={diagram.id} />
          ))}
        </div>
      </section>

      <section className="learning-block">
        <h3>学习目标</h3>
        <ul>
          {knowledgePoint.learningGoals.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
      </section>

      <section className="learning-block">
        <h3>AI 追问</h3>
        <ol>
          {knowledgePoint.socraticQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </section>
    </article>
  );
}
```

Modify `app/page.tsx` to pass diagrams:

```tsx
const diagrams = getDiagramsForKnowledgePoint(bundle, firstKnowledgePoint.id);
```

and:

```tsx
<LearningStepPanel knowledgePoint={firstKnowledgePoint} diagrams={diagrams} />
```

- [ ] **Step 5: Add diagram CSS**

Append to `app/globals.css`:

```css
.diagram-grid {
  display: grid;
  gap: 12px;
}

.diagram-card {
  margin: 0;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fbfcfa;
}

.diagram-card figcaption {
  display: grid;
  gap: 4px;
  color: var(--muted);
}

.diagram-card figcaption strong {
  color: var(--ink);
}

.diagram-card svg {
  width: 100%;
  height: auto;
  margin-top: 12px;
  color: var(--ink);
}

.diagram-prompt {
  margin: 10px 0 0;
  color: var(--accent-strong);
  font-weight: 700;
}
```

- [ ] **Step 6: Verify**

Run:

```powershell
npm run build
```

Expected: build passes and diagrams render as non-empty SVGs.

- [ ] **Step 7: Commit diagrams**

Run:

```powershell
git add components/diagrams components/course/LearningStepPanel.tsx app/page.tsx app/globals.css
git commit -m "Render sequence limit teaching diagrams"
```

## Task 6: Add Exercise and Hint Flow

**Files:**

- Create: `components/course/ExercisePanel.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Create exercise panel**

Write `components/course/ExercisePanel.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import type { Exercise } from "@/lib/course/types";

export function ExercisePanel({ exercises }: { exercises: Exercise[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const activeExercise = exercises[activeIndex];

  const visibleHints = useMemo(() => {
    if (!activeExercise) return [];
    return activeExercise.hints.slice(0, hintLevel);
  }, [activeExercise, hintLevel]);

  if (!activeExercise) {
    return <section className="exercise-panel">当前知识点暂无练习。</section>;
  }

  return (
    <section className="exercise-panel">
      <div className="exercise-header">
        <p className="eyebrow">练习</p>
        <div className="exercise-tabs">
          {exercises.map((exercise, index) => (
            <button
              className={index === activeIndex ? "is-active" : ""}
              key={exercise.id}
              onClick={() => {
                setActiveIndex(index);
                setHintLevel(0);
              }}
              type="button"
            >
              {exercise.difficulty}
            </button>
          ))}
        </div>
      </div>
      <h3>{activeExercise.prompt}</h3>
      <textarea aria-label="输入你的解答" placeholder="在这里写你的思路、计算或证明..." />
      <div className="exercise-actions">
        <button
          onClick={() => setHintLevel((value) => Math.min(value + 1, activeExercise.hints.length))}
          type="button"
        >
          获取提示
        </button>
        <button type="button">对照评分要点</button>
      </div>
      {visibleHints.length > 0 && (
        <ul className="hint-list">
          {visibleHints.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ul>
      )}
      <details>
        <summary>评分要点</summary>
        <ul>
          {activeExercise.gradingRubric.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}
```

- [ ] **Step 2: Mount exercise panel**

Modify `app/page.tsx`:

```tsx
import { ExercisePanel } from "@/components/course/ExercisePanel";
import { getDiagramsForKnowledgePoint, getExercisesForKnowledgePoint } from "@/lib/course/selectors";
```

Inside component:

```tsx
const exercises = getExercisesForKnowledgePoint(bundle, firstKnowledgePoint.id);
```

After `LearningStepPanel`:

```tsx
<div className="main-column">
  <LearningStepPanel knowledgePoint={firstKnowledgePoint} diagrams={diagrams} />
  <ExercisePanel exercises={exercises} />
</div>
```

Adjust grid so the center column uses `.main-column`.

- [ ] **Step 3: Add exercise CSS**

Append to `app/globals.css`:

```css
.main-column {
  display: grid;
  gap: 18px;
  min-width: 0;
}

.exercise-panel {
  padding: 24px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.exercise-tabs {
  display: flex;
  gap: 6px;
}

button {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  padding: 8px 12px;
}

button.is-active,
button:hover {
  border-color: var(--accent);
  color: var(--accent-strong);
}

textarea {
  width: 100%;
  min-height: 140px;
  resize: vertical;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  font: inherit;
  line-height: 1.7;
}

.exercise-actions {
  display: flex;
  gap: 10px;
  margin: 12px 0;
}

.hint-list {
  padding: 12px 18px;
  border-left: 3px solid var(--accent);
  background: #eef7f4;
}
```

- [ ] **Step 4: Verify**

Run:

```powershell
npm run build
```

Expected: build passes and client component compiles.

- [ ] **Step 5: Commit exercise flow**

Run:

```powershell
git add components/course/ExercisePanel.tsx app/page.tsx app/globals.css
git commit -m "Add exercise and hint flow"
```

## Task 7: Add Tutor Panel and Local API Key Settings

**Files:**

- Create: `components/course/TutorPanel.tsx`
- Create: `lib/tutor/tutorTypes.ts`
- Create: `lib/tutor/localTutor.ts`
- Create: `lib/progress/progressStore.ts`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Define tutor types**

Write `lib/tutor/tutorTypes.ts`:

```ts
export type TutorMode = "explain" | "ask" | "grade" | "hint" | "mastery";

export interface TutorMessage {
  id: string;
  role: "teacher" | "student";
  content: string;
}

export interface TutorSettings {
  provider: "openai-compatible" | "gemini";
  model: string;
  apiKey: string;
}
```

- [ ] **Step 2: Add local tutor fallback**

Write `lib/tutor/localTutor.ts`:

```ts
import type { KnowledgePoint } from "@/lib/course/types";

export function buildLocalOpeningMessage(knowledgePoint: KnowledgePoint): string {
  const firstQuestion = knowledgePoint.socraticQuestions[0] ?? "你能先说说这个知识点的核心想法吗？";
  return `我们先学「${knowledgePoint.title}」。先抓住一句话：${knowledgePoint.learningGoals[0]}。\\n\\n我先问你：${firstQuestion}`;
}
```

- [ ] **Step 3: Add browser storage helpers**

Write `lib/progress/progressStore.ts`:

```ts
import type { TutorSettings } from "@/lib/tutor/tutorTypes";

const settingsKey = "ai-math-tutor-settings";

export function loadTutorSettings(): TutorSettings {
  if (typeof window === "undefined") {
    return { provider: "openai-compatible", model: "", apiKey: "" };
  }

  const raw = window.localStorage.getItem(settingsKey);
  if (!raw) {
    return { provider: "openai-compatible", model: "", apiKey: "" };
  }

  return JSON.parse(raw) as TutorSettings;
}

export function saveTutorSettings(settings: TutorSettings) {
  window.localStorage.setItem(settingsKey, JSON.stringify(settings));
}
```

- [ ] **Step 4: Create tutor panel**

Write `components/course/TutorPanel.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import type { KnowledgePoint } from "@/lib/course/types";
import { loadTutorSettings, saveTutorSettings } from "@/lib/progress/progressStore";
import { buildLocalOpeningMessage } from "@/lib/tutor/localTutor";

export function TutorPanel({ knowledgePoint }: { knowledgePoint: KnowledgePoint }) {
  const opening = useMemo(() => buildLocalOpeningMessage(knowledgePoint), [knowledgePoint]);
  const [settings, setSettings] = useState(loadTutorSettings);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([{ id: "opening", role: "teacher" as const, content: opening }]);

  return (
    <aside className="tutor-panel">
      <p className="eyebrow">AI 老师</p>
      <div className="settings-grid">
        <input
          aria-label="模型供应商"
          value={settings.provider}
          onChange={(event) => setSettings({ ...settings, provider: event.target.value as "openai-compatible" })}
        />
        <input
          aria-label="模型名称"
          placeholder="例如 gpt-4.1-mini"
          value={settings.model}
          onChange={(event) => setSettings({ ...settings, model: event.target.value })}
        />
        <input
          aria-label="API Key"
          placeholder="API Key 仅保存在浏览器本地"
          type="password"
          value={settings.apiKey}
          onChange={(event) => setSettings({ ...settings, apiKey: event.target.value })}
        />
        <button onClick={() => saveTutorSettings(settings)} type="button">保存设置</button>
      </div>
      <div className="message-list">
        {messages.map((message) => (
          <div className={`message ${message.role}`} key={message.id}>{message.content}</div>
        ))}
      </div>
      <form
        className="tutor-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) return;
          setMessages((current) => [
            ...current,
            { id: crypto.randomUUID(), role: "student", content: draft },
            { id: crypto.randomUUID(), role: "teacher", content: "我先按评分要点看你的回答。下一版会接入你选择的模型来细批。" }
          ]);
          setDraft("");
        }}
      >
        <textarea aria-label="向 AI 老师回答" value={draft} onChange={(event) => setDraft(event.target.value)} />
        <button type="submit">发送</button>
      </form>
    </aside>
  );
}
```

- [ ] **Step 5: Mount tutor panel**

Modify `app/page.tsx` to replace the tutor placeholder:

```tsx
import { TutorPanel } from "@/components/course/TutorPanel";
```

and:

```tsx
<TutorPanel knowledgePoint={firstKnowledgePoint} />
```

- [ ] **Step 6: Add tutor CSS**

Append to `app/globals.css`:

```css
.tutor-panel {
  display: grid;
  align-content: start;
  gap: 16px;
  padding: 18px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
}

.settings-grid {
  display: grid;
  gap: 8px;
}

input {
  width: 100%;
  padding: 9px 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  font: inherit;
}

.message-list {
  display: grid;
  gap: 10px;
}

.message {
  white-space: pre-wrap;
  padding: 10px 12px;
  border-radius: 8px;
  line-height: 1.6;
}

.message.teacher {
  background: #eef7f4;
}

.message.student {
  background: #f7f2e8;
}

.tutor-form {
  display: grid;
  gap: 8px;
}
```

- [ ] **Step 7: Verify**

Run:

```powershell
npm run build
```

Expected: build passes. Browser local storage code must live only in client components or client-called helpers.

- [ ] **Step 8: Commit tutor panel**

Run:

```powershell
git add components/course/TutorPanel.tsx lib/tutor lib/progress app/page.tsx app/globals.css
git commit -m "Add tutor panel and local model settings"
```

## Task 8: Add Developer Documentation

**Files:**

- Create: `docs/development.md`
- Modify: `README.md` if it exists, otherwise create it.

- [ ] **Step 1: Write development doc**

Write `docs/development.md`:

```md
# Development

## Run Locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Next.js.

## Verify

```powershell
npm run validate:content
npm run build
```

## Content Rules

- Do not commit PDF files.
- Course content lives under `content/courses/math-analysis/`.
- Sequence-limit content is the first sample chapter.
- Diagrams are programmatic specs, not AI-generated images.
- User API keys stay in browser local storage for the MVP.

## Collaboration

Partner AI owns odd partner task packages C and E.
Main AI owns app implementation and even partner task packages B and D.
```

- [ ] **Step 2: Write root README**

Write `README.md`:

```md
# AI Math Tutor

AI-assisted Math Analysis learning workbench.

The MVP focuses on the sequence-limit chapter:

- structured course content
- textbook-order learning
- teaching diagrams
- exercises and hints
- AI tutor shell with local model settings

PDF textbooks are local source material and are ignored by git.
```

- [ ] **Step 3: Verify docs**

Run:

```powershell
git status --short
npm run validate:content
npm run build
```

Expected: only intended docs are changed and verification passes.

- [ ] **Step 4: Commit docs**

Run:

```powershell
git add README.md docs/development.md
git commit -m "Add development documentation"
```

## Task 9: Start Local Dev Server

**Files:**

- No file edits unless a prior task failed.

- [ ] **Step 1: Start dev server**

Run:

```powershell
npm run dev
```

Expected: Next.js prints a local URL, usually `http://localhost:3000`.

- [ ] **Step 2: If port is busy**

Run:

```powershell
npm run dev -- -p 3001
```

Expected: Next.js prints `http://localhost:3001`.

- [ ] **Step 3: Manual smoke check**

Open the local URL and verify:

- Course sidebar shows Math Analysis volume and chapters.
- Main area shows sequence-limit overview and first knowledge point.
- Diagram area shows non-empty SVG cards.
- Exercise panel shows at least one exercise and hint button works.
- Tutor panel stores model settings in browser local storage.

## Task 10: Final Verification and Handoff

**Files:**

- No file edits expected.

- [ ] **Step 1: Run full verification**

Run:

```powershell
npm run validate:content
npm run build
git status --short
git log --oneline -8
```

Expected:

- Content validation passes.
- Build passes.
- Git status contains no unexpected files except partner-owned untracked work if partner is still active.
- Recent commits show scaffold, loader, layout, diagrams, exercise flow, tutor panel, and docs.

- [ ] **Step 2: Summarize remaining partner work**

Report whether these files exist:

```text
docs/ai/tutor-prompt-spec.md
docs/ui/learning-workbench-ia.md
```

If they exist and are uncommitted, do not commit them without reviewing partner output first.

## Self-Review Notes

This plan covers:

- Design doc requirement for Web MVP.
- Developer-maintained course content.
- Sequence-limit sample chapter.
- Teaching diagrams.
- Exercise and hint flow.
- AI tutor shell with local API Key settings.
- Content validation and development docs.
- Partner/main AI file ownership separation.

This plan intentionally excludes:

- User-uploaded textbooks.
- Formal account system.
- Payment or subscription logic.
- Cloud database.
- Production deployment.
