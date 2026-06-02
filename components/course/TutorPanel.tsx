"use client";

import { useEffect, useMemo, useState } from "react";
import { MathText } from "@/components/math/MathText";
import type { KnowledgePoint } from "@/lib/course/types";
import { getDefaultTutorSettings, loadTutorSettings, saveTutorSettings } from "@/lib/progress/progressStore";
import { buildLocalOpeningMessage } from "@/lib/tutor/localTutor";
import type { TutorMessage, TutorSettings } from "@/lib/tutor/tutorTypes";

export function TutorPanel({ knowledgePoint }: { knowledgePoint: KnowledgePoint }) {
  const opening = useMemo(() => buildLocalOpeningMessage(knowledgePoint), [knowledgePoint]);
  const [settings, setSettings] = useState<TutorSettings>(getDefaultTutorSettings);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<TutorMessage[]>([{ id: "opening", role: "teacher", content: opening }]);

  useEffect(() => {
    setSettings(loadTutorSettings());
  }, []);

  return (
    <aside className="tutor-panel">
      <p className="eyebrow">AI 老师</p>
      <div className="settings-grid">
        <select
          aria-label="模型供应商"
          value={settings.provider}
          onChange={(event) => setSettings({ ...settings, provider: event.target.value as TutorSettings["provider"] })}
        >
          <option value="openai-compatible">OpenAI-compatible</option>
          <option value="gemini">Gemini</option>
        </select>
        <input
          aria-label="模型名称"
          onChange={(event) => setSettings({ ...settings, model: event.target.value })}
          placeholder="例如 gpt-4.1-mini"
          value={settings.model}
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
