# 内容智能体工作指南

这份文件供**内容辅助智能体**使用。你的职责：按规范为本项目撰写 JSON 章节文件，
不修改任何 TypeScript/React/CSS 代码，不做框架结构决策。

---

## 1. 项目概览

这是一个 **Next.js 15 + KaTeX** 学习工作台，目前收录**数学分析**全 22 章
（上册 11 章 + 下册 11 章），未来将扩展至**高等数学**（同济版，12 章）。

内容全部存放在 `content/courses/` 目录，**与代码完全解耦**——你只需写 JSON 文件。

---

## 2. 目录结构

```
content/
└── courses/
    └── math-analysis/               ← 数学分析课程根目录
        ├── course.json              ← 课程元信息（不要修改）
        ├── volume-1.json            ← 上册目录（注册新章节时要更新）
        ├── volume-2.json            ← 下册目录（注册新章节时要更新）
        ├── chapters/                ← 每章的知识点内容
        │   ├── sequence-limit.json  ← 已完成样板
        │   └── *.json
        ├── exercises/               ← 每章的练习题
        │   └── *.json
        └── diagrams/                ← 每章的教学图示
            └── *.json
```

如要添加**高等数学**，将来会新建 `content/courses/gaodeng-shuxue/`，
结构完全相同。在主智能体确认课程注册代码之前，**只在 `math-analysis` 下工作**。

---

## 3. LaTeX 编码规则（最重要）

JSON 字符串里所有 LaTeX 命令必须用 **4 个反斜杠**代替 1 个：

| 想输出 | JSON 里写 |
|--------|-----------|
| `\frac{1}{n}` | `\\\\frac{1}{n}` |
| `\lim_{n\to\infty}` | `\\\\lim_{n\\\\to\\\\infty}` |
| `\varepsilon` | `\\\\varepsilon` |
| `\{x_n\}` | `\\\\{x_n\\\\}` |
| `\mathbb{R}` | `\\\\mathbb{R}` |

行内公式：`$\\\\frac{1}{n}$`
行间公式：`$$\\\\lim_{n\\\\to\\\\infty} x_n = a$$`

---

## 4. 中文引号规则

JSON 字符串值**不得包含未转义的英文双引号**。凡需在内容里打引号，一律用中文书名号或角括号：

- **强调词**：`「极限」`、`「收敛」`（而非 `"极限"`）
- **引用**：《数学分析》第三章
- **数学符号**：`$\varepsilon$`（用公式，不用引号）

---

## 5. chapter JSON 格式（完整字段说明）

文件名：`chapters/{slug}.json`，`slug` = 章节 ID 去掉 `ch-` 前缀（如 `function-limit.json`）。

```jsonc
{
  "id": "ch-function-limit",          // 必须与 volume JSON 里的 id 一致
  "courseId": "math-analysis",
  "volumeId": "math-analysis-volume-1",
  "number": 3,                        // 章序号（与 volume JSON 保持一致）
  "title": "函数极限",
  "status": "draft",                  // draft | sample-ready
  "overview": "本章……（1-3 句概括，可留空字符串）",

  "knowledgePoints": [
    {
      "id": "limit-concept",          // 小写字母+连字符，全课程唯一
      "title": "函数极限的概念",

      "learningGoals": [              // 3-5 条，动词开头，具体可测
        "理解函数极限的直观含义……",
        "能用 epsilon-delta 语言陈述极限定义……"
      ],

      "coreExplanation": "主体讲解，可多段，支持行内和行间公式。\n\n第二段……",

      "textbookRefs": [               // 对应教材章节，便于核对
        "数学分析（第5版）上册 第三章 §1"
      ],

      "keyDefinitions": [
        {
          "name": "函数极限（x→x_0）",
          "statement": "设函数 $f$ 在 $x_0$ 的某去心邻域内有定义……"
        }
      ],

      "keyTheorems": [
        {
          "name": "极限的唯一性",
          "statement": "若极限存在，则唯一。",
          "proofSketch": "反设有两个极限 $A\\\\neq B$，取 $\\\\varepsilon=|A-B|/2$……"
        }
      ],

      "proofIdeas": [                 // 证明思路提示，非完整证明
        "epsilon-delta 证明三步：任取 ε>0 → 分析 |f(x)-A| → 解出 δ"
      ],

      "socraticQuestions": [          // 3-5 条，供学生自检
        "为什么极限定义要用去心邻域，而不是普通邻域？",
        "……"
      ],

      "commonMistakes": [
        "把极限值 A 和函数值 f(x_0) 混淆",
        "……"
      ],

      "exampleIds": [],               // 留空或填已有 exercise id
      "exerciseIds": [],
      "diagramIds": [],

      "masteryCriteria": [            // 掌握标准，与学习目标呼应
        "能陈述定义并解释每个量词的角色",
        "……"
      ]
    }
  ]
}
```

---

## 6. exercises JSON 格式

文件名：`exercises/{slug}.json`

```jsonc
{
  "chapterId": "ch-function-limit",
  "courseId": "math-analysis",
  "volumeId": "math-analysis-volume-1",
  "sourceTypeLegend": {
    "textbook-example": "教材例题",
    "textbook-exercise": "教材课后习题",
    "adapted": "由教材题改编",
    "bridging": "自编过渡题，仅用于衔接，不作为正式题"
  },
  "intakeNote": "sourceRef 为「待核对题源」表示题面已录入但题号尚未与教材核对。",

  "exercises": [
    {
      "id": "fl-ex-001",
      "sourceType": "textbook-exercise",
      "sourceRef": "待核对题源（第三章 §1）",  // 核对后填具体题号
      "knowledgePointIds": ["limit-concept"],   // 一个或多个，必须与 chapter 里的 id 匹配
      "difficulty": "basic",                    // basic | medium | advanced
      "type": "computation",                    // computation | proof | definition-understanding | analysis
      "recommendedTiming": "after-lecture",
      "prompt": "求极限 $\\\\lim_{x\\\\to 2}(3x-1)$。",
      "gradingRubric": [
        "说明函数在 x=2 处连续，可直接代入",
        "得 3×2-1=5，结论正确"
      ],
      "hints": [
        "多项式函数在所有点连续。",
        "连续函数的极限等于函数值。"
      ],
      "commonMistakes": [
        "把趋近过程和代入混淆"
      ]
    }
  ]
}
```

每个知识点至少 **2 道题**（基础 1 + 中档/提升 1）。
**严禁编造题目冒充教材原题**；无法核对时 `sourceRef` 一律写 `"待核对题源（章节信息）"`。

---

## 7. diagrams JSON 格式

文件名：`diagrams/{slug}.json`

```jsonc
{
  "chapterId": "ch-function-limit",
  "diagrams": [
    {
      "id": "epsilon-delta-neighborhood",
      "type": "graph",              // graph | number-line | table | geometric
      "title": "ε-δ 邻域示意",
      "description": "展示 x 趋近 x₀ 时 f(x) 进入 A 的 ε 邻域",
      "studentPrompt": "观察：当 δ 缩小时，ε 是否也缩小？",
      "knowledgePointIds": ["limit-concept"],
      "parameters": {},             // 留空即可；SVG 由渲染器生成
      "teacherNotes": [
        "强调去心邻域——x=x₀ 处的点不在考察范围内"
      ]
    }
  ]
}
```

**图示可以留空数组** `"diagrams": []`——优先把章节内容和练习写好，图示后补。

---

## 8. 在 volume JSON 注册新章节

新章节 JSON 写完后，要在 `volume-1.json`（或 `volume-2.json`）的 `chapters` 数组
里确认该章已有正确条目。**如果章节已存在则不用修改**；如果是全新课程（如高等数学），
由主智能体完成 volume 文件和 registry 代码，**你只写内容文件**。

现有章节注册格式（参考）：

```json
{
  "id": "ch-function-limit",
  "number": 3,
  "title": "函数极限",
  "status": "draft",
  "chapterFile": "chapters/function-limit.json",
  "exercisesFile": "exercises/function-limit.json",
  "diagramFile": "diagrams/function-limit.json",
  "sections": [
    {
      "id": "sec-limit-concept",
      "title": "函数极限的概念",
      "status": "draft",
      "knowledgePointIds": ["limit-concept", "one-sided-limit"]
    }
  ]
}
```

`sections[].knowledgePointIds` 必须与 `chapter.json` 里各 `knowledgePoint.id` 一一对应。

---

## 9. 当前数学分析各章状态

| 状态 | 章节 |
|------|------|
| ✅ sample-ready | ch-sequence-limit（样板，可参考所有字段） |
| 📝 draft（内容骨架已有，需补全） | 其余 21 章 |

**draft 章节现状**：已有 `knowledgePoints` 数组（含 id、title、learningGoals、
coreExplanation），但部分字段可能较短或留空，练习题数量不足。

**优先补全顺序**（教学常用度排序）：

1. `ch-function-limit` — 函数极限
2. `ch-continuity` — 函数连续性
3. `ch-derivative-differential` — 导数和微分
4. `ch-mean-value-theorems` — 微分中值定理
5. `ch-indefinite-integral` — 不定积分
6. `ch-definite-integral` — 定积分
7. `ch-definite-integral-applications` — 定积分应用
8. `ch-numerical-series` — 数项级数
9. `ch-multivariable-differential` — 多元微分学
10. `ch-multiple-integrals` — 重积分

---

## 10. 高等数学章节清单（待创建）

课程 ID：`gaodeng-shuxue`，slug 前缀 `gd-`，等主智能体建好目录后再写。

| # | 章节 ID | 章节名称 | 对应数分章节 |
|---|---------|---------|------------|
| 1 | `ch-gd-function-limit` | 函数与极限（含连续性） | CH2+CH3+CH4 合并 |
| 2 | `ch-gd-derivative` | 导数与微分 | CH4 |
| 3 | `ch-gd-mean-value` | 微分中值定理与导数应用 | CH5 |
| 4 | `ch-gd-indefinite-integral` | 不定积分 | CH7 |
| 5 | `ch-gd-definite-integral` | 定积分 | CH8+CH9 |
| 6 | `ch-gd-ode` | 微分方程 | （数分未含，同济版第7章） |
| 7 | `ch-gd-vectors` | 向量代数与空间解析几何 | （数分未含） |
| 8 | `ch-gd-multivariable-diff` | 多元函数微分法 | CH16+CH17+CH18 |
| 9 | `ch-gd-multiple-integrals` | 重积分 | CH20 |
| 10 | `ch-gd-line-surface` | 曲线积分与曲面积分 | CH19+CH21 |
| 11 | `ch-gd-series` | 无穷级数 | CH12+CH13+CH14 合并 |

---

## 11. 工作流程（每次新建一章）

```
1. 读 sequence-limit.json（样板）了解完整字段格式
2. 写 chapters/{slug}.json
   - 至少 3 个 knowledgePoint
   - 每个 KP：learningGoals（3条）+ coreExplanation（3段）+
     keyDefinitions（1-2条）+ socraticQuestions（3条）+ commonMistakes（2条）
3. 写 exercises/{slug}.json
   - 每个 KP 至少 2 道题（basic × 1 + medium × 1）
   - sourceRef 一律写「待核对题源」
4. 写 diagrams/{slug}.json（可留 "diagrams": []）
5. 验证 JSON 是否合法（无多余逗号、无未转义双引号）
```

---

## 12. 内容安全规则（必须遵守）

- ❌ 不得复制教材原文大段录入；用自己的语言解释概念
- ❌ 不得编造题目冒充教材原题；无法核对时写 `"待核对题源"`
- ❌ 不得在任何文件里写入 API Key、密钥、个人账号
- ❌ 不得提交 PDF、截图、教材原件
- ✅ coreExplanation 是自编讲义，允许参考教材思路但不逐句照抄
- ✅ 可以引用定理名称和定义，但陈述必须是自己的语言

---

## 13. 快速校验清单

提交前对照检查：

- [ ] JSON 文件可以被 `JSON.parse()` 解析（无语法错误）
- [ ] 所有 `\` 都已变成 `\\\\`（4个反斜杠）
- [ ] 没有用英文 `"` 在字符串内部（改用 `「」` 或 `《》`）
- [ ] `knowledgePointIds` 里的每个 ID 都能在对应 chapter.json 里找到
- [ ] `sourceRef` 是真实教材章节或明确写 `"待核对题源"`
- [ ] 文件命名 snake-kebab-case（小写字母+连字符）

---

## 参考：最快上手方式

直接复制 `content/courses/math-analysis/chapters/sequence-limit.json`
和对应的 `exercises/sequence-limit.json`，把所有内容替换成新章节即可——
字段结构不用记，参照样板即可。
