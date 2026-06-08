# CC-7 不定积分 — 内容审查备注

**章节：** 第 8 章 不定积分  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| antiderivative-concept | 原函数与不定积分 | 已写 |
| substitution-method | 换元积分法 | 已写 |
| integration-by-parts | 分部积分法 | 已写 |
| rational-function-integration | 有理函数的积分 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| indef-ex-001 | basic | 基本公式直接应用 | antiderivative-concept |
| indef-ex-002 | basic | 第一类换元（凑微分，两题） | substitution-method |
| indef-ex-003 | medium | 第二类换元（三角换元，$\\sqrt{x^2-1}$） | substitution-method |
| indef-ex-004 | basic | 分部积分（$x^2 \\ln x$） | integration-by-parts |
| indef-ex-005 | medium | 循环分部积分（$e^x \\sin x$） | integration-by-parts |
| indef-ex-006 | basic | 有理函数部分分式（不同一次因子） | rational-function-integration |
| indef-ex-007 | medium | 重因子部分分式 | rational-function-integration |
| indef-ex-008 | hard | 不可约二次因子部分分式 | rational-function-integration |

难度分布：basic ×4，medium ×3，hard ×1（共 8 题，满足 ≥8 题要求）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| trig-substitution-triangle | 三种三角换元的直角三角形辅图 |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 8 章习题回填题号。

2. **LaTeX 约定**：章节/练习 JSON 使用四反斜线；图示 JSON 使用两反斜线。已按约定执行。

3. **三角换元辅图**：indef-ex-003 用了 $x=\sec t$ 换元，对应 diagram `trig-substitution-triangle` 的 panel(c)。换回时画直角三角形（斜边 $x$，邻边 $1$，对边 $\sqrt{x^2-1}$），直接读出 $\sin t = \sqrt{x^2-1}/x$。

4. **循环分部积分（indef-ex-005）**：关键是两次分部选法一致（都把 $e^x$ 作为 $\mathrm{d}v$）。若选法不一致则结果消去变成 $0=0$，这是最常见的错误，已在 commonMistakes 中标注。

5. **有理函数积分覆盖三类**：indef-ex-006（不同一次因子）、indef-ex-007（重因子）、indef-ex-008（不可约二次因子），共同覆盖了部分分式分解的全部标准类型。

6. **万能换元（三角有理式）**：KP `rational-function-integration` 中提到，但未单独出题，可在下一轮补充一道 $\int R(\sin x, \cos x)\,\mathrm{d}x$ 型的练习。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 补充万能换元（$t=\tan(x/2)$）练习题（可选）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
