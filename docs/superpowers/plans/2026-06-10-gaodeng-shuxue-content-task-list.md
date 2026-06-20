# 高等数学（同济版）内容编写任务清单 — 给协作 AI

> **课程 ID：`gaodeng-shuxue` ｜ slug 前缀：`gd-` ｜ 目标：11 章完整、精炼、带可渲染配图**
>
> 这份清单是**自包含**的：你不需要读其他文档也能开工。但开工前**必须**先读样板
> `content/courses/math-analysis/chapters/sequence-limit.json`（这是全项目的质量基线），
> 以及 `CONTENT_AGENT.md`（JSON 编码与安全规则，尤其是 LaTeX 四反斜杠和中文引号规则）。
>
> 本次任务相对旧版 CONTENT_AGENT 的**关键升级**：内容必须更厚、配图必须可被渲染器真正画出来（不能只写描述文字）。详见 §3、§4。

---

## 0. 开工前置（主智能体已完成 / 待确认）

`gaodeng-shuxue` 课程目录、`course.json`、`volume-*.json` 与代码注册（registry）由**主智能体**搭建，
你**只写内容 JSON**，不碰任何 `.ts/.tsx/.css/.js` 代码。开工前确认这些已存在：

```
content/courses/gaodeng-shuxue/
├── course.json            ← 主智能体建好（勿改）
├── volume-1.json          ← 上册目录（第 1–7 章）
├── volume-2.json          ← 下册目录（第 8–11 章 + 续）
├── chapters/              ← 你写
├── exercises/             ← 你写
└── diagrams/              ← 你写
```

若目录还没建好，**停下来告诉主智能体**，不要自己创建 course.json / volume 文件。

每完成一章后运行（若脚本存在）：
```powershell
npm run validate:all        # JSON 合法性 + ID 交叉引用校验
node scripts/build-wx-data.js   # 同步到小程序数据（主智能体会跑，你可不跑）
```

---

## 1. 章节总表（11 章，按同济《高等数学》第八版顺序）

| # | 章节 ID | slug / 文件名 | 章节名称 | 册 | 优先级 |
|---|---------|--------------|---------|----|-------|
| 1 | `ch-gd-function-limit` | `gd-function-limit` | 函数、极限与连续 | 上 | P0 |
| 2 | `ch-gd-derivative` | `gd-derivative` | 导数与微分 | 上 | P0 |
| 3 | `ch-gd-mean-value` | `gd-mean-value` | 微分中值定理与导数应用 | 上 | P0 |
| 4 | `ch-gd-indefinite-integral` | `gd-indefinite-integral` | 不定积分 | 上 | P1 |
| 5 | `ch-gd-definite-integral` | `gd-definite-integral` | 定积分及其应用 | 上 | P1 |
| 6 | `ch-gd-ode` | `gd-ode` | 微分方程 | 上 | P1 |
| 7 | `ch-gd-vectors` | `gd-vectors` | 向量代数与空间解析几何 | 下 | P2 |
| 8 | `ch-gd-multivariable-diff` | `gd-multivariable-diff` | 多元函数微分法及其应用 | 下 | P1 |
| 9 | `ch-gd-multiple-integrals` | `gd-multiple-integrals` | 重积分 | 下 | P1 |
| 10 | `ch-gd-line-surface` | `gd-line-surface` | 曲线积分与曲面积分 | 下 | P2 |
| 11 | `ch-gd-series` | `gd-series` | 无穷级数 | 下 | P2 |

**认领方式**：多个 AI 协作时，一人一章，避免冲突。建议按 P0 → P1 → P2 顺序。
高数面向工科，重**计算与应用**、轻**ε 语言的纯证明**——与数学分析的取向不同，写作时务必体现这一点（多算例、多几何/物理背景，证明给思路而非全程 ε-δ）。

---

## 2. 每章必须交付 3 个文件

1. `chapters/{slug}.json` — 知识点讲义（主体）
2. `exercises/{slug}.json` — 练习题
3. `diagrams/{slug}.json` — 配图规格

字段结构**完全复用** `math-analysis` 的样板（见 `CONTENT_AGENT.md` §5/§6/§7）。
只需把 `courseId` 改成 `"gaodeng-shuxue"`，`volumeId` 改成对应册，`number` 改成本章序号。

---

## 3. 内容深度硬指标（针对「内容少不精」的整改）

旧内容的问题是知识点太少、讲解太短。本次每章**必须达到**：

### 3.1 知识点数量
- 每章 **6–10 个 knowledgePoint**（不是 3 个）。按教材小节切分，一个核心概念/一个主定理/一类方法各算一个 KP。
- 例：第 5 章定积分应该至少含：定积分定义与可积性、牛顿-莱布尼茨公式、换元法、分部积分、定积分几何应用（面积/体积/弧长）、物理应用（功/压力）、反常积分。

### 3.2 每个 knowledgePoint 的字段下限
| 字段 | 下限要求 |
|------|---------|
| `learningGoals` | 3–5 条，动词开头，可测 |
| `coreExplanation` | **≥ 3 段、≥ 350 字**；必含至少 1 个**完整算例**（带步骤），不能只讲概念 |
| `keyDefinitions` | 该 KP 涉及的定义全列，statement 用自己的话精确陈述 |
| `keyTheorems` | 主定理必列，附 `proofSketch`（思路，2–4 步） |
| `proofIdeas` | 计算型 KP 写「解题套路」，证明型 KP 写「证明三步」 |
| `socraticQuestions` | 3–5 条，能戳中易错点 |
| `commonMistakes` | 3–4 条，写工科生**真实**常犯错（如换元忘换限、求体积选错公式） |
| `exampleIds` / `exerciseIds` | 指向 exercises 文件中真实存在的 id |
| `diagramIds` | **每章至少 50% 的 KP 要挂 1 张图**（见 §4） |
| `masteryCriteria` | 2–3 条，与 learningGoals 呼应 |

> 质量自检：拿 `sequence-limit.json` 里任意一个 KP 对比——你的每个 KP 信息密度不得低于它。那是**及格线**，不是上限。

### 3.3 算例优先
工科高数的灵魂是「会算」。`coreExplanation` 里的算例要**写全过程**，例如：
> 求 $\\\\int x e^x \\\\mathrm{d}x$：设 $u=x,\\\\ \\\\mathrm{d}v=e^x\\\\mathrm{d}x$，则 $\\\\mathrm{d}u=\\\\mathrm{d}x,\\\\ v=e^x$，由分部积分 $\\\\int u\\\\,\\\\mathrm{d}v=uv-\\\\int v\\\\,\\\\mathrm{d}u=xe^x-\\\\int e^x\\\\mathrm{d}x=xe^x-e^x+C$。

---

## 4. 配图硬指标（针对「配图也没有」的整改）⚠️ 重要

> **背景**：当前渲染器只有少数图类型能真正画出来，其余只显示文字描述。
> 为避免你写的图变成「一段说明文字」，本次**约定一套渲染器一定支持的图类型白名单**。
> **只用白名单内的 `type`，并把几何参数写进 `parameters`**，渲染器才能真正画图。

### 4.1 允许的 `type`（白名单）与必填 `parameters`

| type | 用途 | parameters 必填项 |
|------|------|------------------|
| `number-line` | 数轴 / 邻域 / 区间 | `axisMin,axisMax,points:[{x,label}],intervals:[{from,to,label,open}]` |
| `function-plot` | 单条函数曲线 | `xRange:[a,b],expr`（如 `"x^2"`、`"sin(x)"`）`,marks:[{x,label}],asymptotes:[]` |
| `multi-curve-plot` | 多条曲线对比 | `xRange,curves:[{expr,label,style}]` |
| `area-under-curve` | 定积分面积 | `expr,xRange,fillFrom,fillTo,label` |
| `region-2d` | 二重积分区域 / 平面区域 | `xRange,yRange,boundaries:[{expr,label}],fill:true` |
| `geometric` | 三角形/圆/向量等纯几何 | `shapes:[{kind,points/center/r,label}]`（kind: line/point/circle/polygon/vector） |
| `table` | 对照表 / 符号表 / 收敛判别表 | `columns:[...],rows:[[...]]` |

> 若你需要的图**不在白名单内**，不要硬造新 type（会渲染成纯文字）。改用最接近的 type，或在 `diagrams` 里把它写成 `table`，或留 `diagramIds: []` 并在 `teacherNotes` 写明「待补图」，交给主智能体扩渲染器。

### 4.2 每张图对象必填字段
```jsonc
{
  "id": "gd-int-area-under-curve",      // 全课程唯一，前缀 gd-
  "type": "area-under-curve",           // 必须取自 §4.1 白名单
  "title": "定积分作为曲边梯形面积",
  "description": "$\\\\int_a^b f(x)\\\\,\\\\mathrm{d}x$ 表示曲线下方、x 轴上方的面积。",
  "knowledgePointIds": ["definite-integral-concept"],
  "parameters": {                        // ⚠️ 必须填几何参数，不能是 {}
    "expr": "0.5*x*x+1",
    "xRange": [0, 3],
    "fillFrom": 0.5,
    "fillTo": 2.5,
    "label": "S"
  },
  "studentPrompt": "把 [a,b] 分得更细，矩形和会怎样逼近这块面积？",
  "teacherNotes": ["强调被积函数非负时积分=面积；有正有负时是代数和。"]
}
```

### 4.3 数量要求
- 每章 **3–6 张图**，覆盖本章最核心的几何直观（极限的 ε 邻域、导数的切线、积分的面积、级数的部分和、空间曲面等）。
- 宁可少而准，不要为凑数写无法渲染的图。

---

## 5. 练习题要求（针对「不精」）

- 每个 KP **至少 3 道**：基础计算 ×1 + 中档 ×1 + 综合/应用 ×1。
- `type` 工科侧重 `computation`，但每章保留 2–3 道 `proof`/`analysis`。
- `sourceType` 用 `adapted`（教材题改编）或 `bridging`（自编衔接题）；**严禁编造题号冒充教材原题**，`sourceRef` 一律写 `"待核对题源（章节信息）"`。
- `gradingRubric` 写**评分点**（得分关键步骤），`hints` 给 1–2 级提示，`commonMistakes` 写本题特有的坑。

---

## 6. 内容安全规则（必须遵守，违反即作废）

- ❌ 不得整段复制教材原文；用自己的语言解释（可引用定理名/定义名，陈述自写）。
- ❌ 不得编造教材题号；无法核对写 `"待核对题源"`。
- ❌ 不得写入任何 API Key、密钥、PDF、截图。
- ✅ `coreExplanation`、`statement` 均为自编讲义，允许参考教材思路。

---

## 7. 每章交付自检清单

提交一章前逐条核对：

- [ ] `chapters/{slug}.json` 含 **6–10 个 KP**，每个 `coreExplanation` ≥ 3 段且含完整算例
- [ ] 每个 KP 字段达到 §3.2 下限，无空 `learningGoals`/`commonMistakes`
- [ ] `exercises/{slug}.json` 每个 KP ≥ 3 题，`sourceRef` 合规
- [ ] `diagrams/{slug}.json` 3–6 张图，**每张 `type` 取自 §4.1 白名单且 `parameters` 非空**
- [ ] 所有 `diagramIds/exampleIds/exerciseIds/knowledgePointIds` 交叉引用均能对上
- [ ] LaTeX 全部 `\\\\`（四反斜杠），字符串内无英文 `"`（用「」《》）
- [ ] `JSON.parse()` 能通过（无多余逗号）；运行 `npm run validate:all` 无错
- [ ] `courseId` 全部为 `"gaodeng-shuxue"`，ID 前缀 `gd-`

---

## 8. 分工建议（多 AI 并行）

| 批次 | 章节 | 说明 |
|------|------|------|
| 第一批 P0 | 第 1、2、3 章 | 极限/导数/中值定理，最高频，先做出质量标杆 |
| 第二批 P1 | 第 4、5、8、9 章 | 积分与多元，工科主力内容 |
| 第三批 P1 | 第 6 章 | 微分方程（数分未含，需独立组织） |
| 第四批 P2 | 第 7、10、11 章 | 向量几何、曲线曲面积分、无穷级数 |

每人开工前在本文件对应章节后面标注 `认领人 / 日期`，完成后改成 `✅ 完成`，避免撞车。

---

## 认领登记区

- [ ] 第 1 章 函数、极限与连续 —
- [ ] 第 2 章 导数与微分 —
- [ ] 第 3 章 微分中值定理与导数应用 —
- [ ] 第 4 章 不定积分 —
- [ ] 第 5 章 定积分及其应用 —
- [ ] 第 6 章 微分方程 —
- [ ] 第 7 章 向量代数与空间解析几何 —
- [ ] 第 8 章 多元函数微分法及其应用 —
- [ ] 第 9 章 重积分 —
- [ ] 第 10 章 曲线积分与曲面积分 —
- [ ] 第 11 章 无穷级数 —
