import type { Volume } from "@/lib/course/types";

export function CourseSidebar({ volume, activeChapterId }: { volume: Volume; activeChapterId: string }) {
  return (
    <aside className="course-sidebar">
      <div className="sidebar-heading">
        <span>课程目录</span>
        <strong>{volume.title}</strong>
      </div>
      <nav aria-label="课程章节" className="chapter-list">
        {volume.chapters.map((chapter) => (
          <section className={`chapter-item ${chapter.id === activeChapterId ? "is-active" : ""}`} key={chapter.id}>
            <div className="chapter-title">
              <span>{chapter.number}</span>
              <strong>{chapter.title}</strong>
            </div>
            <small>{chapter.status === "sample-ready" ? "样板完成" : "待整理"}</small>
          </section>
        ))}
      </nav>
    </aside>
  );
}
