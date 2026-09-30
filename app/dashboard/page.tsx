"use client";

import { useState } from "react";
import CopilotDrawer from '@/components/dashboard/CopilotDrawer';
import Sidebar from "@/components/dashboard/Sidebar";
import MetricsBar from "@/components/dashboard/MetricsBar";
import HexMap from "@/components/dashboard/HexMap";
import RecommendationPanel from "@/components/dashboard/RecommendationPanel";
import {
  mockHotspots,
  totalRequests,
  activeHotspotCount,
  criticalCount,
  type Hotspot,
} from "@/lib/mockData";

export default function GovernmentDashboardPage() {
  const [selected, setSelected] = useState<Hotspot | null>(null);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0B0F14] text-slate-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <MetricsBar
          activeHotspots={activeHotspotCount}
          totalRequests={totalRequests}
          criticalCount={criticalCount}
        />

        <main className="relative min-h-0 flex-1">
          <HexMap
            hotspots={mockHotspots}
            selectedId={selected?.id ?? null}
            onSelect={(hotspot) => setSelected(hotspot)}
          />
        </main>
      </div>

      <RecommendationPanel hotspot={selected} onClose={() => setSelected(null)} />
      <CopilotDrawer />
    </div>
  );
}