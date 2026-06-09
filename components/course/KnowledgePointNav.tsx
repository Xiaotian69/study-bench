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
  if (knowledgePoints.length <= 1) return null;

  return (
    <nav aria-label="知识点导航" className="kp-nav">
      <p className="kp-nav-label">本章知识点 · {knowledgePoints.length} 个</p>
      <div className="kp-step-row">
        {knowledgePoints.map((kp, index) => (
          <Link
            className={`kp-step ${index === activeKpIndex ? "is-active" : ""}`}
            href={`/?chapter=${chapterId}&kp=${index}`}
            key={kp.id}
          >
            <span className="kp-step-num">{index + 1}</span>
            <span className="kp-step-title">{kp.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
