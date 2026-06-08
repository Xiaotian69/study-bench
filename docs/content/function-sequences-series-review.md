# CC-12 函数列与函数项级数 — 内容审查备注

**章节：** 第 13 章 函数列与函数项级数  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| uniform-convergence-concept | 一致收敛的概念 | 已写 |
| uniform-convergence-properties | 一致收敛的性质 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| funseq-ex-001 | basic | 函数列一致收敛判断（$M_n$ 方法，三例） | uniform-convergence-concept |
| funseq-ex-002 | basic | Weierstrass M-判别法（三例，含失效情形） | uniform-convergence-concept |
| funseq-ex-003 | medium | 证明非一致收敛（连续性矛盾法） | uniform-convergence-concept |
| funseq-ex-004 | basic | 极限与积分交换条件分析（两题） | uniform-convergence-properties |
| funseq-ex-005 | medium | 逐项积分推导 $\ln(1+r)$ 展开式 | uniform-convergence-properties |
| funseq-ex-006 | medium | 逐项微分失效（$\sin(nx)/n$ 导函数振荡） | uniform-convergence-properties |
| funseq-ex-007 | medium | 利用一致收敛证明函数连续性 | uniform-convergence-properties |
| funseq-ex-008 | hard | 综合：$n^2xe^{-nx}$ 极限与积分不可交换的完整分析 | 全部 |

难度分布：basic ×3，medium ×4，hard ×1（共 8 题）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| uniform-convergence-diagram | 逐点 vs 一致收敛的几何对比（$x^n$ 在 $[0,1]$ 和 $[0,r]$） |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 13 章习题回填题号。

2. **funseq-ex-003**：利用"连续函数一致收敛极限连续"的逆否命题，是证明非一致收敛的优雅方法。$\sum x^2/(1+x^2)^n$ 极限在 $x=0$ 处跳跃，即为此类。

3. **funseq-ex-008（综合难题）**：$n^2 xe^{-nx}$ 展示了经典的"质量集中"现象（mass concentration）——函数在 $x=1/n$ 附近形成高峰，峰值 $ne^{-1}\to\infty$，积分保持为 $\sim 1$，但逐点趋零。是分析学中极限交换失败的标准反例。

4. **逐项微分条件**（funseq-ex-006）：$\sin(nx)/n\rightrightarrows 0$ 但导数 $\cos(nx)$ 连振荡都不收敛，完美说明"函数列一致收敛 $\not\Rightarrow$ 导数列一致收敛"。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
