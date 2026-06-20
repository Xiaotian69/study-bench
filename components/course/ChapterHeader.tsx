import { MathText } from "@/components/math/MathText";
import type { ChapterContent } from "@/lib/course/types";

const statusLabel: Record<string, string> = {
  "sample-ready": "样板完成",
  draft: "草稿",
  planned: "待整理"
};

export function ChapterHeader({ chapter }: { chapter: ChapterContent }) {
  const diagramCount = new Set(chapter.knowledgePoints.flatMap((kp) => kp.diagramIds)).size;
  const exerciseCount = new Set(chapter.knowledgePoints.flatMap((kp) => kp.exerciseIds)).size;

  return (
    <header className="chapter-header">
      <div className="chapter-header-meta">
        <span className="chapter-header-number">第 {chapter.number} 章</span>
        <span className={`chapter-status-badge ${chapter.status}`}>{statusLabel[chapter.status] ?? chapter.status}</span>
      </div>
      <h1 className="chapter-header-title">{chapter.title}</h1>
      {chapter.overview && <p className="chapter-header-overview"><MathText text={chapter.overview} /></p>}
      <div className="chapter-header-stats" aria-label="章节学习资源">
        <span>{chapter.knowledgePoints.length} 个知识点</span>
        {diagramCount > 0 && <span>{diagramCount} 张教学图示</span>}
        {exerciseCount > 0 && <span>{exerciseCount} 道练习</span>}
      </div>
    </header>
  );
}
