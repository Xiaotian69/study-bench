# CH-1 实数集与函数 — 内容审查备注

**章节：** 第 1 章 实数集与函数  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| real-number-system | 实数与实数的性质 | 已写 |
| supremum-infimum | 数集·确界原理 | 已写 |
| function-concept | 函数的概念与表示 | 已写 |
| function-properties | 函数的特性：单调、奇偶、有界、周期 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| rnf-ex-001 | basic | 绝对值不等式分段化简与估计 | real-number-system |
| rnf-ex-002 | basic | 确界求法（序列集 + 开区间） | supremum-infimum |
| rnf-ex-003 | basic | 定义域求法 + 复合函数定义域 | function-concept |
| rnf-ex-004 | basic | 反函数（双曲正弦 $\sinh$）+ 函数方程 | function-concept |
| rnf-ex-005 | basic | 奇偶性判断（含 $\ln(\sqrt{1+x^2}-x)$ 是奇函数） | function-properties |
| rnf-ex-006 | medium | 有界性（AM-GM）+ 周期函数之和的反例 | function-properties |
| rnf-ex-007 | medium | 确界原理：上极限 $\limsup$ 的构造与单调性证明 | supremum-infimum |
| rnf-ex-008 | basic | 分段函数复合：$f\circ g \neq g\circ f$ 的反例 | function-concept |

难度分布：basic ×6，medium ×2（共 8 题）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| function-properties-diagram | 函数四大特性（单调、奇偶、有界、周期）的四图对比 |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 1 章习题回填题号。

2. **rnf-ex-005（第1题）**：$f(x)=\ln(\sqrt{1+x^2}-x)$ 是奇函数——经典结论，来自 $f(x)+f(-x)=\ln[(\sqrt{1+x^2}-x)(\sqrt{1+x^2}+x)]=\ln 1=0$。即 $f(x)=-\ln(\sqrt{1+x^2}+x)=\ln(1/(\sqrt{1+x^2}+x))=\ln(\sqrt{1+x^2}-x)^{-1}\cdot(\sqrt{1+x^2}-x)$——实际上 $f^{-1}(x)=\sinh(x)$ 的对数形式即 $\arcsinh$，rnf-ex-004 第1题也涉及此结果。

3. **rnf-ex-006（周期函数之和）**：$\sin x + \sin(\sqrt{2}x)$ 无周期（周期比 $\sqrt{2}$ 为无理数）——这是学生常见误区，以为周期函数之和必为周期函数。

4. **确界原理的地位**：确界原理（rnf-ex-002）是实数完备性的等价叙述，后续将与区间套定理、Bolzano-Weierstrass 定理等一起在第 7 章（实数完备性）系统讨论。此处只需直觉理解即可。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
