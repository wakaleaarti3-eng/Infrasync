// components/dashboard/RecommendationPanel.tsx
"use client";

import { X, Sparkles, Quote, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { Hotspot } from "@/lib/mockData";

interface RecommendationPanelProps {
  hotspot: Hotspot | null;
  onClose: () => void;
}

const SEVERITY_STYLES: Record<
  Hotspot["severity"],
  { label: string; dot: string; badge: string }
> = {
  critical: {
    label: "Critical",
    dot: "bg-rose-400",
    badge: "border-rose-400/30 bg-rose-400/10 text-rose-300",
  },
  high: {
    label: "High",
    dot: "bg-amber-400",
    badge: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  },
  medium: {
    label: "Medium",
    dot: "bg-cyan-400",
    badge: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  },
  low: {
    label: "Low",
    dot: "bg-emerald-400",
    badge: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  },
};

const SENTIMENT_DOT: Record<string, string> = {
  negative: "bg-rose-400",
  neutral: "bg-slate-400",
  positive: "bg-emerald-400",
};

function TrendIcon({ trend }: { trend: Hotspot["trend"] }) {
  if (trend === "up")
    return <ArrowUpRight className="h-3.5 w-3.5 text-amber-400" />;
  if (trend === "down")
    return <ArrowDownRight className="h-3.5 w-3.5 text-emerald-400" />;
  return <Minus className="h-3.5 w-3.5 text-slate-500" />;
}

export default function RecommendationPanel({
  hotspot,
  onClose,
}: RecommendationPanelProps) {
  const open = hotspot !== null;
  const severity = hotspot ? SEVERITY_STYLES[hotspot.severity] : null;

  return (
    <>
      {/* Backdrop — click to dismiss, tap targets stay large on mobile */}
      <div
        onClick={onClose}
        aria-hidden={!open}
        className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={hotspot ? `Recommendation for ${hotspot.name}` : undefined}
        className={`fixed right-0 top-0 z-40 flex h-full w-full max-w-[440px] flex-col border-l border-white/[0.08] bg-[#0E141B] shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {hotspot && severity && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-6 py-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${severity.badge}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${severity.dot}`} />
                    {severity.label}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    {hotspot.category}
                  </span>
                </div>
                <h2 className="text-lg font-semibold leading-tight text-slate-100">
                  {hotspot.name}
                </h2>
                <span className="font-mono text-[11px] text-slate-500">
                  {hotspot.ward} · Cell {hotspot.id}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close recommendation panel"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* AI Recommendation */}
              <section className="mb-6">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-cyan-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Recommendation
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">
                    {hotspot.confidenceScore}% confidence
                  </span>
                </div>
                <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4">
                  <p className="text-[13.5px] leading-relaxed text-slate-200">
                    {hotspot.aiRecommendation}
                  </p>
                </div>
              </section>

              {/* Evidence */}
              <section className="mb-6">
                <div className="mb-2.5 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  <span>Evidence</span>
                  <span className="flex items-center gap-1 font-mono normal-case tracking-normal text-slate-400">
                    <TrendIcon trend={hotspot.trend} />
                    {hotspot.trendPct}% vs last week
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {hotspot.evidence.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                    >
                      <div className="text-[11px] text-slate-500">
                        {item.label}
                      </div>
                      <div className="mt-0.5 font-mono text-sm font-medium text-slate-100">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Citizen quotes */}
              <section>
                <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  <Quote className="h-3.5 w-3.5" />
                  Citizen Reports ({hotspot.citizenQuotes.length})
                </div>
                <div className="flex flex-col gap-3">
                  {hotspot.citizenQuotes.map((q, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5"
                    >
                      <p className="text-[13px] leading-relaxed text-slate-200">
                        &ldquo;{q.translated}&rdquo;
                      </p>
                      {q.language !== "English" && (
                        <p className="mt-1.5 text-[12px] italic leading-relaxed text-slate-500">
                          &ldquo;{q.original}&rdquo;
                        </p>
                      )}
                      <div className="mt-2.5 flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            SENTIMENT_DOT[q.sentiment]
                          }`}
                        />
                        <span className="text-[11px] text-slate-500">
                          {q.language}
                          {q.language !== "English" && " · Auto-translated"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 border-t border-white/[0.06] px-6 py-4">
              <button
                type="button"
                className="flex-1 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-medium text-[#0B0F14] transition-colors hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              >
                Dispatch Crew
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg border border-white/[0.1] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              >
                Assign for Review
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
