# 下册目录核对记录（volume-2 outline review）

日期：2026-06-03
对应任务包：CC-1（建立下册目录框架）
产出文件：`content/courses/math-analysis/volume-2.json`、`content/courses/math-analysis/course.json`

## 1. 目录来源与核对状态

- 本次 `volume-2.json` 依据《数学分析（第5版）》下册的**通行章节结构**整理，只摘录章/节标题与顺序，不含教材正文、不含原题。
- 整理者**未直接读取本地 PDF**（PDF 不进仓库、不被工具读取），目录来自对该教材结构的通行认知。因此目录标题与小节划分**整体可信、但需对照本地 PDF 做一次人工终核**。
- 章节编号承接上册：上册为第 1–11 章，下册自**第 12 章**起。

## 2. 已录入的下册章节（全部 status=planned）

| 章 | 标题 | chapter slug | 小节数 |
| --- | --- | --- | --- |
| 12 | 数项级数 | `ch-numerical-series` | 3 |
| 13 | 函数列与函数项级数 | `ch-function-sequences-series` | 2 |
| 14 | 幂级数 | `ch-power-series` | 2 |
| 15 | 傅里叶级数 | `ch-fourier-series` | 3 |
| 16 | 多元函数的极限与连续 | `ch-multivariable-limit-continuity` | 3 |
| 17 | 多元函数微分学 | `ch-multivariable-differential` | 4 |
| 18 | 隐函数定理及其应用 | `ch-implicit-function-theorem` | 4 |
| 19 | 含参量积分 | `ch-parameter-integrals` | 3 |
| 20 | 曲线积分 | `ch-line-integrals` | 2 |
| 21 | 重积分 | `ch-multiple-integrals` | 6 |
| 22 | 曲面积分 | `ch-surface-integrals-vector-fields` | 4 |

chapter slug 与后续内容计划（CC-8）的批次 slug 一一对应，便于逐章整理时引用。

## 3. 待人工终核 / 存疑点

- **第 23 章存疑**：部分印次的《数学分析（第5版）》下册含“第二十三章 流形上微积分学初阶”。本次**未收录**该章，待对照本地 PDF 确认是否存在；若存在再追加 `ch-manifold-calculus-intro`（number 23）。
- **格林公式位置**：本目录按教材把“格林公式·曲线积分与路线无关性”放在第 21 章重积分的小节（`sec-green-formula`）。后续整理曲线积分（第 20 章）时，需注意格林公式的正式陈述位于第 21 章，曲线积分章只做铺垫。
- **小节标题用字**：如“以 2l 为周期的函数的展开式”等标题的标点/用字，需对照 PDF 校对一遍。

## 4. course.json 改动

- `volumes`：由 `["math-analysis-volume-1"]` 扩展为 `["math-analysis-volume-1", "math-analysis-volume-2"]`。
- `textbook.title`：由“数学分析（第5版）上册”改为“数学分析（第5版）上下册”。
- `defaultVolumeId` 保持 `math-analysis-volume-1`（首版仍默认进入上册样板）。

## 5. 验证

- `volume-2.json`、`course.json` 均可被 `JSON.parse` 解析。
- `npm run validate:all` 通过（内容交叉引用校验只针对上册样板章，新增 planned 章节不影响）。

## 6. 下一步

- 执行 CC-2：上册第 3 章 函数极限（与已完成的“数列极限”形成连续学习链）。
- 下册各章在 CC-8 阶段按批次逐章从 `planned` 升级为 `draft`。
- 对照本地 PDF 终核第 23 章是否存在，并校对小节标题用字。
