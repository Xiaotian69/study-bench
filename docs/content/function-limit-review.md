# 函数极限章内容核对记录（function-limit review）

日期：2026-06-03
对应任务包：CC-2（上册第 3 章 函数极限）
状态：`draft`

## 1. 产出文件

- `content/courses/math-analysis/chapters/function-limit.json`（8 个知识点）
- `content/courses/math-analysis/exercises/function-limit.json`（10 道题）
- `content/courses/math-analysis/diagrams/function-limit.json`（4 个图示）
- `content/courses/math-analysis/volume-1.json`（第 3 章升为 `draft`，补 chapterFile/exercisesFile/diagramFile 与小节 knowledgePointIds）

## 2. 知识点覆盖

| KP id | 标题 | 所属小节 |
| --- | --- | --- |
| function-limit-intuition | 函数极限直观 | 函数极限概念 |
| x-to-x0-limit-definition | x→x0 的 ε-δ 定义 | 函数极限概念 |
| one-sided-limits | 单侧极限 | 函数极限概念 |
| infinite-limits-and-limits-at-infinity | 无穷极限与 x→∞ | 函数极限概念 |
| function-limit-properties | 函数极限的性质（唯一/局部有界/保号/四则/夹逼） | 函数极限的性质 |
| heine-definition | 归结原则（Heine） | 函数极限存在的条件 |
| two-important-limits | 两个重要极限 | 两个重要的极限 |
| infinitesimal-and-infinite | 无穷小量与无穷大量及阶比较 | 无穷小量与无穷大量 |

## 3. 题目分布与覆盖

| 题号 | 难度 | 类型 | 覆盖点 |
| --- | --- | --- | --- |
| ex-001 | basic | 定义理解 | 极限值≠函数值、去心邻域 |
| ex-002 | basic | 证明 | ε-δ 证线性极限 |
| ex-003 | basic | 定义理解 | 单侧极限、跳跃 |
| ex-004 | basic | 计算 | x→+∞ 有理式 |
| ex-005 | medium | 证明 | ε-δ 证 x²（需先限定 δ≤1） |
| ex-006 | medium | 计算 | 第一重要极限 (1-cos x)/x² |
| ex-007 | medium | 计算 | 第二重要极限 (1+2/x)^x |
| ex-008 | medium | 计算 | 等价无穷小、加减项陷阱 |
| ex-009 | hard | 证明 | 归结原则证 sin(1/x) 极限不存在 |
| ex-010 | hard | 综合 | 无穷小阶比较（同阶 vs 等价） |

难度分布：basic 4 / medium 4 / hard 2，满足计划“每章 ≥8 题、basic≥4”的要求，并覆盖定义、单侧极限、无穷小、两个重要极限、归结原则。

## 4. 图示

| 图示 id | 说明 | 绑定 KP |
| --- | --- | --- |
| function-limit-epsilon-delta-neighborhood | ε-δ 的坐标系几何图 | x-to-x0-limit-definition |
| one-sided-limit-comparison | 左右极限跳跃 | one-sided-limits |
| limit-at-infinity-approach | x→+∞ 趋近水平渐近线 | infinite-limits-and-limits-at-infinity |
| infinitesimal-order-comparison | 无穷小趋于 0 的快慢 | infinitesimal-and-infinite |

均为程序化 specs（不放截图/位图），每图含 teacherNotes 与 studentPrompt。

## 5. 题源核对状态

- **全部题目均为自编或充分改写**，未照搬教材原题。`sourceType` 取 `adapted`（改编）或 `bridging`（自编过渡题）。
- `sourceRef` 仅记录对应章/节，题号标注“待核对题源”。**未核对教材具体题号**（PDF 不进仓库、未读取）。
- 待对照本地《数学分析（第5版）》上册第 3 章核对后，可把确认来自教材的题改标 `textbook-exercise`/`textbook-example` 并回填题号。

## 6. 数学表达约定

- 章节/题目 JSON 中 LaTeX 采用与样板章 `sequence-limit` 一致的**四反斜杠源码约定**（`\\\\` 经 `MathText.normalizeLatex` 归一为单反斜杠后交 KaTeX）。
- 图示 JSON 采用与 `diagrams/sequence-limit.json` 一致的**双反斜杠约定**。
- 两种约定经 `normalizeLatex` 后渲染结果一致；同类文件内部保持统一。

## 7. 升级到 sample-ready 前待办

- 核对教材题号并回填 `sourceRef`。
- 复核 ε-δ 证明题（ex-005）的 δ 取法表述是否对初学者足够清晰。
- 视教学需要，为 function-limit-properties（夹逼）补一张夹逼图示。
- 人工校对所有 LaTeX 在前端的实际渲染（重点 ex-007 的指数凑形、ex-008 的多步等价）。

## 8. 风险

- 题源未核对，内容可信度标注为“自编/改写”，需在 UI 上区分教材题与自编题（见 `docs/qa/ai-tutor-risk-list.md` R7）。
- 归结原则、无穷小阶比较为本章难点，AI 批改时需严格依据 gradingRubric，避免对“同阶/等价”判断放水。
