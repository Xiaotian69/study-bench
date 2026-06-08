# CC-11 数项级数 — 内容审查备注

**章节：** 第 12 章 数项级数  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| series-concept | 数项级数的概念与基本性质 | 已写 |
| positive-term-series-tests | 正项级数的收敛判别法 | 已写 |
| general-term-series-tests | 一般项级数的收敛判别 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| series-ex-001 | basic | 裂项法求级数的和（两题） | series-concept |
| series-ex-002 | basic | 用必要条件判断发散（三题） | series-concept |
| series-ex-003 | basic | 比较判别法（直接/极限，三题） | positive-term-series-tests |
| series-ex-004 | basic | 比值判别法（三题） | positive-term-series-tests |
| series-ex-005 | medium | 根值判别法（三题，含失效分析） | positive-term-series-tests |
| series-ex-006 | basic | Leibniz 判别法与绝对/条件收敛（三题） | general-term-series-tests |
| series-ex-007 | medium | Dirichlet 判别法（级数版，两题） | general-term-series-tests |
| series-ex-008 | medium | 综合判别：比值/积分/Leibniz 混用 | positive-term-series-tests, general-term-series-tests |
| series-ex-009 | hard | 综合难题：收敛级数性质证明+反例构造 | 全部 |

难度分布：basic ×4，medium ×4，hard ×1（共 9 题，满足 ≥8 题要求）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| series-partial-sum-diagram | 收敛/发散级数部分和对比图（$\sum 1/n^2$ vs 调和级数） |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 12 章习题回填题号。

2. **LaTeX 约定**：章节/练习 JSON 使用四反斜线；图示 JSON 使用两反斜线。已按约定执行。

3. **series-ex-009（综合难题）**：(1) 用 AM-GM 给出上界，(2) 用余项估计 $r_n\geq na_{2n}$ 证明单调递减时 $na_n\to 0$，(3) 构造反例（完全平方位置打孔）。这三问综合考查级数理论深度，是本章核心难题。

4. **Dirichlet 判别法（series-ex-007）**：级数版与反常积分版结构相同但对象不同，注意区分。$\sum\sin n/n$ 收敛的证明中，$\sin k$ 的部分和有界是关键（用等差角和公式）。

5. **比值=1 的陷阱**：$\sum 1/n^2$ 用比值/根值得 $r=1$，需提醒学生切换到 $p$ 判别或比较法。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
