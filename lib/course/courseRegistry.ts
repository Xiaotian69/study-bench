import mathAnalysisCourse from "@/content/courses/math-analysis/course.json";
import mathAnalysisVolume1 from "@/content/courses/math-analysis/volume-1.json";
import mathAnalysisVolume2 from "@/content/courses/math-analysis/volume-2.json";
import gaodengShuxueCourse from "@/content/courses/gaodeng-shuxue/course.json";
import gaodengShuxueVolume1 from "@/content/courses/gaodeng-shuxue/volume-1.json";
import gaodengShuxueVolume2 from "@/content/courses/gaodeng-shuxue/volume-2.json";
import { chapterRegistry as mathAnalysisChapterRegistry } from "./chapterRegistry";
import { gaodengChapterRegistry } from "./gaodengChapterRegistry";
import type { ChapterRegistryEntry } from "./chapterRegistry";
import type { Course, Volume } from "./types";

export interface RegisteredCourse {
  course: Course;
  volumes: Volume[];
  chapterRegistry: Record<string, ChapterRegistryEntry>;
}

export const courseRegistry: Record<string, RegisteredCourse> = {
  "math-analysis": {
    course: mathAnalysisCourse as unknown as Course,
    volumes: [mathAnalysisVolume1 as unknown as Volume, mathAnalysisVolume2 as unknown as Volume],
    chapterRegistry: mathAnalysisChapterRegistry,
  },
  "gaodeng-shuxue": {
    course: gaodengShuxueCourse as unknown as Course,
    volumes: [gaodengShuxueVolume1 as unknown as Volume, gaodengShuxueVolume2 as unknown as Volume],
    chapterRegistry: gaodengChapterRegistry,
  },
};

export const REGISTERED_COURSE_IDS = Object.keys(courseRegistry) as Array<keyof typeof courseRegistry>;

export function getRegisteredCourse(courseId: string): RegisteredCourse | undefined {
  return courseRegistry[courseId];
}

export function listRegisteredCourses(): Course[] {
  return REGISTERED_COURSE_IDS.map((id) => courseRegistry[id].course);
}

export function getVolumesForCourse(courseId: string): Volume[] {
  const entry = getRegisteredCourse(courseId);
  if (!entry) {
    throw new Error(`unknown course id: ${courseId}`);
  }
  return entry.volumes;
}
