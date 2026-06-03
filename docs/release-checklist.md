# Release Checklist

日期：2026-06-03

## 当前 MVP 范围

- 学习工作台首页直接进入《数学分析》上册样板章。
- KaTeX 渲染讲义、题面、提示和 AI 反馈中的公式。
- AI 老师支持 OpenAI-compatible、DeepSeek、Xiaomi MiMo、Gemini 预设。
- 用户 API Key 只保存在浏览器 localStorage，不写入仓库或服务端日志。
- 练习区支持文本答案、手写答案图片上传预览、文本批改和视觉模型图片批改。
- 批改后记录本地掌握度，左侧目录和练习区显示掌握状态。

## 发布前验证

在发布或给别人测试前运行：

```powershell
npm run validate:all
```

该命令会依次检查：

- 课程内容交叉引用。
- 模型供应商预设。
- AI 老师运行时契约。
- `/api/tutor` 路由与 OpenAI-compatible adapter。
- 练习区 AI 批改接线。
- 手写答案图片视觉批改接线。
- 本地进度状态接线。
- Next.js 生产构建。

## 本地 smoke test

启动本地服务：

```powershell
npm run dev -- -p 3000
```

打开：

```text
http://localhost:3000
```

人工检查：

- 页面返回 200。
- 左侧目录显示《数学分析 上册》和“数列极限”样板状态。
- 公式显示为 KaTeX，不出现裸 `$x_n$`。
- 练习区显示“提交给 AI 批改”。
- 练习区显示“拍照/上传答案”。
- 右侧 AI 老师能选择 DeepSeek 和 Xiaomi MiMo。
- Base URL 输入框存在。
- 未填写 API Key 时，提交批改会提示先保存模型和 API Key。

测速命令：

```powershell
Measure-Command { Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing }
```

记录 `TotalMilliseconds`，同一机器连续测 3 次取中位数。

## 部署注意

- 第一版可以先部署为普通 Next.js Web 应用。
- `/api/tutor` 会使用用户从浏览器传来的 API Key 调用对应模型供应商。
- 不要在部署平台配置共享 API Key；当前产品策略是用户自带 Key。
- 不要开启会记录请求 body 的平台日志，避免保存用户答案、图片 data URL 或 API Key。
- 上传图片当前以 data URL 进入请求体，适合小图测试；生产版应限制单张 8MB 以内，后续可改为临时对象存储。
- 教材 PDF 不进入仓库，也不公开给用户下载。
- Next 构建在当前 Windows 环境会出现 SWC 原生包警告，但构建 exit code 为 0；如果部署平台是 Linux，该警告通常不会出现。

## 交付给测试者的话术

```text
这是数学分析 AI 同步学习助手的早期测试版。你需要自己准备模型平台 API Key，在右侧 AI 老师区域选择模型供应商并保存。当前样板内容是“数列极限”，可以看讲义、做练习、上传手写答案照片，并让 AI 按评分要点批改。
```
