# CC-13 幂级数 — 内容审查备注

**章节：** 第 14 章 幂级数  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| power-series-convergence | 幂级数的收敛性 | 已写 |
| power-series-operations | 幂级数的运算与性质 | 已写 |
| taylor-expansion | 函数的幂级数展开 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| power-ex-001 | basic | 收敛半径和收敛域（三题，含偶次幂） | power-series-convergence |
| power-ex-002 | basic | $(x-2)$ 中心的幂级数，收敛域+和函数 | power-series-convergence, power-series-operations |
| power-ex-003 | medium | 逐项微分/积分求和函数（三题） | power-series-operations |
| power-ex-004 | medium | 数项级数求和（幂级数构造法） | power-series-operations |
| power-ex-005 | basic | 基本 Maclaurin 展开（间接法，四题） | taylor-expansion |
| power-ex-006 | medium | 间接展开（$\arcsin x$，$x/(1+x)^2$） | taylor-expansion |
| power-ex-007 | medium | Taylor 展开计算极限（两题） | taylor-expansion |
| power-ex-008 | hard | 幂级数+反常积分推导 Basel 问题 $\sum 1/n^2=\pi^2/6$ | taylor-expansion, power-series-operations |

难度分布：basic ×3，medium ×4，hard ×1（共 8 题）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| taylor-convergence-diagram | $\sin x$ 被 Taylor 多项式 $P_1,P_3,P_5,P_7$ 逐步逼近 |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 14 章习题回填题号。

2. **power-ex-008（Basel 问题）**：通过逐项积分 $\int_0^1\ln(1+x)/x$ 推出 $\sum(-1)^{n-1}/n^2=\pi^2/12$，再用奇偶拆分得 Basel 公式 $\sum 1/n^2=\pi^2/6$。这是幂级数理论的美丽应用，也是本章综合性最强的题目。

3. **收敛半径计算**：比值法要求极限存在，Cauchy-Hadamard 对所有序列均适用。建议学生遇到 $(2n)!/(n!)^2$ 这类系数时先试比值，再考虑 Stirling。

4. **间接展开法**（power-ex-005, 006）：5 个基本展开是工具，间接法是实际使用方式。$\arcsin x$ 展开来自 $(1-x^2)^{-1/2}$ 的二项展开加积分，是重要的推导路径。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
