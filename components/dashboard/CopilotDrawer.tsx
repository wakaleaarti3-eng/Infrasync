'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export default function CopilotDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! I am InfraSync AI powered by Gemini. How can I help you analyze the dashboard today?',
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `⚠️ Error: ${err.message || 'Failed to connect.'}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Copilot"
          className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-3 font-semibold text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all hover:scale-105 hover:bg-cyan-400"
        >
          <MessageSquare className="h-5 w-5" />
          AI Copilot
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]"
        />
      )}

      {/* Sliding Drawer */}
      {isOpen && (
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="AI Copilot"
          className="fixed right-0 top-0 z-[9999] flex h-full w-full max-w-[420px] flex-col border-l border-slate-800 bg-slate-950 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/25">
                <Bot className="h-4 w-4 text-cyan-400" strokeWidth={2} />
              </div>
              <div className="leading-tight">
                <h2 className="text-sm font-semibold text-slate-100">AI Copilot</h2>
                <span className="text-[11px] text-slate-500">Powered by Gemini</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close AI Copilot"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
            <div className="flex flex-col gap-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      m.role === 'user'
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/25'
                    }`}
                  >
                    {m.role === 'user' ? (
                      <span className="text-[11px] font-semibold">You</span>
                    ) : (
                      <Bot className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] whitespace-pre-line rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'border border-slate-800 bg-slate-900 text-slate-200'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/25">
                    <Bot className="h-3.5 w-3.5" strokeWidth={2} />
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-3 text-slate-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span className="text-[12px]">Thinking…</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Composer */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-slate-800 px-4 py-3.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a hotspot, ward, or category…"
              className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-[13px] text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Send className="h-4 w-4" strokeWidth={2} />
            </button>
          </form>
        </aside>
      )}
    </>
  );
}