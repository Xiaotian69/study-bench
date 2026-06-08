# CC-4 导数和微分 — 内容审查备注

**章节：** 第 5 章 导数和微分  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| derivative-definition | 导数的定义 | 已写 |
| derivative-geometric-meaning | 导数的几何意义与物理意义 | 已写 |
| derivative-rules-basic | 基本求导法则 | 已写 |
| derivative-table | 基本初等函数的导数公式 | 已写 |
| implicit-parametric-derivatives | 隐函数与参变量函数的导数 | 已写 |
| higher-order-derivatives | 高阶导数 | 已写 |
| differential-definition | 微分的概念 | 已写 |
| differential-approximation | 微分的近似计算 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| deriv-ex-001 | basic | 定义法求导 | derivative-definition |
| deriv-ex-002 | basic | 判断可导性（绝对值函数） | derivative-definition |
| deriv-ex-003 | basic | 切线/法线方程 | derivative-geometric-meaning |
| deriv-ex-004 | basic | 乘积/商法则 | derivative-rules-basic, derivative-table |
| deriv-ex-005 | medium | 链式法则（多层复合） | derivative-rules-basic |
| deriv-ex-006 | basic | 对数求导法（幂指函数） | derivative-table |
| deriv-ex-007 | medium | 参变量函数求导（摆线） | implicit-parametric-derivatives |
| deriv-ex-008 | medium | Leibniz 公式（高阶导数） | higher-order-derivatives |
| deriv-ex-009 | basic | 微分计算 | differential-definition |
| deriv-ex-010 | hard | 微分近似计算与误差分析 | differential-approximation |

难度分布：basic ×5，medium ×3，hard ×1（共 9 题，满足 ≥8 题要求）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| derivative-tangent-chord | 割线趋近切线，导数的几何意义 |
| differential-linear-approximation | 微分与增量的对比，切线近似曲线 |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 5 章习题回填题号。

2. **LaTeX 约定**：章节/练习 JSON 使用四反斜线；图示 JSON 使用两反斜线。已按约定执行。

3. **摆线 ex-007**：摆线 $x=a(t-\sin t)$，$y=a(1-\cos t)$ 是经典参变量曲线，在 $t=\pi/2$ 处斜率为 1，几何上对应摆线下行段与水平方向成 45°。

4. **Leibniz 公式 ex-008**：$(x^2 e^x)^{(n)}=e^x(x^2+2nx+n(n-1))$ 是 Leibniz 公式的典型例题，$f=x^2$ 使得求和只有三项非零，结果简洁。

5. **implicit-parametric-derivatives KP**：隐函数求导（$F(x,y)=0$ 两边对 $x$ 求导）未单独出题，合并在参变量 KP 中。若下一轮补充 1 道隐函数题（如圆或椭圆的切线）可提高该 KP 的覆盖密度。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 补充 1 道隐函数求导例题（可选）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
