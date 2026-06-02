# Partner AI 任务清单

日期：2026-06-02

## 给另一个 AI 的总说明

你正在协助开发一个新项目：AI 数学分析同步学习助手。

项目根目录：

```text
E:\Study_worker
```

已完成的设计文档：

```text
docs/superpowers/specs/2026-06-01-ai-math-tutor-design.md
```

请先阅读设计文档，再选择下面一个任务包执行。不要同时做多个任务包，避免和主 AI 改同一批文件。

项目定位：

- 这是 Web 学习工作台，不是通用 PDF 问答工具。
- 用户不上传教材，课程由开发者整理后提供。
- 第一版聚焦《数学分析》上册目录和“数列极限”样板章节。
- AI 负责讲解、追问、提示、批改和反馈，不负责自由生成整门课。
- 题目主要来自教材例题和课后题，AI 不凭空生成正式题。
- 课程内容第一版用结构化文件维护，后续再迁移后台。

重要参考：

- ExamPass-Assistant 可参考“资料提取流水线、缓存、MathJax、结构化知识清单、互动测验”的思路。
- 不要复制 ExamPass-Assistant 的代码；它是 CC BY-NC 4.0，未来商业用途存在限制。

## 协作规则

1. 开始前运行：

```powershell
git status --short
```

2. 不要提交或上传 PDF 文件。

3. 不要改这些文件，除非任务明确要求：

```text
.gitignore
docs/superpowers/specs/2026-06-01-ai-math-tutor-design.md
docs/superpowers/plans/2026-06-02-partner-ai-task-list.md
```

4. 如果你创建代码文件，优先保持文件小而清晰。

5. 如果你发现设计文档和任务描述冲突，以设计文档为准，并在输出中说明冲突点。

6. 完成后输出：

- 你选择的任务包编号。
- 修改了哪些文件。
- 运行了哪些验证命令。
- 哪些地方没有完成。
- 下一步建议。

## 当前仓库状态

当前已存在：

```text
.gitignore
docs/superpowers/specs/2026-06-01-ai-math-tutor-design.md
docs/superpowers/plans/2026-06-02-partner-ai-task-list.md
```

当前根目录还有教材 PDF，它们不应进入 git：

```text
数学分析(第5版) 上 ...
数学分析(第5版) 下 ...
高等数学 上册 ...
高等数学 下册 ...
```

## 任务包 A：课程内容结构设计

适合：内容整理、课程 schema、知识点拆分。

目标：

为《数学分析》课程设计第一版结构化内容格式，并写出“数列极限”样板数据的骨架。

建议创建文件：

```text
content/courses/math-analysis/course.json
content/courses/math-analysis/volume-1.json
content/courses/math-analysis/chapters/sequence-limit.json
content/courses/math-analysis/exercises/sequence-limit.json
content/courses/math-analysis/README.md
```

不要改：

```text
app/
components/
lib/ai/
```

任务步骤：

1. 阅读设计文档，确认课程层级：

```text
课程 -> 册 -> 章 -> 小节 -> 知识点 -> 教学步骤 -> 例题/练习/图示
```

2. 创建 `content/courses/math-analysis/course.json`，描述课程基本信息：

```json
{
  "id": "math-analysis",
  "title": "数学分析",
  "subtitle": "按教材顺序学习定义、定理、证明与习题",
  "audience": "大学数学分析学习者",
  "defaultVolumeId": "math-analysis-volume-1",
  "volumes": ["math-analysis-volume-1"]
}
```

3. 创建 `volume-1.json`，包含上册目录框架。先不需要完整填深内容，但要有章节 id、标题、状态。

建议状态：

```text
planned
sample-ready
draft
```

4. 创建 `chapters/sequence-limit.json`，把“数列极限”拆成知识点骨架。建议至少包含：

- 数列与数列极限直观
- epsilon-N 定义
- 收敛数列的唯一性
- 收敛数列的有界性
- 收敛数列的保号性
- 收敛数列的四则运算
- 单调有界收敛定理
- 子列与收敛性

5. 每个知识点包含字段：

```json
{
  "id": "epsilon-n-definition",
  "title": "epsilon-N 定义",
  "learningGoals": [],
  "coreExplanation": "",
  "textbookRefs": [],
  "keyDefinitions": [],
  "keyTheorems": [],
  "proofIdeas": [],
  "socraticQuestions": [],
  "commonMistakes": [],
  "exampleIds": [],
  "exerciseIds": [],
  "diagramIds": [],
  "masteryCriteria": []
}
```

6. 创建 `exercises/sequence-limit.json`，先写题目结构，不需要大量题。至少放 6 道占位样板题，但不能写 `TODO`。可以用“待从教材录入”的说明字段表达状态。

题目字段：

```json
{
  "id": "seq-limit-ex-001",
  "sourceType": "textbook-exercise",
  "sourceRef": "待从教材对应小节录入",
  "knowledgePointIds": ["epsilon-n-definition"],
  "difficulty": "basic",
  "type": "definition-understanding",
  "recommendedTiming": "after-lecture",
  "prompt": "请解释数列极限定义中 N 为什么依赖 epsilon。",
  "gradingRubric": [
    "说明 epsilon 表示任意精度要求",
    "说明 N 表示达到该精度所需的起始项",
    "说明 epsilon 越小，通常需要越大的 N"
  ],
  "hints": [
    "先说 epsilon 的角色。",
    "再说 N 的角色。",
    "最后说明二者的依赖关系。"
  ],
  "commonMistakes": [
    "把 epsilon 当成固定常数",
    "认为 N 与 epsilon 无关"
  ]
}
```

7. 创建 `content/courses/math-analysis/README.md`，说明内容文件如何维护、题目如何标注、PDF 不提交。

验收标准：

- `content/courses/math-analysis/` 下文件存在。
- JSON 能被 Node 解析。
- 不包含 `TODO`、`TBD`。
- 不提交 PDF。

验证命令：

```powershell
node -e "JSON.parse(require('fs').readFileSync('content/courses/math-analysis/course.json','utf8')); JSON.parse(require('fs').readFileSync('content/courses/math-analysis/volume-1.json','utf8')); JSON.parse(require('fs').readFileSync('content/courses/math-analysis/chapters/sequence-limit.json','utf8')); JSON.parse(require('fs').readFileSync('content/courses/math-analysis/exercises/sequence-limit.json','utf8')); console.log('course content json ok')"
Select-String -Path 'content/courses/math-analysis/**/*.json','content/courses/math-analysis/*.md' -Pattern 'TODO','TBD'
git status --short
```

## 任务包 B：数学图示规格设计

适合：图示、SVG/Canvas、数学表达。

目标：

设计“数列极限”所需教学图示的结构化规格，先不需要实现完整 UI。

建议创建文件：

```text
content/courses/math-analysis/diagrams/sequence-limit.json
docs/diagrams/sequence-limit-diagram-notes.md
```

不要改：

```text
app/
components/
lib/ai/
```

任务步骤：

1. 阅读设计文档第 7 节“教学图示”。

2. 创建图示 JSON，至少包含 6 个图示：

- epsilon-neighborhood-on-number-line
- sequence-eventually-inside-neighborhood
- convergent-vs-divergent-sequence
- bounded-sequence
- monotone-bounded-convergence
- subsequence-idea

3. 每个图示包含：

```json
{
  "id": "epsilon-neighborhood-on-number-line",
  "title": "数轴上的 epsilon 邻域",
  "type": "number-line",
  "knowledgePointIds": ["epsilon-n-definition"],
  "description": "展示极限 a 及其左右 epsilon 邻域。",
  "parameters": {
    "limit": "a",
    "epsilonLabel": "\\\\varepsilon",
    "leftEndpoint": "a - \\\\varepsilon",
    "rightEndpoint": "a + \\\\varepsilon"
  },
  "teacherNotes": [
    "强调 epsilon 是任意给定的精度。",
    "强调只要 n 足够大，数列项会落入这个邻域。"
  ],
  "studentPrompt": "图中哪一段表示 |x_n-a|<\\\\varepsilon？"
}
```

4. 创建 `docs/diagrams/sequence-limit-diagram-notes.md`，用文字说明每张图怎么用于教学。

验收标准：

- 图示 JSON 能被 Node 解析。
- 每张图都绑定至少一个 knowledgePointId。
- 每张图都有 teacherNotes 和 studentPrompt。
- 不出现 AI 随机生成图的要求。

验证命令：

```powershell
node -e "const d=JSON.parse(require('fs').readFileSync('content/courses/math-analysis/diagrams/sequence-limit.json','utf8')); if(!Array.isArray(d.diagrams) || d.diagrams.length < 6) throw new Error('need at least 6 diagrams'); for (const item of d.diagrams) { if(!item.id || !item.knowledgePointIds?.length || !item.teacherNotes?.length || !item.studentPrompt) throw new Error('bad diagram '+item.id); } console.log('diagram specs ok')"
git status --short
```

## 任务包 C：AI Tutor Prompt 设计

适合：提示词、AI 角色约束、批改规则。

目标：

为第一版 AI 老师写出提示词规范，限制 AI 只围绕当前课程脚本工作。

建议创建文件：

```text
docs/ai/tutor-prompt-spec.md
lib/ai/prompt-templates.md
```

不要改：

```text
app/
components/
content/
```

任务步骤：

1. 阅读设计文档第 8 节“AI 工作方式”。

2. 在 `docs/ai/tutor-prompt-spec.md` 中写清 AI 的五种任务：

- explain
- ask
- grade
- hint
- mastery

3. 为每种任务写输入字段、输出字段和禁止行为。

4. 在 `lib/ai/prompt-templates.md` 中写可复用提示词模板。先写 Markdown 文档，不写 TypeScript 代码，避免和主应用搭建冲突。

5. 批改输出建议统一为 JSON：

```json
{
  "verdict": "correct | partially_correct | incorrect",
  "score": 0,
  "feedback": "",
  "missingKeyPoints": [],
  "nextHintLevel": 1,
  "masterySuggestion": "not_started | emerging | proficient | weak"
}
```

6. 明确禁止：

- 不得脱离当前知识点自由扩展。
- 不得给出未经课程数据支持的正式题。
- 不得在学生请求提示时直接给完整答案，除非已经达到最后提示层级。
- 不得声称用户已经掌握，除非满足 masteryCriteria。

验收标准：

- 文档能直接指导后续实现。
- 包含 explain/ask/grade/hint/mastery 五类任务。
- 包含输入、输出、禁止行为。
- 不包含空泛的“以后完善”。

验证命令：

```powershell
Select-String -Path 'docs/ai/tutor-prompt-spec.md','lib/ai/prompt-templates.md' -Pattern 'explain','ask','grade','hint','mastery'
Select-String -Path 'docs/ai/tutor-prompt-spec.md','lib/ai/prompt-templates.md' -Pattern 'TODO','TBD','以后完善'
git status --short
```

## 任务包 D：ExamPass-Assistant 参考分析

适合：竞品/开源参考、架构归纳、规避许可证风险。

目标：

把 ExamPass-Assistant 中值得参考和不能照搬的点整理成项目内部参考文档。

建议创建文件：

```text
docs/references/exampass-assistant-notes.md
```

不要改：

```text
app/
components/
lib/
content/
```

任务步骤：

1. 阅读 GitHub 仓库：

```text
https://github.com/WUBING2023/ExamPass-Assistant
```

2. 重点看：

```text
README.md
scripts/run_exampass.py
scripts/extractor.py
scripts/template_engine.py
scripts/knowledge_analyzer.py
scripts/test_generator.py
LICENSE
```

3. 整理它的核心流程：

```text
扫描资料 -> 提取文本/图片 -> 保存 bundle -> AI 分析 -> 生成知识清单 HTML -> 生成互动测试 HTML
```

4. 对比我们项目：

- 它偏期末复习资料生成。
- 我们偏同步教学和持续交互。
- 它支持用户上传资料。
- 我们第一版只做开发者预制课程。
- 它生成静态 HTML。
- 我们做 Web 学习工作台。

5. 写清许可证风险：

- ExamPass-Assistant 使用 CC BY-NC 4.0。
- 如果本项目未来收费，不能直接复制它的代码。
- 可以借鉴思想、流程和产品结构，但实现要独立编写。

验收标准：

- 文档有“可参考点”“不适合照搬点”“许可证风险”“可转化为本项目任务”四节。
- 不粘贴大段源码。
- 给出清楚结论。

验证命令：

```powershell
Select-String -Path 'docs/references/exampass-assistant-notes.md' -Pattern '可参考点','不适合照搬点','许可证风险','可转化为本项目任务'
git status --short
```

## 任务包 E：UI 信息架构草案

适合：产品界面、布局、交互流程。

目标：

写出第一版学习工作台的信息架构和页面结构，给后续前端实现用。

建议创建文件：

```text
docs/ui/learning-workbench-ia.md
```

不要改：

```text
app/
components/
content/
lib/
```

任务步骤：

1. 阅读设计文档第 3、4、9 节。

2. 写出页面清单：

- 课程首页
- 章节学习页
- 当前知识点学习区
- AI 老师互动区
- 练习与批改区
- 模型/API Key 设置页

3. 写出桌面布局：

```text
左侧：课程目录和进度
中间：讲义、公式、图示、题目
右侧：AI 老师、提示、反馈
```

4. 写出移动端简化布局：

```text
顶部：课程位置
主体：当前学习步骤
底部：AI 辅导抽屉或标签页
```

5. 写出视觉原则：

- 清爽学术。
- 不做营销首页。
- 公式可读。
- 题目状态清楚。
- 图示为教学材料，不是装饰。

验收标准：

- 文档能指导前端搭建。
- 页面和组件边界清晰。
- 不包含“做漂亮一点”这种空泛要求。

验证命令：

```powershell
Select-String -Path 'docs/ui/learning-workbench-ia.md' -Pattern '课程首页','章节学习页','AI 老师互动区','模型/API Key 设置页'
git status --short
```

## 推荐并行方式

如果只有一个 partner AI，优先做：

1. 任务包 A：课程内容结构设计
2. 任务包 B：数学图示规格设计
3. 任务包 C：AI Tutor Prompt 设计

如果有两个 partner AI：

- Partner 1 做任务包 A。
- Partner 2 做任务包 B 或 C。

如果主 AI 已经开始搭建 Next.js 项目，partner AI 暂时不要改 `app/`、`components/`、`lib/course/`，优先做 `content/` 和 `docs/`。

## 可直接复制给 partner AI 的提示词

```text
你是这个项目的 partner AI。项目根目录是 E:\Study_worker。

请先阅读：
docs/superpowers/specs/2026-06-01-ai-math-tutor-design.md
docs/superpowers/plans/2026-06-02-partner-ai-task-list.md

然后选择任务包 A、B、C、D、E 中的一个执行。优先选择任务包 A。

协作要求：
- 不要提交 PDF。
- 不要改 app/、components/、lib/，除非任务明确要求。
- 不要复制 ExamPass-Assistant 的代码。
- 输出你改了哪些文件、跑了哪些验证命令、还有哪些没完成。
- 如果任务和设计文档冲突，以设计文档为准。

完成后请保留改动，不要擅自清理别人的文件。
```
