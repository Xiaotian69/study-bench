# 数学分析课程内容（结构化文件）

本目录是《数学分析》课程第一版的结构化内容来源。第一版不使用后台数据库，课程内容全部以 JSON 文件维护，后续可迁移到后台编辑器。

## 目录结构

```text
content/courses/math-analysis/
  course.json                      课程基本信息与册列表
  volume-1.json                    上册目录框架（章 -> 小节 -> 知识点引用 + 状态）
  chapters/
    sequence-limit.json            “数列极限”章：知识点骨架与教学内容
  exercises/
    sequence-limit.json            “数列极限”章：题目（教材例题/课后题为主）
  diagrams/                        教学图示规格（由任务包 B 维护）
  README.md                        本文件
```

## 内容层级

依据设计文档，课程层级为：

```text
课程 -> 册 -> 章 -> 小节 -> 知识点 -> 教学步骤 -> 例题/练习/图示
```

- `course.json`：课程元信息，`volumes` 列出册的 id。
- `volume-1.json`：上册全部章节框架。每章、每小节都带 `status`，多数为 `planned`，样板章“数列极限”为 `sample-ready`。小节通过 `knowledgePointIds` 引用知识点。
- `chapters/<chapter>.json`：该章 `knowledgePoints` 数组，每个知识点是一个教学单元。
- `exercises/<chapter>.json`：该章题目数组，题目用 `knowledgePointIds` 反向关联到知识点。

## 状态约定（status）

| 状态 | 含义 |
| --- | --- |
| `planned` | 已列入目录，尚未整理内容 |
| `sample-ready` | 样板内容，已整理为可学习的结构化内容 |
| `draft` | 正在整理，内容不完整 |

第一版策略为“上册目录框架 + 样板章节深做 + 按模板扩展”，因此只有“数列极限”章为 `sample-ready`，其余章节列出目录占位即可。

## 知识点字段说明（chapters/*.json）

每个知识点对象包含以下字段：

| 字段 | 说明 |
| --- | --- |
| `id` | 知识点唯一标识（kebab-case） |
| `title` | 知识点标题 |
| `learningGoals` | 学习目标列表 |
| `coreExplanation` | 核心讲义（开发者整理，含 LaTeX） |
| `textbookRefs` | 教材依据（章节、小节、定义/定理编号） |
| `keyDefinitions` | 关键定义，`{ name, statement }` |
| `keyTheorems` | 关键定理，`{ name, statement }` |
| `proofIdeas` | 证明思路要点 |
| `socraticQuestions` | AI 用于追问的苏格拉底式问题 |
| `commonMistakes` | 常见误区 |
| `exampleIds` | 关联的例题 id（指向 exercises 文件） |
| `exerciseIds` | 关联的练习题 id（指向 exercises 文件） |
| `diagramIds` | 关联的教学图示 id（指向 diagrams 文件） |
| `masteryCriteria` | 掌握度判定标准 |

## 题目字段说明（exercises/*.json）

每道题目包含：

| 字段 | 说明 |
| --- | --- |
| `id` | 题目唯一标识 |
| `sourceType` | 来源类型，见下 |
| `sourceRef` | 教材出处。尚未核对题号时填“待从教材对应小节录入（…）” |
| `knowledgePointIds` | 所属知识点（可多个） |
| `difficulty` | `basic` / `medium` / `hard` |
| `type` | `definition-understanding` / `computation` / `proof` / `counterexample` / `comprehensive` |
| `recommendedTiming` | `after-lecture` / `review` / `chapter-quiz` / `sprint` |
| `prompt` | 题面（含 LaTeX） |
| `gradingRubric` | 评分要点 / 标准解法要点 |
| `hints` | 分层提示（从浅到深） |
| `commonMistakes` | 常见错误 |

### 来源类型（sourceType）

| 取值 | 含义 |
| --- | --- |
| `textbook-example` | 教材例题 |
| `textbook-exercise` | 教材课后习题 |
| `adapted` | 由教材题改编 |
| `bridging` | 自编过渡题，仅用于衔接，不作为正式题 |

## 题目录入规则

- 第一版题目**以教材例题和课后习题为主**，AI 不凭空生成正式题（见设计文档第 6 节）。
- 当题面来自教材但尚未核对具体题号时，`sourceRef` 写为“待从教材对应小节录入（章节信息）”。正式录入时填入准确的章、节、题号，并复核 `gradingRubric`。
- 占位题目**不得使用未完成标记字样**（例如英文的待办/待定缩写）；应改用结构化的 `sourceRef` 状态字段表达“待录入”。
- 改编题标 `adapted`，过渡题标 `bridging`，并在 `sourceRef` 中说明改编自哪道题。

## LaTeX 约定

- 讲义与题面中的数学公式使用 LaTeX 语法。
- 在 JSON 字符串中，反斜杠需转义为 `\\`，例如希腊字母 `\\varepsilon`、分式 `\\frac{1}{n}`。前端读取后交由 MathJax / KaTeX 渲染。

## 版权与 PDF

- 原始教材 PDF **不提交到仓库**，不在前台公开，不作为可下载内容分发（见设计文档第 12 节）。
- 仓库与前台仅包含整理后的课程结构、讲义、题目训练与学习流程。
- 正式商业化前需进一步审查教材引用与题目改编的版权边界。
