# Study Bench

![Study Bench——把教材变成有引导的学习过程](./docs/assets/hero.png)

[English](./README.md) · **简体中文**

[![Build](https://img.shields.io/badge/build-npm%20run%20validate%3Aall-2563eb?logo=npm)](#验证)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-111827?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-16a34a)](./LICENSE)

Study Bench 是一个 AI 学习工作台：按照教材顺序阅读聚焦讲义、回答引导问题、完成练习、获得反馈，并在本地保留掌握度记录。

**[打开在线演示](https://study-bench.vercel.app)**

## 完整学习闭环

许多学习工具把阅读、解题和 AI 对话分散在不同位置。Study Bench 将它们围绕同一个知识点组织起来，让导师知道你正在学习什么，也让练习紧跟引入概念的讲义。

```text
教材顺序 → 讲义 → 苏格拉底式追问 → 练习 → AI 反馈 → 本地掌握度
```

当前产品是一套中文数学分析学习工作台。课程导航遵循上下两册、共 22 章的教材目录；每个学习页面则把讲义、问题、练习和导师放在同一个工作区中。

## 你可以做什么

- 按教材顺序浏览上下两册、章节和知识点。
- 阅读结构化讲解、学习目标、定义、定理和证明思路，并用 KaTeX 渲染数学公式。
- 按需展开教学图示和苏格拉底式问题，从不同角度理解概念。
- 选择练习、逐层查看提示，并对照评分要点。
- 提交文字解答、每张不超过 8 MB 的答案图片，或同时提交两者接受 AI 评阅。
- 配置 OpenAI-compatible、DeepSeek、Xiaomi MiMo 或 Gemini 预设，并按需覆盖模型和 Base URL。
- 无需账户或应用数据库，在浏览器中保留作答历史和掌握状态。

## 学习流程

1. 从课程目录选择分册和章节。
2. 按顺序切换本章知识点。
3. 阅读讲义，并通过 KaTeX 渲染行内或独立数学公式。
4. 展开图示和苏格拉底式问题，检验自己是否真正理解。
5. 选择练习，输入或拍摄解答，只在需要时逐层获取提示。
6. 把答案发送给已配置模型，获得分数、针对性反馈、遗漏要点和掌握度建议。
7. 根据浏览器本地保存的掌握度标记回顾章节。

## 界面截图

### 学习工作台

![包含教材导航、讲义和 AI 导师的三栏学习工作台](./docs/assets/screenshots/learning-workbench.png)

### 练习与提示复盘

![包含合成 epsilon-delta 解答与分层提示的练习工作区](./docs/assets/screenshots/exercise-review.png)

### AI 导师设置

![AI 导师的提供商、模型、Base URL 和空白 API Key 设置](./docs/assets/screenshots/ai-tutor-settings.png)

### 移动端学习视图

<img src="./docs/assets/screenshots/mobile-learning.png" alt="390×844 移动端视口中的 Study Bench 学习内容" width="390" />

## AI 导师与隐私模型

Study Bench 采用自备密钥模式，本身不提供 API Key。提供商、模型、Base URL 和 API Key 设置保存在浏览器的 `localStorage` 中。掌握状态、文字答案、作答元数据和返回反馈也保存在本地；应用没有数据库或账户系统。

当你向导师提问或提交答案时，浏览器会把所选设置（包括 API Key）及相关学习上下文发送到 Next.js 服务端路由，再由该路由转发给已配置的模型提供商。答案图片会在浏览器中转换为请求数据并转发用于评阅；应用不会把图片写入本地进度记录。

因此，部署运营方和模型提供商都属于信任边界。请先查看双方政策，使用受限密钥；对于不希望经过第三方托管演示的凭据，建议自行部署。不要把密钥提交到仓库。

## 课程内容

课程材料以结构化 JSON 维护在 `content/courses/math-analysis/` 中，与界面代码分离。课程注册表对应上下两册、共 22 章的数学分析顺序。

- **样板完成：**数列极限、函数极限和函数的连续性。
- **当前默认章节：**数列极限，包含 8 个知识点、8 道练习和 6 个教学图示。
- **草稿覆盖：**其余章节条目及其结构化材料仍明确标记为草稿，不会被描述为完整内容。

仓库只包含整理后的学习材料，不包含教材源文件。教材 PDF 已通过 `.gitignore` 明确排除，不会在这里提交或分发。

## 快速开始

```bash
git clone https://github.com/Xiaotian69/study-bench.git
cd study-bench
npm ci
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。无需模型密钥即可浏览课程；AI 对话和答案评阅需要配置兼容的模型提供商。

## 验证

运行完整的内容、导师契约、API 接线、图像评阅、进度状态、掌握状态及生产构建检查：

```bash
npm run validate:all
```

也可以单独运行 [`package.json`](./package.json) 中的各个 `validate:*` 脚本。

## 项目结构

```text
app/                              Next.js App Router 页面与服务端路由
components/course/                课程、练习、图示与导师界面
content/courses/math-analysis/    上下两册结构化课程 JSON
lib/ai/                           导师契约、提供商运行时与客户端
lib/course/                       课程注册、加载与选择逻辑
lib/progress/                     浏览器设置与本地掌握度记录
scripts/                          内容、集成、状态与构建验证
docs/assets/                      README 截图与确定性视觉素材
```

## 路线图

- 将其余草稿章节扩展到样板完成深度。
- 增强自动化浏览器与响应式布局回归覆盖。
- 在不改变本地优先默认方式的前提下，探索可选的进度导出或同步。

路线图内容属于未来工作，当前产品尚未提供。

## 许可证

项目采用 [MIT License](./LICENSE)。课程摘录和改编练习可能涉及各自来源的权利边界；教材 PDF 不属于本仓库内容。
