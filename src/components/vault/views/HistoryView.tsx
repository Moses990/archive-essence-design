import { Card, PageHeader, Badge, Button, Input } from "../ui";
import { Search, Filter, FileEdit, Upload, Trash2, GitBranch, Archive, Sparkles } from "lucide-react";

const groups = [
  {
    date: "今天 · 2026-07-01",
    items: [
      { time: "12:04", who: "李泽", icon: FileEdit, action: "更新了图纸", target: "A-03 二层平面图.dwg", meta: "v13 → v14", proj: "外滩 22 号会所" },
      { time: "11:38", who: "王悦", icon: Upload, action: "新建了图纸", target: "S-01 结构总平面.dwg", meta: "v1", proj: "松江云庐别墅群" },
      { time: "10:21", who: "陈默", icon: Archive, action: "归档了项目", target: "苏州河公寓样板房", meta: "P-2019", proj: "" },
      { time: "09:47", who: "周颖", icon: Upload, action: "上传材料", target: "石材_米黄大理石.pdf", meta: "3.2 MB", proj: "陆家嘴金融塔 T2" },
      { time: "09:12", who: "系统", icon: Sparkles, action: "完成索引", target: "外滩 22 号会所 (+18 项)", meta: "自动", proj: "" },
    ],
  },
  {
    date: "昨天 · 2026-06-30",
    items: [
      { time: "18:22", who: "李泽", icon: FileEdit, action: "更新了图纸", target: "A-05 南立面图.dwg", meta: "v7 → v8", proj: "外滩 22 号会所" },
      { time: "16:04", who: "周颖", icon: GitBranch, action: "创建分支", target: "T2 幕墙优化 v2", meta: "从 v22", proj: "陆家嘴金融塔 T2" },
      { time: "14:48", who: "陈默", icon: FileEdit, action: "更新了图纸", target: "M-04 空调水系统.dwg", meta: "v4 → v5", proj: "西岸美术馆改造" },
      { time: "11:12", who: "刘洋", icon: Trash2, action: "删除了旧版本", target: "A-12 v0 草稿", meta: "-820 KB", proj: "苏州河公寓样板房" },
    ],
  },
  {
    date: "2026-06-29",
    items: [
      { time: "17:36", who: "王悦", icon: Upload, action: "批量导入", target: "78 份 CAD 图纸", meta: "自 SVN", proj: "松江云庐别墅群" },
      { time: "10:04", who: "系统", icon: Sparkles, action: "AI 摘要", target: "生成 12 份材料说明", meta: "gpt-家用", proj: "" },
    ],
  },
];

export default function HistoryView() {
  return (
    <div className="p-6 max-w-[1080px] mx-auto">
      <PageHeader
        title="历史记录"
        description="所有资产变更、版本操作与系统事件的时间线"
        actions={
          <>
            <Button variant="outline"><Filter className="h-3.5 w-3.5" />筛选</Button>
            <Button variant="ghost">导出 CSV</Button>
          </>
        }
      />

      <Card padded={false} className="mb-3">
        <div className="flex items-center gap-2 px-3 h-11">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
            <Input placeholder="按操作、文件、成员搜索…" className="pl-7 w-[280px]" />
          </div>
          <div className="flex items-center gap-1 ml-2">
            {["全部", "编辑", "上传", "版本", "归档", "系统"].map((t, i) => (
              <button
                key={t}
                className={`h-6 px-2 rounded-[4px] text-[11.5px] transition-colors ${
                  i === 0 ? "bg-surface-3 text-foreground border hairline" : "text-foreground-subtle hover:text-foreground hover:bg-surface-2 border border-transparent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="text-[11.5px] text-foreground-subtle">共 <span className="font-mono tabular text-foreground-muted">248</span> 条 · 显示最近 30 天</div>
        </div>
      </Card>

      <div className="space-y-4">
        {groups.map((g) => (
          <div key={g.date}>
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur py-1.5 flex items-center gap-2">
              <span className="text-[10.5px] font-medium uppercase tracking-wider text-foreground-subtle">{g.date}</span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10.5px] font-mono text-foreground-subtle">{g.items.length} 条</span>
            </div>
            <Card padded={false} className="mt-2">
              <ul>
                {g.items.map((it, i) => {
                  const Icon = it.icon;
                  return (
                    <li key={i} className={`flex items-start gap-3 px-4 py-2.5 row-hover ${i > 0 ? "border-t hairline" : ""}`}>
                      <div className="mt-0.5 h-6 w-6 grid place-items-center rounded-[6px] bg-surface-3 text-foreground-muted border hairline">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px]">
                          <span className="text-foreground font-medium">{it.who}</span>
                          <span className="text-foreground-muted"> {it.action} </span>
                          <span className="text-foreground">{it.target}</span>
                          {it.meta && <Badge variant="neutral" className="ml-2 font-mono">{it.meta}</Badge>}
                        </div>
                        {it.proj && (
                          <div className="text-[10.5px] text-foreground-subtle mt-0.5">
                            于 <span className="text-foreground-muted">{it.proj}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-[10.5px] font-mono text-foreground-subtle tabular whitespace-nowrap">{it.time}</div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
