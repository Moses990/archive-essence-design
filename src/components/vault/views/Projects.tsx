import { useState } from "react";
import { Card, PageHeader, Button, Badge, StatusDot, Input } from "../ui";
import {
  Plus, Search, Filter, ArrowUpDown, LayoutGrid, List as ListIcon, Star, MoreHorizontal, Upload, X, Check, ChevronDown
} from "lucide-react";
import type { ViewKey } from "../types";
import {
  projects, clients, tagOptions, applyFilter, filterSummary,
  type ProjectsFilter, type ProjectStatus, type ProjectTag,
} from "../data/projects";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  onNavigate: (v: ViewKey) => void;
  filter: ProjectsFilter;
  setFilter: (f: ProjectsFilter) => void;
}

const statusMeta: Record<ProjectStatus | "all", { label: string; dot?: "success" | "warning" | "neutral" }> = {
  all: { label: "全部状态" },
  active: { label: "进行中", dot: "success" },
  review: { label: "待审阅", dot: "warning" },
  archived: { label: "已归档", dot: "neutral" },
};

const quickTabs: { key: ProjectTag | "all" | "archived"; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "住宅", label: "住宅" },
  { key: "商业空间", label: "商业空间" },
  { key: "文化建筑", label: "文化建筑" },
  { key: "办公", label: "办公" },
  { key: "archived", label: "已归档" },
];

export default function Projects({ onNavigate, filter, setFilter }: Props) {
  const [mode, setMode] = useState<"list" | "grid">("list");

  const filtered = applyFilter(projects, filter);
  const activeCount =
    (filter.favOnly ? 1 : 0) +
    (filter.client !== "all" ? 1 : 0) +
    (filter.status !== "all" ? 1 : 0) +
    (filter.tag !== "all" ? 1 : 0);
  const chips = filterSummary(filter);

  const currentQuickTab: string =
    filter.status === "archived" ? "archived" : filter.tag !== "all" ? filter.tag : "all";

  return (
    <div className="p-6 max-w-[1240px] mx-auto">
      <PageHeader
        title="项目"
        description={`${projects.length} 个项目 · 索引大小 34.8 GB · 最近同步 09:12`}
        actions={
          <>
            <Button variant="outline"><Upload className="h-3.5 w-3.5" />导入</Button>
            <Button variant="primary"><Plus className="h-3.5 w-3.5" />新建项目</Button>
          </>
        }
      />

      <Card padded={false} className="mb-3">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 h-11 border-b hairline">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle pointer-events-none" />
            <Input
              placeholder="搜索项目名 / 编号 / 客户 / 标签…"
              className="pl-7 w-[280px]"
              value={filter.query}
              onChange={(e) => setFilter({ ...filter, query: e.target.value })}
            />
            {filter.query && (
              <button
                onClick={() => setFilter({ ...filter, query: "" })}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-4 w-4 grid place-items-center rounded-[3px] text-foreground-subtle hover:text-foreground hover:bg-surface-3"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Client */}
          <SelectPop
            label="客户"
            value={filter.client}
            valueLabel={filter.client === "all" ? undefined : filter.client}
            options={[{ v: "all", l: "全部客户" }, ...clients.map(c => ({ v: c, l: c }))]}
            onChange={(v) => setFilter({ ...filter, client: v as string })}
          />
          {/* Status */}
          <SelectPop
            label="状态"
            value={filter.status}
            valueLabel={filter.status === "all" ? undefined : statusMeta[filter.status].label}
            options={(Object.keys(statusMeta) as (ProjectStatus | "all")[]).map(k => ({
              v: k, l: statusMeta[k].label, dot: statusMeta[k].dot,
            }))}
            onChange={(v) => setFilter({ ...filter, status: v as ProjectStatus | "all" })}
          />
          {/* Tag */}
          <SelectPop
            label="标签"
            value={filter.tag}
            valueLabel={filter.tag === "all" ? undefined : filter.tag}
            options={[{ v: "all", l: "全部标签" }, ...tagOptions.map(t => ({ v: t, l: t }))]}
            onChange={(v) => setFilter({ ...filter, tag: v as ProjectTag | "all" })}
          />
          {/* Fav */}
          <button
            onClick={() => setFilter({ ...filter, favOnly: !filter.favOnly })}
            className={cn(
              "inline-flex items-center gap-1.5 h-7 px-2 rounded-[6px] text-[12px] border hairline transition-colors",
              filter.favOnly
                ? "bg-warning/12 text-[hsl(38_92%_74%)] border-warning/40"
                : "bg-transparent text-foreground-muted hover:bg-surface-2"
            )}
            title="只看收藏"
          >
            <Star className={cn("h-3.5 w-3.5", filter.favOnly && "fill-warning text-warning")} />
            收藏
          </button>

          <Button variant="ghost"><ArrowUpDown className="h-3.5 w-3.5" />最近更新</Button>
          <div className="flex-1" />
          <div className="text-[11.5px] text-foreground-subtle">
            {filtered.length} / {projects.length}
          </div>
          <div className="flex items-center rounded-[6px] border hairline overflow-hidden">
            <button
              onClick={() => setMode("list")}
              className={`h-7 w-7 grid place-items-center ${mode === "list" ? "bg-surface-3 text-foreground" : "text-foreground-subtle hover:text-foreground"}`}
              title="列表"
            >
              <ListIcon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setMode("grid")}
              className={`h-7 w-7 grid place-items-center ${mode === "grid" ? "bg-surface-3 text-foreground" : "text-foreground-subtle hover:text-foreground"}`}
              title="卡片"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Quick tag row */}
        <div className="flex items-center gap-1 px-3 h-9 border-b hairline overflow-x-auto scroll-thin">
          {quickTabs.map((t) => {
            const active = currentQuickTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => {
                  if (t.key === "all") setFilter({ ...filter, tag: "all", status: filter.status === "archived" ? "all" : filter.status });
                  else if (t.key === "archived") setFilter({ ...filter, status: "archived", tag: "all" });
                  else setFilter({ ...filter, tag: t.key as ProjectTag, status: filter.status === "archived" ? "all" : filter.status });
                }}
                className={`h-6 px-2 rounded-[4px] text-[11.5px] transition-colors ${
                  active
                    ? "bg-surface-3 text-foreground border hairline"
                    : "text-foreground-subtle hover:text-foreground hover:bg-surface-2 border border-transparent"
                }`}
              >
                {t.label}
              </button>
            );
          })}
          {(chips.length > 0 || activeCount > 0) && (
            <>
              <div className="mx-2 h-3 w-px bg-border" />
              <div className="flex items-center gap-1 flex-wrap">
                {chips.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 h-5 px-1.5 rounded-[4px] text-[10.5px] bg-primary/12 text-[hsl(244_88%_82%)] border border-primary/25">
                    <Filter className="h-2.5 w-2.5" />
                    {c}
                  </span>
                ))}
                <button
                  onClick={() => setFilter({ query: "", client: "all", status: "all", tag: "all", favOnly: false })}
                  className="ml-1 inline-flex items-center gap-1 h-5 px-1.5 rounded-[4px] text-[10.5px] text-foreground-subtle hover:text-foreground hover:bg-surface-2"
                >
                  <X className="h-2.5 w-2.5" />
                  清除
                </button>
              </div>
            </>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center text-[12px] text-foreground-subtle">
            未找到匹配项目 · 尝试
            <button
              className="mx-1 underline decoration-dotted hover:text-foreground"
              onClick={() => setFilter({ query: "", client: "all", status: "all", tag: "all", favOnly: false })}
            >
              清除筛选
            </button>
          </div>
        ) : mode === "list" ? (
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left text-[10.5px] uppercase tracking-wider text-foreground-subtle bg-surface-1/50">
                <th className="w-8 px-3 py-2"></th>
                <th className="w-[86px] font-medium py-2">编号</th>
                <th className="font-medium py-2">名称 / 客户</th>
                <th className="w-[92px] font-medium py-2">标签</th>
                <th className="w-[92px] font-medium py-2">阶段</th>
                <th className="w-[70px] font-medium py-2 text-right">图纸</th>
                <th className="w-[70px] font-medium py-2 text-right">材料</th>
                <th className="w-[74px] font-medium py-2 text-right">大小</th>
                <th className="w-[110px] font-medium py-2">更新</th>
                <th className="w-8 px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.code} className="row-hover border-t hairline cursor-pointer group" onClick={() => onNavigate("project-detail")}>
                  <td className="px-3 py-2">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className={`h-5 w-5 grid place-items-center rounded-[4px] ${p.fav ? "text-warning" : "text-foreground-subtle hover:text-foreground"}`}
                    >
                      <Star className={`h-3.5 w-3.5 ${p.fav ? "fill-warning" : ""}`} />
                    </button>
                  </td>
                  <td className="py-2 font-mono text-[11px] text-foreground-subtle">{p.code}</td>
                  <td className="py-2">
                    <div className="text-foreground font-medium">{p.name}</div>
                    <div className="text-[10.5px] text-foreground-subtle">{p.client}</div>
                  </td>
                  <td className="py-2"><Badge variant="neutral">{p.tag}</Badge></td>
                  <td className="py-2">
                    <Badge variant={p.status === "review" ? "warning" : p.status === "archived" ? "neutral" : "primary"}>
                      <StatusDot variant={p.status === "review" ? "warning" : p.status === "archived" ? "neutral" : "success"} />
                      {p.stage}
                    </Badge>
                  </td>
                  <td className="py-2 text-right tabular font-mono text-foreground-muted">{p.drawings}</td>
                  <td className="py-2 text-right tabular font-mono text-foreground-muted">{p.materials}</td>
                  <td className="py-2 text-right tabular font-mono text-foreground-subtle">{p.size}</td>
                  <td className="py-2 text-foreground-subtle">{p.updated}</td>
                  <td className="px-3 py-2 text-right">
                    <MoreHorizontal className="inline h-3.5 w-3.5 text-foreground-subtle opacity-0 group-hover:opacity-100" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-3 gap-3 p-3">
            {filtered.map((p) => (
              <button
                key={p.code}
                onClick={() => onNavigate("project-detail")}
                className="text-left rounded-[8px] border hairline bg-surface-2 hover:bg-surface-3 transition-colors p-3.5 focus-ring"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10.5px] text-foreground-subtle">{p.code}</span>
                  <Star className={`h-3.5 w-3.5 ${p.fav ? "text-warning fill-warning" : "text-foreground-subtle"}`} />
                </div>
                <div className="mt-2 text-[13px] font-semibold text-foreground truncate">{p.name}</div>
                <div className="text-[11px] text-foreground-subtle truncate">{p.client}</div>
                <div className="mt-3 flex items-center gap-1.5">
                  <Badge variant="neutral">{p.tag}</Badge>
                  <Badge variant={p.status === "review" ? "warning" : p.status === "archived" ? "neutral" : "primary"}>
                    <StatusDot variant={p.status === "review" ? "warning" : p.status === "archived" ? "neutral" : "success"} />
                    {p.stage}
                  </Badge>
                </div>
                <div className="mt-3 pt-3 border-t hairline grid grid-cols-3 gap-2 text-[10.5px] text-foreground-subtle">
                  <div><div className="text-foreground tabular font-mono">{p.drawings}</div>图纸</div>
                  <div><div className="text-foreground tabular font-mono">{p.materials}</div>材料</div>
                  <div><div className="text-foreground tabular font-mono">{p.size}</div>大小</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      <div className="text-[10.5px] text-foreground-subtle px-1">
        提示：按 <span className="kbd">⌘K</span> 打开命令面板，可直接跳转到当前筛选或应用预设。
      </div>
    </div>
  );
}

function SelectPop({
  label, value, valueLabel, options, onChange,
}: {
  label: string;
  value: string;
  valueLabel?: string;
  options: { v: string; l: string; dot?: "success" | "warning" | "neutral" }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const active = valueLabel !== undefined;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1.5 h-7 px-2 rounded-[6px] border hairline text-[12px] transition-colors",
            active
              ? "bg-primary/10 text-foreground border-primary/30"
              : "bg-transparent text-foreground-muted hover:bg-surface-2"
          )}
        >
          <span className="text-foreground-subtle">{label}</span>
          {active && <span className="text-foreground">{valueLabel}</span>}
          <ChevronDown className="h-3 w-3 text-foreground-subtle" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-1 bg-popover border-border-strong">
        <div className="max-h-[260px] overflow-y-auto scroll-thin">
          {options.map((o) => {
            const sel = o.v === value;
            return (
              <button
                key={o.v}
                onClick={() => { onChange(o.v); setOpen(false); }}
                className="w-full flex items-center gap-2 h-7 px-2 rounded-[4px] text-[12px] text-foreground-muted hover:bg-surface-3 hover:text-foreground"
              >
                {o.dot && <span className={cn("h-1.5 w-1.5 rounded-full", {
                  success: "bg-success", warning: "bg-warning", neutral: "bg-foreground-subtle",
                }[o.dot])} />}
                <span className="flex-1 text-left truncate">{o.l}</span>
                {sel && <Check className="h-3 w-3 text-primary" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
