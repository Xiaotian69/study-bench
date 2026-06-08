# CC-3 函数连续性 — 内容审查备注

**章节：** 第 4 章 函数的连续性  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| continuity-at-point | 函数在一点的连续性 | 已写 |
| one-sided-continuity | 单侧连续 | 已写 |
| discontinuity-types | 间断点的分类 | 已写 |
| continuity-operations | 连续函数的运算 | 已写 |
| composite-continuity | 复合函数的连续性 | 已写 |
| elementary-function-continuity | 初等函数的连续性 | 已写 |
| closed-interval-properties-preview | 闭区间连续函数性质（预览） | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| continuity-ex-001 | basic | 判断连续性 | continuity-at-point |
| continuity-ex-002 | basic | 确定参数使连续 | continuity-at-point |
| continuity-ex-003 | basic | 单侧连续判断 | one-sided-continuity |
| continuity-ex-004 | basic | 间断点分类 | discontinuity-types |
| continuity-ex-005 | medium | 间断点分类（含单侧极限分析） | discontinuity-types |
| continuity-ex-006 | basic | 连续区间与极限计算 | continuity-operations |
| continuity-ex-007 | medium | 复合极限（连续函数穿极限） | composite-continuity |
| continuity-ex-008 | medium | 初等函数极限计算 | elementary-function-continuity |
| continuity-ex-009 | medium | 零点定理应用 | closed-interval-properties-preview |
| continuity-ex-010 | hard | 介值定理变式证明（辅助函数构造） | closed-interval-properties-preview |

难度分布：basic ×4，medium ×4，hard ×1（共 10 题，满足 ≥8 题要求）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| continuity-at-point-three-cases | 连续/可去/跳跃三种情形对比 |
| discontinuity-types-gallery | 四类间断点：可去/跳跃/无穷/振荡 |
| intermediate-value-theorem-illustration | 介值定理与零点定理示意 |

## 内容注意事项

1. **题源说明**：本章所有题目为自编或充分改写，sourceRef 均标注"待核对题源"。正式上线前需对照《数学分析（第5版）》上册第 4 章课后习题回填具体题号，并检查是否与教材原题重复。

2. **LaTeX 约定**：章节 JSON 和练习 JSON 使用四反斜线（`\\\\`）；图示 JSON 使用两反斜线（`\\`）。已按约定执行。

3. **closed-interval-properties-preview**：本 KP 仅"预览"三大定理，严格证明留在第 7 章（实数完备性）。讲义中已明确注明。exercise-010（辅助函数构造）属于该定理的较难应用，适合章末综合练习。

4. **discontinuity-types 的 ex-005**：$f(x)=\frac{e^{1/x}-1}{e^{1/x}+1}$ 是跳跃间断点的典型例子（左极限 $-1$，右极限 $1$），常见于竞赛题和考研题，难度适中。

5. **composite-continuity 的 ex-007**：$\lim_{x\to 0}\ln(1+\sin x/x)$ 是连续函数穿极限的标准示范，正好衔接前一章"两个重要极限"。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 与教材目录比对，确认 KP 覆盖无遗漏
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
