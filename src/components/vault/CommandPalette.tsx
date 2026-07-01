import { Command } from "cmdk";
import { useEffect } from "react";
import {
  LayoutDashboard, FolderKanban, DraftingCompass, History, Sparkles, Settings as SettingsIcon,
  Plus, FileText, Upload, Search
} from "lucide-react";
import type { ViewKey } from "./types";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onNavigate: (v: ViewKey) => void;
}

export function CommandPalette({ open, onOpenChange, onNavigate }: CommandPaletteProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  if (!open) return null;

  const go = (v: ViewKey) => {
    onNavigate(v);
    onOpenChange(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-start justify-center pt-[14vh] bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={() => onOpenChange(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[620px] max-w-[92vw] rounded-[10px] border border-border-strong bg-popover shadow-2xl overflow-hidden animate-scale-in"
      >
        <Command label="命令面板" className="[&_[cmdk-input]]:outline-none">
          <div className="flex items-center gap-2 px-3.5 h-11 border-b hairline">
            <Search className="h-4 w-4 text-foreground-subtle" />
            <Command.Input
              autoFocus
              placeholder="输入命令、项目名或图纸编号…"
              className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-foreground-subtle"
            />
            <span className="kbd">ESC</span>
          </div>
          <Command.List className="max-h-[380px] overflow-y-auto scroll-thin p-1.5">
            <Command.Empty className="p-6 text-center text-[12px] text-foreground-subtle">未找到匹配结果</Command.Empty>

            <Command.Group heading="导航" className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[10.5px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-foreground-subtle">
              {[
                { key: "dashboard", label: "前往 工作台", icon: LayoutDashboard, hint: "G D" },
                { key: "projects", label: "前往 项目", icon: FolderKanban, hint: "G P" },
                { key: "cad", label: "前往 CAD 中心", icon: DraftingCompass, hint: "G C" },
                { key: "history", label: "前往 历史记录", icon: History, hint: "G H" },
                { key: "ai", label: "前往 AI 中心", icon: Sparkles, hint: "G A" },
                { key: "settings", label: "前往 设置", icon: SettingsIcon, hint: "G S" },
              ].map((i) => {
                const Icon = i.icon;
                return (
                  <Command.Item
                    key={i.key}
                    onSelect={() => go(i.key as ViewKey)}
                    className="flex items-center gap-2.5 h-8 px-2.5 rounded-[6px] text-[12.5px] text-foreground-muted cursor-pointer data-[selected=true]:bg-surface-3 data-[selected=true]:text-foreground"
                  >
                    <Icon className="h-3.5 w-3.5 text-foreground-subtle" />
                    <span className="flex-1">{i.label}</span>
                    <span className="text-[10.5px] font-mono text-foreground-subtle">{i.hint}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            <Command.Group heading="操作" className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[10.5px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-foreground-subtle">
              {[
                { label: "新建项目", icon: Plus, hint: "N" },
                { label: "导入 CAD 图纸", icon: Upload, hint: "U" },
                { label: "创建材料清单", icon: FileText, hint: "M" },
                { label: "重新索引本地资产", icon: Search, hint: "R I" },
              ].map((i) => {
                const Icon = i.icon;
                return (
                  <Command.Item
                    key={i.label}
                    className="flex items-center gap-2.5 h-8 px-2.5 rounded-[6px] text-[12.5px] text-foreground-muted cursor-pointer data-[selected=true]:bg-surface-3 data-[selected=true]:text-foreground"
                  >
                    <Icon className="h-3.5 w-3.5 text-foreground-subtle" />
                    <span className="flex-1">{i.label}</span>
                    <span className="text-[10.5px] font-mono text-foreground-subtle">{i.hint}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            <Command.Group heading="最近项目" className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[10.5px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-foreground-subtle">
              {[
                { code: "P-2041", name: "外滩 22 号会所" },
                { code: "P-2039", name: "西岸美术馆改造" },
                { code: "P-2033", name: "松江云庐别墅群" },
              ].map((p) => (
                <Command.Item
                  key={p.code}
                  onSelect={() => go("project-detail")}
                  className="flex items-center gap-2.5 h-8 px-2.5 rounded-[6px] text-[12.5px] text-foreground-muted cursor-pointer data-[selected=true]:bg-surface-3 data-[selected=true]:text-foreground"
                >
                  <span className="badge-dot bg-primary" />
                  <span className="flex-1">{p.name}</span>
                  <span className="text-[10.5px] font-mono text-foreground-subtle">{p.code}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="border-t hairline px-3 h-8 flex items-center justify-between text-[10.5px] text-foreground-subtle">
            <div className="flex items-center gap-2">
              <span className="kbd">↑</span><span className="kbd">↓</span>
              <span>选择</span>
              <span className="kbd">↵</span>
              <span>确认</span>
            </div>
            <div>Project Vault · 命令面板</div>
          </div>
        </Command>
      </div>
    </div>
  );
}
