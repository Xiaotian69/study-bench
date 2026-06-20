# Dual-End Learning Workbench UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a coherent dual-end learning workbench upgrade for the web app and WeChat Mini Program, including miniprogram diagram data and rendering entry points.

**Architecture:** Keep the existing JSON-first content pipeline. Extend the miniprogram data builder to include diagram metadata, add a focused miniprogram diagram component, and refine existing web/miniprogram UI surfaces without changing the core course schema.

**Tech Stack:** Next.js 15, React 19, KaTeX, WeChat Mini Program WXML/WXSS/JS, Node validation scripts.

---

### Task 1: Protect Repository Hygiene

**Files:**
- Modify: `.gitignore`

- [x] **Step 1: Ignore local visual companion and logs**

Add these lines under local generated data:

```gitignore
*.log
.superpowers/
```

- [x] **Step 2: Confirm git status no longer shows visual companion files**

Run: `git status --short`

Expected: `.superpowers/` and root `*.log` files are not listed.

### Task 2: Document The Product Story

**Files:**
- Create: `docs/superpowers/specs/2026-06-20-dual-end-learning-workbench-ui-design.md`
- Create: `docs/superpowers/plans/2026-06-20-dual-end-learning-workbench-ui-plan.md`

- [x] **Step 1: Write the design spec**

Document the dual-end learning loop, web refinements, miniprogram learning-page changes, diagram strategy, PR story, and acceptance criteria.

- [x] **Step 2: Write this implementation plan**

Keep the plan scoped to UI/interaction and miniprogram diagram support. Content expansion for the remaining chapters stays out of scope.

### Task 3: Add Miniprogram Diagram Validation

**Files:**
- Modify: `package.json`
- Create: `scripts/validate-wx-diagrams.mjs`

- [ ] **Step 1: Add failing validation**

Create `scripts/validate-wx-diagrams.mjs` that checks:

```js
assert(sequenceKp.diagrams.some((diagram) => diagram.id === "epsilon-neighborhood-on-number-line"));
assert(studyJson.usingComponents["diagram-card"] === "/components/diagram-card/diagram-card");
assert(studyWxml.includes("<diagram-card"));
assert(fs.existsSync("wx-miniprogram/components/diagram-card/diagram-card.js"));
```

- [ ] **Step 2: Wire the script**

Add:

```json
"validate:wx-diagrams": "node scripts/build-wx-data.js && node scripts/validate-wx-diagrams.mjs"
```

- [ ] **Step 3: Run and confirm failure**

Run: `npm run validate:wx-diagrams`

Expected: failure because the data builder and component are not implemented yet.

### Task 4: Include Diagrams In Mini Program Data

**Files:**
- Modify: `scripts/build-wx-data.js`

- [ ] **Step 1: Read each chapter diagram file**

When a volume chapter has `diagramFile`, read it next to the chapter and exercise files.

- [ ] **Step 2: Adapt diagrams for the mini program**

Return compact objects with:

```js
{
  id,
  title,
  type,
  typeLabel,
  displayKind,
  description,
  parameters,
  teacherNotes,
  studentPrompt
}
```

- [ ] **Step 3: Attach diagrams to each knowledge point**

Match by explicit `kp.diagramIds` first and by `diagram.knowledgePointIds` second, de-duplicating by id.

- [ ] **Step 4: Run validation**

Run: `npm run validate:wx-diagrams`

Expected: still fails until the component and WXML are implemented.

### Task 5: Render Diagrams In The Mini Program Study Page

**Files:**
- Create: `wx-miniprogram/components/diagram-card/diagram-card.js`
- Create: `wx-miniprogram/components/diagram-card/diagram-card.json`
- Create: `wx-miniprogram/components/diagram-card/diagram-card.wxml`
- Create: `wx-miniprogram/components/diagram-card/diagram-card.wxss`
- Modify: `wx-miniprogram/pages/study/study.json`
- Modify: `wx-miniprogram/pages/study/study.wxml`
- Modify: `wx-miniprogram/pages/study/study.wxss`
- Modify: `wx-miniprogram/pages/study/study.js`

- [ ] **Step 1: Create diagram-card component**

The component derives a display model from `diagram.type` and `diagram.parameters`; it renders a lightweight visual for number-line, sequence, function, table, and concept-style diagrams.

- [ ] **Step 2: Register the component**

Add to `study.json`:

```json
"diagram-card": "/components/diagram-card/diagram-card"
```

- [ ] **Step 3: Insert the teaching diagrams section**

In the learn tab, render a section when `kp.diagrams.length > 0` and loop over `kp.diagrams` with `<diagram-card diagram="{{item}}" />`.

- [ ] **Step 4: Add diagram counters**

Expose diagram count in the top navigation badges and learning-page state.

- [ ] **Step 5: Run validation**

Run: `npm run validate:wx-diagrams`

Expected: pass.

### Task 6: Refine Web And Mini Program UI Rhythm

**Files:**
- Modify: `app/globals.css`
- Modify: `components/course/CourseSidebar.tsx`
- Modify: `components/course/ChapterHeader.tsx`
- Modify: `components/course/KnowledgePointNav.tsx`
- Modify: `components/course/ExercisePanel.tsx`
- Modify: `components/course/TutorPanel.tsx`
- Modify: `wx-miniprogram/pages/index/index.wxml`
- Modify: `wx-miniprogram/pages/index/index.wxss`
- Modify: `wx-miniprogram/pages/chapter/chapter.wxml`
- Modify: `wx-miniprogram/pages/chapter/chapter.wxss`
- Modify: `wx-miniprogram/pages/study/study.wxss`

- [ ] **Step 1: Tighten web hierarchy**

Improve spacing, section headings, nav affordances, exercise action grouping, and AI settings treatment while preserving the editorial palette.

- [ ] **Step 2: Align miniprogram labels**

Use the same language as the web app: 教学图示、思考题、易错提醒、AI 老师、评分要点.

- [ ] **Step 3: Improve progress affordances**

Show diagram count and progress signals in chapter/study contexts.

### Task 7: Validate And Publish

**Files:**
- Modify: README or PR body only if needed for narrative.

- [ ] **Step 1: Run validation commands**

Run:

```bash
npm run validate:wx-diagrams
npm run validate:all
npm run build
```

- [ ] **Step 2: Review git diff**

Run: `git diff --stat` and inspect changed files. Do not stage `.superpowers/`, root logs, or generated local secrets.

- [ ] **Step 3: Commit in story chunks**

Suggested commits:

```bash
git commit -m "docs: frame dual-end learning workbench upgrade"
git commit -m "feat(wx): render teaching diagrams in study flow"
git commit -m "style: refine dual-end learning workbench rhythm"
```

- [ ] **Step 4: Push and open draft PR**

Run:

```bash
git push -u origin codex/dual-workbench-ui-miniprogram
gh pr create --draft --title "[codex] Upgrade dual-end math learning workbench" --body-file <body-file>
```
