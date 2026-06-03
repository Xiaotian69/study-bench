# Claude Code Full Math Analysis Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Coordinate Claude Code to expand the project from one sample chapter into a full Math Analysis course across both volumes.

**Architecture:** Course content remains file-based under `content/courses/math-analysis/`. Each chapter is an independent content package with chapter JSON, exercise JSON, optional diagram JSON, and a review note. The app code should not be modified by Claude Code during content production unless explicitly requested.

**Tech Stack:** JSON course files, Markdown review docs, Node.js validation scripts, Next.js build verification.

---

## 0. Claude Code 启动说明

项目根目录：

```text
E:\Study_worker
```

开始前必须运行：

```powershell
git status --short
git log --oneline -8
npm run validate:all
```

必须阅读：

```text
docs/content/full-book-roadmap.md
content/courses/math-analysis/README.md
docs/superpowers/specs/2026-06-01-ai-math-tutor-design.md
docs/ai/tutor-prompt-spec.md
docs/release-checklist.md
```

## 1. 协作规则

- Claude Code 主要负责内容生产，不改 `app/`、`components/`、`lib/ai/`、`lib/tutor/`。
- 可以改 `content/courses/math-analysis/`、`docs/content/`、内容验证脚本。
- 不提交 PDF、截图、教材原文件、API Key。
- 不复制教材正文或大段原题原文；使用自编讲义、自编题或充分改写题。
- 可记录教材题号、章/节/页码作为 `sourceRef`，但不能编造。
- 每次只做一个章节任务包，完成后提交一次。
- 每个章节先做 `draft`，核对题源后再升 `sample-ready`。

## 2. 每章统一文件结构

以“函数极限”为例：

```text
content/courses/math-analysis/chapters/function-limit.json
content/courses/math-analysis/exercises/function-limit.json
content/courses/math-analysis/diagrams/function-limit.json
docs/content/function-limit-review.md
```

章节 JSON 须包含：

```json
{
  "id": "ch-function-limit",
  "courseId": "math-analysis",
  "volumeId": "math-analysis-volume-1",
  "number": 3,
  "title": "函数极限",
  "status": "draft",
  "overview": "本章用自编语言概括学习目标。",
  "knowledgePoints": []
}
```

题目 JSON 须包含：

```json
{
  "chapterId": "ch-function-limit",
  "exercises": []
}
```

图示 JSON 如本章需要图示则包含：

```json
{
  "chapterId": "ch-function-limit",
  "diagrams": []
}
```

不需要图示的章节可以先不建 diagrams 文件。

## 3. 单章知识点最低结构

每个知识点必须字段完整：

```json
{
  "id": "function-limit-definition",
  "title": "函数极限定义",
  "learningGoals": [
    "能说清自变量趋近过程和函数值趋近过程的区别。"
  ],
  "coreExplanation": "用原创文字讲清概念，公式用 LaTeX。",
  "textbookRefs": [
    "数学分析（第5版）上册，第 3 章，对应小节；具体题号待核对"
  ],
  "keyDefinitions": [
    { "name": "函数极限", "statement": "用原创表达写定义，不复制教材原文。" }
  ],
  "keyTheorems": [],
  "proofIdeas": [
    "写证明套路，而不是照搬教材证明。"
  ],
  "socraticQuestions": [
    "为什么函数极限讨论的是自变量趋近某点时的函数值行为？"
  ],
  "commonMistakes": [
    "把函数在该点的取值和极限值混为一谈。"
  ],
  "exampleIds": [],
  "exerciseIds": [],
  "diagramIds": [],
  "masteryCriteria": [
    "能独立判断一个基础函数极限是否存在，并说明理由。"
  ]
}
```

## 4. 单章练习最低结构

每章至少 8 道题，难度分布建议：

- basic：4 道。
- medium：3 道。
- hard：1 道。

题目结构：

```json
{
  "id": "function-limit-ex-001",
  "sourceType": "adapted",
  "sourceRef": "待核对题源：数学分析（第5版）上册，第 3 章相关习题",
  "knowledgePointIds": ["function-limit-definition"],
  "difficulty": "basic",
  "type": "definition-understanding",
  "recommendedTiming": "after-lecture",
  "prompt": "用原创或充分改写的题面，公式用 LaTeX。",
  "gradingRubric": [
    "评分要点 1",
    "评分要点 2",
    "评分要点 3"
  ],
  "hints": [
    "第一层提示，只给方向。",
    "第二层提示，指出关键等价变形。",
    "第三层提示，可给完整思路。"
  ],
  "commonMistakes": [
    "常见错误 1"
  ]
}
```

## 5. 第一批 Claude Code 任务包

### 任务包 CC-1：建立下册目录框架

**目标：** 对照本地《数学分析（第5版）下册》PDF，创建 `volume-2.json`，并把 `course.json` 的 `volumes` 扩展为上下册。

**Files:**

- Create: `content/courses/math-analysis/volume-2.json`
- Modify: `content/courses/math-analysis/course.json`
- Create: `docs/content/volume-2-outline-review.md`

**Steps:**

- [ ] 运行 `git status --short`，确认没有别人未提交的内容改动。
- [ ] 对照本地 PDF 目录，只摘录章/节标题和顺序，不复制正文。
- [ ] 创建 `volume-2.json`，章节状态全部设为 `planned`。
- [ ] 修改 `course.json`：`volumes` 改为 `["math-analysis-volume-1", "math-analysis-volume-2"]`，`textbook.title` 改为“数学分析（第5版）上下册”。
- [ ] 写 `docs/content/volume-2-outline-review.md`，记录目录是否已核对、哪些标题有疑问。
- [ ] 运行：

```powershell
node -e "JSON.parse(require('fs').readFileSync('content/courses/math-analysis/volume-2.json','utf8')); JSON.parse(require('fs').readFileSync('content/courses/math-analysis/course.json','utf8')); console.log('volume 2 outline json ok')"
npm run validate:all
git status --short
```

- [ ] 提交：

```powershell
git add content/courses/math-analysis/volume-2.json content/courses/math-analysis/course.json docs/content/volume-2-outline-review.md
git commit -m "Add math analysis volume two outline"
```

### 任务包 CC-2：上册第 3 章 函数极限

**目标：** 完成函数极限章节 draft。

**Files:**

- Create: `content/courses/math-analysis/chapters/function-limit.json`
- Create: `content/courses/math-analysis/exercises/function-limit.json`
- Create: `content/courses/math-analysis/diagrams/function-limit.json`
- Create: `docs/content/function-limit-review.md`
- Modify: `content/courses/math-analysis/volume-1.json`

**Knowledge point ids:**

```text
function-limit-intuition
x-to-x0-limit-definition
one-sided-limits
infinite-limits-and-limits-at-infinity
function-limit-properties
heine-definition
two-important-limits
infinitesimal-and-infinite
```

**Exercise ids:** `function-limit-ex-001` 到 `function-limit-ex-010`。

**Steps:**

- [ ] 把第 3 章 `status` 改为 `draft`，添加 `chapterFile` 和 `exercisesFile`。
- [ ] 小节添加对应 `knowledgePointIds`。
- [ ] 创建章节文件，至少 8 个知识点。
- [ ] 创建题目文件，至少 10 道题，覆盖定义、单侧极限、无穷小、两个重要极限。
- [ ] 创建图示文件，至少 4 个图示：邻域、左右极限、无穷远趋近、无穷小比较。
- [ ] 写 review 文档，列出题源核对状态。
- [ ] 运行：

```powershell
npm run validate:all
$blockedPatterns = @('TO' + 'DO', 'T' + 'BD', '以后' + '完善')
Select-String -Path 'content/courses/math-analysis/chapters/function-limit.json','content/courses/math-analysis/exercises/function-limit.json','docs/content/function-limit-review.md' -Pattern $blockedPatterns
git status --short
```

- [ ] 提交：

```powershell
git add content/courses/math-analysis/volume-1.json content/courses/math-analysis/chapters/function-limit.json content/courses/math-analysis/exercises/function-limit.json content/courses/math-analysis/diagrams/function-limit.json docs/content/function-limit-review.md
git commit -m "Draft function limit chapter content"
```

### 任务包 CC-3：上册第 4 章 函数的连续性

**目标：** 完成连续性章节 draft。

**Files:**

- Create: `content/courses/math-analysis/chapters/continuity.json`
- Create: `content/courses/math-analysis/exercises/continuity.json`
- Create: `content/courses/math-analysis/diagrams/continuity.json`
- Create: `docs/content/continuity-review.md`
- Modify: `content/courses/math-analysis/volume-1.json`

**Knowledge point ids:**

```text
continuity-at-point
one-sided-continuity
discontinuity-types
continuity-operations
composite-continuity
elementary-function-continuity
closed-interval-properties-preview
```

**Exercise ids:** `continuity-ex-001` 到 `continuity-ex-008`。

**Diagram ids:**

```text
continuity-at-point-neighborhood
one-sided-continuity-comparison
removable-discontinuity-hole
jump-discontinuity-step
closed-interval-value-property
```

**Steps:**

- [ ] 运行 `git status --short`，确认没有别人正在改同一批 `content/courses/math-analysis/` 文件。
- [ ] 修改 `content/courses/math-analysis/volume-1.json`，把第 4 章 `status` 改为 `draft`，补上 `chapterFile`、`exercisesFile`、`diagramFile`。
- [ ] 在第 4 章小节里填入上面的 `knowledgePointIds`，每个 id 只能出现一次。
- [ ] 创建 `chapters/continuity.json`，至少 7 个知识点；重点写清“点连续”“单侧连续”“间断点分类”“闭区间连续函数性质”的逻辑关系。
- [ ] 创建 `exercises/continuity.json`，至少 8 道题；题型覆盖定义判断、间断点分类、参数连续、闭区间定理应用、证明题。
- [ ] 创建 `diagrams/continuity.json`，至少 5 个图示；图示只用程序化 specs，不放截图。
- [ ] 创建 `docs/content/continuity-review.md`，记录哪些题源已核对、哪些只做了原创/改写。
- [ ] 运行：

```powershell
node -e "JSON.parse(require('fs').readFileSync('content/courses/math-analysis/chapters/continuity.json','utf8')); JSON.parse(require('fs').readFileSync('content/courses/math-analysis/exercises/continuity.json','utf8')); JSON.parse(require('fs').readFileSync('content/courses/math-analysis/diagrams/continuity.json','utf8')); console.log('continuity json ok')"
npm run validate:all
$blockedPatterns = @('TO' + 'DO', 'T' + 'BD', '以后' + '完善')
Select-String -Path 'content/courses/math-analysis/chapters/continuity.json','content/courses/math-analysis/exercises/continuity.json','docs/content/continuity-review.md' -Pattern $blockedPatterns
git status --short
```

- [ ] 提交：

```powershell
git add content/courses/math-analysis/volume-1.json content/courses/math-analysis/chapters/continuity.json content/courses/math-analysis/exercises/continuity.json content/courses/math-analysis/diagrams/continuity.json docs/content/continuity-review.md
git commit -m "Draft continuity chapter content"
```

### 任务包 CC-4：上册第 5 章 导数和微分

**目标：** 完成导数和微分章节 draft。

**Files:**

- Create: `content/courses/math-analysis/chapters/derivative-differential.json`
- Create: `content/courses/math-analysis/exercises/derivative-differential.json`
- Create: `content/courses/math-analysis/diagrams/derivative-differential.json`
- Create: `docs/content/derivative-differential-review.md`
- Modify: `content/courses/math-analysis/volume-1.json`

**Knowledge point ids:**

```text
derivative-definition
geometric-meaning
differentiability-and-continuity
derivative-rules
inverse-and-composite-derivative
higher-order-derivatives
differential-definition
parametric-derivative
```

**Exercise ids:** `derivative-differential-ex-001` 到 `derivative-differential-ex-010`。

**Diagram ids:**

```text
secant-to-tangent
cusp-not-differentiable
differential-linear-approximation
derivative-sign-local-shape
parametric-derivative-curve
```

**Steps:**

- [ ] 运行 `git status --short`，确认没有别人正在改第 5 章文件。
- [ ] 修改 `volume-1.json`，把第 5 章改为 `draft`，补 `chapterFile`、`exercisesFile`、`diagramFile`。
- [ ] 创建 `chapters/derivative-differential.json`，至少 8 个知识点；重点写清“可导推出连续，但连续不推出可导”。
- [ ] 创建 `exercises/derivative-differential.json`，至少 10 道题；题型覆盖定义求导、可导性判断、求导法则、反函数/复合函数、参数方程、高阶导数、微分近似。
- [ ] 创建 `diagrams/derivative-differential.json`，至少 5 个图示；尖点不可导图示必须体现左右斜率不同。
- [ ] 创建 `docs/content/derivative-differential-review.md`，列出本章题目是否来自原创、改写或待核对题源。
- [ ] 运行：

```powershell
node -e "for (const p of ['content/courses/math-analysis/chapters/derivative-differential.json','content/courses/math-analysis/exercises/derivative-differential.json','content/courses/math-analysis/diagrams/derivative-differential.json']) JSON.parse(require('fs').readFileSync(p,'utf8')); console.log('derivative differential json ok')"
npm run validate:all
git status --short
```

- [ ] 提交：

```powershell
git add content/courses/math-analysis/volume-1.json content/courses/math-analysis/chapters/derivative-differential.json content/courses/math-analysis/exercises/derivative-differential.json content/courses/math-analysis/diagrams/derivative-differential.json docs/content/derivative-differential-review.md
git commit -m "Draft derivative and differential chapter content"
```

### 任务包 CC-5：上册第 6 章 微分中值定理及其应用

**目标：** 完成中值定理章节 draft。

**Files:**

- Create: `content/courses/math-analysis/chapters/mean-value-theorems.json`
- Create: `content/courses/math-analysis/exercises/mean-value-theorems.json`
- Create: `content/courses/math-analysis/diagrams/mean-value-theorems.json`
- Create: `docs/content/mean-value-theorems-review.md`
- Modify: `content/courses/math-analysis/volume-1.json`

**Knowledge point ids:**

```text
fermat-theorem
rolle-theorem
lagrange-mvt
cauchy-mvt
lhopital-rule
taylor-formula
monotonicity-extrema
convexity-and-inflection
```

**Exercise ids:** `mean-value-theorems-ex-001` 到 `mean-value-theorems-ex-012`。

**Diagram ids:**

```text
rolle-horizontal-tangent
lagrange-parallel-secant-tangent
cauchy-parametric-curve
taylor-polynomial-contact
convexity-second-derivative
```

**Steps:**

- [ ] 运行 `git status --short`，确认第 6 章相关文件没有并行改动。
- [ ] 修改 `volume-1.json`，把第 6 章改为 `draft`，补 `chapterFile`、`exercisesFile`、`diagramFile`。
- [ ] 创建 `chapters/mean-value-theorems.json`，至少 8 个知识点；证明思路要写清 Fermat -> Rolle -> Lagrange -> Cauchy 的依赖链。
- [ ] 创建 `exercises/mean-value-theorems.json`，至少 12 道题；证明题不少于 4 道，另含洛必达、Taylor、单调性、极值、凸性题。
- [ ] 创建 `diagrams/mean-value-theorems.json`，至少 5 个图示。
- [ ] 创建 `docs/content/mean-value-theorems-review.md`，记录每类证明题对应的训练目标。
- [ ] 运行：

```powershell
node -e "for (const p of ['content/courses/math-analysis/chapters/mean-value-theorems.json','content/courses/math-analysis/exercises/mean-value-theorems.json','content/courses/math-analysis/diagrams/mean-value-theorems.json']) JSON.parse(require('fs').readFileSync(p,'utf8')); console.log('mean value theorem json ok')"
npm run validate:all
git status --short
```

- [ ] 提交：

```powershell
git add content/courses/math-analysis/volume-1.json content/courses/math-analysis/chapters/mean-value-theorems.json content/courses/math-analysis/exercises/mean-value-theorems.json content/courses/math-analysis/diagrams/mean-value-theorems.json docs/content/mean-value-theorems-review.md
git commit -m "Draft mean value theorem chapter content"
```

### 任务包 CC-6：上册积分三章

**目标：** 分三次提交完成不定积分、定积分、反常积分 draft。

**第 8 章：不定积分**

```text
content/courses/math-analysis/chapters/indefinite-integral.json
content/courses/math-analysis/exercises/indefinite-integral.json
content/courses/math-analysis/diagrams/indefinite-integral.json
docs/content/indefinite-integral-review.md
```

知识点 id：

```text
antiderivative-and-indefinite-integral
basic-integral-table
substitution-method
integration-by-parts
rational-function-integration
trigonometric-substitution
```

步骤：

- [ ] 修改 `volume-1.json` 第 8 章为 `draft`。
- [ ] 写 6 个以上知识点、8 道以上题，题型覆盖换元、分部、三角代换、有理函数。
- [ ] 图示至少 2 个：换元变量映射、分部积分结构。
- [ ] 运行 `npm run validate:all`。
- [ ] 提交：

```powershell
git add content/courses/math-analysis/volume-1.json content/courses/math-analysis/chapters/indefinite-integral.json content/courses/math-analysis/exercises/indefinite-integral.json content/courses/math-analysis/diagrams/indefinite-integral.json docs/content/indefinite-integral-review.md
git commit -m "Draft indefinite integral chapter content"
```

**第 9 章：定积分**

```text
content/courses/math-analysis/chapters/definite-integral.json
content/courses/math-analysis/exercises/definite-integral.json
content/courses/math-analysis/diagrams/definite-integral.json
docs/content/definite-integral-review.md
```

知识点 id：

```text
riemann-sum-intuition
definite-integral-definition
integrability-criteria
integral-properties
fundamental-theorem-of-calculus
variable-upper-limit-function
definite-integral-substitution
definite-integral-parts
```

步骤：

- [ ] 修改 `volume-1.json` 第 9 章为 `draft`。
- [ ] 写 8 个以上知识点、10 道以上题，题型覆盖 Riemann 和、可积性、积分性质、变上限函数、Newton-Leibniz、定积分换元/分部。
- [ ] 图示至少 4 个：分割求和、上/下和、变上限面积函数、奇偶对称积分。
- [ ] 运行 `npm run validate:all`。
- [ ] 提交：

```powershell
git add content/courses/math-analysis/volume-1.json content/courses/math-analysis/chapters/definite-integral.json content/courses/math-analysis/exercises/definite-integral.json content/courses/math-analysis/diagrams/definite-integral.json docs/content/definite-integral-review.md
git commit -m "Draft definite integral chapter content"
```

**第 11 章：反常积分**

```text
content/courses/math-analysis/chapters/improper-integral.json
content/courses/math-analysis/exercises/improper-integral.json
content/courses/math-analysis/diagrams/improper-integral.json
docs/content/improper-integral-review.md
```

知识点 id：

```text
improper-integral-infinite-interval
improper-integral-unbounded-function
convergence-definition
comparison-test
limit-comparison-test
absolute-and-conditional-convergence
gamma-type-integrals-preview
```

步骤：

- [ ] 修改 `volume-1.json` 第 11 章为 `draft`。
- [ ] 写 7 个以上知识点、10 道以上题，题型覆盖无穷区间、瑕积分、比较判别、极限比较、绝对/条件收敛。
- [ ] 图示至少 3 个：无穷区间截断、瑕点邻域、面积尾部估计。
- [ ] 运行 `npm run validate:all`。
- [ ] 提交：

```powershell
git add content/courses/math-analysis/volume-1.json content/courses/math-analysis/chapters/improper-integral.json content/courses/math-analysis/exercises/improper-integral.json content/courses/math-analysis/diagrams/improper-integral.json docs/content/improper-integral-review.md
git commit -m "Draft improper integral chapter content"
```

### 任务包 CC-7：上册基础与完备性

**目标：** 补齐实数集与函数、实数完备性、定积分应用。

**Chapters:**

```text
real-numbers-functions
real-completeness
definite-integral-applications
```

**Real numbers and functions ids:**

```text
real-number-field-order
sets-and-mappings
function-basic-concepts
elementary-functions
absolute-value-and-inequalities
supremum-infimum-preview
```

**Real completeness ids:**

```text
least-upper-bound-property
monotone-convergence-theorem
nested-interval-theorem
cauchy-convergence-principle
bolzano-weierstrass-theorem
heine-borel-theorem-preview
equivalence-of-completeness-theorems
```

**Integral applications ids:**

```text
area-by-definite-integral
volume-by-slicing
arc-length
surface-area-of-revolution
work-and-average-value
```

**Steps:**

- [ ] 每次只选一个 chapter slug，创建 chapter/exercise/diagram/review 四类文件。
- [ ] 每章修改 `volume-1.json` 的对应状态和文件引用。
- [ ] `real-numbers-functions` 至少 6 个知识点、8 道题，重点服务后续章节的语言基础。
- [ ] `real-completeness` 至少 7 个知识点、10 道题，证明思路必须写清定理间等价关系，不只给结论。
- [ ] `definite-integral-applications` 至少 5 个知识点、8 道题，图示至少覆盖面积、旋转体、弧长。
- [ ] 每章完成后运行：

```powershell
npm run validate:all
git status --short
```

- [ ] 每章单独提交，提交信息分别使用：

```powershell
git commit -m "Draft real numbers and functions chapter content"
git commit -m "Draft real completeness chapter content"
git commit -m "Draft definite integral applications content"
```

### 任务包 CC-8：下册分批整理

**前置：** 必须先完成 CC-1。

**推荐批次：**

| 批次 | chapter slug | 最低要求 |
| --- | --- | --- |
| 1 | `numerical-series` | 8 个知识点、12 道题，覆盖正项级数、任意项级数、绝对/条件收敛 |
| 2 | `function-sequences-series` | 8 个知识点、10 道题，覆盖一致收敛、逐项极限/积分/微分 |
| 3 | `power-series` | 7 个知识点、10 道题，覆盖收敛半径、Taylor 展开、函数展开 |
| 4 | `fourier-series` | 6 个知识点、8 道题，覆盖三角级数、正交性、收敛定理直观 |
| 5 | `multivariable-limit-continuity` | 7 个知识点、10 道题，覆盖二重极限路径法、连续性 |
| 6 | `multivariable-differential` | 8 个知识点、12 道题，覆盖偏导、全微分、方向导数、梯度、极值 |
| 7 | `implicit-function-theorem` | 6 个知识点、8 道题，覆盖隐函数、反函数、条件极值 |
| 8 | `parameter-integrals` | 6 个知识点、8 道题，覆盖含参积分连续性、可导性、可积性 |
| 9 | `line-integrals` | 7 个知识点、10 道题，覆盖第一/二型曲线积分、Green 公式 |
| 10 | `multiple-integrals` | 8 个知识点、12 道题，覆盖二重/三重积分、变量替换、几何应用 |
| 11 | `surface-integrals-vector-fields` | 8 个知识点、12 道题，覆盖曲面积分、Gauss 公式、Stokes 公式、场论初步 |

**每个下册章节的固定步骤：**

- [ ] 读取 `volume-2.json`，找到当前 chapter slug 对应章节。
- [ ] 修改当前章节为 `draft`，补 `chapterFile`、`exercisesFile`、需要时补 `diagramFile`。
- [ ] 创建对应 `chapters/*.json`，知识点字段完整。
- [ ] 创建对应 `exercises/*.json`，题目按 easy/medium/hard 分层。
- [ ] 需要图示时创建对应 `diagrams/*.json`，不用截图或位图。
- [ ] 创建对应 `docs/content/*-review.md`，记录题源核对状态和本章风险。
- [ ] 运行：

```powershell
npm run validate:all
git status --short
```

**下册各批次提交命令：**

```powershell
git add content/courses/math-analysis/volume-2.json content/courses/math-analysis/chapters/numerical-series.json content/courses/math-analysis/exercises/numerical-series.json content/courses/math-analysis/diagrams/numerical-series.json docs/content/numerical-series-review.md
git commit -m "Draft numerical series chapter content"

git add content/courses/math-analysis/volume-2.json content/courses/math-analysis/chapters/function-sequences-series.json content/courses/math-analysis/exercises/function-sequences-series.json content/courses/math-analysis/diagrams/function-sequences-series.json docs/content/function-sequences-series-review.md
git commit -m "Draft function sequences and series chapter content"

git add content/courses/math-analysis/volume-2.json content/courses/math-analysis/chapters/power-series.json content/courses/math-analysis/exercises/power-series.json content/courses/math-analysis/diagrams/power-series.json docs/content/power-series-review.md
git commit -m "Draft power series chapter content"

git add content/courses/math-analysis/volume-2.json content/courses/math-analysis/chapters/fourier-series.json content/courses/math-analysis/exercises/fourier-series.json content/courses/math-analysis/diagrams/fourier-series.json docs/content/fourier-series-review.md
git commit -m "Draft fourier series chapter content"

git add content/courses/math-analysis/volume-2.json content/courses/math-analysis/chapters/multivariable-limit-continuity.json content/courses/math-analysis/exercises/multivariable-limit-continuity.json content/courses/math-analysis/diagrams/multivariable-limit-continuity.json docs/content/multivariable-limit-continuity-review.md
git commit -m "Draft multivariable limit and continuity chapter content"

git add content/courses/math-analysis/volume-2.json content/courses/math-analysis/chapters/multivariable-differential.json content/courses/math-analysis/exercises/multivariable-differential.json content/courses/math-analysis/diagrams/multivariable-differential.json docs/content/multivariable-differential-review.md
git commit -m "Draft multivariable differential chapter content"

git add content/courses/math-analysis/volume-2.json content/courses/math-analysis/chapters/implicit-function-theorem.json content/courses/math-analysis/exercises/implicit-function-theorem.json content/courses/math-analysis/diagrams/implicit-function-theorem.json docs/content/implicit-function-theorem-review.md
git commit -m "Draft implicit function theorem chapter content"

git add content/courses/math-analysis/volume-2.json content/courses/math-analysis/chapters/parameter-integrals.json content/courses/math-analysis/exercises/parameter-integrals.json content/courses/math-analysis/diagrams/parameter-integrals.json docs/content/parameter-integrals-review.md
git commit -m "Draft parameter integrals chapter content"

git add content/courses/math-analysis/volume-2.json content/courses/math-analysis/chapters/line-integrals.json content/courses/math-analysis/exercises/line-integrals.json content/courses/math-analysis/diagrams/line-integrals.json docs/content/line-integrals-review.md
git commit -m "Draft line integrals chapter content"

git add content/courses/math-analysis/volume-2.json content/courses/math-analysis/chapters/multiple-integrals.json content/courses/math-analysis/exercises/multiple-integrals.json content/courses/math-analysis/diagrams/multiple-integrals.json docs/content/multiple-integrals-review.md
git commit -m "Draft multiple integrals chapter content"

git add content/courses/math-analysis/volume-2.json content/courses/math-analysis/chapters/surface-integrals-vector-fields.json content/courses/math-analysis/exercises/surface-integrals-vector-fields.json content/courses/math-analysis/diagrams/surface-integrals-vector-fields.json docs/content/surface-integrals-vector-fields-review.md
git commit -m "Draft surface integrals and vector fields chapter content"
```

## 6. Claude Code 每次完成后的报告格式

```text
完成报告

选择的任务包：

修改/创建的文件：

运行的验证命令：

验证结果：

题源核对状态：

没有完成或需要主 AI 继续处理的点：

是否改动 app/components/lib/ai：

下一步建议：
```

## 7. 可直接复制给 Claude Code 的提示词

```text
你是本项目的 Claude Code / AI partner。项目根目录是 E:\Study_worker。

任务目标：把《数学分析》上下册整理成结构化学习内容。你只负责内容文件和内容文档，不改 app/、components/、lib/ai/、lib/tutor/。

请先阅读：
docs/superpowers/plans/2026-06-03-claude-code-full-math-analysis-content-plan.md
docs/content/full-book-roadmap.md
content/courses/math-analysis/README.md
docs/superpowers/specs/2026-06-01-ai-math-tutor-design.md
docs/release-checklist.md

优先执行任务包 CC-1：建立下册目录框架。
然后执行 CC-2：上册第 3 章 函数极限。

硬性规则：
- 开始前运行 git status --short 和 npm run validate:all。
- 不提交 PDF、截图、教材原文件、API Key。
- 不复制教材正文或大段原题原文。
- 讲义、解释、题面、提示、评分要点用自编表达。
- 可记录教材题号作为 sourceRef；无法核对时写“待核对题源”，不得编造。
- 每次只做一个章节任务包，完成后提交一次。
- 完成后按计划文档里的“完成报告”格式输出。
```
