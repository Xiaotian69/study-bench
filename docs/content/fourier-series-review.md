# CC-14 傅里叶级数 — 内容审查备注

**章节：** 第 15 章 傅里叶级数  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| fourier-series-concept | 傅里叶级数的概念与 Fourier 系数 | 已写 |
| fourier-convergence | Fourier 级数的收敛定理 | 已写 |
| fourier-general-period | 以 $2l$ 为周期的 Fourier 展开 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| fourier-ex-001 | basic | 矩形波 Fourier 系数 + 间断点收敛值 | fourier-series-concept |
| fourier-ex-002 | basic | $x^2$ 偶函数展开，分部积分 | fourier-series-concept |
| fourier-ex-003 | basic | 代入特殊点推出 Basel 公式及 $\sum(-1)^n/n^2$ | fourier-convergence |
| fourier-ex-004 | medium | Parseval 等式求 $\sum 1/n^4=\pi^4/90$ | fourier-convergence |
| fourier-ex-005 | medium | 锯齿波 + Dirichlet 定理 + Leibniz 公式推导 | fourier-convergence |
| fourier-ex-006 | basic | $x(l-x)$ 正弦级数（$[0,l]$，三次分部积分） | fourier-general-period |
| fourier-ex-007 | medium | $f(x)=x$ 在 $[0,l]$ 正弦/余弦双展开，端点比较 | fourier-general-period |
| fourier-ex-008 | hard | $e^x$ 周期为 $2$ 的展开，端点收敛到 $\cosh 1$，双曲余切公式起点 | fourier-general-period |

难度分布：basic ×4，medium ×3，hard ×1（共 8 题）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| fourier-partial-sum-diagram | 方波 Fourier 部分和与 Gibbs 现象（$S_1,S_5,S_{15},S_{51}$） |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 15 章习题回填题号。

2. **fourier-ex-003 + fourier-ex-004 联系**：这两题合起来用同一函数 $x^2$ 给出 Basel 问题（$\sum 1/n^2=\pi^2/6$）和 $\sum 1/n^4=\pi^4/90$ 两个经典结果——一个用代点法，另一个用 Parseval 等式，体现 Fourier 分析的两条主线。

3. **fourier-ex-005（Leibniz 公式）**：从 $f(x)=x$ 的 Fourier 展开代入 $x=\pi/2$ 推出，展示 Fourier 级数"数学炼金术"——从几何上简单的锯齿波导出 $\pi$ 的精确表达式。

4. **fourier-ex-008（$e^x$ 展开）**：难点在于 $T=2$（$l=1$，$\omega_0=\pi$）时系数公式中积分区间为 $[-1,1]$，与 $[-\pi,\pi]$ 区间不同，需注意基频 $\pi$。

5. **Gibbs 现象**（fourier-partial-sum-diagram）：约 $9\%$ 超调是 Fourier 近似固有局限，强调逐点收敛与一致收敛的区别。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
