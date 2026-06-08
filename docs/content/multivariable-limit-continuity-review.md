# CC-15 多元函数的极限与连续 — 内容审查备注

**章节：** 第 16 章 多元函数的极限与连续  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| planar-point-sets | 平面点集与多元函数 | 已写 |
| two-variable-limit | 二元函数的极限 | 已写 |
| two-variable-continuity | 二元函数的连续性与有界闭域上的性质 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| mvlc-ex-001 | basic | 判断三个点集的内点/边界/开闭性/区域 | planar-point-sets |
| mvlc-ex-002 | basic | 三种极限计算（夹逼法） | two-variable-limit |
| mvlc-ex-003 | medium | 证明三个极限不存在（直线路径、极坐标、曲线路径经典陷阱） | two-variable-limit |
| mvlc-ex-004 | basic | 分段函数在特定点的连续性 | two-variable-continuity |
| mvlc-ex-005 | medium | 累次极限与二元极限的关系（经典区分）| two-variable-limit |
| mvlc-ex-006 | medium | 极坐标法计算 $(x^3+y^3)/(x^2+y^2)$ | two-variable-limit |
| mvlc-ex-007 | basic | 多元初等函数极限（含不存在情形） | two-variable-continuity |
| mvlc-ex-008 | hard | 有界闭域上连续函数的积分中值定理证明 | two-variable-continuity |

难度分布：basic ×4，medium ×3，hard ×1（共 8 题）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| path-dependence-diagram | $f=xy/(x^2+y^2)$ 路径依赖示例（含 3D 辅助图）|

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 16 章习题回填题号。

2. **mvlc-ex-003（经典陷阱）**：第3小题 $f=x^2y^2/(x^2y^2+(x-y)^2)$ 是沿直线极限均为 $0$ 但沿特定曲线极限为 $1$ 的经典反例。选取路径 $y=x-x^2$ 使分母 $x-y=x^2$，消去一项后极限不为零。

3. **mvlc-ex-005（累次极限）**：强调"两个累次极限存在且相等"是二元极限存在的**必要**不充分条件；"两个累次极限不等"则直接说明二元极限不存在。

4. **mvlc-ex-008（积分中值定理）**：虽然放在连续性章节，实际上依赖最值定理 + 介值定理的组合使用，属于综合性证明题，体现三大定理的协同应用。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
