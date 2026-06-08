# CC-21 曲面积分 — 内容审查备注

**章节：** 第 22 章 曲面积分  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| first-type-surface-integral | 第一型曲面积分（对面积的积分） | 已写 |
| second-type-surface-integral | 第二型曲面积分（对坐标的积分） | 已写 |
| gauss-stokes-formula | 高斯公式与斯托克斯公式 | 已写 |
| field-theory-intro | 场论初步 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| si-ex-001 | basic | 球面对称性 $\iint(x^2+y^2)\,\mathrm{d}S=8\pi R^4/3$ | first-type-surface-integral |
| si-ex-002 | basic | 抛物面面积 + 第一型积分（换元 $t=1+r^2$） | first-type-surface-integral |
| si-ex-003 | basic | 第二型：半球补底面+高斯（散度=3），圆柱侧面=0 | second-type-surface-integral |
| si-ex-004 | medium | 锥面补顶面+高斯（散度=1），结果 $-5\pi/3$ | second-type-surface-integral |
| si-ex-005 | basic | 高斯公式（球面 $x^3+y^3+z^3$，散度 $3r^2$，结果 $12\pi a^5/5$） | gauss-stokes-formula |
| si-ex-006 | medium | 斯托克斯（三角形边界，散度消去，结果 $-2$） | gauss-stokes-formula |
| si-ex-007 | hard | 高斯+挖球法（含原点奇点，$1/r^2$ 型，结果 $4\pi$） | gauss-stokes-formula |
| si-ex-008 | medium | 保守场势函数 + 调和函数验证（$\ln r$ vs $1/r$） | field-theory-intro |

难度分布：basic ×4，medium ×3，hard ×1（共 8 题）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| surface-integral-diagram | 两型曲面积分对比 + 法向量方向 + 高斯散度图 |
| gauss-stokes-diagram | 高斯补面法 + 斯托克斯右手定则 |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 22 章习题回填题号。

2. **si-ex-007（挖球法）**：三维版的"挖洞法"——含奇点时，散度为零但奇点处不可积，挖去小球后高斯公式给出大曲面积分 = 小球面积分（与曲面形状无关）。$I=4\pi$ 即静电学中点电荷的高斯定理。

3. **si-ex-008（调和函数）**：注意三维与二维的区别——二维调和函数是 $\ln r$（$r=\sqrt{x^2+y^2}$），三维调和函数是 $1/r$（$r=\sqrt{x^2+y^2+z^2}$）。这是常见的混淆。

4. **两型曲面积分核心区别**：
   - 第一型：$\mathrm{d}S>0$ 恒成立，与法向量方向无关，化为 $\sqrt{1+z_x^2+z_y^2}\,\mathrm{d}x\,\mathrm{d}y$（总正）。
   - 第二型：$\mathrm{d}x\,\mathrm{d}y=\cos\gamma\,\mathrm{d}S$（可正可负），反向变号。

5. **斯托克斯方向约定**：右手定则——拇指沿法向量，四指为边界正方向。从正法向一侧看边界为逆时针。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
