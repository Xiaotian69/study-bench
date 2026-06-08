# CC-8 定积分 — 内容审查备注

**章节：** 第 9 章 定积分  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| definite-integral-concept | 定积分的概念 | 已写 |
| integrability-conditions | 可积条件 | 已写 |
| definite-integral-properties | 定积分的性质 | 已写 |
| fundamental-theorem | 微积分学基本定理 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| defint-ex-001 | basic | 用定义计算 $\int_0^1 x\,\mathrm{d}x$ | definite-integral-concept |
| defint-ex-002 | basic | 极限化为定积分（两题） | definite-integral-concept |
| defint-ex-003 | basic | 判断可积性（Dirichlet/含瑕点） | integrability-conditions |
| defint-ex-004 | basic | 估值不等式 + 奇偶性简化 | definite-integral-properties |
| defint-ex-005 | medium | 积分不等式（Cauchy-Schwarz） | definite-integral-properties |
| defint-ex-006 | basic | Newton-Leibniz 与变上限求导 | fundamental-theorem |
| defint-ex-007 | medium | 换元法（三题） | fundamental-theorem |
| defint-ex-008 | medium | 分部积分法（三题） | fundamental-theorem |
| defint-ex-009 | medium | Wallis 公式递推 | fundamental-theorem |
| defint-ex-010 | hard | 变上限积分与极限综合分析 | fundamental-theorem, definite-integral-properties |

难度分布：basic ×4，medium ×5，hard ×1（共 10 题，满足 ≥8 题要求）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| riemann-sum-illustration | Riemann 和逼近过程（三幅，$n=4,8,\infty$） |
| fundamental-theorem-diagram | 变上限积分与 Newton-Leibniz 公式直观图 |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 9 章习题回填题号。

2. **LaTeX 约定**：章节/练习 JSON 使用四反斜线；图示 JSON 使用两反斜线。已按约定执行。

3. **可积性条件覆盖**：defint-ex-003 同时覆盖了"振幅和证明不可积"（Dirichlet 函数）和"有界+有限不连续点可积"两类，是本章最重要的判断题类型。

4. **变上限积分复合形式**：defint-ex-006 (2)(3) 覆盖了 $\int_0^{x^2}$ 和 $\int_{\sin x}^{\cos x}$ 两种复合形式，重点在于链式法则的应用。

5. **Wallis 公式**：defint-ex-009 引导学生自己推导递推公式，比直接给结论更有价值。$I_0=\pi/2$，$I_1=1$，递推步长为 2。

6. **defint-ex-010（综合难题）**：综合了变上限积分、L'Hôpital 法则、积分不等式，是对全章理解深度的考验。特别注意 (3) 中利用 $f$ 单调性估计 $\int f$ 与 $xf(x)$ 的大小关系。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
- [ ] 可考虑补充：定积分换元法中对称区间利用 $f(a+b-x)=f(x)$ 的技巧
