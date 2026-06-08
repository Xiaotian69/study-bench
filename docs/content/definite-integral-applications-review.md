# CC-9 定积分的应用 — 内容审查备注

**章节：** 第 10 章 定积分的应用  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| area-calculation | 平面图形的面积 | 已写 |
| volume-arc-length | 旋转体体积与弧长 | 已写 |
| physics-applications | 定积分在物理中的应用 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| app-ex-001 | basic | 曲线围成面积（直角坐标，含 $\ln x$） | area-calculation |
| app-ex-002 | medium | 极坐标面积（心形线、螺旋线） | area-calculation |
| app-ex-003 | basic | 旋转体体积（圆盘法/柱壳法/球体验证） | volume-arc-length |
| app-ex-004 | medium | 弧长计算（抛物线、摆线） | volume-arc-length |
| app-ex-005 | medium | 旋转曲面面积（球面积公式推导） | volume-arc-length |
| app-ex-006 | basic | 弹簧做功（Hooke 定律，三问） | physics-applications |
| app-ex-007 | medium | 梯形水闸压力 | physics-applications |
| app-ex-008 | hard | 质心坐标（抛物线与直线围成区域） | physics-applications, area-calculation |

难度分布：basic ×3，medium ×4，hard ×1（共 8 题，满足 ≥8 题要求）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| area-calculation-diagram | 直角/极坐标面积微元对比图 |
| volume-disk-diagram | 圆盘法与柱壳法对比图 |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 10 章习题回填题号。

2. **LaTeX 约定**：章节/练习 JSON 使用四反斜线；图示 JSON 使用两反斜线。已按约定执行。

3. **摆线弧长（app-ex-004）**：利用 $1-\cos t=2\sin^2(t/2)$ 是关键化简步骤，结果为 $8$（一拱弧长是旋转直径的 $8/2\pi$ 倍——注意摆线一拱长度 $8r$ 是直径 $2r$ 的 4 倍）。

4. **球面积（app-ex-005）**：根号与分母约分消去，$\sqrt{r^2-x^2}\cdot\frac{r}{\sqrt{r^2-x^2}}=r$，被积函数化为常数 $r$，非常优雅。

5. **质心计算（app-ex-008）**：$\bar{y}$ 的微元中，竖向细条的质心纵坐标是上下曲线的中点 $(x+x^2)/2$，这是均匀密度假设下细条内部均匀的体现，学生常犯忘记乘细条面积微元的错误。

6. **微元法的核心逻辑**：所有应用题都体现同一思路——"分割→近似→积分"。强调微元的近似误差是高阶无穷小（$o(\mathrm{d}x)$），这是合理性保证。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
- [ ] 可补充：Pappus 定理（旋转体体积 = 面积 × 质心轨迹长度），作为高阶拓展
