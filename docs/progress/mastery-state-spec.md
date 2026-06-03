# 掌握度与学习进度数据模型

日期：2026-06-02
对应任务包：5（掌握度与学习进度数据模型）
canonical 实现：`lib/progress/masteryProgress.ts`
类型出口：`lib/progress/masteryTypes.ts`
关联：`docs/ui/learning-workbench-ia.md` 第 6 节、`docs/ai/tutor-runtime-contract.md`（mastery 任务）

本规范描述“学没学、会不会、哪题错、提示用了几级”的数据模型。模型已实现于 `lib/progress/masteryProgress.ts`（含 localStorage 持久化与 UI 接线），本文档记录其语义、状态机与对接关系，作为后续扩展的依据。

---

## 1. 数据结构

定义在 `lib/progress/masteryProgress.ts`，类型可从 `lib/progress/masteryTypes.ts` 单独导入：

```ts
ExerciseAttemptRecord {
  exerciseId, knowledgePointIds, submittedAt, answerText,
  attachmentCount, hintLevelUsed, verdict, score, missingKeyPoints
}

KnowledgePointProgressRecord {
  knowledgePointId, masteryState,
  startedAt?, lastStudiedAt?, completedAt?,
  attempts: ExerciseAttemptRecord[], criteriaMet, criteriaUnmet
}

CourseProgressRecord {
  courseId, volumeId, updatedAt,
  knowledgePoints: Record<knowledgePointId, KnowledgePointProgressRecord>
}
```

- 进度以 **册** 为单位存一条 `CourseProgressRecord`。
- 每个知识点一条 `KnowledgePointProgressRecord`，内含全部作答历史 `attempts`。
- 这套结构足以支撑：左侧目录章节进度徽标、知识点掌握状态、题目作答历史、缺失要点回顾。

## 2. 四种掌握状态

`MasteryState = "not_started" | "emerging" | "proficient" | "weak"`

中文标签（`getMasteryLabel`）：

| 状态 | 标签 | 含义 |
| --- | --- | --- |
| `not_started` | 未学 | 还没有任何作答记录 |
| `emerging` | 初步掌握 | 已开始练习，部分要点达成，但尚未满足全部掌握标准 |
| `proficient` | 熟练 | 满足该知识点全部 `masteryCriteria`，可进入下一知识点 |
| `weak` | 薄弱 | 多次作答仍有关键要点缺失/错误，需要补讲或补练 |

## 3. 状态转移

### 3.1 触发时机

每次提交批改后，`saveExerciseAttempt(...)` 追加一条 `ExerciseAttemptRecord` 并更新该知识点的 `masteryState`。

### 3.2 何时离开 `not_started` → `emerging`

- 该知识点出现**第一条作答记录**（`attempts` 从空变为非空），且本次未直接达到 `proficient`/`weak`，即进入 `emerging`。
- `startedAt` 在首次作答时写入。

### 3.3 何时进入 `proficient`

- **当且仅当**该知识点的 `criteriaUnmet` 为空，即全部 `masteryCriteria` 均被满足。
- 与 AI `mastery` 任务一致：`masteryState=proficient ⇔ criteriaUnmet 为空`（见 `docs/ai/tutor-runtime-contract.md` 第 5 节）。
- 进入时写入 `completedAt`。
- 不得在没有作答证据（`attempts` 为空）时判 `proficient`。

### 3.4 何时标记 `weak`

- 多次作答（≥2 次）后仍持续 `incorrect`，或关键要点反复出现在 `missingKeyPoints` 中。
- `weak` 是“需要干预”的信号，触发复讲或补基础题（见第 5 节 recommendation 映射）。

### 3.5 当前实现说明

现版本 `saveExerciseAttempt` 直接采用批改结果的 `result.masterySuggestion` 作为新的 `masteryState`，并把 `result.missingKeyPoints` 写入 `criteriaUnmet`。这是一个**以单次批改信号驱动**的过渡实现。后续接入 AI `mastery` 任务后，应改为综合多次 `attempts` 与 `masteryCriteria` 逐条判定 `criteriaMet`/`criteriaUnmet`，再据 3.3 规则决定是否 `proficient`。本文件第 3.2–3.4 节描述的是目标语义。

### 3.6 章节级聚合

`getChapterMasteryState(progress, knowledgePointIds)`：

- 任一知识点为 `weak` → 章节 `weak`；
- 全部为 `proficient` → 章节 `proficient`；
- 存在 `emerging`/`proficient` → 章节 `emerging`；
- 否则 `not_started`。

## 4. 本地存储

- 存储键命名：`ai-math-tutor-progress:<courseId>:<volumeId>`（见 `getProgressStorageKey`）。例如 `ai-math-tutor-progress:math-analysis:math-analysis-volume-1`。
- 使用浏览器 `localStorage`，不进入服务端数据库（与第一版“API Key/进度优先本地”一致）。
- 写入后派发自定义事件 `ai-math-tutor-progress-updated`，供侧边栏等组件实时刷新。
- 解析失败时回退为空的默认进度（`getDefaultCourseProgress`），不抛错。
- 模型设置另存于 `ai-math-tutor-settings`（`lib/progress/progressStore.ts`），与进度数据分开。

## 5. 与 AI `mastery` 任务输出的对应

AI `mastery` 任务返回 `TutorMasteryResponse`（见 `lib/ai/tutor-contract.ts`）：

| AI 输出字段 | 进度模型落点 |
| --- | --- |
| `masteryState` | `KnowledgePointProgressRecord.masteryState` |
| `criteriaMet` | `KnowledgePointProgressRecord.criteriaMet` |
| `criteriaUnmet` | `KnowledgePointProgressRecord.criteriaUnmet` |
| `recommendation` | 不持久化；用于前端路径调整提示（见下） |
| `rationale` | 可作为反馈展示，不必长期存储 |

`recommendation` 与路径调整：

| recommendation | 前端动作 |
| --- | --- |
| `advance` | 允许进入下一知识点 |
| `review-explanation` | 建议回看讲义/重看 explain |
| `more-basic-practice` | 安排更多基础题 |
| `retry-exercise` | 重做当前题目 |

`grade` 任务的 `masterySuggestion` 是**单题信号**，最终知识点掌握度应以 `mastery` 任务的综合判定为准。

## 6. 范围边界

- 本规范不新增 UI；左侧进度徽标和当前知识点状态已由主 AI 任务包 8 接线。
- 模型设置继续由 `lib/progress/progressStore.ts` 维护，和学习进度分开。
- 不引入服务端持久化或账号系统。
