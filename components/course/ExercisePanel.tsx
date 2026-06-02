"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MathText } from "@/components/math/MathText";
import type { Exercise } from "@/lib/course/types";

interface AnswerImage {
  id: string;
  name: string;
  url: string;
}

export function ExercisePanel({ exercises }: { exercises: Exercise[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [answer, setAnswer] = useState("");
  const [attachments, setAttachments] = useState<AnswerImage[]>([]);
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
  }

  function addAnswerImages(files: FileList | null) {
    if (!files?.length) return;

    const nextAttachments = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file)
      }));

    setAttachments((current) => [...current, ...nextAttachments]);
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

  if (!activeExercise) {
    return <section className="exercise-panel">当前知识点暂无练习。</section>;
  }

  return (
    <section className="exercise-panel">
      <div className="exercise-header">
        <p className="eyebrow">练习</p>
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
              {exercise.difficulty}
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
        <span>支持手写答案照片，当前先用于预览和附加，后续接视觉批改。</span>
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
        <button type="button">对照评分要点</button>
      </div>
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
