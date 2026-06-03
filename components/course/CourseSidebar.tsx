"use client";

import { useEffect, useState } from "react";
import type { Volume } from "@/lib/course/types";
import {
  getChapterMasteryState,
  getMasteryLabel,
  loadCourseProgress,
  progressUpdatedEventName,
  type CourseProgressRecord
} from "@/lib/progress/masteryProgress";

export function CourseSidebar({ activeChapterId, courseId, volume }: { activeChapterId: string; courseId: string; volume: Volume }) {
  const [progress, setProgress] = useState<CourseProgressRecord>(() => loadCourseProgress(courseId, volume.id));

  useEffect(() => {
    function refreshProgress() {
      setProgress(loadCourseProgress(courseId, volume.id));
    }

    refreshProgress();
    window.addEventListener(progressUpdatedEventName, refreshProgress);
    return () => window.removeEventListener(progressUpdatedEventName, refreshProgress);
  }, [courseId, volume.id]);

  return (
    <aside className="course-sidebar">
      <div className="sidebar-heading">
        <span>课程目录</span>
        <strong>{volume.title}</strong>
      </div>
      <nav aria-label="课程章节" className="chapter-list">
        {volume.chapters.map((chapter) => {
          const knowledgePointIds = chapter.sections.flatMap((section) => section.knowledgePointIds ?? []);
          const masteryState = getChapterMasteryState(progress, knowledgePointIds);

          return (
            <section className={`chapter-item ${chapter.id === activeChapterId ? "is-active" : ""}`} key={chapter.id}>
              <div className="chapter-title">
                <span>{chapter.number}</span>
                <strong>{chapter.title}</strong>
              </div>
              <small>{chapter.status === "sample-ready" ? "样板完成" : "待整理"}</small>
              {chapter.status === "sample-ready" && <span className={`progress-pill ${masteryState}`}>{getMasteryLabel(masteryState)}</span>}
            </section>
          );
        })}
      </nav>
    </aside>
  );
}
