# CC-6 实数的完备性 — 内容审查备注

**章节：** 第 7 章 实数的完备性  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| completeness-axioms | 确界原理与实数完备性 | 已写 |
| nested-interval-theorem | 闭区间套定理与 Cauchy 收敛准则 | 已写 |
| bolzano-weierstrass | Bolzano–Weierstrass 定理 | 已写 |
| uniform-continuity | 一致连续性 | 已写 |
| closed-interval-theorems | 闭区间上连续函数的性质（严格证明） | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| completeness-ex-001 | basic | 上确界计算与验证 | completeness-axioms |
| completeness-ex-002 | basic | Cauchy 准则判断级数收敛 | nested-interval-theorem |
| completeness-ex-003 | medium | 相邻差趋零数列的收敛性（Cauchy 准则） | nested-interval-theorem |
| completeness-ex-004 | medium | B–W 定理 + 取极限得方程 | bolzano-weierstrass |
| completeness-ex-005 | medium | 一致连续性证明（sin x 在 R 上） | uniform-continuity |
| completeness-ex-006 | basic | 有界性定理（反证 + B–W） | closed-interval-theorems |
| completeness-ex-007 | medium | 零点定理严格证明（确界法） | closed-interval-theorems |
| completeness-ex-008 | hard | 反例构造：最值定理条件不可少 | closed-interval-theorems |

难度分布：basic ×3，medium ×4，hard ×1（共 8 题，满足 ≥8 题要求）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| nested-intervals-diagram | 闭区间套收缩趋向单点 |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 7 章习题回填题号。

2. **LaTeX 约定**：章节/练习 JSON 使用四反斜线；图示 JSON 使用两反斜线。已按约定执行。

3. **本章定理体系**：本章 KP 覆盖了五个互相等价的完备性定理，以确界原理为根基。KP 之间有明确的推导链：确界原理 → 单调有界（已在数列极限章）→ 闭区间套 → B–W → Cauchy 准则；另一路：确界原理 → 最值/有界/零点定理（用 B–W）、一致连续性（Cantor 定理）。

4. **一致连续性（completeness-ex-005）**：$\sin x$ 在整个 $\mathbb{R}$ 上一致连续是重要例子，证明用 $|\sin x_1 - \sin x_2| \le |x_1-x_2|$，取 $\delta=\varepsilon$ 即可。这比闭区间更强，因为 $\sin x$ 有界。

5. **反例题 completeness-ex-008**：两个反例覆盖"缺连续性"和"缺闭区间"两种情形，适合帮助学生深刻理解最值定理的必要性。

6. **Heine–Borel 定理**（有限覆盖定理）：在本 KP 体系中略去，只在 Cantor 定理（一致连续性）证明中提及作为另一种方法，暂不单独作为 KP，待下一轮内容迭代时补充。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 考虑补充 Heine–Borel 定理 KP（与确界原理等价，用于一致连续性另一种证明）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
