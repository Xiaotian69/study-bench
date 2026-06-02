import type { TutorSettings } from "@/lib/tutor/tutorTypes";
import { getTutorProviderPreset } from "@/lib/tutor/modelProviders";

const settingsKey = "ai-math-tutor-settings";

export function getDefaultTutorSettings(): TutorSettings {
  const preset = getTutorProviderPreset("openai-compatible");
  return {
    provider: preset.id,
    model: preset.defaultModel,
    baseUrl: preset.baseUrl,
    apiKey: ""
  };
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
    const stored = JSON.parse(raw) as Partial<TutorSettings>;
    const fallback = getDefaultTutorSettings();
    const preset = getTutorProviderPreset(stored.provider);

    return {
      provider: preset.id,
      model: stored.model ?? preset.defaultModel ?? fallback.model,
      baseUrl: stored.baseUrl ?? preset.baseUrl ?? fallback.baseUrl,
      apiKey: stored.apiKey ?? fallback.apiKey
    };
  } catch {
    return getDefaultTutorSettings();
  }
}

export function saveTutorSettings(settings: TutorSettings) {
  window.localStorage.setItem(settingsKey, JSON.stringify(settings));
}
