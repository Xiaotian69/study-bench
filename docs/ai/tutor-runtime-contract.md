# AI 老师运行时契约（API route 实现指南）

日期：2026-06-02
对应任务包：1（AI 调用契约与样例数据）
依据：`docs/ai/tutor-prompt-spec.md`、`lib/ai/prompt-templates.md`
类型：`lib/ai/tutor-contract.ts`　样例：`lib/ai/tutor-fixtures.ts`

本文件把提示词规范落成可被后续 API route 直接实现的运行时契约。主 AI（任务包 2）据此实现真实模型调用，无需再回头解读 prompt 规范。

---

## 1. 整体调用流程

```text
前端学习区
  -> 组装 TutorContextEnvelope（task + context + payload）
  -> POST /api/tutor
  -> API route 按 task 选择 prompt 模板 + 输出解析方式
  -> 调用所选模型（provider/baseUrl/apiKey 来自前端设置）
  -> 解析模型输出为对应的 TutorResponse
  -> 返回前端渲染
```

所有任务共用同一个请求信封 `TutorContextEnvelope`（见 `lib/ai/tutor-contract.ts`）。`task` 字段决定 `payload` 的形状和返回类型。

## 2. 请求如何组装

API route 不直接信任前端传来的整段课程数据；建议由前端只传**标识**，服务端再从课程内容加载并裁剪：

| envelope 字段 | 来源 |
| --- | --- |
| `context.courseId/chapterId/sectionId/knowledgePointId` | 当前学习位置（来自路由/状态） |
| `context.currentStep` | 学习闭环当前步（见 prompt 规范第 7 节映射表） |
| `context.knowledgePoint` | 由 `knowledgePointId` 加载后裁剪为 `TutorKnowledgePointContext` |
| `context.exercise` | 仅 grade/hint 任务需要；由 `exerciseId` 加载后裁剪为 `TutorExerciseContext` |
| `context.learnerHistory` | 来自进度模型（任务包 5：`masteryState`、最近回答、已用提示层级） |
| `payload` | 随 task 不同，见各任务 payload 类型 |

**裁剪原则**：发送给模型前，去掉与当前任务无关的字段，降低越界概率与 token 成本（对应 prompt 规范第 1.1 节）。例如 `ask` 任务不需要 `gradingRubric`，`grade` 任务不需要 `socraticQuestions`。

## 3. 哪些任务返回自然语言，哪些返回严格 JSON

由 `tutorTaskOutputKind`（`lib/ai/tutor-contract.ts`）给出，供 API route 选择解析路径：

| task | 输出 | 返回类型 |
| --- | --- | --- |
| `explain` | 自然语言文本 | `TutorExplainResponse`（`{ text }`） |
| `ask` | 严格 JSON | `TutorAskResponse` |
| `grade` | 严格 JSON | `TutorGradeResponse` |
| `hint` | 严格 JSON | `TutorHintResponse` |
| `mastery` | 严格 JSON | `TutorMasteryResponse` |

- 文本任务：直接把模型文本作为 `text` 返回；不强行解析 JSON。
- JSON 任务：模型应只输出 JSON 对象（无 Markdown 围栏、无解释文字）。建议调用时温度设低（0–0.3）。

## 4. JSON 解析失败时的降级规则

JSON 任务的解析按以下顺序处理：

1. **直接 `JSON.parse`**：成功则按对应类型做字段校验（见第 5 节）。
2. **剥离围栏后重试**：若输出被 ```` ```json ```` 包裹，去掉围栏再 parse。
3. **重试一次模型调用**：在系统提示后追加“只输出 JSON 对象，不要任何解释或代码围栏”，重新请求一次。
4. **结构化降级**：仍失败时，返回该任务的安全兜底值，且**不得编造内容**：
   - `grade` → `{ verdict: "partially_correct", score: 0, feedback: "暂时无法完成自动批改，请稍后重试或检查模型设置。", missingKeyPoints: [], nextHintLevel: <当前层级>, masterySuggestion: <沿用入参 currentMastery 或 "emerging"> }`
   - `hint` → 直接回退到课程数据 `exercise.hints[level-1]`（提示本就来自题库，可不依赖模型）。
   - `ask` → 回退到 `knowledgePoint.socraticQuestions` 中下一个未问过的问题。
   - `mastery` → `{ masteryState: <沿用入参>, criteriaMet: [], criteriaUnmet: [], recommendation: "review-explanation", rationale: "自动判定不可用，建议复看讲义后重试。" }`
5. 前端应能区分“正常结果”与“降级结果”，必要时提示用户检查模型/网络。

字段级校验失败（如 `score` 越界、`verdict` 非枚举值）按第 4 步同样降级处理。

## 5. 各任务字段校验要点

- `grade`：`score ∈ [0,100]` 整数；`verdict ∈ {correct, partially_correct, incorrect}`；`verdict=correct` 时 `nextHintLevel=0`；`missingKeyPoints` 取自题目 `gradingRubric`。
- `hint`：`1 ≤ level ≤ maxLevel`；`maxLevel = exercise.hints.length`；`isFinalAnswerRevealed` 仅在 `level=maxLevel` 时可为 `true`；`hint` 不得提前泄露更深层级。
- `ask`：`sourceQuestionIndex` 必须是 `socraticQuestions` 的合法下标；一次只一个问题。
- `mastery`：`masteryState=proficient` 当且仅当 `criteriaUnmet` 为空；`gradeResults` 为空时不得判 `proficient`。

## 6. 硬性约束（不得违反）

- **AI 不得生成题库外正式题**。题目只能来自课程内容文件中的 `exercise` 对象；任何“再出一道类似题”的正式题请求都应拒绝，只能在原题基础上做追问式变式提问（不产出新的带标准答案的正式题）。
- AI 不得脱离 `context` 注入的当前知识点/题目自由扩展。
- 提示在到达最后层级前不得给出完整答案。
- 不得在未满足 `masteryCriteria` 时宣布“已掌握”。
- 不得在文件、日志或返回中泄露 API Key。

## 7. 样例数据

`lib/ai/tutor-fixtures.ts` 导出以下样例，可用于单元测试与 mock：

- `sampleExplainRequest`、`sampleGradeRequest`：完整请求信封。
- `sampleAskResponse`、`sampleGradeResponse`、`sampleHintResponse`、`sampleMasteryResponse`：四类 JSON 任务的标准返回。

样例均来自“数列极限”样板章（知识点 `epsilon-n-definition`，题目 `seq-limit-ex-002`），不含任何真实密钥。
