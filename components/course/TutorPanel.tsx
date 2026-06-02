"use client";

import { useEffect, useMemo, useState } from "react";
import { MathText } from "@/components/math/MathText";
import type { KnowledgePoint } from "@/lib/course/types";
import { getDefaultTutorSettings, loadTutorSettings, saveTutorSettings } from "@/lib/progress/progressStore";
import { buildLocalOpeningMessage } from "@/lib/tutor/localTutor";
import { getTutorProviderPreset, tutorModelProviders } from "@/lib/tutor/modelProviders";
import type { TutorMessage, TutorSettings } from "@/lib/tutor/tutorTypes";

export function TutorPanel({ knowledgePoint }: { knowledgePoint: KnowledgePoint }) {
  const opening = useMemo(() => buildLocalOpeningMessage(knowledgePoint), [knowledgePoint]);
  const [settings, setSettings] = useState<TutorSettings>(getDefaultTutorSettings);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<TutorMessage[]>([{ id: "opening", role: "teacher", content: opening }]);

  useEffect(() => {
    setSettings(loadTutorSettings());
  }, []);

  const activeProvider = getTutorProviderPreset(settings.provider);

  function handleProviderChange(provider: TutorSettings["provider"]) {
    const preset = getTutorProviderPreset(provider);
    setSettings({
      ...settings,
      provider: preset.id,
      model: preset.defaultModel,
      baseUrl: preset.baseUrl
    });
  }

  return (
    <aside className="tutor-panel">
      <p className="eyebrow">AI 老师</p>
      <div className="settings-grid">
        <select
          aria-label="模型供应商"
          value={settings.provider}
          onChange={(event) => handleProviderChange(event.target.value as TutorSettings["provider"])}
        >
          {tutorModelProviders.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.label}
            </option>
          ))}
        </select>
        <input
          aria-label="模型名称"
          onChange={(event) => setSettings({ ...settings, model: event.target.value })}
          placeholder={activeProvider.modelPlaceholder}
          value={settings.model}
        />
        <input
          aria-label="Base URL"
          onChange={(event) => setSettings({ ...settings, baseUrl: event.target.value })}
          placeholder="OpenAI-compatible Base URL"
          value={settings.baseUrl}
        />
        <input
          aria-label="API Key"
          onChange={(event) => setSettings({ ...settings, apiKey: event.target.value })}
          placeholder="API Key 仅保存在浏览器本地"
          type="password"
          value={settings.apiKey}
        />
        <button onClick={() => saveTutorSettings(settings)} type="button">
          保存设置
        </button>
      </div>
      <div className="message-list">
        {messages.map((message) => (
          <div className={`message ${message.role}`} key={message.id}>
            <MathText text={message.content} />
          </div>
        ))}
      </div>
      <form
        className="tutor-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) return;
          setMessages((current) => [
            ...current,
            { id: crypto.randomUUID(), role: "student", content: draft },
            {
              id: crypto.randomUUID(),
              role: "teacher",
              content: "我先按评分要点看你的回答。下一版会接入你选择的模型来细批。"
            }
          ]);
          setDraft("");
        }}
      >
        <textarea aria-label="向 AI 老师回答" onChange={(event) => setDraft(event.target.value)} value={draft} />
        <button type="submit">发送</button>
      </form>
    </aside>
  );
}
