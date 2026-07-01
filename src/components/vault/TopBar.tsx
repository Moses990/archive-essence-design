import { Search, Bell, HelpCircle, ChevronRight } from "lucide-react";
import type { ViewKey } from "./types";

const labels: Record<ViewKey, string> = {
  dashboard: "工作台",
  projects: "项目",
  cad: "CAD 中心",
  history: "历史记录",
  ai: "AI 中心",
  settings: "设置",
  "project-detail": "项目详情",
};

interface TopBarProps {
  view: ViewKey;
  onOpenPalette: () => void;
  onNavigate: (v: ViewKey) => void;
}

export function TopBar({ view, onOpenPalette, onNavigate }: TopBarProps) {
  const isDetail = view === "project-detail";
  return (
    <header className="h-11 shrink-0 border-b hairline flex items-center pl-4 pr-2 gap-3 bg-background/80 backdrop-blur">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-foreground-muted">
        {isDetail ? (
          <>
            <button onClick={() => onNavigate("projects")} className="hover:text-foreground transition-colors">项目</button>
            <ChevronRight className="h-3 w-3 text-foreground-subtle" />
            <span className="text-foreground font-medium">外滩 22 号会所</span>
            <span className="ml-1.5 px-1.5 h-[18px] inline-flex items-center rounded-[4px] bg-surface-3 text-[10.5px] text-foreground-muted border hairline font-mono">P-2041</span>
          </>
        ) : (
          <span className="text-foreground font-medium">{labels[view]}</span>
        )}
      </div>

      <div className="flex-1" />

      {/* Command search */}
      <button
        onClick={onOpenPalette}
        className="flex items-center gap-2 h-7 px-2.5 w-[300px] rounded-[6px] border hairline bg-surface-2 hover:bg-surface-3 text-foreground-subtle transition-colors focus-ring"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="text-[12px]">搜索项目、图纸、材料…</span>
        <span className="ml-auto flex items-center gap-0.5">
          <span className="kbd">⌘</span>
          <span className="kbd">K</span>
        </span>
      </button>

      <div className="h-4 w-px bg-border" />

      <button className="h-7 w-7 grid place-items-center rounded-[6px] hover:bg-surface-2 text-foreground-muted focus-ring" title="帮助">
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      <button className="h-7 w-7 grid place-items-center rounded-[6px] hover:bg-surface-2 text-foreground-muted focus-ring relative" title="通知">
        <Bell className="h-3.5 w-3.5" />
        <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" />
      </button>
      <div className="ml-1 h-7 w-7 rounded-full bg-gradient-to-br from-primary to-[hsl(244_78%_46%)] grid place-items-center text-[10.5px] font-semibold text-primary-foreground">
        LZ
      </div>
    </header>
  );
}
