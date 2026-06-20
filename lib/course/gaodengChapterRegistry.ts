import gdFunctionLimitChapter from "@/content/courses/gaodeng-shuxue/chapters/gd-function-limit.json";
import gdFunctionLimitDiagrams from "@/content/courses/gaodeng-shuxue/diagrams/gd-function-limit.json";
import gdFunctionLimitExercises from "@/content/courses/gaodeng-shuxue/exercises/gd-function-limit.json";

import gdDerivativeChapter from "@/content/courses/gaodeng-shuxue/chapters/gd-derivative.json";
import gdDerivativeDiagrams from "@/content/courses/gaodeng-shuxue/diagrams/gd-derivative.json";
import gdDerivativeExercises from "@/content/courses/gaodeng-shuxue/exercises/gd-derivative.json";

import gdMeanValueChapter from "@/content/courses/gaodeng-shuxue/chapters/gd-mean-value.json";
import gdMeanValueDiagrams from "@/content/courses/gaodeng-shuxue/diagrams/gd-mean-value.json";
import gdMeanValueExercises from "@/content/courses/gaodeng-shuxue/exercises/gd-mean-value.json";

import gdIndefiniteIntegralChapter from "@/content/courses/gaodeng-shuxue/chapters/gd-indefinite-integral.json";
import gdIndefiniteIntegralDiagrams from "@/content/courses/gaodeng-shuxue/diagrams/gd-indefinite-integral.json";
import gdIndefiniteIntegralExercises from "@/content/courses/gaodeng-shuxue/exercises/gd-indefinite-integral.json";

import gdDefiniteIntegralChapter from "@/content/courses/gaodeng-shuxue/chapters/gd-definite-integral.json";
import gdDefiniteIntegralDiagrams from "@/content/courses/gaodeng-shuxue/diagrams/gd-definite-integral.json";
import gdDefiniteIntegralExercises from "@/content/courses/gaodeng-shuxue/exercises/gd-definite-integral.json";

import gdOdeChapter from "@/content/courses/gaodeng-shuxue/chapters/gd-ode.json";
import gdOdeDiagrams from "@/content/courses/gaodeng-shuxue/diagrams/gd-ode.json";
import gdOdeExercises from "@/content/courses/gaodeng-shuxue/exercises/gd-ode.json";

import gdVectorsChapter from "@/content/courses/gaodeng-shuxue/chapters/gd-vectors.json";
import gdVectorsDiagrams from "@/content/courses/gaodeng-shuxue/diagrams/gd-vectors.json";
import gdVectorsExercises from "@/content/courses/gaodeng-shuxue/exercises/gd-vectors.json";

import gdMultivariableDiffChapter from "@/content/courses/gaodeng-shuxue/chapters/gd-multivariable-diff.json";
import gdMultivariableDiffDiagrams from "@/content/courses/gaodeng-shuxue/diagrams/gd-multivariable-diff.json";
import gdMultivariableDiffExercises from "@/content/courses/gaodeng-shuxue/exercises/gd-multivariable-diff.json";

import gdMultipleIntegralsChapter from "@/content/courses/gaodeng-shuxue/chapters/gd-multiple-integrals.json";
import gdMultipleIntegralsDiagrams from "@/content/courses/gaodeng-shuxue/diagrams/gd-multiple-integrals.json";
import gdMultipleIntegralsExercises from "@/content/courses/gaodeng-shuxue/exercises/gd-multiple-integrals.json";

import gdLineSurfaceChapter from "@/content/courses/gaodeng-shuxue/chapters/gd-line-surface.json";
import gdLineSurfaceDiagrams from "@/content/courses/gaodeng-shuxue/diagrams/gd-line-surface.json";
import gdLineSurfaceExercises from "@/content/courses/gaodeng-shuxue/exercises/gd-line-surface.json";

import gdSeriesChapter from "@/content/courses/gaodeng-shuxue/chapters/gd-series.json";
import gdSeriesDiagrams from "@/content/courses/gaodeng-shuxue/diagrams/gd-series.json";
import gdSeriesExercises from "@/content/courses/gaodeng-shuxue/exercises/gd-series.json";

import type { ChapterRegistryEntry } from "./chapterRegistry";

export const gaodengChapterRegistry: Record<string, ChapterRegistryEntry> = {
  "ch-gd-function-limit": {
    chapter: gdFunctionLimitChapter as unknown as Record<string, unknown>,
    exercises: gdFunctionLimitExercises as { exercises: unknown[] },
    diagrams: gdFunctionLimitDiagrams as { diagrams: unknown[] },
  },
  "ch-gd-derivative": {
    chapter: gdDerivativeChapter as unknown as Record<string, unknown>,
    exercises: gdDerivativeExercises as { exercises: unknown[] },
    diagrams: gdDerivativeDiagrams as { diagrams: unknown[] },
  },
  "ch-gd-mean-value": {
    chapter: gdMeanValueChapter as unknown as Record<string, unknown>,
    exercises: gdMeanValueExercises as { exercises: unknown[] },
    diagrams: gdMeanValueDiagrams as { diagrams: unknown[] },
  },
  "ch-gd-indefinite-integral": {
    chapter: gdIndefiniteIntegralChapter as unknown as Record<string, unknown>,
    exercises: gdIndefiniteIntegralExercises as { exercises: unknown[] },
    diagrams: gdIndefiniteIntegralDiagrams as { diagrams: unknown[] },
  },
  "ch-gd-definite-integral": {
    chapter: gdDefiniteIntegralChapter as unknown as Record<string, unknown>,
    exercises: gdDefiniteIntegralExercises as { exercises: unknown[] },
    diagrams: gdDefiniteIntegralDiagrams as { diagrams: unknown[] },
  },
  "ch-gd-ode": {
    chapter: gdOdeChapter as unknown as Record<string, unknown>,
    exercises: gdOdeExercises as { exercises: unknown[] },
    diagrams: gdOdeDiagrams as { diagrams: unknown[] },
  },
  "ch-gd-vectors": {
    chapter: gdVectorsChapter as unknown as Record<string, unknown>,
    exercises: gdVectorsExercises as { exercises: unknown[] },
    diagrams: gdVectorsDiagrams as { diagrams: unknown[] },
  },
  "ch-gd-multivariable-diff": {
    chapter: gdMultivariableDiffChapter as unknown as Record<string, unknown>,
    exercises: gdMultivariableDiffExercises as { exercises: unknown[] },
    diagrams: gdMultivariableDiffDiagrams as { diagrams: unknown[] },
  },
  "ch-gd-multiple-integrals": {
    chapter: gdMultipleIntegralsChapter as unknown as Record<string, unknown>,
    exercises: gdMultipleIntegralsExercises as { exercises: unknown[] },
    diagrams: gdMultipleIntegralsDiagrams as { diagrams: unknown[] },
  },
  "ch-gd-line-surface": {
    chapter: gdLineSurfaceChapter as unknown as Record<string, unknown>,
    exercises: gdLineSurfaceExercises as { exercises: unknown[] },
    diagrams: gdLineSurfaceDiagrams as { diagrams: unknown[] },
  },
  "ch-gd-series": {
    chapter: gdSeriesChapter as unknown as Record<string, unknown>,
    exercises: gdSeriesExercises as { exercises: unknown[] },
    diagrams: gdSeriesDiagrams as { diagrams: unknown[] },
  },
};
