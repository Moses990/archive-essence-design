import { useMemo, useState } from "react";
import { Card, PageHeader, Badge, Button, Input, Divider } from "../ui";
import { Search, Filter, GitCompare, Undo2, Download, X, Check, AlertTriangle } from "lucide-react";
import { historyEvents, OP_META, allPeople, allProjects, type HistoryOp } from "../data/history";

type OpFilter = HistoryOp | "all";
type RangeKey = "today" | "week" | "month" | "all";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "today", label: "今天" },
  { key: "week",  label: "本周" },
  { key: "month", label: "近 30 天" },
  { key: "all",   label: "全部" },
];

export default function HistoryView() {
  const [q, setQ] = useState("");
  const [opFilter, setOpFilter] = useState<Set<HistoryOp>>(new Set());
  const [personFilter, setPersonFilter] = useState<string | "all">("all");
  const [projectFilter, setProjectFilter] = useState<string | "all">("all");
  const [range, setRange] = useState<RangeKey>("month");
  const [rollback, setRollback] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return historyEvents.filter(e => {
      if (opFilter.size > 0 && !opFilter.has(e.op)) return false;
      if (personFilter !== "all" && e.who !== personFilter) return false;
      if (projectFilter !== "all" && e.project !== projectFilter) return false;
      if (range === "today" && e.day !== "今天") return false;
      if (range === "week" && !(e.day === "今天" || e.day === "昨天" || e.day === "本周")) return false;
      // month & all: pass-through (demo dataset within range)
      if (query) {
        const hay = `${e.who} ${e.action} ${e.target} ${e.project ?? ""}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [q, opFilter, personFilter, projectFilter, range]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach(e => {
      const key = `${e.day} · ${e.date}`;
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const summary = {
    total: filtered.length,
    projects: new Set(filtered.map(e => e.project).filter(Boolean)).size,
    people: new Set(filtered.map(e => e.who)).size,
  };

  const toggleOp = (op: HistoryOp) => {
    const n = new Set(opFilter);
    n.has(op) ? n.delete(op) : n.add(op);
    setOpFilter(n);
  };

  const confirmRollback = () => {
    setFlash(`已回滚到 ${rollback}（演示，未真实执行）`);
    setRollback(null);
    window.setTimeout(() => setFlash(null), 2200);
  };

  return (
    <div className="p-6 max-w-[1240px] mx-auto">
      <PageHeader
        title="历史记录"
        description="所有资产变更、版本操作与系统事件的可审计时间线"
        actions={
          <>
            <Button variant="ghost"><Download className="h-3.5 w-3.5" />导出 CSV</Button>
          </>
        }
      />

      {/* Summary strip */}
      <Card padded={false} className="mb-3">
        <div className="grid grid-cols-4 divide-x divide-border">
          {[
            { k: "事件", v: summary.total },
            { k: "涉及项目", v: summary.projects },
            { k: "涉及成员", v: summary.people },
            { k: "视图范围", v: RANGES.find(r => r.key === range)?.label ?? "" },
          ].map((s) => (
            <div key={s.k} className="px-4 py-3">
              <div className="text-[10.5px] uppercase tracking-wider text-foreground-subtle">{s.k}</div>
              <div className="mt-1 text-[16px] font-semibold tabular text-foreground font-mono">{s.v}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-[220px_1fr] gap-3">
        {/* Left filter rail */}
        <div className="space-y-3 sticky top-4 self-start">
          <Card padded={false}>
            <div className="px-3 h-9 flex items-center border-b hairline">
              <span className="text-[10.5px] uppercase tracking-wider text-foreground-subtle">时间范围</span>
            </div>
            <div className="p-1.5">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRange(r.key)}
                  className={`w-full text-left h-7 px-2 rounded-[4px] text-[12px] ${
                    range === r.key ? "bg-surface-3 text-foreground" : "text-foreground-muted hover:bg-surface-2"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </Card>

          <Card padded={false}>
            <div className="px-3 h-9 flex items-center justify-between border-b hairline">
              <span className="text-[10.5px] uppercase tracking-wider text-foreground-subtle">操作类型</span>
              {opFilter.size > 0 && (
                <button onClick={() => setOpFilter(new Set())} className="text-[10.5px] text-foreground-subtle hover:text-foreground">清除</button>
              )}
            </div>
            <div className="p-1.5 space-y-0.5">
              {(Object.keys(OP_META) as HistoryOp[]).map((op) => {
                const m = OP_META[op];
                const Icon = m.icon;
                const on = opFilter.has(op);
                return (
                  <button
                    key={op}
                    onClick={() => toggleOp(op)}
                    className={`w-full flex items-center gap-2 h-7 px-2 rounded-[4px] text-[12px] transition-colors ${
                      on ? "bg-primary/12 text-foreground border border-primary/30" : "text-foreground-muted hover:bg-surface-2 border border-transparent"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: m.color }} />
                    <span className="flex-1 text-left">{m.label}</span>
                    {on && <Check className="h-3 w-3 text-primary" />}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card padded={false}>
            <div className="px-3 h-9 flex items-center border-b hairline">
              <span className="text-[10.5px] uppercase tracking-wider text-foreground-subtle">人员</span>
            </div>
            <div className="p-1.5 space-y-0.5">
              <button
                onClick={() => setPersonFilter("all")}
                className={`w-full text-left h-7 px-2 rounded-[4px] text-[12px] ${personFilter === "all" ? "bg-surface-3 text-foreground" : "text-foreground-muted hover:bg-surface-2"}`}
              >全部</button>
              {allPeople.map((p) => (
                <button
                  key={p}
                  onClick={() => setPersonFilter(p)}
                  className={`w-full text-left h-7 px-2 rounded-[4px] text-[12px] ${personFilter === p ? "bg-surface-3 text-foreground" : "text-foreground-muted hover:bg-surface-2"}`}
                >{p}</button>
              ))}
            </div>
          </Card>

          <Card padded={false}>
            <div className="px-3 h-9 flex items-center border-b hairline">
              <span className="text-[10.5px] uppercase tracking-wider text-foreground-subtle">项目</span>
            </div>
            <div className="p-1.5 space-y-0.5">
              <button
                onClick={() => setProjectFilter("all")}
                className={`w-full text-left h-7 px-2 rounded-[4px] text-[12px] truncate ${projectFilter === "all" ? "bg-surface-3 text-foreground" : "text-foreground-muted hover:bg-surface-2"}`}
              >全部</button>
              {allProjects.map((p) => (
                <button
                  key={p}
                  onClick={() => setProjectFilter(p)}
                  className={`w-full text-left h-7 px-2 rounded-[4px] text-[12px] truncate ${projectFilter === p ? "bg-surface-3 text-foreground" : "text-foreground-muted hover:bg-surface-2"}`}
                >{p}</button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main list */}
        <div className="min-w-0">
          <Card padded={false} className="mb-3">
            <div className="flex items-center gap-2 px-3 h-11">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
                <Input
                  placeholder="按操作、文件、成员搜索…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-7 w-[300px]"
                />
              </div>
              <div className="flex-1" />
              <div className="text-[11.5px] text-foreground-subtle">显示 <span className="font-mono tabular text-foreground-muted">{filtered.length}</span> / {historyEvents.length}</div>
            </div>
          </Card>

          {flash && (
            <div className="mb-3 rounded-[8px] border border-success/40 bg-success/10 px-3 py-2 text-[12px] text-foreground inline-flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-success" />{flash}
            </div>
          )}

          {grouped.length === 0 ? (
            <Card><div className="py-8 text-center text-[12px] text-foreground-subtle">没有匹配的事件。</div></Card>
          ) : (
            <div className="space-y-4">
              {grouped.map(([label, items]) => (
                <div key={label}>
                  <div className="sticky top-0 z-10 bg-background/80 backdrop-blur py-1.5 flex items-center gap-2">
                    <span className="text-[10.5px] font-medium uppercase tracking-wider text-foreground-subtle">{label}</span>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[10.5px] font-mono text-foreground-subtle">{items.length} 条</span>
                  </div>
                  <Card padded={false} className="mt-2">
                    <ul>
                      {items.map((it, i) => {
                        const m = OP_META[it.op];
                        const Icon = m.icon;
                        const canRollback = it.op === "edit" || it.op === "version" || it.op === "delete";
                        return (
                          <li key={it.id} className={`flex items-start gap-3 px-4 py-2.5 row-hover group ${i > 0 ? "border-t hairline" : ""}`}>
                            <div
                              className="mt-0.5 h-6 w-6 grid place-items-center rounded-[6px] border hairline"
                              style={{ backgroundColor: `${m.color.replace(")", " / 0.14)")}`, color: m.color }}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[12px]">
                                <span className="text-foreground font-medium">{it.who}</span>
                                <span className="text-foreground-muted"> {it.action} </span>
                                <span className="text-foreground">{it.target}</span>
                                {it.meta && <Badge variant="neutral" className="ml-2 font-mono">{it.meta}</Badge>}
                              </div>
                              {it.project && (
                                <div className="text-[10.5px] text-foreground-subtle mt-0.5">
                                  于 <span className="text-foreground-muted">{it.project}</span>
                                </div>
                              )}
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              {it.op === "edit" && (
                                <button className="h-6 px-2 rounded-[4px] text-[11px] text-foreground-muted hover:bg-surface-3 hover:text-foreground inline-flex items-center gap-1">
                                  <GitCompare className="h-3 w-3" />差异
                                </button>
                              )}
                              {canRollback && (
                                <button
                                  onClick={() => setRollback(`${it.target} · ${it.meta ?? ""}`.trim())}
                                  className="h-6 px-2 rounded-[4px] text-[11px] text-foreground-muted hover:bg-surface-3 hover:text-foreground inline-flex items-center gap-1"
                                >
                                  <Undo2 className="h-3 w-3" />回滚
                                </button>
                              )}
                            </div>
                            <div className="text-[10.5px] font-mono text-foreground-subtle tabular whitespace-nowrap self-center">{it.time}</div>
                          </li>
                        );
                      })}
                    </ul>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rollback confirm modal */}
      {rollback && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setRollback(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-[420px] rounded-[10px] border border-border-strong bg-popover shadow-2xl animate-scale-in">
            <div className="flex items-start gap-3 p-4 border-b hairline">
              <div className="h-8 w-8 rounded-[8px] bg-warning/15 border border-warning/40 grid place-items-center text-warning">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-foreground">确认回滚？</div>
                <div className="text-[11.5px] text-foreground-muted mt-1">将恢复到此事件之前的状态：</div>
                <div className="text-[11.5px] font-mono text-foreground mt-1 truncate">{rollback}</div>
              </div>
              <button onClick={() => setRollback(null)} className="h-7 w-7 grid place-items-center rounded-[6px] text-foreground-muted hover:bg-surface-3"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-4 text-[11.5px] text-foreground-muted">
              此操作会写入新的历史事件，可再次回滚。当前为演示环境，不会真实修改文件。
            </div>
            <Divider />
            <div className="p-3 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setRollback(null)}>取消</Button>
              <Button variant="primary" onClick={confirmRollback}><Undo2 className="h-3.5 w-3.5" />确认回滚</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
