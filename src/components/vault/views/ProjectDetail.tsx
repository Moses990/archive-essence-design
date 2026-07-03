import { useState } from "react";
import { Card, Button, Badge, StatusDot, Divider, Input } from "../ui";
import {
  Star, Share2, MoreHorizontal, Info, FileText, DraftingCompass, Package,
  Sparkles, History as HistoryIcon, Download, Eye, GitBranch, MapPin, Calendar, User,
  ChevronRight, ChevronDown, Folder, Search, Filter,
} from "lucide-react";
import { historyEvents, OP_META } from "../data/history";

const TABS = [
  { key: "overview", label: "概览", icon: Info },
  { key: "files", label: "文件", icon: FileText, count: 214 },
  { key: "drawings", label: "图纸", icon: DraftingCompass, count: 128 },
  { key: "materials", label: "材料", icon: Package, count: 46 },
  { key: "team", label: "团队", icon: User, count: 5 },
  { key: "ai", label: "AI", icon: Sparkles },
  { key: "activity", label: "活动", icon: HistoryIcon },
] as const;

type TabKey = typeof TABS[number]["key"];

/* ────────────── shared demo data ────────────── */

const files = [
  { name: "A-03 二层平面图.dwg", type: "CAD", size: "8.4 MB", ver: "v14", author: "李泽", updated: "12 分钟前", state: "current" as const, folder: "CAD" },
  { name: "A-05 南立面图.dwg", type: "CAD", size: "6.2 MB", ver: "v8", author: "李泽", updated: "1 小时前", state: "current" as const, folder: "CAD" },
  { name: "D-04 门窗大样.dwg", type: "CAD", size: "3.1 MB", ver: "v9", author: "李泽", updated: "3 天前", state: "current" as const, folder: "CAD/详图" },
  { name: "材料清单_v2.xlsx", type: "表格", size: "220 KB", ver: "v2", author: "王悦", updated: "昨天", state: "current" as const, folder: "材料" },
  { name: "施工说明.pdf", type: "文档", size: "1.4 MB", ver: "v3", author: "陈默", updated: "昨天", state: "review" as const, folder: "文档" },
  { name: "石材_米黄大理石.pdf", type: "材料", size: "3.2 MB", ver: "v1", author: "周颖", updated: "今天 09:47", state: "current" as const, folder: "材料" },
  { name: "会议纪要_20260628.md", type: "文档", size: "18 KB", ver: "v1", author: "李泽", updated: "3 天前", state: "current" as const, folder: "文档" },
];

const tree = [
  { name: "CAD", children: ["CAD/详图", "CAD/结构"], count: 128 },
  { name: "材料", children: [], count: 46 },
  { name: "文档", children: ["文档/会议纪要"], count: 24 },
  { name: "渲染", children: [], count: 16 },
];

const drawingCards = [
  { code: "A-03", name: "二层平面图", v: "v14", state: "current" as const, author: "李泽", updated: "12 分钟前" },
  { code: "A-05", name: "南立面图", v: "v8", state: "current" as const, author: "李泽", updated: "1 小时前" },
  { code: "A-06", name: "北立面图", v: "v6", state: "review" as const, author: "李泽", updated: "昨天" },
  { code: "D-04", name: "门窗大样", v: "v9", state: "current" as const, author: "李泽", updated: "3 天前" },
  { code: "D-08", name: "楼梯节点", v: "v3", state: "current" as const, author: "王悦", updated: "上周" },
  { code: "S-01", name: "结构总平面", v: "v2", state: "outdated" as const, author: "刘洋", updated: "2 周前" },
];

const materialCats = [
  { key: "stone", label: "石材", count: 12 },
  { key: "wood", label: "木饰面", count: 10 },
  { key: "metal", label: "五金", count: 14 },
  { key: "light", label: "灯具", count: 10 },
] as const;

const materialItems: Record<string, { name: string; vendor: string; price: string; stock: "in" | "low" | "out"; swatch: string }[]> = {
  stone: [
    { name: "米黄大理石 300×600", vendor: "环球石业", price: "¥ 480 /㎡", stock: "in", swatch: "hsl(38 45% 68%)" },
    { name: "云多拉灰 800×800", vendor: "环球石业", price: "¥ 620 /㎡", stock: "low", swatch: "hsl(220 8% 55%)" },
    { name: "黑金花 600×1200", vendor: "上海石材市场", price: "¥ 880 /㎡", stock: "in", swatch: "hsl(30 20% 22%)" },
    { name: "雅士白 抛光", vendor: "环球石业", price: "¥ 720 /㎡", stock: "in", swatch: "hsl(210 8% 88%)" },
  ],
  wood: [
    { name: "白橡木染色 A", vendor: "德国 EGGER", price: "¥ 420 /㎡", stock: "in", swatch: "hsl(30 35% 55%)" },
    { name: "胡桃木直纹", vendor: "上海诺尔", price: "¥ 680 /㎡", stock: "low", swatch: "hsl(22 40% 32%)" },
    { name: "橡木烟熏", vendor: "德国 EGGER", price: "¥ 520 /㎡", stock: "out", swatch: "hsl(28 25% 25%)" },
  ],
  metal: [
    { name: "拉丝香槟金 U 型收边", vendor: "宝钢金属", price: "¥ 88 /m", stock: "in", swatch: "hsl(42 40% 62%)" },
    { name: "黑钛不锈钢板", vendor: "宝钢金属", price: "¥ 1,240 /㎡", stock: "in", swatch: "hsl(220 10% 18%)" },
    { name: "黄铜合页 · 大", vendor: "德国 Hafele", price: "¥ 320 /个", stock: "low", swatch: "hsl(40 55% 55%)" },
  ],
  light: [
    { name: "线性洗墙灯 3000K", vendor: "Erco", price: "¥ 1,880 /m", stock: "in", swatch: "hsl(40 92% 68%)" },
    { name: "轨道射灯 12W", vendor: "iGuzzini", price: "¥ 780 /只", stock: "in", swatch: "hsl(40 88% 74%)" },
    { name: "定制吊灯 Ø1200", vendor: "自制", price: "¥ 24,000 /套", stock: "out", swatch: "hsl(38 60% 65%)" },
  ],
};

const teamMembers = [
  { n: "李泽", r: "主设计师 · Owner", email: "li.ze@studio.cn", perm: "全部", active: "在线", c: "hsl(244 78% 66%)" },
  { n: "王悦", r: "施工图设计",       email: "wang.yue@studio.cn", perm: "编辑",  active: "12 分钟前", c: "hsl(152 55% 46%)" },
  { n: "陈默", r: "机电顾问",         email: "chen.mo@ext.cn", perm: "评论",  active: "1 小时前", c: "hsl(38 92% 58%)" },
  { n: "周颖", r: "材料 / BIM",       email: "zhou.ying@studio.cn", perm: "编辑",  active: "3 小时前", c: "hsl(210 90% 62%)" },
  { n: "刘洋", r: "结构复核",         email: "liu.yang@ext.cn", perm: "只读",  active: "昨天",     c: "hsl(358 68% 58%)" },
];

const aiSuggestions = [
  { title: "生成 A-03 施工说明", desc: "基于图签、图层与元数据推断中文段落", model: "gpt-5.1-mini" },
  { title: "匹配材料库中的候选石材", desc: "根据设计意图关键词返回 5 个近似项", model: "qwen2.5-coder (本地)" },
  { title: "命名规范体检", desc: "检查 128 张图纸的图号是否符合 P-2041 模板", model: "claude-sonnet-4.5" },
];

export default function ProjectDetail() {
  const [tab, setTab] = useState<TabKey>("overview");

  return (
    <div>
      {/* Header strip */}
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
            {TABS.map((t) => {
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
                  {"count" in t && t.count && <span className="font-mono text-[10.5px] text-foreground-subtle">{t.count}</span>}
                  {active && <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-primary rounded-t" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1240px] mx-auto">
        {tab === "overview" && <OverviewTab />}
        {tab === "files" && <FilesTab />}
        {tab === "drawings" && <DrawingsTab />}
        {tab === "materials" && <MaterialsTab />}
        {tab === "team" && <TeamTab />}
        {tab === "ai" && <AiTab />}
        {tab === "activity" && <ActivityTab />}
      </div>
    </div>
  );
}

/* ─────────────────────── Tab: Overview (existing side panel) ─────────────────────── */

function OverviewTab() {
  return (
    <div className="grid grid-cols-[1fr_300px] gap-4">
      <div className="space-y-3">
        <Card>
          <h3 className="text-[12.5px] font-semibold text-foreground mb-2">项目摘要</h3>
          <p className="text-[12px] text-foreground-muted leading-relaxed">
            外滩 22 号会所为独栋会员制高端商业空间，建筑面积 18,420㎡，含地下 2 层、地上 6 层。
            当前处于施工图深化阶段，主要材料为米黄大理石、白橡木染色 A 与拉丝香槟金。
            机电系统由外部顾问 陈默 负责，结构复核由 刘洋 参与。
          </p>
        </Card>
        <div className="grid grid-cols-3 gap-3">
          {[
            { k: "文件总数", v: "214", sub: "CAD 128 · 材料 46" },
            { k: "本周提交", v: "31", sub: "+8 昨日" },
            { k: "待审阅", v: "3", sub: "含 1 项高优" },
          ].map((s) => (
            <Card key={s.k}>
              <div className="text-[10.5px] uppercase tracking-wider text-foreground-subtle">{s.k}</div>
              <div className="mt-1.5 text-[20px] font-semibold tabular font-mono text-foreground">{s.v}</div>
              <div className="mt-1 text-[10.5px] text-foreground-subtle">{s.sub}</div>
            </Card>
          ))}
        </div>
        <Card>
          <h3 className="text-[12.5px] font-semibold text-foreground mb-2">近期里程碑</h3>
          <ol className="relative border-l hairline ml-1.5 pl-4 space-y-3">
            {[
              { d: "2026-07-15", t: "施工图内部评审", s: "计划" },
              { d: "2026-07-30", t: "向业主提交 90% 施工图", s: "计划" },
              { d: "2026-06-24", t: "施工图 v1.0 定稿",       s: "完成" },
              { d: "2026-05-30", t: "扩初图定稿",             s: "完成" },
            ].map((m, i) => (
              <li key={i} className="relative">
                <span className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-background ${m.s === "完成" ? "bg-success" : "bg-primary"}`} />
                <div className="flex items-baseline gap-2">
                  <span className="text-[11.5px] text-foreground">{m.t}</span>
                  <span className="text-[10.5px] font-mono text-foreground-subtle ml-auto">{m.d}</span>
                </div>
                <div className="text-[10.5px] text-foreground-subtle">{m.s}</div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

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
  );
}

/* ─────────────────────── Tab: Files ─────────────────────── */

function FilesTab() {
  const [folder, setFolder] = useState<string>("CAD");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["CAD"]));
  const [q, setQ] = useState("");
  const [mineOnly, setMineOnly] = useState(false);

  const shown = files.filter(f =>
    (folder === "*" || f.folder.startsWith(folder)) &&
    (!mineOnly || f.author === "李泽") &&
    (!q || f.name.toLowerCase().includes(q.toLowerCase()))
  );

  const toggle = (n: string) => {
    const s = new Set(expanded);
    s.has(n) ? s.delete(n) : s.add(n);
    setExpanded(s);
  };

  return (
    <div className="grid grid-cols-[220px_1fr] gap-3">
      <Card padded={false}>
        <div className="px-3 h-9 flex items-center border-b hairline">
          <span className="text-[10.5px] uppercase tracking-wider text-foreground-subtle">目录树</span>
        </div>
        <div className="p-1.5">
          <button
            onClick={() => setFolder("*")}
            className={`w-full text-left h-7 px-2 rounded-[4px] text-[12px] flex items-center gap-1.5 ${folder === "*" ? "bg-surface-3 text-foreground" : "text-foreground-muted hover:bg-surface-2"}`}
          >
            <Folder className="h-3.5 w-3.5" />全部文件
          </button>
          {tree.map((n) => (
            <div key={n.name}>
              <button
                onClick={() => { setFolder(n.name); toggle(n.name); }}
                className={`w-full text-left h-7 px-2 rounded-[4px] text-[12px] flex items-center gap-1.5 ${folder === n.name ? "bg-surface-3 text-foreground" : "text-foreground-muted hover:bg-surface-2"}`}
              >
                {n.children.length > 0 ? (
                  expanded.has(n.name) ? <ChevronDown className="h-3 w-3 text-foreground-subtle" /> : <ChevronRight className="h-3 w-3 text-foreground-subtle" />
                ) : <span className="w-3" />}
                <Folder className="h-3.5 w-3.5" />
                <span className="flex-1 truncate">{n.name}</span>
                <span className="font-mono text-[10.5px] text-foreground-subtle">{n.count}</span>
              </button>
              {expanded.has(n.name) && n.children.map((c) => (
                <button
                  key={c}
                  onClick={() => setFolder(c)}
                  className={`w-full text-left h-7 pl-8 pr-2 rounded-[4px] text-[11.5px] flex items-center gap-1.5 ${folder === c ? "bg-surface-3 text-foreground" : "text-foreground-subtle hover:bg-surface-2"}`}
                >
                  <Folder className="h-3 w-3" />{c.split("/").pop()}
                </button>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <Card padded={false}>
        <div className="flex items-center gap-2 px-3 h-11 border-b hairline">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
            <Input placeholder="搜索文件名…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-7 w-[240px]" />
          </div>
          <label className="ml-2 inline-flex items-center gap-1.5 text-[11.5px] text-foreground-muted cursor-pointer">
            <input type="checkbox" className="accent-primary" checked={mineOnly} onChange={(e) => setMineOnly(e.target.checked)} />
            仅显示我修改的
          </label>
          <div className="flex-1" />
          <span className="text-[11.5px] text-foreground-subtle">{shown.length} 个文件</span>
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
            {shown.map((f) => (
              <tr key={f.name} className="row-hover border-t hairline group">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-[4px] bg-surface-3 border hairline grid place-items-center text-foreground-subtle">
                      <FileText className="h-3 w-3" />
                    </span>
                    <span className="text-foreground font-medium truncate">{f.name}</span>
                    <span className="text-[10.5px] text-foreground-subtle font-mono ml-1">{f.folder}</span>
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
    </div>
  );
}

/* ─────────────────────── Tab: Drawings ─────────────────────── */

function DrawingsTab() {
  return (
    <Card padded={false}>
      <div className="flex items-center gap-2 px-3 h-11 border-b hairline">
        <div className="flex items-center gap-1">
          {["全部", "平面", "立面", "剖面", "详图", "结构"].map((t, i) => (
            <button key={t} className={`h-6 px-2 rounded-[4px] text-[11.5px] ${i === 0 ? "bg-surface-3 text-foreground border hairline" : "text-foreground-subtle hover:text-foreground hover:bg-surface-2 border border-transparent"}`}>{t}</button>
          ))}
        </div>
        <div className="flex-1" />
        <Button variant="outline"><Filter className="h-3.5 w-3.5" />筛选</Button>
      </div>
      <div className="grid grid-cols-3 gap-3 p-3">
        {drawingCards.map((d) => (
          <div key={d.code} className="group rounded-[8px] border hairline bg-surface-1 overflow-hidden hover:border-primary/40 transition-colors">
            <div className="relative h-[120px] grid-bg">
              <div className="absolute inset-3 border border-primary/30 rounded-[4px] bg-surface-2/30" />
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <Badge variant={d.state === "current" ? "primary" : d.state === "review" ? "warning" : "danger"} className="font-mono">
                  <StatusDot variant={d.state === "current" ? "success" : d.state === "review" ? "warning" : "danger"} />
                  {d.v}
                </Badge>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1">
                <button className="h-6 w-6 grid place-items-center rounded-[4px] bg-surface-3/80 backdrop-blur text-foreground hover:bg-surface-3"><Eye className="h-3.5 w-3.5" /></button>
                <button className="h-6 w-6 grid place-items-center rounded-[4px] bg-surface-3/80 backdrop-blur text-foreground hover:bg-surface-3"><Download className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="p-2.5">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[11px] text-foreground-subtle">{d.code}</span>
                <span className="text-[12px] font-medium text-foreground truncate">{d.name}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-[10.5px] text-foreground-subtle">
                <span>{d.author}</span>
                <span>·</span>
                <span>{d.updated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─────────────────────── Tab: Materials ─────────────────────── */

function MaterialsTab() {
  const [cat, setCat] = useState<typeof materialCats[number]["key"]>("stone");
  const items = materialItems[cat];
  return (
    <Card padded={false}>
      <div className="flex items-center gap-1 px-2 h-10 border-b hairline">
        {materialCats.map((m) => (
          <button
            key={m.key}
            onClick={() => setCat(m.key)}
            className={`h-7 px-2.5 rounded-[6px] text-[12px] inline-flex items-center gap-1.5 ${
              cat === m.key
                ? "bg-surface-3 text-foreground border hairline"
                : "text-foreground-subtle hover:text-foreground hover:bg-surface-2 border border-transparent"
            }`}
          >
            {m.label}
            <span className="text-[10.5px] font-mono text-foreground-subtle">{m.count}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-3 p-3">
        {items.map((it) => (
          <div key={it.name} className="rounded-[8px] border hairline bg-surface-1 overflow-hidden hover:border-primary/40 transition-colors">
            <div className="h-[64px]" style={{ backgroundColor: it.swatch }} />
            <div className="p-2.5">
              <div className="text-[12px] font-medium text-foreground truncate">{it.name}</div>
              <div className="mt-1 flex items-center justify-between text-[10.5px] text-foreground-subtle">
                <span className="truncate">{it.vendor}</span>
                <Badge variant={it.stock === "in" ? "success" : it.stock === "low" ? "warning" : "danger"}>
                  <StatusDot variant={it.stock === "in" ? "success" : it.stock === "low" ? "warning" : "danger"} />
                  {it.stock === "in" ? "现货" : it.stock === "low" ? "低库存" : "缺货"}
                </Badge>
              </div>
              <div className="mt-1 text-[11.5px] font-mono text-foreground">{it.price}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─────────────────────── Tab: Team ─────────────────────── */

function TeamTab() {
  return (
    <Card padded={false}>
      <div className="flex items-center justify-between px-4 h-11 border-b hairline">
        <div className="flex items-center gap-2">
          <h3 className="text-[12.5px] font-semibold text-foreground">团队成员</h3>
          <Badge variant="neutral" className="font-mono">{teamMembers.length}</Badge>
        </div>
        <Button variant="primary">+ 邀请成员</Button>
      </div>
      <table className="w-full text-[12px]">
        <thead>
          <tr className="text-left text-[10.5px] uppercase tracking-wider text-foreground-subtle bg-surface-1/50">
            <th className="font-medium px-4 py-2">成员</th>
            <th className="font-medium py-2">角色</th>
            <th className="font-medium py-2 w-[220px]">邮箱</th>
            <th className="font-medium py-2 w-[80px]">权限</th>
            <th className="font-medium py-2 w-[120px]">活跃</th>
            <th className="w-[80px] px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((m) => (
            <tr key={m.n} className="row-hover border-t hairline">
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full grid place-items-center text-[11px] font-semibold text-primary-foreground" style={{ backgroundColor: m.c }}>
                    {m.n.slice(-1)}
                  </span>
                  <span className="text-foreground font-medium">{m.n}</span>
                </div>
              </td>
              <td className="py-2.5 text-foreground-muted">{m.r}</td>
              <td className="py-2.5 text-foreground-muted font-mono text-[11px]">{m.email}</td>
              <td className="py-2.5">
                <Badge variant={m.perm === "全部" ? "primary" : m.perm === "编辑" ? "info" : m.perm === "评论" ? "warning" : "neutral"}>{m.perm}</Badge>
              </td>
              <td className="py-2.5 text-foreground-subtle">{m.active}</td>
              <td className="px-4 py-2.5 text-right">
                <button className="h-6 w-6 grid place-items-center rounded-[4px] hover:bg-surface-3 text-foreground-muted"><MoreHorizontal className="h-3.5 w-3.5" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

/* ─────────────────────── Tab: AI ─────────────────────── */

function AiTab() {
  return (
    <div className="space-y-3">
      <Card>
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-[8px] bg-primary/12 border border-primary/30 grid place-items-center text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-foreground">AI 建议</div>
            <div className="text-[11.5px] text-foreground-muted mt-0.5">基于当前项目上下文的可执行操作</div>
          </div>
          <Button variant="outline">刷新建议</Button>
        </div>
      </Card>
      <div className="grid grid-cols-3 gap-3">
        {aiSuggestions.map((s) => (
          <Card key={s.title}>
            <div className="text-[12.5px] font-medium text-foreground">{s.title}</div>
            <div className="mt-1 text-[11.5px] text-foreground-muted leading-relaxed">{s.desc}</div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10.5px] font-mono text-foreground-subtle">{s.model}</span>
              <Button size="xs" variant="primary">运行</Button>
            </div>
          </Card>
        ))}
      </div>
      <Card padded={false}>
        <div className="px-4 h-10 border-b hairline flex items-center">
          <h3 className="text-[12.5px] font-semibold text-foreground">对话历史</h3>
        </div>
        <div className="p-4 text-[12px] text-foreground-subtle">
          还没有针对本项目的对话。可在命令面板输入 <span className="kbd">/</span> 快速唤起。
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────── Tab: Activity ─────────────────────── */

function ActivityTab() {
  const events = historyEvents.filter(e => e.project === "外滩 22 号会所" || !e.project);
  return (
    <Card padded={false}>
      <div className="flex items-center justify-between px-4 h-10 border-b hairline">
        <h3 className="text-[12.5px] font-semibold text-foreground">本项目活动</h3>
        <Badge variant="neutral" className="font-mono">{events.length}</Badge>
      </div>
      <ul>
        {events.map((it, i) => {
          const m = OP_META[it.op];
          const Icon = m.icon;
          return (
            <li key={it.id} className={`flex items-start gap-3 px-4 py-2.5 row-hover ${i > 0 ? "border-t hairline" : ""}`}>
              <div className="mt-0.5 h-6 w-6 grid place-items-center rounded-[6px] border hairline"
                style={{ backgroundColor: `${m.color.replace(")", " / 0.14)")}`, color: m.color }}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px]">
                  <span className="text-foreground font-medium">{it.who}</span>
                  <span className="text-foreground-muted"> {it.action} </span>
                  <span className="text-foreground">{it.target}</span>
                  {it.meta && <Badge variant="neutral" className="ml-2 font-mono">{it.meta}</Badge>}
                </div>
                <div className="text-[10.5px] text-foreground-subtle mt-0.5 font-mono">{it.date} · {it.time}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
