# CC-10 反常积分 — 内容审查备注

**章节：** 第 11 章 反常积分  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| improper-integral-concept | 反常积分的概念 | 已写 |
| improper-convergence-criteria | 反常积分的收敛判别法 | 已写 |
| gamma-function | Gamma 函数与重要反常积分 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| imp-ex-001 | basic | 无穷限反常积分计算 | improper-integral-concept |
| imp-ex-002 | basic | 瑕积分计算（含内部瑕点） | improper-integral-concept |
| imp-ex-003 | basic | 比较判别法 | improper-convergence-criteria |
| imp-ex-004 | medium | 极限比较判别法 | improper-convergence-criteria |
| imp-ex-005 | medium | Dirichlet 判别法与条件收敛 | improper-convergence-criteria |
| imp-ex-006 | basic | Gamma 函数递推计算 | gamma-function |
| imp-ex-007 | medium | 换元化为 Gamma 函数 | gamma-function |
| imp-ex-008 | hard | $\int_0^\infty x^{\alpha-1}/(1+x)$ 综合收敛性分析 | improper-convergence-criteria, improper-integral-concept |

难度分布：basic ×4，medium ×3，hard ×1（共 8 题，满足 ≥8 题要求）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| improper-integral-concept-diagram | 两类反常积分对比图（无穷限与瑕积分，$p>1$ vs $p<1$） |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 11 章习题回填题号。

2. **LaTeX 约定**：章节/练习 JSON 使用四反斜线；图示 JSON 使用两反斜线。已按约定执行。

3. **imp-ex-002 (2) 内部瑕点**：这是一个经典陷阱题，$\int_0^2 1/(x-1)^2$ 中 $x=1$ 是内部瑕点，若直接用 Newton-Leibniz 代入得 $-2$（错误），正确做法是分拆后发现单侧均发散。

4. **Dirichlet 判别法（imp-ex-005）**：证明 $\int_1^\infty \cos x/x$ 收敛的关键是 $\int_1^b \cos x\,\mathrm{d}x=\sin b-\sin 1$，这是**有界**的（不是趋零的），是 Dirichlet 条件。

5. **imp-ex-008（综合难题）**：即 Beta 函数的特例 $B(\alpha,1-\alpha)$，收敛条件 $0<\alpha<1$ 同时限制了两端行为。这道题训练"分两端分析"的方法论，是反常积分章节最重要的综合题型。

6. **Gaussian 积分**（imp-ex-007 (1)）：$\int_0^\infty e^{-x^2}=\sqrt{\pi}/2$ 的证明通过换元化为 Gamma 函数，但 $\Gamma(1/2)=\sqrt{\pi}$ 本身需要用重积分（下册内容）。在此给出结论，完整证明留到二重积分章节。

## 上册完成状态

完成 CC-10 后，数学分析上册（第 2-11 章）全部完成 draft 阶段：
- CH-2 数列极限（sample-ready）
- CH-3 函数极限（draft）
- CH-4 函数的连续性（draft）
- CH-5 导数和微分（draft）
- CH-6 微分中值定理（draft）
- CH-7 实数的完备性（draft）
- CH-8 不定积分（draft）
- CH-9 定积分（draft）
- CH-10 定积分的应用（draft）
- CH-11 反常积分（draft）

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
- [ ] CH-1 实数集与函数（尚为 planned）——可在下一阶段补充
