# CC-5 微分中值定理及其应用 — 内容审查备注

**章节：** 第 6 章 微分中值定理及其应用  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| rolle-lagrange-theorems | Rolle 定理与 Lagrange 中值定理 | 已写 |
| cauchy-lhopital | Cauchy 中值定理与 L'Hôpital 法则 | 已写 |
| taylor-formula | Taylor 公式 | 已写 |
| monotonicity-extrema | 函数的单调性与极值 | 已写 |
| convexity-inflection | 函数的凸性与拐点 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| mvt-ex-001 | basic | 中值定理直接应用 | rolle-lagrange-theorems |
| mvt-ex-002 | medium | 用 Lagrange 定理证不等式 | rolle-lagrange-theorems |
| mvt-ex-003 | basic | L'Hôpital 法则（0/0 型） | cauchy-lhopital |
| mvt-ex-004 | medium | 0^0 型不定式 | cauchy-lhopital |
| mvt-ex-005 | medium | Taylor 展开乘积（到 x^4） | taylor-formula |
| mvt-ex-006 | hard | Taylor 展开求极限 | taylor-formula |
| mvt-ex-007 | basic | 求单调区间和极值 | monotonicity-extrema |
| mvt-ex-008 | medium | 闭区间最大最小值（含不可导点） | monotonicity-extrema |
| mvt-ex-009 | basic | 凹凸区间和拐点 | convexity-inflection |
| mvt-ex-010 | hard | 综合函数分析（极值+凹凸+渐近线） | convexity-inflection, monotonicity-extrema |

难度分布：basic ×4，medium ×4，hard ×2（共 10 题，满足 ≥8 题要求）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| lagrange-mvt-illustration | Lagrange 定理几何意义：割线与切线平行 |
| monotonicity-extrema-diagram | 单调性、极值、凹凸性、拐点综合示意 |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 6 章习题回填题号。

2. **LaTeX 约定**：章节/练习 JSON 使用四反斜线；图示 JSON 使用两反斜线。已按约定执行。

3. **L'Hôpital 局限性（ex-004 和 KP 均已提及）**：$f'/g'$ 极限不存在时，不能断言 $f/g$ 极限不存在。这是数学分析课中的高频考点，已在 commonMistakes 中标注。

4. **Taylor 公式两种余项**：本章 KP 和练习均强调 Peano 余项用于求极限、Lagrange 余项用于误差估算。ex-005 和 ex-006 分别对应乘积展开和求极限场景。

5. **凹凸性术语约定**：中文教材"下凸（凹）"=$f''>0$（向上开口）和"上凸（凸）"=$f''<0$（向下开口）的定义已在 KP 中明确说明，避免中文约定混淆。

6. **ex-010**（函数 $x/(1+x^2)$ 综合分析）是标准"综合题"，覆盖极值+凹凸+渐近线三个方面，适合作为章末综合练习。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 补充 Rolle 定理的直接例题（可选，目前 ex-001 是 Lagrange，可加一道 Rolle）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
