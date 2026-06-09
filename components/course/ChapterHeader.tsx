import type { ChapterContent } from "@/lib/course/types";

const statusLabel: Record<string, string> = {
  "sample-ready": "样板完成",
  draft: "草稿",
  planned: "待整理"
};

export function ChapterHeader({ chapter }: { chapter: ChapterContent }) {
  return (
    <header className="chapter-header">
      <div className="chapter-header-meta">
        <span className="chapter-header-number">第 {chapter.number} 章</span>
        <span className={`chapter-status-badge ${chapter.status}`}>{statusLabel[chapter.status] ?? chapter.status}</span>
      </div>
      <h1 className="chapter-header-title">{chapter.title}</h1>
      {chapter.overview && <p className="chapter-header-overview">{chapter.overview}</p>}
      <p className="chapter-header-kp-count">
        {chapter.knowledgePoints.length} 个知识点
      </p>
    </header>
  );
}
