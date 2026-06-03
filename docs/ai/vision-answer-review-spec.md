# 手写答案视觉批改规范

日期：2026-06-02
对应任务包：3（手写答案视觉批改规范）
类型：`lib/ai/vision-contract.ts`
关联实现：`lib/ai/tutorRuntime.ts`、`lib/ai/tutorClient.ts`、`components/course/ExercisePanel.tsx`

本规范定义“学生上传的手写答案图片如何进入 AI 批改”的协议。它不实现 UI，也不直接调用模型，而是为视觉批改流程给出可落地的契约与边界。

---

## 1. 当前实现现状（先对齐，再扩展）

练习区（`components/course/ExercisePanel.tsx`）目前的行为：

- 用户可“拍照/上传答案”，图片仅作浏览器预览（`URL.createObjectURL`），不落盘、不入库、不进 git。
- 单张图片限制 8MB，只接受 `image/*`，可逐张移除。
- 提交批改时，`lib/ai/tutorClient.ts` 的 `buildTutorImageAttachments` 用 `FileReader` 把图片编码为 data URL，封装为 `TutorImageAttachmentPayload`，**和文本答案一起**发给视觉模型。
- `lib/ai/tutorRuntime.ts` 把图片作为 `image_url` 内容拼进 chat 消息，系统提示已要求模型“先识别图片转写为 LaTeX，再批改；看不清要说明不确定位置”。

也就是说，**已实现的是“转写 + 批改”合并在一次调用里的直连视觉路径**。本规范在此基础上定义一个更细的分阶段契约，供需要单独检查/纠正转写结果时演进，二者并存：

- 直连路径：快、调用少，适合 MVP。
- 分阶段路径（本规范）：把转写结果显式产出，便于人工确认、错题记录与降级。

## 2. 三阶段批改流程

```text
图片附件 -> OCR/数学转写 -> 合并文本答案 -> grade 任务批改
```

| 阶段 | `VisionReviewStage` | 输入 | 输出 |
| --- | --- | --- | --- |
| 1. OCR | `ocr` | `AnswerImageAttachment[]` + 视觉模型 | 图片中的原始文字/符号读取 |
| 2. 数学转写 | `math-transcription` | OCR 结果 | 统一为 LaTeX 的 `transcribedAnswer` + `uncertainSegments` |
| 3. 批改 | `grading` | 合并后的文本答案 + 题目 `gradingRubric` | 复用 tutor `grade` 任务，产出 `TutorGradeResponse` |

阶段 1、2 在视觉模型一次调用中合并完成是允许的（即当前直连实现）；关键是**产出可见的 `transcribedAnswer` 与 `uncertainSegments`**，而不是把识别结果藏在批改里。

合并规则：

- 若学生既有文本答案又有图片：以文本为主，转写内容作为补充/对照。
- 若只有图片：`transcribedAnswer` 即作为送入 `grade` 的学生答案。
- 转写结果中的数学表达统一为 LaTeX，与讲义、题面一致。

## 3. 契约类型

见 `lib/ai/vision-contract.ts`：

- `AnswerImageAttachment`：客户端图片元数据（**不含像素/ data URL**，保护隐私，不持久化）。
- `VisionAnswerReviewRequest`：`{ exerciseId, knowledgePointId, textAnswer, attachments, expectedRubric }`。`expectedRubric` 复制题目 `gradingRubric`，确保最终评分锚定课程数据。
- `VisionAnswerReviewResult`：`{ transcribedAnswer, uncertainSegments, stage, feedback }`。
- `visionAttachmentLimits`：与已实现 UI 一致的 8MB / png·jpeg·webp 限制。

与实现层 `TutorImageAttachmentPayload`（`{ id, name, mimeType, sizeBytes, dataUrl }`）的关系：后者是**传输载荷**（含一次调用所需的 data URL），前者是**契约元数据**。同一张图在 UI 侧是 `AnswerImageAttachment`，在发往模型的瞬间被编码成 `TutorImageAttachmentPayload`。

## 4. 硬性限制

1. 图片**只用于学生自己的答案**，不得用于上传教材、书页或题目原文。
2. 单张图片建议限制在 **8MB** 以内；超限的图片应被跳过并提示用户（当前 UI 已实现）。
3. 仅允许 `image/png`、`image/jpeg`、`image/webp`。
4. 模型看不清局部时，**必须**在 `uncertainSegments` 中列出不确定片段，不能假装识别准确。
5. 转写后的数学表达统一成 **LaTeX**。
6. 最终评分仍依据题目 `gradingRubric`（即 `expectedRubric`），**不是视觉模型自由打分**；视觉模型只负责把图片变成可批改的文本。
7. 不引入后端文件存储；不把任何用户答案图片写入 git 或服务端磁盘。
8. data URL 仅在单次批改请求中存在，请求结束即可丢弃；日志中不得打印图片内容或 API Key。

## 5. 降级与异常

- 视觉模型不可用或解析失败时，按 `docs/ai/tutor-runtime-contract.md` 第 4 节的 `grade` 降级处理：返回 `partially_correct`、`score=0`、明确说明“无法完成自动批改”，绝不编造评分。
- 若 `uncertainSegments` 非空，前端应展示这些不确定片段，引导用户补充文本或重拍更清晰的照片，而不是直接给出可能错误的批改。
- 图片全部超限或类型不符时，等价于“无图片”，按纯文本答案流程处理。

## 6. 对主 AI（任务包 6）的衔接

- 当前直连实现已满足 MVP；若要落地分阶段契约，可在 API route 增加一个 `vision-review` 子流程：先调用一次模型只产出 `VisionAnswerReviewResult`（transcription + uncertainSegments），前端确认后再走 `grade`。
- `expectedRubric` 始终从课程内容的 `exercise.gradingRubric` 注入，不接受前端自定义评分标准。
