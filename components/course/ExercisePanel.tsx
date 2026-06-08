"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildTutorGradeEnvelope, buildTutorImageAttachments, requestTutorGrade } from "@/lib/ai/tutorClient";
import { MathText } from "@/components/math/MathText";
import type { TutorGradeResponse } from "@/lib/ai/tutor-contract";
import type { Exercise, KnowledgePoint } from "@/lib/course/types";
import {
  getKnowledgePointProgress,
  getMasteryLabel,
  loadCourseProgress,
  saveExerciseAttempt,
  type MasteryState
} from "@/lib/progress/masteryProgress";
import { loadTutorSettings } from "@/lib/progress/progressStore";

interface AnswerImage {
  id: string;
  name: string;
  url: string;
  file: File;
}

type GradingStatus = "idle" | "submitting" | "success" | "error";
const maxAnswerImageSizeLabel = "8MB";
const maxAnswerImageBytes = 8 * 1024 * 1024;

export function ExercisePanel({
  chapterId,
  courseId,
  exercises,
  knowledgePoint,
  sectionId,
  volumeId
}: {
  chapterId: string;
  courseId: string;
  exercises: Exercise[];
  knowledgePoint: KnowledgePoint;
  sectionId: string;
  volumeId: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [answer, setAnswer] = useState("");
  const [attachments, setAttachments] = useState<AnswerImage[]>([]);
  const [gradingStatus, setGradingStatus] = useState<GradingStatus>("idle");
  const [gradingError, setGradingError] = useState("");
  const [gradeResult, setGradeResult] = useState<TutorGradeResponse | null>(null);
  const [masteryState, setMasteryState] = useState<MasteryState>("not_started");
  const attachmentsRef = useRef<AnswerImage[]>([]);
  const activeExercise = exercises[activeIndex];

  const visibleHints = useMemo(() => {
    if (!activeExercise) return [];
    return activeExercise.hints.slice(0, hintLevel);
  }, [activeExercise, hintLevel]);

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    const progress = loadCourseProgress(courseId, volumeId);
    const record = getKnowledgePointProgress(progress, knowledgePoint.id);
    setMasteryState(record?.masteryState ?? "not_started");
  }, [courseId, knowledgePoint.id, volumeId]);

  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach((attachment) => URL.revokeObjectURL(attachment.url));
    };
  }, []);

  function resetAnswerState() {
    attachmentsRef.current.forEach((attachment) => URL.revokeObjectURL(attachment.url));
    attachmentsRef.current = [];
    setAttachments([]);
    setAnswer("");
    setHintLevel(0);
    setGradingStatus("idle");
    setGradingError("");
    setGradeResult(null);
  }

  function addAnswerImages(files: FileList | null) {
    if (!files?.length) return;

    const nextAttachments = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .filter((file) => file.size <= maxAnswerImageBytes)
      .map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
        file
      }));

    setAttachments((current) => [...current, ...nextAttachments]);

    const oversizedCount = Array.from(files).filter((file) => file.type.startsWith("image/") && file.size > maxAnswerImageBytes).length;
    if (oversizedCount > 0) {
      setGradingStatus("error");
      setGradingError(`有 ${oversizedCount} 张图片超过 ${maxAnswerImageSizeLabel}，已跳过。`);
    }
  }

  function removeAnswerImage(id: string) {
    setAttachments((current) => {
      const target = current.find((attachment) => attachment.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return current.filter((attachment) => attachment.id !== id);
    });
  }

  async function submitForAiGrading() {
    if (!activeExercise) return;

    if (!answer.trim() && attachments.length === 0) {
      setGradingStatus("error");
      setGradingError("请先写下你的解答，或上传手写答案照片，再提交给 AI 批改。");
      return;
    }

    const settings = loadTutorSettings();
    if (!settings.apiKey.trim()) {
      setGradingStatus("error");
      setGradingError("请先在右侧 AI 老师区域保存模型和 API Key。");
      return;
    }

    setGradingStatus("submitting");
    setGradingError("");
    setGradeResult(null);

    try {
      const studentAnswer = answer.trim() || "学生上传了手写答案照片，请根据图片转写后批改。";
      const imageAttachments = await buildTutorImageAttachments(attachments);
      const envelope = buildTutorGradeEnvelope({
        courseId,
        chapterId,
        sectionId,
        knowledgePoint,
        exercise: activeExercise,
        studentAnswer,
        hintLevelUsed: hintLevel
      });
      const result = await requestTutorGrade(settings, envelope, { imageAttachments });
      setGradeResult(result);
      const progress = saveExerciseAttempt({
        courseId,
        volumeId,
        knowledgePointId: knowledgePoint.id,
        knowledgePointIds: activeExercise.knowledgePointIds,
        exerciseId: activeExercise.id,
        answerText: studentAnswer,
        attachmentCount: attachments.length,
        hintLevelUsed: hintLevel,
        result
      });
      setMasteryState(getKnowledgePointProgress(progress, knowledgePoint.id)?.masteryState ?? result.masterySuggestion);
      setGradingStatus("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "tutor_grade_request_failed";
      setGradingStatus("error");
      setGradingError(`AI 批改暂时不可用：${message}`);
    }
  }

  if (!activeExercise) {
    return <section className="exercise-panel">当前知识点暂无练习。</section>;
  }

  return (
    <section className="exercise-panel">
      <div className="exercise-header">
        <p className="eyebrow">练习</p>
        <span className={`mastery-summary ${masteryState}`}>当前掌握状态：{getMasteryLabel(masteryState)}</span>
        <div className="exercise-tabs">
          {exercises.map((exercise, index) => (
            <button
              className={index === activeIndex ? "is-active" : ""}
              key={exercise.id}
              onClick={() => {
                setActiveIndex(index);
                resetAnswerState();
              }}
              type="button"
            >
              {exercise.difficulty === "basic" ? "基础" : exercise.difficulty === "medium" ? "中档" : "提升"}
            </button>
          ))}
        </div>
      </div>
      <h3>
        <MathText text={activeExercise.prompt} />
      </h3>
      <textarea
        aria-label="输入你的解答"
        onChange={(event) => setAnswer(event.target.value)}
        placeholder="在这里写你的思路、计算或证明..."
        value={answer}
      />
      <div className="answer-upload-row">
        <label className="upload-button">
          拍照/上传答案
          <input
            accept="image/*"
            capture="environment"
            className="sr-only"
            multiple
            onChange={(event) => {
              addAnswerImages(event.target.files);
              event.target.value = "";
            }}
            type="file"
          />
        </label>
        <span>支持手写答案照片，单张 {maxAnswerImageSizeLabel} 以内，可随文本答案提交给支持视觉的模型。</span>
      </div>
      {attachments.length > 0 && (
        <div className="answer-image-grid">
          {attachments.map((attachment) => (
            <figure className="answer-image-card" key={attachment.id}>
              <img alt={attachment.name} src={attachment.url} />
              <figcaption>
                <span>{attachment.name}</span>
                <button onClick={() => removeAnswerImage(attachment.id)} type="button">
                  移除
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      <div className="exercise-actions">
        <button onClick={() => setHintLevel((value) => Math.min(value + 1, activeExercise.hints.length))} type="button">
          获取提示
        </button>
        <button disabled={gradingStatus === "submitting"} onClick={submitForAiGrading} type="button">
          {gradingStatus === "submitting" ? "批改中..." : "提交给 AI 批改"}
        </button>
        <button type="button">对照评分要点</button>
      </div>
      {gradingError && <p className="grading-error">{gradingError}</p>}
      {gradeResult && (
        <section className={`grade-result-card ${gradeResult.verdict}`} aria-label="AI 批改结果">
          <div className="grade-result-heading">
            <strong>AI 批改结果</strong>
            <span>{gradeResult.score} 分</span>
          </div>
          <p>
            <MathText text={gradeResult.feedback} />
          </p>
          {gradeResult.missingKeyPoints.length > 0 && (
            <div>
              <strong>还缺这些要点</strong>
              <ul>
                {gradeResult.missingKeyPoints.map((item) => (
                  <li key={item}>
                    <MathText text={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
      {visibleHints.length > 0 && (
        <ul className="hint-list">
          {visibleHints.map((hint) => (
            <li key={hint}>
              <MathText text={hint} />
            </li>
          ))}
        </ul>
      )}
      <details>
        <summary>评分要点</summary>
        <ul>
          {activeExercise.gradingRubric.map((item) => (
            <li key={item}>
              <MathText text={item} />
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
