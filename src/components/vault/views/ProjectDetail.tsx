import { useState } from "react";
import { Card, Button, Badge, StatusDot, Divider } from "../ui";
import {
  Star, Share2, MoreHorizontal, Info, FileText, DraftingCompass, Package,
  Sparkles, History as HistoryIcon, Download, Eye, GitBranch, MapPin, Calendar, User
} from "lucide-react";

const tabs = [
  { key: "overview", label: "概览", icon: Info },
  { key: "files", label: "文件", icon: FileText, count: 214 },
  { key: "drawings", label: "图纸", icon: DraftingCompass, count: 128 },
  { key: "materials", label: "材料", icon: Package, count: 46 },
  { key: "ai", label: "AI", icon: Sparkles },
  { key: "history", label: "历史", icon: HistoryIcon },
];

const files = [
  { name: "A-03 二层平面图.dwg", type: "CAD", size: "8.4 MB", ver: "v14", author: "李泽", updated: "12 分钟前", state: "current" as const },
  { name: "A-05 南立面图.dwg", type: "CAD", size: "6.2 MB", ver: "v8", author: "李泽", updated: "1 小时前", state: "current" as const },
  { name: "D-04 门窗大样.dwg", type: "CAD", size: "3.1 MB", ver: "v9", author: "李泽", updated: "3 天前", state: "current" as const },
  { name: "材料清单_v2.xlsx", type: "表格", size: "220 KB", ver: "v2", author: "王悦", updated: "昨天", state: "current" as const },
  { name: "施工说明.pdf", type: "文档", size: "1.4 MB", ver: "v3", author: "陈默", updated: "昨天", state: "review" as const },
  { name: "石材_米黄大理石.pdf", type: "材料", size: "3.2 MB", ver: "v1", author: "周颖", updated: "今天 09:47", state: "current" as const },
  { name: "会议纪要_20260628.md", type: "文档", size: "18 KB", ver: "v1", author: "李泽", updated: "3 天前", state: "current" as const },
];

export default function ProjectDetail() {
  const [tab, setTab] = useState("files");

  return (
    <div>
      {/* Project header strip */}
      <div className="border-b hairline bg-surface-1">
        <div className="px-6 py-4 max-w-[1240px] mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-[10px] bg-gradient-to-br from-primary to-[hsl(244_78%_46%)] grid place-items-center text-primary-foreground font-semibold text-[15px] shadow-lg shadow-primary/20">
                外
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[16px] font-semibold text-foreground tracking-tight">外滩 22 号会所</h1>
                  <span className="font-mono text-[11px] text-foreground-subtle bg-surface-3 border hairline px-1.5 h-[18px] inline-flex items-center rounded-[4px]">P-2041</span>
                  <Badge variant="primary"><StatusDot />施工图</Badge>
                  <Badge variant="neutral">商业空间</Badge>
                </div>
                <div className="mt-1.5 flex items-center gap-4 text-[11.5px] text-foreground-subtle">
                  <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />负责人 <span className="text-foreground-muted">李泽</span></span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />上海市黄浦区</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />2025-11 → 2026-09</span>
                  <span className="font-mono">/Vault/外滩22号会所</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost"><Star className="h-3.5 w-3.5 fill-warning text-warning" /></Button>
              <Button variant="outline"><Share2 className="h-3.5 w-3.5" />分享</Button>
              <Button variant="outline">在 Finder 打开</Button>
              <Button variant="primary"><Sparkles className="h-3.5 w-3.5" />AI 生成摘要</Button>
              <Button variant="ghost"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex items-center gap-0.5 -mb-4">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`relative h-8 px-3 text-[12px] transition-colors inline-flex items-center gap-1.5 ${
                    active ? "text-foreground" : "text-foreground-subtle hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${active ? "text-primary" : ""}`} />
                  {t.label}
                  {t.count && <span className="font-mono text-[10.5px] text-foreground-subtle">{t.count}</span>}
                  {active && <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-primary rounded-t" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1240px] mx-auto">
        <div className="grid grid-cols-[1fr_300px] gap-4">
          {/* Main */}
          <Card padded={false}>
            <div className="flex items-center justify-between px-4 h-10 border-b hairline">
              <div className="flex items-center gap-2">
                <h2 className="text-[12.5px] font-semibold text-foreground">文件</h2>
                <Badge variant="neutral" className="font-mono">{files.length}</Badge>
              </div>
              <div className="flex items-center gap-1">
                {["全部", "CAD", "文档", "材料", "表格"].map((t, i) => (
                  <button key={t} className={`h-6 px-2 rounded-[4px] text-[11.5px] ${i === 0 ? "bg-surface-3 text-foreground border hairline" : "text-foreground-subtle hover:text-foreground hover:bg-surface-2 border border-transparent"}`}>{t}</button>
                ))}
              </div>
            </div>
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-left text-[10.5px] uppercase tracking-wider text-foreground-subtle bg-surface-1/50">
                  <th className="font-medium px-4 py-2">名称</th>
                  <th className="font-medium py-2 w-[70px]">类型</th>
                  <th className="font-medium py-2 w-[60px]">版本</th>
                  <th className="font-medium py-2 w-[70px] text-right">大小</th>
                  <th className="font-medium py-2 w-[70px]">作者</th>
                  <th className="font-medium py-2 w-[110px]">更新</th>
                  <th className="w-[90px] px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f.name} className="row-hover border-t hairline group">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-[4px] bg-surface-3 border hairline grid place-items-center text-foreground-subtle">
                          <FileText className="h-3 w-3" />
                        </span>
                        <span className="text-foreground font-medium truncate">{f.name}</span>
                      </div>
                    </td>
                    <td className="py-2"><Badge variant="neutral">{f.type}</Badge></td>
                    <td className="py-2">
                      <Badge variant={f.state === "current" ? "primary" : "warning"} className="font-mono">
                        <StatusDot variant={f.state === "current" ? "success" : "warning"} />
                        {f.ver}
                      </Badge>
                    </td>
                    <td className="py-2 text-right tabular font-mono text-foreground-muted">{f.size}</td>
                    <td className="py-2 text-foreground-muted">{f.author}</td>
                    <td className="py-2 text-foreground-subtle">{f.updated}</td>
                    <td className="px-4 py-2 text-right">
                      <div className="inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                        <button className="h-6 w-6 grid place-items-center rounded-[4px] hover:bg-surface-3 text-foreground-muted"><Eye className="h-3.5 w-3.5" /></button>
                        <button className="h-6 w-6 grid place-items-center rounded-[4px] hover:bg-surface-3 text-foreground-muted"><GitBranch className="h-3.5 w-3.5" /></button>
                        <button className="h-6 w-6 grid place-items-center rounded-[4px] hover:bg-surface-3 text-foreground-muted"><Download className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Metadata side */}
          <div className="space-y-3">
            <Card>
              <h3 className="text-[12.5px] font-semibold text-foreground mb-3">项目元数据</h3>
              <dl className="space-y-2 text-[12px]">
                {[
                  ["客户", "外滩集团有限公司"],
                  ["合同编号", "SH-2025-1104"],
                  ["建筑面积", "18,420 m²"],
                  ["造价预算", "¥ 2.4 亿"],
                  ["主设计师", "李泽"],
                  ["施工方", "上海建工八局"],
                  ["交付时间", "2026-09-30"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-foreground-subtle">{k}</dt>
                    <dd className="text-foreground text-right tabular">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card>
              <h3 className="text-[12.5px] font-semibold text-foreground mb-3">团队 (5)</h3>
              <ul className="space-y-2">
                {[
                  { n: "李泽", r: "主设计师 · Owner", c: "hsl(244 78% 66%)" },
                  { n: "王悦", r: "施工图设计", c: "hsl(152 55% 46%)" },
                  { n: "陈默", r: "机电顾问", c: "hsl(38 92% 58%)" },
                  { n: "周颖", r: "材料 / BIM", c: "hsl(210 90% 62%)" },
                  { n: "刘洋", r: "结构复核", c: "hsl(358 68% 58%)" },
                ].map((m) => (
                  <li key={m.n} className="flex items-center gap-2 text-[12px]">
                    <span className="h-6 w-6 rounded-full grid place-items-center text-[10.5px] font-semibold text-primary-foreground" style={{ backgroundColor: m.c }}>
                      {m.n.slice(-1)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-foreground truncate">{m.n}</div>
                      <div className="text-[10.5px] text-foreground-subtle truncate">{m.r}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <Divider className="my-3" />
              <button className="w-full h-7 rounded-[6px] border border-dashed hairline text-[11.5px] text-foreground-subtle hover:text-foreground hover:bg-surface-2 transition-colors">
                + 邀请成员
              </button>
            </Card>

            <Card>
              <h3 className="text-[12.5px] font-semibold text-foreground mb-3">标签</h3>
              <div className="flex flex-wrap gap-1.5">
                {["高端会所", "外滩", "石材主导", "夜景照明", "定制家具", "机电复杂"].map((t) => (
                  <span key={t} className="inline-flex items-center h-5 px-1.5 rounded-[4px] text-[10.5px] bg-surface-3 border hairline text-foreground-muted">
                    #{t}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
