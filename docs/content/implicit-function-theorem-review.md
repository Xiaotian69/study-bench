# CC-17 隐函数定理及其应用 — 内容审查备注

**章节：** 第 18 章 隐函数定理及其应用  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| implicit-function | 隐函数定理 | 已写 |
| implicit-function-system | 方程组确定的隐函数 | 已写 |
| geometric-applications | 隐函数定理的几何应用 | 已写 |
| conditional-extrema | 条件极值与 Lagrange 乘数法 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| ift-ex-001 | basic | 隐函数定理条件验证 + 一/二阶导数 | implicit-function |
| ift-ex-002 | basic | 三元隐函数 $z_x,z_y,z_{xx}$ | implicit-function |
| ift-ex-003 | medium | 方程组 Jacobi 行列式 + 全微分法求偏导 | implicit-function-system |
| ift-ex-004 | basic | 曲面切平面和法线（椭球面） | geometric-applications |
| ift-ex-005 | medium | 空间曲线（方程组）的切线和法平面 | geometric-applications |
| ift-ex-006 | basic | Lagrange 方法：$x^2+y^2$ 在直线约束下极值 | conditional-extrema |
| ift-ex-007 | medium | 等周问题：周长固定矩形最大面积 | conditional-extrema |
| ift-ex-008 | hard | 椭球面到原点距离最大/最小（三元 Lagrange） | conditional-extrema |

难度分布：basic ×4，medium ×3，hard ×1（共 8 题）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| lagrange-geometric-diagram | Lagrange 乘数法几何直觉（等值线相切） |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 18 章习题回填题号。

2. **ift-ex-001（条件失败的情形）**：原始设计时发现 $F_y(0,0)=0$（Fourier 级数相关的函数），需重新设计函数确保验证有效。最终改用 $F=y^3+x-y$ 确保 $F_y(0,0)=-1\neq 0$。这道题的教育价值在于先检验条件、再应用公式。

3. **ift-ex-008（椭球面）**：三元 Lagrange 方法，候选点来自"只有一个坐标非零"的三类情形。结果直接给出椭球长/短半轴是最远/最近点，几何直观强。

4. **ift-ex-003（全微分法）**：全微分法建立线性方程组后用 Cramer 法则，是求偏导数的最实用方法，比死套 Jacobi 公式更清晰。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
