import { useMemo, useState } from "react";
import { Card, PageHeader, Button, Badge, StatusDot, Input, Divider } from "../ui";
import { Sheet } from "../Sheet";
import {
  Search, Upload, Download, Eye, GitBranch, MoreHorizontal, Layers, Filter,
  ChevronDown, ChevronRight, Copy, FolderOpen, ExternalLink,
} from "lucide-react";
import { drawings, versionHistory, type DrawingState, type Drawing } from "../data/drawings";

const cats = [
  { key: "all", label: "全部" },
  { key: "平面图", label: "平面图" },
  { key: "立面图", label: "立面图" },
  { key: "剖面图", label: "剖面图" },
  { key: "节点大样", label: "节点大样" },
  { key: "结构", label: "结构" },
  { key: "机电", label: "机电" },
] as const;

const stateOptions: { key: DrawingState | "all"; label: string; variant?: "success" | "warning" | "danger" | "neutral" }[] = [
  { key: "all", label: "全部状态" },
  { key: "current", label: "最新", variant: "success" },
  { key: "review", label: "待审阅", variant: "warning" },
  { key: "outdated", label: "有冲突", variant: "danger" },
  { key: "archived", label: "已归档", variant: "neutral" },
];

export default function CadCenter() {
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const [stateFilter, setStateFilter] = useState<DrawingState | "all">("all");
  const [projectFilter, setProjectFilter] = useState<string | "all">("all");
  const [openState, setOpenState] = useState(false);
  const [openProj, setOpenProj] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<Drawing | null>(null);

  const projectOptions = useMemo(() => Array.from(new Set(drawings.map(d => d.project))), []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return drawings.filter(d => {
      if (cat !== "all" && d.cat !== cat) return false;
      if (stateFilter !== "all" && d.state !== stateFilter) return false;
      if (projectFilter !== "all" && d.project !== projectFilter) return false;
      if (query) {
        const hay = `${d.code} ${d.name} ${d.project}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [cat, q, stateFilter, projectFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, Drawing[]>();
    filtered.forEach(d => {
      const arr = map.get(d.project) ?? [];
      arr.push(d);
      map.set(d.project, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const isCollapsed = (name: string) => openGroups.has(name);
  const toggleGroup = (name: string) => {
    const n = new Set(openGroups);
    n.has(name) ? n.delete(name) : n.add(name);
    setOpenGroups(n);
  };

  const chips: string[] = [];
  if (cat !== "all") chips.push(cat);
  if (stateFilter !== "all") chips.push(stateOptions.find(s => s.key === stateFilter)?.label ?? "");
  if (projectFilter !== "all") chips.push(projectFilter);
  if (q) chips.push(`"${q}"`);

  return (
    <div className="p-6 max-w-[1240px] mx-auto">
      <PageHeader
        title="CAD 中心"
        description="统一管理所有项目的 CAD 图纸 · 支持版本回溯与批量导出"
        actions={
          <>
            <Button variant="outline"><Layers className="h-3.5 w-3.5" />图层预设</Button>
            <Button variant="primary"><Upload className="h-3.5 w-3.5" />上传图纸</Button>
          </>
        }
      />

      <Card padded={false}>
        {/* Category tabs */}
        <div className="flex items-center gap-1 px-2 h-10 border-b hairline overflow-x-auto scroll-thin">
          {cats.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`h-7 px-2.5 rounded-[6px] text-[12px] transition-colors ${
                cat === c.key
                  ? "bg-surface-3 text-foreground border hairline"
                  : "text-foreground-subtle hover:text-foreground hover:bg-surface-2 border border-transparent"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 h-11 border-b hairline flex-wrap">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
            <Input
              placeholder="搜索图号 / 图名 / 项目…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-7 w-[260px]"
            />
          </div>

          {/* Project filter popover */}
          <div className="relative">
            <Button variant="outline" onClick={() => { setOpenProj(v => !v); setOpenState(false); }}>
              <Filter className="h-3.5 w-3.5" />项目
              <span className="ml-1 text-foreground-subtle">{projectFilter === "all" ? "全部" : projectFilter}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
            {openProj && (
              <div className="absolute top-8 left-0 z-30 w-[220px] rounded-[8px] border border-border-strong bg-popover shadow-xl p-1">
                {[{ p: "all" as const, label: "全部项目" }, ...projectOptions.map(p => ({ p, label: p }))].map((o) => (
                  <button
                    key={o.p}
                    onClick={() => { setProjectFilter(o.p as string); setOpenProj(false); }}
                    className={`w-full text-left h-7 px-2 rounded-[4px] text-[12px] flex items-center justify-between ${
                      projectFilter === o.p ? "bg-primary/12 text-foreground" : "text-foreground-muted hover:bg-surface-3"
                    }`}
                  >
                    <span className="truncate">{o.label}</span>
                    {projectFilter === o.p && <span className="badge-dot bg-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Version state popover */}
          <div className="relative">
            <Button variant="outline" onClick={() => { setOpenState(v => !v); setOpenProj(false); }}>
              <Filter className="h-3.5 w-3.5" />状态
              <span className="ml-1 text-foreground-subtle">
                {stateOptions.find(s => s.key === stateFilter)?.label}
              </span>
              <ChevronDown className="h-3 w-3" />
            </Button>
            {openState && (
              <div className="absolute top-8 left-0 z-30 w-[180px] rounded-[8px] border border-border-strong bg-popover shadow-xl p-1">
                {stateOptions.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => { setStateFilter(o.key); setOpenState(false); }}
                    className={`w-full text-left h-7 px-2 rounded-[4px] text-[12px] flex items-center gap-2 ${
                      stateFilter === o.key ? "bg-primary/12 text-foreground" : "text-foreground-muted hover:bg-surface-3"
                    }`}
                  >
                    {o.variant && <StatusDot variant={o.variant === "danger" ? "danger" : o.variant === "warning" ? "warning" : o.variant === "success" ? "success" : "neutral"} />}
                    <span className="flex-1">{o.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1" />
          <div className="text-[11.5px] text-foreground-subtle">共 {filtered.length} 张</div>
        </div>

        {/* Filter chips */}
        {chips.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-2 border-b hairline flex-wrap">
            {chips.map((c) => (
              <span key={c} className="inline-flex items-center gap-1 h-5 px-1.5 rounded-[4px] text-[10.5px] bg-primary/12 text-[hsl(244_88%_82%)] border border-primary/25">
                <Filter className="h-2.5 w-2.5" />{c}
              </span>
            ))}
            <button
              onClick={() => { setCat("all"); setStateFilter("all"); setProjectFilter("all"); setQ(""); }}
              className="text-[10.5px] text-foreground-subtle hover:text-foreground px-1.5 h-5 rounded-[4px] hover:bg-surface-3"
            >
              清除全部
            </button>
          </div>
        )}

        {/* Grouped list */}
        {grouped.length === 0 ? (
          <div className="p-10 text-center text-[12px] text-foreground-subtle">
            没有匹配的图纸，尝试调整筛选条件。
          </div>
        ) : (
          <div>
            {grouped.map(([project, items]) => {
              const collapsed = isCollapsed(project);
              return (
                <div key={project} className="border-b hairline last:border-b-0">
                  <button
                    onClick={() => toggleGroup(project)}
                    className="w-full flex items-center gap-2 px-3 h-9 hover:bg-surface-2 text-left"
                  >
                    {collapsed
                      ? <ChevronRight className="h-3.5 w-3.5 text-foreground-subtle" />
                      : <ChevronDown className="h-3.5 w-3.5 text-foreground-subtle" />}
                    <span className="text-[12px] font-medium text-foreground">{project}</span>
                    <Badge variant="neutral" className="font-mono">{items.length} 张</Badge>
                    <span className="text-[10.5px] text-foreground-subtle font-mono">{items[0].projectCode}</span>
                  </button>
                  {!collapsed && (
                    <table className="w-full text-[12px]">
                      <tbody>
                        {items.map((r) => (
                          <tr key={r.code} className="row-hover border-t hairline group cursor-pointer" onClick={() => setPreview(r)}>
                            <td className="pl-9 py-2 font-mono text-[11px] text-foreground-subtle w-[92px]">{r.code}</td>
                            <td className="py-2">
                              <div className="text-foreground font-medium truncate">{r.name}</div>
                            </td>
                            <td className="py-2 w-[86px]"><Badge variant="neutral">{r.cat}</Badge></td>
                            <td className="py-2 w-[70px]">
                              <Badge variant={r.state === "current" ? "primary" : r.state === "review" ? "warning" : r.state === "outdated" ? "danger" : "neutral"} className="font-mono">
                                <StatusDot variant={r.state === "current" ? "success" : r.state === "review" ? "warning" : r.state === "outdated" ? "danger" : "neutral"} />
                                {r.v}
                              </Badge>
                            </td>
                            <td className="py-2 w-[70px] text-right tabular font-mono text-foreground-muted">{r.size}</td>
                            <td className="py-2 w-[70px] text-foreground-muted">{r.author}</td>
                            <td className="py-2 w-[110px] text-foreground-subtle">{r.updated}</td>
                            <td className="px-3 py-2 text-right w-[110px]">
                              <div className="inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                <button className="h-6 w-6 grid place-items-center rounded-[4px] hover:bg-surface-3 text-foreground-muted" title="预览" onClick={() => setPreview(r)}><Eye className="h-3.5 w-3.5" /></button>
                                <button className="h-6 w-6 grid place-items-center rounded-[4px] hover:bg-surface-3 text-foreground-muted" title="版本"><GitBranch className="h-3.5 w-3.5" /></button>
                                <button className="h-6 w-6 grid place-items-center rounded-[4px] hover:bg-surface-3 text-foreground-muted" title="下载"><Download className="h-3.5 w-3.5" /></button>
                                <button className="h-6 w-6 grid place-items-center rounded-[4px] hover:bg-surface-3 text-foreground-muted"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between px-3 h-9 border-t hairline text-[11px] text-foreground-subtle">
          <div>点击任意行可打开预览抽屉</div>
          <div className="flex items-center gap-1">
            <span className="kbd">?</span>
            <span>快捷键</span>
          </div>
        </div>
      </Card>

      <DrawingPreview drawing={preview} onClose={() => setPreview(null)} />
    </div>
  );
}

function DrawingPreview({ drawing, onClose }: { drawing: Drawing | null; onClose: () => void }) {
  const history = drawing ? versionHistory[drawing.code] ?? [
    { v: drawing.v, who: drawing.author, when: drawing.updated, note: "当前版本" },
  ] : [];
  return (
    <Sheet
      open={!!drawing}
      onClose={onClose}
      title={drawing?.name}
      subtitle={drawing && `${drawing.projectCode} · ${drawing.project}`}
      width={480}
      footer={
        <div className="flex items-center gap-2">
          <Button variant="primary"><ExternalLink className="h-3.5 w-3.5" />在 CAD 中打开</Button>
          <Button variant="outline"><Download className="h-3.5 w-3.5" />导出</Button>
          <Button variant="ghost"><Copy className="h-3.5 w-3.5" />复制路径</Button>
        </div>
      }
    >
      {drawing && (
        <div className="p-4 space-y-4">
          <div className="relative rounded-[8px] border hairline bg-surface-1 grid-bg h-[220px] overflow-hidden">
            <div className="absolute inset-3 border border-primary/30 rounded-[4px] bg-surface-2/40" />
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
              <Badge variant="primary" className="font-mono">{drawing.v}</Badge>
              <Badge variant={drawing.state === "current" ? "success" : drawing.state === "review" ? "warning" : "neutral"}>
                <StatusDot variant={drawing.state === "current" ? "success" : drawing.state === "review" ? "warning" : "neutral"} />
                {drawing.state === "current" ? "最新" : drawing.state === "review" ? "待审阅" : drawing.state === "outdated" ? "有冲突" : "已归档"}
              </Badge>
            </div>
          </div>

          <div>
            <div className="text-[10.5px] uppercase tracking-wider text-foreground-subtle mb-1.5">元数据</div>
            <dl className="grid grid-cols-2 gap-2 text-[11.5px]">
              {[
                ["图号", drawing.code],
                ["分类", drawing.cat],
                ["大小", drawing.size],
                ["作者", drawing.author],
                ["项目", drawing.project],
                ["更新", drawing.updated],
              ].map(([k, v]) => (
                <div key={k} className="rounded-[6px] border hairline bg-surface-1 p-2">
                  <dt className="text-foreground-subtle text-[10.5px]">{k}</dt>
                  <dd className="text-foreground font-mono mt-0.5 truncate">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Divider />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[10.5px] uppercase tracking-wider text-foreground-subtle">版本时间线</div>
              <button className="text-[11px] text-primary hover:underline">完整历史 →</button>
            </div>
            <ol className="relative border-l hairline ml-1.5 pl-4 space-y-3">
              {history.map((h, i) => (
                <li key={h.v} className="relative">
                  <span className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-background ${i === 0 ? "bg-primary" : "bg-surface-3"}`} />
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[11.5px] text-foreground">{h.v}</span>
                    <span className="text-[10.5px] text-foreground-subtle">· {h.who}</span>
                    <span className="text-[10.5px] text-foreground-subtle font-mono ml-auto">{h.when}</span>
                  </div>
                  <div className="text-[11.5px] text-foreground-muted mt-0.5">{h.note}</div>
                </li>
              ))}
            </ol>
          </div>

          <Divider />

          <div className="flex items-center gap-2 text-[11px] text-foreground-subtle">
            <FolderOpen className="h-3 w-3" />
            <span className="font-mono truncate">/Vault/{drawing.project}/CAD/{drawing.name}</span>
          </div>
        </div>
      )}
    </Sheet>
  );
}
