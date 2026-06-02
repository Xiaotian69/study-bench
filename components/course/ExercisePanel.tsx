"use client";

import { useMemo, useState } from "react";
import type { Exercise } from "@/lib/course/types";

export function ExercisePanel({ exercises }: { exercises: Exercise[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const activeExercise = exercises[activeIndex];

  const visibleHints = useMemo(() => {
    if (!activeExercise) return [];
    return activeExercise.hints.slice(0, hintLevel);
  }, [activeExercise, hintLevel]);

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
                setHintLevel(0);
              }}
              type="button"
            >
              {exercise.difficulty}
            </button>
          ))}
        </div>
      </div>
      <h3>{activeExercise.prompt}</h3>
      <textarea aria-label="输入你的解答" placeholder="在这里写你的思路、计算或证明..." />
      <div className="exercise-actions">
        <button onClick={() => setHintLevel((value) => Math.min(value + 1, activeExercise.hints.length))} type="button">
          获取提示
        </button>
        <button type="button">对照评分要点</button>
      </div>
      {visibleHints.length > 0 && (
        <ul className="hint-list">
          {visibleHints.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ul>
      )}
      <details>
        <summary>评分要点</summary>
        <ul>
          {activeExercise.gradingRubric.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}
