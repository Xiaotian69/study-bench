import type { TutorSettings } from "@/lib/tutor/tutorTypes";

const settingsKey = "ai-math-tutor-settings";

export function getDefaultTutorSettings(): TutorSettings {
  return { provider: "openai-compatible", model: "", apiKey: "" };
}

export function loadTutorSettings(): TutorSettings {
  if (typeof window === "undefined") {
    return getDefaultTutorSettings();
  }

  const raw = window.localStorage.getItem(settingsKey);
  if (!raw) {
    return getDefaultTutorSettings();
  }

  try {
    return JSON.parse(raw) as TutorSettings;
  } catch {
    return getDefaultTutorSettings();
  }
}

export function saveTutorSettings(settings: TutorSettings) {
  window.localStorage.setItem(settingsKey, JSON.stringify(settings));
}
