import Link from "next/link";
import type { KnowledgePoint } from "@/lib/course/types";

export function KnowledgePointNav({
  chapterId,
  knowledgePoints,
  activeKpIndex,
}: {
  chapterId: string;
  knowledgePoints: KnowledgePoint[];
  activeKpIndex: number;
}) {
  if (knowledgePoints.length === 0) return null;

  const prevIndex = activeKpIndex > 0 ? activeKpIndex - 1 : null;
  const nextIndex = activeKpIndex < knowledgePoints.length - 1 ? activeKpIndex + 1 : null;
  const activeKP = knowledgePoints[activeKpIndex];

  return (
    <nav aria-label="知识点导航" className="kp-nav">
      <div className="kp-nav-top">
        <p className="kp-nav-label">本章知识点 · {knowledgePoints.length} 个</p>
        <div className="kp-nav-arrows">
          {prevIndex !== null ? (
            <Link
              aria-label={`上一个：${knowledgePoints[prevIndex].title}`}
              className="kp-arrow"
              href={`/?chapter=${chapterId}&kp=${prevIndex}`}
            >
              ← 上一个
            </Link>
          ) : (
            <span aria-disabled="true" className="kp-arrow is-disabled">← 上一个</span>
          )}
          <span className="kp-nav-index">{activeKpIndex + 1} / {knowledgePoints.length}</span>
          {nextIndex !== null ? (
            <Link
              aria-label={`下一个：${knowledgePoints[nextIndex].title}`}
              className="kp-arrow"
              href={`/?chapter=${chapterId}&kp=${nextIndex}`}
            >
              下一个 →
            </Link>
          ) : (
            <span aria-disabled="true" className="kp-arrow is-disabled">下一个 →</span>
          )}
        </div>
      </div>

      {knowledgePoints.length > 1 && (
        <div className="kp-step-row">
          {knowledgePoints.map((kp, index) => (
            <Link
              className={`kp-step ${index === activeKpIndex ? "is-active" : ""}`}
              href={`/?chapter=${chapterId}&kp=${index}`}
              key={kp.id}
              title={kp.title}
            >
              <span className="kp-step-num">{index + 1}</span>
              <span className="kp-step-title">{kp.title}</span>
            </Link>
          ))}
        </div>
      )}

      {activeKP && knowledgePoints.length === 1 && (
        <p className="kp-single-label">{activeKP.title}</p>
      )}
    </nav>
  );
}
