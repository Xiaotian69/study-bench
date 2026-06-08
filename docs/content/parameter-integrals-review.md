# CC-18 含参量积分 — 内容审查备注

**章节：** 第 19 章 含参量积分  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| proper-parameter-integral | 含参量正常积分 | 已写 |
| improper-parameter-integral | 含参量反常积分（一致收敛） | 已写 |
| euler-integrals | 欧拉积分（B 函数和 Γ 函数） | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| pi-ex-001 | basic | Leibniz 积分法则：$\int_0^1(x^\alpha-1)/\ln x$ | proper-parameter-integral |
| pi-ex-002 | medium | 变上下限含参量积分导数 | proper-parameter-integral |
| pi-ex-003 | medium | 含参量反常积分一致收敛性判断（两例） | improper-parameter-integral |
| pi-ex-004 | hard | Dirichlet 积分 $\int_0^\infty\sin x/x=\pi/2$ 的推导 | improper-parameter-integral |
| pi-ex-005 | basic | Γ 函数计算（含换元） | euler-integrals |
| pi-ex-006 | basic | B 函数计算（含三角换元、余元公式） | euler-integrals |
| pi-ex-007 | medium | Wallis 公式与 $I_n$ 系列 | euler-integrals |
| pi-ex-008 | medium | $\int_0^1(\ln(1/x))^n=n!$（Γ 函数换元） | euler-integrals |

难度分布：basic ×3，medium ×4，hard ×1（共 8 题）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| gamma-function-diagram | Γ 函数图像（整数点=阶乘，$\Gamma(1/2)=\sqrt{\pi}$）|

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 19 章习题回填题号。

2. **pi-ex-004（Dirichlet 积分）**：这是含参量积分理论的明星应用题，展示引入参数 $\alpha$ 后对 $\alpha$ 微分、积分、再令 $\alpha\to 0$ 得出 $\pi/2$ 的完整推导链。是全章最美的结果之一。

3. **pi-ex-006（余元公式）**：$\Gamma(1/4)\Gamma(3/4)=\pi/\sin(\pi/4)=\pi\sqrt{2}$ 的余元公式较高级，通常需要复分析证明。若学生未学到余元公式，可将第3小题改为直接跳过或替换为 $B(1/3,2/3)$。

4. **一致收敛的强调**：pi-ex-003 专门区分"在 $(0,1]$ 上不一致收敛"和"在 $[\alpha_0,\infty)$ 上一致收敛"，这是教材的重点之一。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
