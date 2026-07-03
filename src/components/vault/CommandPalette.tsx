import { Command } from "cmdk";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, FolderKanban, DraftingCompass, History, Sparkles, Settings as SettingsIcon,
  Plus, FileText, Upload, Search, Star, Filter as FilterIcon, X, Clock, Archive, Save, Trash2,
} from "lucide-react";
import type { ViewKey } from "./types";
import {
  clients, tagOptions, filterSummary, defaultFilter,
  type ProjectsFilter,
} from "./data/projects";
import { drawings } from "./data/drawings";
import { useLocalState, readRecent, type RecentItem } from "./utils/localState";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onNavigate: (v: ViewKey) => void;
  filter: ProjectsFilter;
  setFilter: (f: ProjectsFilter) => void;
}

type FilterPreset = { name: string; filter: ProjectsFilter };

export function CommandPalette({ open, onOpenChange, onNavigate, filter, setFilter }: CommandPaletteProps) {
  const [presets, setPresets] = useLocalState<FilterPreset[]>("vault:filter-presets", []);
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [presetName, setPresetName] = useState("");
  const [showSave, setShowSave] = useState(false);

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

  useEffect(() => {
    if (open) {
      setRecent(readRecent());
      setShowSave(false);
      setPresetName("");
    }
  }, [open]);

  if (!open) return null;

  const go = (v: ViewKey) => {
    onNavigate(v);
    onOpenChange(false);
  };

  const applyFilter = (patch: Partial<ProjectsFilter>, reset = false) => {
    setFilter({ ...(reset ? defaultFilter : filter), ...patch });
    go("projects");
  };

  const applyPreset = (p: FilterPreset) => {
    setFilter(p.filter);
    go("projects");
  };

  const removePreset = (name: string) => setPresets(presets.filter(p => p.name !== name));

  const saveCurrentAsPreset = () => {
    const name = presetName.trim() || `预设 ${presets.length + 1}`;
    if (presets.some(p => p.name === name)) return;
    setPresets([...presets, { name, filter }]);
    setShowSave(false);
    setPresetName("");
  };

  const chips = filterSummary(filter);
  const hasFilter = chips.length > 0;

  const headingCls = "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[10.5px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-foreground-subtle";
  const itemCls = "flex items-center gap-2.5 h-8 px-2.5 rounded-[6px] text-[12.5px] text-foreground-muted cursor-pointer data-[selected=true]:bg-surface-3 data-[selected=true]:text-foreground";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-start justify-center pt-[14vh] bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={() => onOpenChange(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[640px] max-w-[92vw] rounded-[10px] border border-border-strong bg-popover shadow-2xl overflow-hidden animate-scale-in"
      >
        <Command label="命令面板" className="[&_[cmdk-input]]:outline-none">
          <div className="flex items-center gap-2 px-3.5 h-11 border-b hairline">
            <Search className="h-4 w-4 text-foreground-subtle" />
            <Command.Input
              autoFocus
              placeholder="输入命令、项目名、图纸编号…"
              className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-foreground-subtle"
            />
            <span className="kbd">ESC</span>
          </div>

          {chips.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 border-b hairline bg-surface-1/40 flex-wrap">
              <span className="text-[10.5px] uppercase tracking-wider text-foreground-subtle">当前筛选</span>
              {chips.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 h-5 px-1.5 rounded-[4px] text-[10.5px] bg-primary/12 text-[hsl(244_88%_82%)] border border-primary/25">
                  <FilterIcon className="h-2.5 w-2.5" />{c}
                </span>
              ))}
              <div className="flex-1" />
              <button
                onClick={() => setShowSave(true)}
                className="inline-flex items-center gap-1 h-5 px-1.5 rounded-[4px] text-[10.5px] text-primary hover:bg-primary/12"
              >
                <Save className="h-2.5 w-2.5" />保存为预设
              </button>
              <button
                onClick={() => setFilter(defaultFilter)}
                className="inline-flex items-center gap-1 h-5 px-1.5 rounded-[4px] text-[10.5px] text-foreground-subtle hover:text-foreground hover:bg-surface-3"
              >
                <X className="h-2.5 w-2.5" />清除
              </button>
            </div>
          )}

          {showSave && (
            <div className="flex items-center gap-2 px-3 py-2 border-b hairline bg-primary/8">
              <input
                autoFocus
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="预设名称，例如：住宅 · 待审阅"
                className="flex-1 h-7 px-2 rounded-[4px] border hairline bg-surface-2 text-[12px] text-foreground focus-ring"
                onKeyDown={(e) => { if (e.key === "Enter") saveCurrentAsPreset(); }}
              />
              <button onClick={saveCurrentAsPreset} className="h-7 px-2 rounded-[4px] bg-primary text-primary-foreground text-[11.5px] hover:bg-primary/90">保存</button>
              <button onClick={() => setShowSave(false)} className="h-7 px-2 rounded-[4px] text-[11.5px] text-foreground-muted hover:bg-surface-3">取消</button>
            </div>
          )}

          <Command.List className="max-h-[440px] overflow-y-auto scroll-thin p-1.5">
            <Command.Empty className="p-6 text-center text-[12px] text-foreground-subtle">未找到匹配结果</Command.Empty>

            {recent.length > 0 && (
              <Command.Group heading="最近打开" className={headingCls}>
                {recent.slice(0, 5).map((r) => (
                  <Command.Item key={r.key} value={`最近 ${r.label}`} onSelect={() => go(r.kind === "project" ? "project-detail" : "cad")} className={itemCls}>
                    <Clock className="h-3.5 w-3.5 text-foreground-subtle" />
                    <span className="flex-1 truncate">{r.label}</span>
                    <span className="text-[10.5px] font-mono text-foreground-subtle">{r.kind === "project" ? "项目" : "图纸"}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {presets.length > 0 && (
              <Command.Group heading="筛选预设" className={headingCls}>
                {presets.map((p) => (
                  <Command.Item key={p.name} value={`预设 ${p.name}`} onSelect={() => applyPreset(p)} className={itemCls}>
                    <Save className="h-3.5 w-3.5 text-primary" />
                    <span className="flex-1 truncate">{p.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removePreset(p.name); }}
                      className="h-5 w-5 grid place-items-center rounded-[3px] text-foreground-subtle hover:bg-surface-3 hover:text-destructive"
                      title="删除"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="图纸检索" className={headingCls}>
              {drawings.slice(0, 6).map((d) => (
                <Command.Item
                  key={d.code}
                  value={`图纸 ${d.code} ${d.name} ${d.project}`}
                  onSelect={() => go("cad")}
                  className={itemCls}
                >
                  <DraftingCompass className="h-3.5 w-3.5 text-foreground-subtle" />
                  <span className="flex-1 truncate">
                    <span className="font-mono text-[11px] text-foreground-subtle mr-1.5">{d.code}</span>
                    <span className="text-foreground">{d.name}</span>
                  </span>
                  <span className="text-[10.5px] text-foreground-subtle truncate max-w-[120px]">{d.project}</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="项目筛选" className={headingCls}>
              <Command.Item value="收藏 收藏项目 fav" onSelect={() => applyFilter({ favOnly: true }, true)} className={itemCls}>
                <Star className="h-3.5 w-3.5 text-warning" />
                <span className="flex-1">只看收藏项目</span>
                <span className="text-[10.5px] font-mono text-foreground-subtle">F</span>
              </Command.Item>
              <Command.Item value="待审阅 审核 review" onSelect={() => applyFilter({ status: "review" }, true)} className={itemCls}>
                <Clock className="h-3.5 w-3.5 text-warning" />
                <span className="flex-1">待审阅项目</span>
              </Command.Item>
              <Command.Item value="进行中 active" onSelect={() => applyFilter({ status: "active" }, true)} className={itemCls}>
                <span className="badge-dot bg-success" />
                <span className="flex-1">进行中项目</span>
              </Command.Item>
              <Command.Item value="已归档 archived" onSelect={() => applyFilter({ status: "archived" }, true)} className={itemCls}>
                <Archive className="h-3.5 w-3.5 text-foreground-subtle" />
                <span className="flex-1">已归档项目</span>
              </Command.Item>
              {tagOptions.map((t) => (
                <Command.Item key={t} value={`标签 ${t}`} onSelect={() => applyFilter({ tag: t }, true)} className={itemCls}>
                  <FilterIcon className="h-3.5 w-3.5 text-foreground-subtle" />
                  <span className="flex-1">按标签：{t}</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="按客户" className={headingCls}>
              {clients.map((c) => (
                <Command.Item key={c} value={`客户 ${c}`} onSelect={() => applyFilter({ client: c }, true)} className={itemCls}>
                  <span className="h-4 w-4 grid place-items-center rounded-[3px] bg-surface-3 text-[9px] text-foreground-muted font-medium">
                    {c.slice(0, 1)}
                  </span>
                  <span className="flex-1">{c}</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="导航" className={headingCls}>
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
                  <Command.Item key={i.key} onSelect={() => go(i.key as ViewKey)} className={itemCls}>
                    <Icon className="h-3.5 w-3.5 text-foreground-subtle" />
                    <span className="flex-1">{i.label}</span>
                    <span className="text-[10.5px] font-mono text-foreground-subtle">{i.hint}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            <Command.Group heading="操作" className={headingCls}>
              {[
                { label: "新建项目", icon: Plus, hint: "N" },
                { label: "导入 CAD 图纸", icon: Upload, hint: "U" },
                { label: "创建材料清单", icon: FileText, hint: "M" },
                { label: "重新索引本地资产", icon: Search, hint: "R I" },
              ].map((i) => {
                const Icon = i.icon;
                return (
                  <Command.Item key={i.label} className={itemCls}>
                    <Icon className="h-3.5 w-3.5 text-foreground-subtle" />
                    <span className="flex-1">{i.label}</span>
                    <span className="text-[10.5px] font-mono text-foreground-subtle">{i.hint}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>

          <div className="border-t hairline px-3 h-8 flex items-center justify-between text-[10.5px] text-foreground-subtle">
            <div className="flex items-center gap-2">
              <span className="kbd">↑</span><span className="kbd">↓</span>
              <span>选择</span>
              <span className="kbd">↵</span>
              <span>确认</span>
              {hasFilter && (<><span className="text-border">·</span><span className="text-primary">当前 {chips.length} 个筛选</span></>)}
            </div>
            <div>Project Vault · 命令面板</div>
          </div>
        </Command>
      </div>
    </div>
  );
}
