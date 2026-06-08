# CC-16 多元函数微分学 — 内容审查备注

**章节：** 第 17 章 多元函数微分学  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| differentiability | 可微性、偏导数与全微分 | 已写 |
| composite-differentiation | 复合函数微分法（链式法则） | 已写 |
| directional-derivative-gradient | 方向导数与梯度 | 已写 |
| multivariable-extrema | 多元函数的泰勒公式与极值 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| mvd-ex-001 | basic | 偏导数计算（$x^y$，$\arctan(y/x)$，三元） | differentiability |
| mvd-ex-002 | medium | 验证可微性（偏导存在但不可微的反例） | differentiability |
| mvd-ex-003 | basic | 链式法则 + 等式验证 | composite-differentiation |
| mvd-ex-004 | medium | 隐函数求导（含二阶偏导） | composite-differentiation |
| mvd-ex-005 | basic | 方向导数计算 + 最大增长方向 | directional-derivative-gradient |
| mvd-ex-006 | medium | 温度场梯度 + 等温线方向 | directional-derivative-gradient |
| mvd-ex-007 | medium | 极值判定（4 个驻点，含鞍点）| multivariable-extrema |
| mvd-ex-008 | hard | Laplace 方程的极坐标形式推导 | composite-differentiation |

难度分布：basic ×3，medium ×4，hard ×1（共 8 题）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| gradient-diagram | 梯度与等值线垂直关系（含 3D 旋转抛物面）|

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 17 章习题回填题号。

2. **mvd-ex-002（反例）**：$f=\sqrt{|xy|}$ 的标准变体，说明偏导存在但全微分不存在。是本章最重要的概念辨析题。

3. **mvd-ex-008（Laplace 极坐标）**：这道题技术量大，是链式法则的极致应用。推导过程要求仔细追踪所有交叉项并证明它们消去。结果是物理/工程中常用的极坐标 Laplace 算子 $u_{rr}+(1/r)u_r+(1/r^2)u_{\theta\theta}=0$。

4. **mvd-ex-007**：$f_{xy}=0$ 使得 $4$ 个驻点的 $x,y$ 解耦，计算较简洁。实际给出了极大值、极小值和鞍点各一组，覆盖全部情形。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
