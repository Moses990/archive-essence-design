import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import {
  LayoutDashboard,
  FolderKanban,
  DraftingCompass,
  History,
  Sparkles,
  Settings as SettingsIcon,
  ChevronsUpDown,
  Plus,
  CircleDot,
} from "lucide-react";
import type { ViewKey } from "./types";

interface SidebarProps {
  active: ViewKey;
  onNavigate: (v: ViewKey) => void;
}

const nav: { key: ViewKey; label: string; icon: React.ComponentType<{ className?: string }>; hint?: string }[] = [
  { key: "dashboard", label: "工作台", icon: LayoutDashboard, hint: "G D" },
  { key: "projects", label: "项目", icon: FolderKanban, hint: "G P" },
  { key: "cad", label: "CAD 中心", icon: DraftingCompass, hint: "G C" },
  { key: "history", label: "历史记录", icon: History, hint: "G H" },
  { key: "ai", label: "AI 中心", icon: Sparkles, hint: "G A" },
  { key: "settings", label: "设置", icon: SettingsIcon, hint: "G S" },
];

const pinned = [
  { name: "外滩 22 号会所", color: "hsl(244 78% 66%)" },
  { name: "西岸美术馆改造", color: "hsl(152 55% 46%)" },
  { name: "松江云庐别墅群", color: "hsl(38 92% 58%)" },
];

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="w-[220px] shrink-0 border-r hairline bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Workspace switcher */}
      <button className="flex items-center justify-between px-3 h-11 border-b hairline hover:bg-sidebar-accent transition-colors focus-ring">
        <div className="flex items-center gap-2 min-w-0">
          <Logo size={18} />
          <div className="flex flex-col items-start min-w-0">
            <span className="text-[12.5px] font-semibold text-foreground leading-tight truncate">Project Vault</span>
            <span className="text-[10.5px] text-foreground-subtle leading-tight">本地工作区 · v0.9</span>
          </div>
        </div>
        <ChevronsUpDown className="h-3.5 w-3.5 text-foreground-subtle" />
      </button>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto scroll-thin py-2">
        <div className="px-2 space-y-0.5">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={cn(
                  "group w-full flex items-center gap-2 px-2 h-7 rounded-[6px] text-[12.5px] transition-colors focus-ring",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "text-foreground-subtle group-hover:text-foreground-muted")} />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {isActive && <span className="badge-dot bg-primary" />}
              </button>
            );
          })}
        </div>

        {/* Pinned projects */}
        <div className="mt-5 px-2">
          <div className="flex items-center justify-between px-2 h-6">
            <span className="text-[10.5px] font-medium uppercase tracking-wider text-foreground-subtle">收藏项目</span>
            <button className="text-foreground-subtle hover:text-foreground-muted focus-ring rounded p-0.5">
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-1 space-y-0.5">
            {pinned.map((p) => (
              <button
                key={p.name}
                onClick={() => onNavigate("project-detail")}
                className="w-full flex items-center gap-2 px-2 h-7 rounded-[6px] text-[12px] text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground transition-colors"
              >
                <CircleDot className="h-3 w-3" style={{ color: p.color }} />
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 px-2">
          <div className="flex items-center justify-between px-2 h-6">
            <span className="text-[10.5px] font-medium uppercase tracking-wider text-foreground-subtle">标签</span>
          </div>
          <div className="mt-1 space-y-0.5">
            {[
              { label: "住宅", color: "hsl(210 90% 62%)" },
              { label: "商业空间", color: "hsl(244 78% 66%)" },
              { label: "文化建筑", color: "hsl(38 92% 58%)" },
              { label: "已归档", color: "hsl(220 8% 58%)" },
            ].map((t) => (
              <button
                key={t.label}
                className="w-full flex items-center gap-2 px-2 h-7 rounded-[6px] text-[12px] text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground transition-colors"
              >
                <span className="badge-dot" style={{ backgroundColor: t.color }} />
                <span className="truncate">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer: storage */}
      <div className="border-t hairline p-3">
        <div className="flex items-center justify-between text-[10.5px] text-foreground-subtle mb-1.5">
          <span>本地存储</span>
          <span className="tabular font-mono text-foreground-muted">184.2 / 500 GB</span>
        </div>
        <div className="h-1 rounded-full bg-surface-3 overflow-hidden">
          <div className="h-full bg-primary/70" style={{ width: "36.8%" }} />
        </div>
        <div className="mt-2 text-[10.5px] text-foreground-subtle">
          <span className="inline-flex items-center gap-1">
            <span className="badge-dot bg-success" />
            索引服务运行中
          </span>
        </div>
      </div>
    </aside>
  );
}
