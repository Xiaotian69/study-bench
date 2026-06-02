// Sample tutor requests and responses.
//
// These fixtures let the main AI build and test the API route without a live
// model, and document the exact shape each task produces. Values are drawn
// from the "数列极限" sample chapter (knowledge point epsilon-n-definition,
// exercise seq-limit-ex-002). No real API keys or secrets appear here.

import type {
  TutorAskResponse,
  TutorContextEnvelope,
  TutorExerciseContext,
  TutorGradeResponse,
  TutorHintResponse,
  TutorKnowledgePointContext,
  TutorMasteryResponse
} from "@/lib/ai/tutor-contract";

const epsilonNKnowledgePoint: TutorKnowledgePointContext = {
  id: "epsilon-n-definition",
  title: "epsilon-N 定义",
  coreExplanation:
    "数列极限的精确定义把“接近”翻译成不等式：对任意给定精度 $\\varepsilon>0$，存在起始项号 $N$，使 $n>N$ 时 $|x_n-a|<\\varepsilon$。",
  keyDefinitions: [
    {
      name: "数列极限（epsilon-N 定义）",
      statement:
        "若对任给 $\\varepsilon>0$，存在正整数 $N$，使当 $n>N$ 时恒有 $|x_n-a|<\\varepsilon$，则称 $\\{x_n\\}$ 收敛于 $a$。"
    }
  ],
  keyTheorems: [],
  proofIdeas: [
    "用定义证极限三步：任取 ε>0；把 |x_n−a| 放缩为关于 n 的简单表达式；解出使其小于 ε 的 n，取相应 N。"
  ],
  socraticQuestions: [
    "定义里为什么是“对任意 ε>0”，而不是“对某个 ε>0”？",
    "如果交换量词顺序，描述的还是极限吗？",
    "证明 lim 1/n = 0 时，你取的 N 依赖 ε 吗？"
  ],
  commonMistakes: ["把 ε 当成固定常数", "认为 N 与 ε 无关"],
  masteryCriteria: [
    "能完整、正确地默写 epsilon-N 定义并解释每个量词。",
    "能说明 N 对 ε 的依赖关系。",
    "能独立用定义证明 lim 1/n=0 这类基础极限。"
  ]
};

const epsilonNExercise: TutorExerciseContext = {
  id: "seq-limit-ex-002",
  prompt: "用 epsilon-N 定义证明 $\\lim_{n\\to\\infty}\\frac{1}{n}=0$。",
  gradingRubric: [
    "任取 epsilon>0 作为证明起点",
    "由 |1/n - 0| = 1/n < epsilon 解出 n > 1/epsilon",
    "明确取 N = ⌈1/epsilon⌉（或任意大于 1/epsilon 的正整数），并验证 n>N 时不等式成立"
  ],
  hints: [
    "写出 |x_n - 0| 并化简。",
    "把 1/n < epsilon 解成关于 n 的不等式。",
    "据此选择一个合适的 N，并回代验证。"
  ],
  commonMistakes: [
    "证明中没有先“任取 epsilon>0”",
    "N 的选取与 epsilon 无关",
    "只验证了个别 n 而非所有 n>N"
  ]
};

/** A complete `explain` request envelope. */
export const sampleExplainRequest: TutorContextEnvelope = {
  task: "explain",
  locale: "zh-CN",
  context: {
    courseId: "math-analysis",
    chapterId: "ch-sequence-limit",
    sectionId: "sec-sequence-limit-concept",
    knowledgePointId: "epsilon-n-definition",
    currentStep: "definition-reading",
    knowledgePoint: epsilonNKnowledgePoint,
    learnerHistory: {
      masteryState: "emerging",
      recentAnswers: ["ε 是任意小的精度要求"],
      hintLevelUsed: 0
    }
  },
  payload: {
    focus: "definition:数列极限（epsilon-N 定义）",
    depth: "walkthrough"
  }
};

/** A complete `grade` request envelope (targets an exercise). */
export const sampleGradeRequest: TutorContextEnvelope = {
  task: "grade",
  locale: "zh-CN",
  context: {
    courseId: "math-analysis",
    chapterId: "ch-sequence-limit",
    sectionId: "sec-sequence-limit-concept",
    knowledgePointId: "epsilon-n-definition",
    currentStep: "basic-practice",
    knowledgePoint: epsilonNKnowledgePoint,
    exercise: epsilonNExercise,
    learnerHistory: {
      masteryState: "emerging",
      recentAnswers: [],
      hintLevelUsed: 1
    }
  },
  payload: {
    exerciseId: "seq-limit-ex-002",
    studentAnswer:
      "因为 1/n 越来越小，所以当 n 很大时 1/n 接近 0，故极限是 0。"
  }
};

export const sampleAskResponse: TutorAskResponse = {
  question: "在 epsilon-N 定义里，为什么要求“对任意 ε>0”，而不是“对某个 ε>0”？",
  sourceQuestionIndex: 0,
  expectedFocus: "考察学生是否理解 ε 的任意性，而非某个固定精度。"
};

export const sampleGradeResponse: TutorGradeResponse = {
  verdict: "partially_correct",
  score: 55,
  feedback:
    "你抓住了“n 大时 1/n 接近 0”的直觉，方向正确。但这还不是按定义的证明：需要任取 ε>0，并明确给出与 ε 对应的 N。",
  missingKeyPoints: [
    "任取 epsilon>0 作为证明起点",
    "明确取 N = ⌈1/epsilon⌉（或任意大于 1/epsilon 的正整数），并验证 n>N 时不等式成立"
  ],
  nextHintLevel: 2,
  masterySuggestion: "emerging"
};

export const sampleHintResponse: TutorHintResponse = {
  level: 2,
  maxLevel: 3,
  hint: "把目标不等式 1/n < ε 解成关于 n 的不等式：它等价于 n > 1/ε。",
  isFinalAnswerRevealed: false
};

export const sampleMasteryResponse: TutorMasteryResponse = {
  masteryState: "emerging",
  criteriaMet: ["能说明 N 对 ε 的依赖关系。"],
  criteriaUnmet: [
    "能完整、正确地默写 epsilon-N 定义并解释每个量词。",
    "能独立用定义证明 lim 1/n=0 这类基础极限。"
  ],
  recommendation: "more-basic-practice",
  rationale:
    "学生理解了 N 依赖 ε，但尚未独立完成按定义的完整证明，仍有两条 criteria 未满足，故维持 emerging。"
};
