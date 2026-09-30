// components/dashboard/Sidebar.tsx
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  MapPinned,
  MessagesSquare,
  Users,
  FileBarChart2,
  Settings,
  Radio,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", icon: LayoutGrid, active: true },
  { label: "Hotspots", icon: MapPinned },
  { label: "Requests", icon: MessagesSquare },
  { label: "Citizens", icon: Users },
  { label: "Reports", icon: FileBarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-[72px] shrink-0 flex-col items-center justify-between border-r border-white/[0.06] bg-[#0B0F14] py-4">
      <div className="flex flex-col items-center gap-6">
        {/* Mark */}
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-cyan-400/5 ring-1 ring-cyan-400/30">
          <Radio className="h-4 w-4 text-cyan-300" strokeWidth={2} />
        </div>

        <nav className="flex flex-col items-center gap-1.5">
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              title={label}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                active
                  ? "bg-cyan-400/10 text-cyan-300"
                  : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-200"
              }`}
            >
              {active && (
                <span className="absolute left-0 h-5 w-[3px] -translate-x-[13px] rounded-full bg-cyan-400" />
              )}
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          title="Settings"
          aria-label="Settings"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          <Settings className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </button>
        <div
          className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 ring-1 ring-white/10"
          title="Ops Duty Officer"
          aria-label="Signed in as Ops Duty Officer"
        />
      </div>
    </aside>
  );
}
