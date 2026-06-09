"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Volume } from "@/lib/course/types";
import {
  getChapterMasteryState,
  getMasteryLabel,
  loadCourseProgress,
  progressUpdatedEventName,
  type CourseProgressRecord
} from "@/lib/progress/masteryProgress";

export function CourseSidebar({
  activeChapterId,
  courseId,
  volumes,
}: {
  activeChapterId: string;
  courseId: string;
  volumes: Volume[];
}) {
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgressRecord>>(() =>
    Object.fromEntries(volumes.map((v) => [v.id, loadCourseProgress(courseId, v.id)]))
  );

  useEffect(() => {
    function refreshProgress() {
      setProgressMap(Object.fromEntries(volumes.map((v) => [v.id, loadCourseProgress(courseId, v.id)])));
    }
    refreshProgress();
    window.addEventListener(progressUpdatedEventName, refreshProgress);
    return () => window.removeEventListener(progressUpdatedEventName, refreshProgress);
  }, [courseId, volumes]);

  return (
    <aside className="course-sidebar">
      <div className="sidebar-heading">
        <span>课程目录</span>
        <strong>数学分析</strong>
      </div>
      {volumes.map((volume) => {
        const progress = progressMap[volume.id] ?? {};
        return (
          <nav aria-label={volume.title} className="chapter-list" key={volume.id}>
            <p className="volume-label">{volume.title}</p>
            {volume.chapters.map((chapter) => {
              const knowledgePointIds = chapter.sections.flatMap((section) => section.knowledgePointIds ?? []);
              const masteryState = getChapterMasteryState(progress, knowledgePointIds);
              const isActive = chapter.id === activeChapterId;

              return (
                <Link
                  className={`chapter-item ${isActive ? "is-active" : ""}`}
                  href={`/?chapter=${chapter.id}`}
                  key={chapter.id}
                >
                  <div className="chapter-title">
                    <span>{chapter.number}</span>
                    <strong>{chapter.title}</strong>
                  </div>
                  <small>
                    {chapter.status === "sample-ready" ? "样板完成" : chapter.status === "draft" ? "草稿" : "待整理"}
                  </small>
                  {chapter.status === "sample-ready" && (
                    <span className={`progress-pill ${masteryState}`}>{getMasteryLabel(masteryState)}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        );
      })}
    </aside>
  );
}
