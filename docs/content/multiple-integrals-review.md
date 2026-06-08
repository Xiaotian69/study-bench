# CC-20 重积分 — 内容审查备注

**章节：** 第 21 章 重积分  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| double-integral-concept | 二重积分的概念与计算（直角坐标） | 已写 |
| double-integral-polar | 二重积分的极坐标变换与变量变换 | 已写 |
| triple-integral | 三重积分与重积分应用 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| mi-ex-001 | basic | 交换积分顺序（含 $e^{x^2}$ 和合并区域） | double-integral-concept |
| mi-ex-002 | medium | 直角坐标+极坐标二重积分（圆区域） | double-integral-polar |
| mi-ex-003 | medium | 高斯积分 $\int_0^{+\infty}e^{-x^2}\mathrm{d}x=\sqrt{\pi}/2$（极坐标法） | double-integral-polar |
| mi-ex-004 | medium | 仿射变换 $u=y-x,v=y+x$，Jacobi=1/2 | double-integral-polar |
| mi-ex-005 | medium | 球坐标三重积分（半球 $\iiint z\,\mathrm{d}V=\pi R^4/4$） | triple-integral |
| mi-ex-006 | medium | 柱坐标三重积分（倾斜顶面柱体体积 $=\pi aR^2$） | triple-integral |
| mi-ex-007 | basic | 二重积分求质心（抛物线区域） | double-integral-concept |
| mi-ex-008 | hard | 球坐标锥面截球体积（$\pi a^3(2-\sqrt{2})/3$） | triple-integral |

难度分布：basic ×3，medium ×4，hard ×1（共 8 题）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| double-integral-region-diagram | $X$-型/$Y$-型区域与极坐标面积元素 $r\,\mathrm{d}r\,\mathrm{d}\theta$ |

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 21 章习题回填题号。

2. **mi-ex-003（高斯积分）**：经典结果 $\int_0^{+\infty}e^{-x^2}\mathrm{d}x=\sqrt{\pi}/2$，全平面积分 $\iint_{\mathbb{R}^2}e^{-(x^2+y^2)}\mathrm{d}A=\pi$。注意 $I=\int_0^{+\infty}$（非 $-\infty$ 到 $+\infty$），$I^2$ 是第一象限积分 $=\pi/4$（不是全平面 $\pi$）。

3. **mi-ex-006（柱坐标体积）**：倾斜顶面 $z=a+bx$ 的体积与 $z=a$ 相同（$=\pi aR^2$），因为 $\int_0^{2\pi}\cos\theta\,\mathrm{d}\theta=0$。这是对称性消去斜率项的直觉验证。

4. **mi-ex-008（锥面截球）**：锥面 $z=\sqrt{x^2+y^2}$ 的球坐标表示为 $\varphi=\pi/4$（$\tan\varphi=1$）。"锥面之上"（$z\geq\sqrt{x^2+y^2}$）对应 $\varphi\leq\pi/4$（更靠近 $z$ 轴）。

5. **极坐标 Jacobi**：$\mathrm{d}A=r\,\mathrm{d}r\,\mathrm{d}\theta$（不是 $\mathrm{d}r\,\mathrm{d}\theta$），球坐标 $\mathrm{d}V=\rho^2\sin\varphi\,\mathrm{d}\rho\,\mathrm{d}\varphi\,\mathrm{d}\theta$——两个最常犯的遗漏错误。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
