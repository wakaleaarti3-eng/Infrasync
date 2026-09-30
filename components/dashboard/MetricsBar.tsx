// components/dashboard/MetricsBar.tsx
"use client";

import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface MetricsBarProps {
  activeHotspots: number;
  totalRequests: number;
  criticalCount: number;
}

function StatBlock({
  label,
  value,
  delta,
  deltaDirection,
  mono = true,
}: {
  label: string;
  value: string | number;
  delta?: string;
  deltaDirection?: "up" | "down";
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-r border-white/[0.06] px-6 first:pl-0 last:border-r-0">
      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span
          className={`text-2xl font-semibold text-slate-100 ${
            mono ? "font-mono tabular-nums" : ""
          }`}
        >
          {value}
        </span>
        {delta && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              deltaDirection === "up" ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {deltaDirection === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

export default function MetricsBar({
  activeHotspots,
  totalRequests,
  criticalCount,
}: MetricsBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0B0F14]/90 px-6 backdrop-blur">
      <div className="flex items-center gap-8">
        <div className="flex flex-col leading-tight">
          <h1 className="text-sm font-semibold tracking-tight text-slate-100">
            InfraSync
          </h1>
          <span className="text-[11px] text-slate-500">
            Municipal Demand Command Center
          </span>
        </div>

        <div className="hidden items-center gap-0 sm:flex">
          <StatBlock label="Active Hotspots" value={activeHotspots} />
          <StatBlock
            label="Total Requests"
            value={totalRequests.toLocaleString()}
            delta="18% wk/wk"
            deltaDirection="up"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {criticalCount > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1.5 text-xs font-medium text-rose-300">
            <AlertTriangle className="h-3.5 w-3.5" />
            {criticalCount} critical cell{criticalCount > 1 ? "s" : ""}
          </div>
        )}
        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-[11px] tracking-wide text-slate-400">
            LIVE FEED
          </span>
        </div>
      </div>
    </header>
  );
}
