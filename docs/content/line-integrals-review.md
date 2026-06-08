# CC-19 曲线积分 — 内容审查备注

**章节：** 第 20 章 曲线积分  
**文件日期：** 2026-06-08  
**状态：** draft

---

## 知识点覆盖

| KP id | 标题 | 状态 |
|---|---|---|
| first-type-line-integral | 第一型曲线积分（对弧长的积分） | 已写 |
| second-type-line-integral | 第二型曲线积分与 Green 公式 | 已写 |

## 练习题清单

| 题号 | 难度 | 类型 | 覆盖 KP |
|---|---|---|---|
| li-ex-001 | basic | 圆弧第一型积分（利用 $x^2+y^2=a^2$ 化简） | first-type-line-integral |
| li-ex-002 | medium | 螺旋线空间曲线第一型积分 | first-type-line-integral |
| li-ex-003 | basic | 抛物线第二型积分（参数化） | second-type-line-integral |
| li-ex-004 | medium | Green 公式（$Q_x-P_y=0$，积分为零） | second-type-line-integral |
| li-ex-005 | medium | 补线法 + Green 公式（半圆弧） | second-type-line-integral |
| li-ex-006 | medium | 恰当微分验证 + 势函数 + 路径无关积分 | second-type-line-integral |
| li-ex-007 | hard | 含奇点闭曲线积分（挖洞法，结果 $2\pi$） | second-type-line-integral |
| li-ex-008 | basic | Green 公式面积公式（椭圆 $\pi ab$，星形线 $3\pi a^2/8$） | second-type-line-integral |

难度分布：basic ×3，medium ×4，hard ×1（共 8 题）。

## 图示清单

| 图示 id | 用途 |
|---|---|
| green-formula-diagram | Green 公式正向边界与挖洞法示意（三图）|

## 内容注意事项

1. **题源说明**：所有题面自编或充分改写，sourceRef 标注"待核对题源"，正式上线前需对照教材第 20 章习题回填题号。

2. **li-ex-007（挖洞法）**：绕数（winding number）的本质：$\oint x\mathrm{d}y-y\mathrm{d}x/(x^2+y^2)=2\pi$ 对包含原点的任意正向简单闭曲线成立，对不包含原点的曲线为 $0$。这是复分析中围道积分的实分析对应，是本章最重要的结果之一。

3. **li-ex-005（补线法）**：$Q_x-P_y=1$ 的情形，Green 公式直接给出面积。补线 $L_0$ 在 $x$ 轴上，$P=0$（因为 $y=0,\sin 0=0$），积分为零，计算干净。

4. **第一型 vs 第二型**：两类积分的本质区别：第一型对弧长，与路径方向无关；第二型对坐标（向量场做功），与路径方向有关（反向积分变号）。

## 待办

- [ ] 核对题源（题号回填）
- [ ] 升级 status 为 `sample-ready`（待题源核对后）
