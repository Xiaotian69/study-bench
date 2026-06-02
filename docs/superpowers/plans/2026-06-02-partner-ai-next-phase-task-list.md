# Partner AI 下一阶段任务清单

日期：2026-06-02

## 给 Partner AI 的总说明

你正在协助开发一个 Web 项目：数学分析 AI 同步学习助手。项目根目录：

```text
E:\Study_worker
```

当前项目已经完成第一版 MVP：

- Next.js 学习工作台。
- 《数学分析》上册目录与“数列极限”样板章。
- 教学图示、练习区、提示区。
- KaTeX 公式渲染。
- 答案文本输入和手写答案图片上传预览。
- AI 老师模型设置，包含 OpenAI-compatible、DeepSeek、Xiaomi MiMo、Gemini。

下一阶段目标：把“AI 老师 shell”推进到可接真实模型、可批改文本答案、可接视觉批改、可记录掌握度的版本。

## 协作分工

继续按“Partner AI 做单数任务包，主 AI 做双数任务包”执行。

Partner AI 本轮只做下面这些单数任务包：

```text
任务包 1：AI 调用契约与样例数据
任务包 3：手写答案视觉批改规范
任务包 5：掌握度与学习进度数据模型
任务包 7：数列极限内容补强与题源核对
任务包 9：QA 验收清单与风险列表
```

主 AI 后续会做双数任务包：

```text
任务包 2：真实模型 API route 与 provider adapter
任务包 4：前端提交答案并展示 AI 批改
任务包 6：图片答案接入视觉模型
任务包 8：进度状态 UI 与本地持久化
任务包 10：整体集成、部署准备、测速
```

## 开始前必须阅读

```text
docs/superpowers/specs/2026-06-01-ai-math-tutor-design.md
docs/superpowers/plans/2026-06-02-partner-ai-task-list.md
docs/superpowers/plans/2026-06-02-ai-math-tutor-mvp-plan.md
docs/ai/tutor-prompt-spec.md
docs/ui/learning-workbench-ia.md
README.md
docs/development.md
```

开始前运行：

```powershell
git status --short
git log --oneline -8
```

## 禁止事项

1. 不要提交 PDF、截图、教材原文件。
2. 不要复制 ExamPass-Assistant 的代码。
3. 不要改 `app/` 和 `components/`，除非用户明确让你做 UI。
4. 不要改主 AI 正在用的 dev server 启动脚本或 `.next/`。
5. 不要写“以后完善”“暂时不管”“随便处理”这类模糊说明。
6. 不要把 API Key、真实密钥或个人账号信息写入文件。
7. 不要生成正式题目冒充教材题；正式题优先来自教材例题/课后题，无法核对时明确写“待核对题源”。

## 当前关键文件

AI 与 prompt：

```text
docs/ai/tutor-prompt-spec.md
lib/ai/prompt-templates.md
lib/tutor/modelProviders.ts
lib/tutor/tutorTypes.ts
lib/tutor/localTutor.ts
components/course/TutorPanel.tsx
```

课程内容：

```text
content/courses/math-analysis/course.json
content/courses/math-analysis/volume-1.json
content/courses/math-analysis/chapters/sequence-limit.json
content/courses/math-analysis/exercises/sequence-limit.json
content/courses/math-analysis/diagrams/sequence-limit.json
content/courses/math-analysis/README.md
```

验证脚本：

```text
scripts/validate-course-content.mjs
scripts/validate-tutor-providers.mjs
```

## 任务包 1：AI 调用契约与样例数据

适合：类型设计、AI 输入输出协议、测试夹具。

### 目标

把 `docs/ai/tutor-prompt-spec.md` 中的 explain/ask/grade/hint/mastery 五种任务，整理成后续 API route 可以直接使用的 TypeScript 契约和 JSON 样例。主 AI 后续会基于这些契约实现真实模型调用。

### 建议创建文件

```text
lib/ai/tutor-contract.ts
lib/ai/tutor-fixtures.ts
docs/ai/tutor-runtime-contract.md
scripts/validate-ai-contract.mjs
```

### 不要改

```text
app/
components/
content/
lib/tutor/modelProviders.ts
```

### 具体步骤

1. 阅读 `docs/ai/tutor-prompt-spec.md`，确认五种任务的输入/输出。
2. 创建 `lib/ai/tutor-contract.ts`，至少定义这些类型：

```ts
export type TutorTask = "explain" | "ask" | "grade" | "hint" | "mastery";
export type TutorLocale = "zh-CN";
export type TutorVerdict = "correct" | "partially_correct" | "incorrect";
export type MasteryState = "not_started" | "emerging" | "proficient" | "weak";
export type MasteryRecommendation = "advance" | "review-explanation" | "more-basic-practice" | "retry-exercise";

export interface TutorContextEnvelope {
  task: TutorTask;
  locale: TutorLocale;
  context: {
    courseId: string;
    chapterId: string;
    sectionId: string;
    knowledgePointId: string;
    currentStep: string;
    knowledgePoint: unknown;
    exercise?: unknown;
    learnerHistory: {
      masteryState: MasteryState;
      recentAnswers: string[];
      hintLevelUsed: number;
    };
  };
  payload: Record<string, unknown>;
}

export interface TutorAskResponse {
  question: string;
  sourceQuestionIndex: number;
  expectedFocus: string;
}

export interface TutorGradeResponse {
  verdict: TutorVerdict;
  score: number;
  feedback: string;
  missingKeyPoints: string[];
  nextHintLevel: number;
  masterySuggestion: MasteryState;
}

export interface TutorHintResponse {
  level: number;
  maxLevel: number;
  hint: string;
  isFinalAnswerRevealed: boolean;
}

export interface TutorMasteryResponse {
  masteryState: MasteryState;
  criteriaMet: string[];
  criteriaUnmet: string[];
  recommendation: MasteryRecommendation;
  rationale: string;
}
```

3. 创建 `lib/ai/tutor-fixtures.ts`，导出至少 5 个样例：

```text
sampleExplainRequest
sampleAskResponse
sampleGradeResponse
sampleHintResponse
sampleMasteryResponse
```

4. 创建 `docs/ai/tutor-runtime-contract.md`，写清：

- 请求如何从当前知识点、题目、用户回答组装。
- 哪些任务返回自然语言。
- 哪些任务返回严格 JSON。
- 模型输出 JSON 解析失败时的降级规则。
- AI 不得生成题库外正式题。

5. 创建 `scripts/validate-ai-contract.mjs`，静态检查：

- `lib/ai/tutor-contract.ts` 包含五种任务名。
- `docs/ai/tutor-runtime-contract.md` 包含 explain/ask/grade/hint/mastery。
- `lib/ai/tutor-fixtures.ts` 包含 5 个样例导出名。

### 验收标准

- 契约文件能被 TypeScript build 检查。
- 文档能指导主 AI 直接实现 API route。
- 样例数据不含真实 API Key。
- 没有 `TODO`、`TBD`、`以后完善`。

### 验证命令

```powershell
npm run build
node scripts/validate-ai-contract.mjs
Select-String -Path 'lib/ai/tutor-contract.ts','lib/ai/tutor-fixtures.ts','docs/ai/tutor-runtime-contract.md' -Pattern 'TODO','TBD','以后完善'
git status --short
```

### 完成后建议提交

```powershell
git add lib/ai/tutor-contract.ts lib/ai/tutor-fixtures.ts docs/ai/tutor-runtime-contract.md scripts/validate-ai-contract.mjs
git commit -m "Add tutor runtime contract fixtures"
```

## 任务包 3：手写答案视觉批改规范

适合：视觉模型、图片答案、OCR/公式识别、批改流程。

### 目标

用户已经可以在练习区拍照/上传手写答案。此任务要设计“图片答案如何进入 AI 批改”的协议，不实现 UI，不直接调模型。

### 建议创建文件

```text
docs/ai/vision-answer-review-spec.md
lib/ai/vision-contract.ts
scripts/validate-vision-contract.mjs
```

### 不要改

```text
app/
components/
content/
lib/tutor/modelProviders.ts
```

### 具体步骤

1. 阅读 `components/course/ExercisePanel.tsx`，理解当前图片只是浏览器预览。
2. 创建 `lib/ai/vision-contract.ts`，至少定义：

```ts
export type AnswerAttachmentKind = "image";
export type VisionReviewStage = "ocr" | "math-transcription" | "grading";

export interface AnswerImageAttachment {
  id: string;
  kind: AnswerAttachmentKind;
  fileName: string;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
  sizeBytes: number;
  width?: number;
  height?: number;
}

export interface VisionAnswerReviewRequest {
  exerciseId: string;
  knowledgePointId: string;
  textAnswer: string;
  attachments: AnswerImageAttachment[];
  expectedRubric: string[];
}

export interface VisionAnswerReviewResult {
  transcribedAnswer: string;
  uncertainSegments: string[];
  stage: VisionReviewStage;
  feedback: string;
}
```

3. 创建 `docs/ai/vision-answer-review-spec.md`，写清三阶段流程：

```text
图片附件 -> OCR/数学转写 -> 合并文本答案 -> grade 任务批改
```

4. 文档必须写清限制：

- 图片只用于学生自己的答案，不用于上传教材。
- 图片大小建议限制在 8MB 以内。
- 允许 png/jpeg/webp。
- 模型看不清时必须返回 uncertainSegments，不能假装识别准确。
- 转写后的数学表达统一成 LaTeX。
- 最终评分仍依据题目 `gradingRubric`，不是视觉模型自由评分。

5. 创建 `scripts/validate-vision-contract.mjs`，检查：

- `vision-contract.ts` 包含 `VisionAnswerReviewRequest` 和 `VisionAnswerReviewResult`。
- 文档包含 `OCR`、`LaTeX`、`uncertainSegments`、`gradingRubric`。

### 验收标准

- 主 AI 后续可以按该契约实现图片上传到模型。
- 不要求现在真的识别图片。
- 不引入后端文件存储。
- 不保存用户答案图片到 git。

### 验证命令

```powershell
npm run build
node scripts/validate-vision-contract.mjs
Select-String -Path 'docs/ai/vision-answer-review-spec.md','lib/ai/vision-contract.ts' -Pattern 'TODO','TBD','以后完善'
git status --short
```

### 完成后建议提交

```powershell
git add docs/ai/vision-answer-review-spec.md lib/ai/vision-contract.ts scripts/validate-vision-contract.mjs
git commit -m "Define vision answer review contract"
```

## 任务包 5：掌握度与学习进度数据模型

适合：学习状态、数据结构、本地存储设计。

### 目标

把“学没学、会不会、哪题错、提示用了几级”设计成稳定数据模型。主 AI 后续会把它接到 UI 和 localStorage。

### 建议创建文件

```text
docs/progress/mastery-state-spec.md
lib/progress/masteryTypes.ts
scripts/validate-mastery-state.mjs
```

### 不要改

```text
app/
components/
content/
lib/progress/progressStore.ts
```

### 具体步骤

1. 阅读 `docs/ui/learning-workbench-ia.md` 第 6 节“题目与掌握度状态可视化”。
2. 创建 `lib/progress/masteryTypes.ts`，至少定义：

```ts
export type MasteryState = "not_started" | "emerging" | "proficient" | "weak";
export type ExerciseAttemptVerdict = "correct" | "partially_correct" | "incorrect";

export interface ExerciseAttemptRecord {
  exerciseId: string;
  knowledgePointIds: string[];
  submittedAt: string;
  answerText: string;
  attachmentCount: number;
  hintLevelUsed: number;
  verdict: ExerciseAttemptVerdict;
  score: number;
  missingKeyPoints: string[];
}

export interface KnowledgePointProgressRecord {
  knowledgePointId: string;
  masteryState: MasteryState;
  startedAt?: string;
  lastStudiedAt?: string;
  completedAt?: string;
  attempts: ExerciseAttemptRecord[];
  criteriaMet: string[];
  criteriaUnmet: string[];
}

export interface CourseProgressRecord {
  courseId: string;
  volumeId: string;
  updatedAt: string;
  knowledgePoints: Record<string, KnowledgePointProgressRecord>;
}
```

3. 创建 `docs/progress/mastery-state-spec.md`，写清：

- 四种 masteryState 的含义。
- 什么时候从 `not_started` 变成 `emerging`。
- 什么时候可以进入 `proficient`。
- 什么时候标记 `weak`。
- 本地存储 key 命名建议。
- 与 AI `mastery` 任务输出的对应关系。

4. 创建 `scripts/validate-mastery-state.mjs`，检查：

- `masteryTypes.ts` 包含四种状态。
- 文档包含 `not_started`、`emerging`、`proficient`、`weak`。
- 文档包含 `localStorage` 和 `criteriaUnmet`。

### 验收标准

- 数据模型足够支持左侧目录进度、题目历史、掌握度徽标。
- 不实现 UI。
- 不改当前 `progressStore.ts`，避免和主 AI 后续实现撞文件。

### 验证命令

```powershell
npm run build
node scripts/validate-mastery-state.mjs
Select-String -Path 'docs/progress/mastery-state-spec.md','lib/progress/masteryTypes.ts' -Pattern 'TODO','TBD','以后完善'
git status --short
```

### 完成后建议提交

```powershell
git add docs/progress/mastery-state-spec.md lib/progress/masteryTypes.ts scripts/validate-mastery-state.mjs
git commit -m "Define mastery progress state model"
```

## 任务包 7：数列极限内容补强与题源核对

适合：内容整理、教材对照、数学表达校对。

### 目标

把“数列极限”样板章从可演示提升到可复习使用：补强证明逻辑、检查题目难度、把能核对的教材题源写清楚。

### 可修改文件

```text
content/courses/math-analysis/chapters/sequence-limit.json
content/courses/math-analysis/exercises/sequence-limit.json
content/courses/math-analysis/README.md
docs/content/sequence-limit-content-review.md
```

### 不要改

```text
app/
components/
lib/
scripts/validate-course-content.mjs
```

### 具体步骤

1. 阅读当前两个内容文件：

```text
content/courses/math-analysis/chapters/sequence-limit.json
content/courses/math-analysis/exercises/sequence-limit.json
```

2. 对每个知识点检查：

- `coreExplanation` 是否有公式裸写错误。
- `proofIdeas` 是否足够体现数学分析的证明逻辑，而不是只记结论。
- `socraticQuestions` 是否能引导学生说出关键条件。
- `masteryCriteria` 是否可被题目表现验证。

3. 对每道题检查：

- `difficulty` 是否合理。
- `type` 是否准确。
- `recommendedTiming` 是否适合。
- `gradingRubric` 是否能用于批改。
- `hints` 是否由浅到深。
- `commonMistakes` 是否对应真实易错点。

4. 如果能对照本地教材，请回填 `sourceRef`。格式建议：

```text
数学分析(第5版)上册，第 X 章，第 X 节，例 X / 习题 X
```

无法核对时不要编造题号，保留：

```text
待从教材对应小节录入（原因：未核对具体题号）
```

5. 创建 `docs/content/sequence-limit-content-review.md`，记录：

- 哪些题源已核对。
- 哪些题源未核对。
- 哪些题建议改成基础/中档/困难。
- 哪些证明点还需要后续补图或补例题。

### 验收标准

- JSON 能被 `npm run validate:content` 解析并通过。
- 不降低现有 8 个知识点和 8 道题的数量。
- 不添加教材 PDF 到 git。
- 不编造题号。
- 不出现 `TODO`、`TBD`。

### 验证命令

```powershell
npm run validate:content
node -e "const c=JSON.parse(require('fs').readFileSync('content/courses/math-analysis/chapters/sequence-limit.json','utf8')); const e=JSON.parse(require('fs').readFileSync('content/courses/math-analysis/exercises/sequence-limit.json','utf8')); if(c.knowledgePoints.length<8) throw new Error('need at least 8 knowledge points'); if(e.exercises.length<8) throw new Error('need at least 8 exercises'); console.log('sequence limit content count ok')"
Select-String -Path 'content/courses/math-analysis/chapters/sequence-limit.json','content/courses/math-analysis/exercises/sequence-limit.json','docs/content/sequence-limit-content-review.md' -Pattern 'TODO','TBD'
git status --short
```

### 完成后建议提交

```powershell
git add content/courses/math-analysis/chapters/sequence-limit.json content/courses/math-analysis/exercises/sequence-limit.json content/courses/math-analysis/README.md docs/content/sequence-limit-content-review.md
git commit -m "Strengthen sequence limit sample content"
```

## 任务包 9：QA 验收清单与风险列表

适合：测试、验收、产品风险、交付检查。

### 目标

给下一阶段开发建立一套手动验收清单，防止“看起来能用但关键学习流程断掉”。

### 建议创建文件

```text
docs/qa/mvp-smoke-test.md
docs/qa/ai-tutor-risk-list.md
docs/qa/partner-handoff-template.md
```

### 不要改

```text
app/
components/
lib/
content/
```

### 具体步骤

1. 创建 `docs/qa/mvp-smoke-test.md`，覆盖这些场景：

- 首页能打开。
- 左侧目录显示章节。
- 公式能用 KaTeX 渲染，不显示裸 `$x_n$`。
- 教学图示非空。
- 练习题可切换。
- 提示按钮按层级显示。
- 文本答案可输入。
- 图片答案可上传、预览、移除。
- AI 老师设置能选择 DeepSeek 和 Xiaomi MiMo。
- Base URL 输入框存在。
- API Key 不显示明文。
- 页面刷新后模型设置能从 localStorage 恢复。

2. 创建 `docs/qa/ai-tutor-risk-list.md`，至少列出这些风险：

- 模型输出 JSON 解析失败。
- 模型脱离当前知识点自由发挥。
- 模型提前泄露答案。
- 图片识别错但没有标记不确定。
- 用户上传超大图片。
- API Key 存储方式引发隐私担忧。
- 教材题源未核对导致内容可信度不足。
- 数学公式转义错误导致前端显示异常。

3. 创建 `docs/qa/partner-handoff-template.md`，供每个 AI 完成任务后填写：

```md
# Partner Handoff

## 选择的任务包

## 修改/创建的文件

## 运行的验证命令

## 结果

## 未完成事项

## 需要主 AI 注意的冲突
```

4. 文档中写清每个 smoke test 的操作步骤和预期结果，不只写标题。

### 验收标准

- 文档能让不懂代码的人按步骤检查页面。
- 风险列表有具体规避建议。
- handoff 模板能直接复制使用。
- 不出现 `TODO`、`TBD`、`以后完善`。

### 验证命令

```powershell
Select-String -Path 'docs/qa/mvp-smoke-test.md' -Pattern 'KaTeX','图片答案','DeepSeek','Xiaomi MiMo','localStorage'
Select-String -Path 'docs/qa/ai-tutor-risk-list.md' -Pattern 'JSON','知识点','答案','图片','API Key','题源'
Select-String -Path 'docs/qa/partner-handoff-template.md' -Pattern '选择的任务包','修改/创建的文件','运行的验证命令','需要主 AI 注意的冲突'
Select-String -Path 'docs/qa/*.md' -Pattern 'TODO','TBD','以后完善'
git status --short
```

### 完成后建议提交

```powershell
git add docs/qa/mvp-smoke-test.md docs/qa/ai-tutor-risk-list.md docs/qa/partner-handoff-template.md
git commit -m "Add QA handoff checklist"
```

## 推荐执行顺序

如果 Partner AI 只做一个任务，优先做：

```text
任务包 1：AI 调用契约与样例数据
```

原因：主 AI 后续接真实模型 API 时最需要这个契约。

如果 Partner AI 能连续做多个任务，建议顺序：

```text
1 -> 3 -> 5 -> 9 -> 7
```

原因：

- 1 先定义 AI 文本任务契约。
- 3 定义图片答案视觉批改契约。
- 5 定义批改后如何记录掌握度。
- 9 给后续集成做验收兜底。
- 7 内容补强最耗时，可在前面契约稳定后慢慢做。

## Partner AI 完成后必须输出

```text
完成报告

选择的任务包：

修改/创建的文件：

运行的验证命令：

验证结果：

未完成事项：

是否改动 app/components：

是否有需要主 AI 处理的冲突：

下一步建议：
```

## 可直接复制给 Partner AI 的提示词

```text
你是这个项目的 Partner AI。项目根目录是 E:\Study_worker。

请先阅读：
docs/superpowers/specs/2026-06-01-ai-math-tutor-design.md
docs/superpowers/plans/2026-06-02-partner-ai-next-phase-task-list.md
docs/ai/tutor-prompt-spec.md
docs/ui/learning-workbench-ia.md
README.md
docs/development.md

你只执行单数任务包：1、3、5、7、9。
建议优先执行任务包 1。

协作要求：
- 开始前运行 git status --short。
- 不要提交 PDF、截图或教材原文件。
- 不要改 app/ 和 components/，除非用户明确指定。
- 不要复制 ExamPass-Assistant 代码。
- 不要写真实 API Key。
- 完成后运行任务包指定的验证命令。
- 完成后按清单末尾的“完成报告”格式输出。
- 保留改动，不要清理别人文件。
```
