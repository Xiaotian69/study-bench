import type { KnowledgePoint } from "@/lib/course/types";

export function buildLocalOpeningMessage(knowledgePoint: KnowledgePoint): string {
  const firstQuestion = knowledgePoint.socraticQuestions[0] ?? "你能先说说这个知识点的核心想法吗？";
  return `我们先学「${knowledgePoint.title}」。先抓住一句话：${knowledgePoint.learningGoals[0]}\n\n我先问你：${firstQuestion}`;
}
