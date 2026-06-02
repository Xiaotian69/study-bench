# ExamPass-Assistant 参考分析

日期：2026-06-02

参考仓库：

```text
https://github.com/WUBING2023/ExamPass-Assistant
```

本项目可以参考它的产品流程和工程思路，但不复制代码。ExamPass-Assistant 使用 CC BY-NC 4.0，未来商业化项目不应直接复用其源码。

## 1. 项目概览

ExamPass-Assistant 的定位是“把课堂讲义变成考试利器”。它面向 PPT、Word、PDF 等课程资料，自动生成结构化知识清单和交互式章节测试 HTML。

它更接近期末复习资料生成器，重点是：

- 扫描课程资料目录。
- 提取 PPTX / DOCX / PDF 的文本、表格和图片。
- 将同一章节资料合并为分析 bundle。
- 让 AI 生成知识清单。
- 让 AI 生成章节测试。
- 用 HTML 模板输出可打印、可交互页面。

我们的项目定位不同：我们做的是“AI 同步课老师”，课程由开发者预制，用户按教材顺序学习并与 AI 进行讲、问、练、批改的持续交互。

## 2. ExamPass 核心流程

从 README、`SKILL.md`、`scripts/run_exampass.py`、`scripts/scanner.py`、`scripts/extractor.py`、`scripts/knowledge_analyzer.py`、`scripts/test_generator.py`、`scripts/template_engine.py` 可归纳出流程：

```text
扫描资料目录
  -> 按父目录分组章节资料
  -> 按文件类型提取 PPTX / DOCX / PDF
  -> 合并提取文本和图片引用
  -> 保存 _extraction_bundle.json
  -> AI 生成知识清单
  -> AI 生成章节测试
  -> HTML 模板渲染
  -> 浏览器打开或打印为 PDF
```

工程模块划分清晰：

- `scanner.py`：递归扫描并按目录分组。
- `extractor.py`：统一调度不同文件类型的提取器。
- `run_exampass.py`：执行扫描、提取、合并和 bundle 保存。
- `knowledge_analyzer.py`：生成知识清单 prompt。
- `test_generator.py`：生成章节测试 prompt。
- `template_engine.py`：把知识清单和测试题渲染为 HTML。

## 3. 可参考点

### 3.1 资料提取流水线

ExamPass 把“资料处理”拆为扫描、提取、合并、缓存、生成几个阶段。这个思路适合我们做开发者内部内容整理工具。

可转化为本项目任务：

- 建立 `tools/content-ingest/` 或 `scripts/content-ingest/`。
- 只供开发者使用，不暴露给普通用户。
- 对数学分析 PDF 提取目录、文本和候选例题。
- 保存中间结果，避免反复解析 PDF。
- 输出结构化草稿，再由人校对后进入 `content/courses/`。

### 3.2 中间 bundle 缓存

ExamPass 会把提取结果保存成 `_extraction_bundle.json`。这能降低后续 AI 分析成本，也方便人工检查。

可转化为本项目任务：

- 设计 `content-ingest-output/` 或本地 ignored 目录保存提取草稿。
- bundle 只作为开发者临时数据，不提交含版权原文的大段内容。
- 正式课程只提交整理后的讲义、题目标签、图示规格和评分要点。

### 3.3 Prompt 任务分离

ExamPass 将“知识清单生成”和“测试题生成”拆成独立 prompt。这个边界值得借鉴。

可转化为本项目任务：

- 我们把 AI 任务拆成 explain、ask、grade、hint、mastery。
- 每类任务都有明确输入和输出格式。
- AI 只处理当前知识点、当前题目和当前教学步骤。

### 3.4 HTML 和公式渲染

ExamPass 使用 MathJax 支持公式，HTML 模板有目录、样式和互动测试。这说明第一版数学内容必须尽早支持公式渲染。

可转化为本项目任务：

- 前端第一轮就加入 KaTeX 或 MathJax。
- 课程讲义、题目、提示、评分反馈都必须支持 LaTeX。
- 交互题目组件应优先支持定义理解、计算、证明和反例题。

### 3.5 题目解释与常见错误

ExamPass 的测试题 prompt 要求答案解析、评分要点、易错提醒。这个和我们的题库结构高度一致。

可转化为本项目任务：

- 每道题保留 `gradingRubric`、`hints`、`commonMistakes`。
- AI 批改时必须引用评分要点，而不是自由发挥。
- 学生错题应回流到掌握度记录。

### 3.6 多模式内容深度

ExamPass 的 `SKILL.md` 区分考试、平衡、深度学习三种模式。这个想法可用于我们未来的学习模式。

可转化为本项目任务：

- 第一版默认“教材精读模式”。
- 后续增加“期末冲刺模式”。
- 再后续增加“薄弱点补强模式”。

## 4. 不适合照搬点

### 4.1 用户上传资料

ExamPass 支持用户上传或指定任意课程资料目录。我们的第一版不做用户上传教材。

原因：

- 我们的课程由开发者整理和校对。
- 用户只选择已经准备好的课程学习。
- 这样能降低版权、内容质量、文件安全和解析失败风险。

### 4.2 静态 HTML 输出

ExamPass 生成知识清单 HTML 和章节测试 HTML。我们的产品需要持续交互式学习工作台。

差异：

- ExamPass 适合一次性生成资料。
- 我们需要记录当前学习步骤、答题状态、掌握度和 AI 对话。
- 我们需要页面状态和课程数据 loader，而不是只输出静态 HTML。

### 4.3 AI 动态生成正式题库

ExamPass 会根据资料生成章节测试题。我们的第一版不让 AI 凭空生成正式题。

原因：

- 数学分析需要严谨题目和证明标准。
- 正式题以教材例题、课后题和人工审核改编题为主。
- AI 可用于追问、提示、批改和变式提问，但不负责生产核心题库。

### 4.4 复习导向大于教学导向

ExamPass 的语言和流程偏期末复习。我们的主线是日常同步教学。

差异：

- ExamPass 输出“知识清单 + 测试”。
- 我们输出“讲解步骤 + 追问 + 例题拆解 + 练习 + 批改 + 掌握度”。

## 5. 许可证风险

ExamPass-Assistant 使用 CC BY-NC 4.0。

风险点：

- BY 要求署名。
- NC 限制非商业用途。
- 本项目未来计划收运营费用，存在商业化可能。
- 因此不能直接复制 ExamPass 的源码、模板、样式或 prompt 文本进入本项目。

可接受做法：

- 参考公开仓库的产品思路和模块边界。
- 独立实现自己的扫描、提取、模板、prompt 和 UI。
- 在内部参考文档中记录灵感来源。
- 如果未来确实要复用其代码，需要单独取得商业授权或更换实现。

## 6. 可转化为本项目任务

### 6.1 开发者内容导入工具

建议后续建立：

```text
tools/content-ingest/
  scan-source-files.ts
  extract-pdf-text.ts
  build-course-draft.ts
  validate-course-content.ts
```

目标：

- 只供开发者处理教材。
- 从 PDF 生成课程草稿。
- 不把 PDF 或大段原文提交到仓库。
- 输出供人工校对的 JSON 草稿。

### 6.2 内容校验工具

建议建立内容 CI 检查：

- JSON 格式检查。
- 章节、知识点、题目、图示交叉引用检查。
- 题目必须有评分要点、提示和常见错误。
- 图示必须绑定知识点。
- 检查是否误提交 PDF。

### 6.3 AI 任务 prompt 模板

建议把 AI 任务拆为：

```text
explain
ask
grade
hint
mastery
```

每种任务要有：

- 当前课程上下文。
- 当前知识点。
- 当前教学步骤。
- 当前题目或追问。
- 禁止行为。
- 结构化输出。

### 6.4 互动测试组件

建议前端练习区先支持：

- 定义理解题。
- 计算题。
- 证明题。
- 反例题。
- 分层提示。
- 评分要点展示。
- AI 批改反馈。

### 6.5 公式与图示基础设施

建议第一版尽早支持：

- LaTeX 渲染。
- 程序化 SVG 数学图示。
- 图示与知识点绑定。
- 图示旁的学生追问。

## 7. 结论

ExamPass-Assistant 对我们有参考价值，尤其是资料处理流水线、bundle 缓存、知识清单生成、测试题结构、MathJax 渲染和模式化 prompt。

但它不是我们要做的产品形态。我们不应照搬它的用户上传、静态 HTML、AI 动态生成正式题库路线。我们的第一版应坚持：

- 开发者预制课程。
- 数学分析教材同步教学。
- 数列极限样板章节深做。
- 题目来自教材和人工审核。
- AI 在固定教学脚本里执行讲、问、练、批改。
- 代码和 prompt 独立实现，规避 CC BY-NC 商业化限制。
