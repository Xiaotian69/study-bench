import chapter from "@/content/courses/math-analysis/chapters/sequence-limit.json";
import course from "@/content/courses/math-analysis/course.json";
import diagrams from "@/content/courses/math-analysis/diagrams/sequence-limit.json";
import exercises from "@/content/courses/math-analysis/exercises/sequence-limit.json";
import volume from "@/content/courses/math-analysis/volume-1.json";
import type { CourseBundle } from "./types";

export function loadMathAnalysisCourse(): CourseBundle {
  return {
    course,
    volume,
    chapter,
    exercises: exercises.exercises,
    diagrams: diagrams.diagrams
  } as CourseBundle;
}
