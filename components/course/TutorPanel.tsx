"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MathText } from "@/components/math/MathText";
import type { KnowledgePoint } from "@/lib/course/types";
import { getDefaultTutorSettings, loadTutorSettings, saveTutorSettings } from "@/lib/progress/progressStore";
import { buildLocalOpeningMessage } from "@/lib/tutor/localTutor";
import { getTutorProviderPreset, tutorModelProviders } from "@/lib/tutor/modelProviders";
import type { TutorMessage, TutorSettings } from "@/lib/tutor/tutorTypes";

interface ChatApiResponse {
  content?: string;
  error?: string;
}

async function requestChat(settings: TutorSettings, knowledgePoint: KnowledgePoint, messages: TutorMessage[]): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings, knowledgePoint, messages }),
  });
  const data = (await response.json()) as ChatApiResponse;
  if (!response.ok || !data.content) {
    throw new Error(data.error ?? "chat_failed");
  }
  return data.content;
}

export function TutorPanel({ knowledgePoint }: { knowledgePoint: KnowledgePoint }) {
  const opening = useMemo(() => buildLocalOpeningMessage(knowledgePoint), [knowledgePoint]);

  const [settings, setSettings] = useState<TutorSettings>(getDefaultTutorSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [messages, setMessages] = useState<TutorMessage[]>([
    { id: "opening", role: "teacher", content: opening },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSettings(loadTutorSettings());
  }, []);

  // Reset conversation when KP changes
  useEffect(() => {
    setMessages([{ id: "opening", role: "teacher", content: buildLocalOpeningMessage(knowledgePoint) }]);
    setSendError("");
    setDraft("");
  }, [knowledgePoint.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeProvider = getTutorProviderPreset(settings.provider);
  const hasApiKey = Boolean(settings.apiKey.trim());

  function handleProviderChange(provider: TutorSettings["provider"]) {
    const preset = getTutorProviderPreset(provider);
    setSettings({ ...settings, provider: preset.id, model: preset.defaultModel, baseUrl: preset.baseUrl });
  }

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim() || isSending) return;

    const userMessage: TutorMessage = { id: crypto.randomUUID(), role: "student", content: draft.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setDraft("");
    setSendError("");

    if (!hasApiKey) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "teacher", content: "请先在设置里填入 API Key，我才能回答你。" },
      ]);
      return;
    }

    setIsSending(true);
    try {
      const reply = await requestChat(settings, knowledgePoint, updatedMessages);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "teacher", content: reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "请求失败";
      setSendError(`AI 老师暂时不可用：${msg}`);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <aside className="tutor-panel">
      <div className="tutor-header">
        <p className="eyebrow">AI 老师</p>
        <button
          aria-expanded={settingsOpen}
          className={`settings-toggle ${settingsOpen ? "is-active" : ""}`}
          onClick={() => setSettingsOpen((v) => !v)}
          type="button"
        >
          ⚙ 设置{hasApiKey ? "" : " · 未配置"}
        </button>
      </div>

      {settingsOpen && (
        <div className="settings-grid">
          <select
            aria-label="模型供应商"
            onChange={(e) => handleProviderChange(e.target.value as TutorSettings["provider"])}
            value={settings.provider}
          >
            {tutorModelProviders.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <input
            aria-label="模型名称"
            onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            placeholder={activeProvider.modelPlaceholder}
            value={settings.model}
          />
          <input
            aria-label="Base URL"
            onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
            placeholder="OpenAI-compatible Base URL"
            value={settings.baseUrl}
          />
          <input
            aria-label="API Key"
            onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
            placeholder="API Key 仅保存在浏览器本地"
            type="password"
            value={settings.apiKey}
          />
          <button onClick={() => { saveTutorSettings(settings); setSettingsOpen(false); }} type="button">
            保存并关闭
          </button>
        </div>
      )}

      <div className="message-list">
        {messages.map((message) => (
          <div className={`message ${message.role}`} key={message.id}>
            <MathText text={message.content} />
          </div>
        ))}
        {isSending && (
          <div className="message teacher is-loading">
            <span className="typing-dots"><span /><span /><span /></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {sendError && <p className="tutor-error">{sendError}</p>}

      <form className="tutor-form" onSubmit={handleSend}>
        <textarea
          aria-label="向 AI 老师回答"
          disabled={isSending}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSend(e as unknown as React.FormEvent);
            }
          }}
          placeholder={hasApiKey ? "输入你的回答…（Ctrl+Enter 发送）" : "先在设置里填入 API Key"}
          value={draft}
        />
        <button disabled={isSending || !draft.trim()} type="submit">
          {isSending ? "发送中…" : "发送"}
        </button>
      </form>
    </aside>
  );
}
