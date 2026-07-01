import { useState } from "react";
import { Card, PageHeader, Button, Badge, StatusDot, Input } from "../ui";
import {
  Search, Upload, Download, Eye, GitBranch, Clock, MoreHorizontal, Layers,
  Filter
} from "lucide-react";

const cats = [
  { key: "all", label: "全部", count: 1284 },
  { key: "plan", label: "平面图", count: 412 },
  { key: "elev", label: "立面图", count: 168 },
  { key: "sect", label: "剖面图", count: 96 },
  { key: "detail", label: "节点大样", count: 348 },
  { key: "struct", label: "结构", count: 142 },
  { key: "mep", label: "机电", count: 118 },
];

const rows = [
  { code: "A-03-14", name: "A-03 二层平面图.dwg", project: "外滩 22 号会所", cat: "平面图", v: "v14", size: "8.4 MB", author: "李泽", updated: "12 分钟前", state: "current" as const },
  { code: "A-05-08", name: "A-05 南立面图.dwg", project: "外滩 22 号会所", cat: "立面图", v: "v8", size: "6.2 MB", author: "李泽", updated: "1 小时前", state: "current" as const },
  { code: "S-01-02", name: "S-01 结构总平面.dwg", project: "松江云庐别墅群", cat: "结构", v: "v2", size: "12.6 MB", author: "王悦", updated: "今天 09:41", state: "review" as const },
  { code: "D-11-22", name: "D-11 幕墙节点大样.dwg", project: "陆家嘴金融塔 T2", cat: "节点大样", v: "v22", size: "3.8 MB", author: "周颖", updated: "昨天", state: "current" as const },
  { code: "M-04-05", name: "M-04 空调水系统.dwg", project: "西岸美术馆改造", cat: "机电", v: "v5", size: "5.1 MB", author: "陈默", updated: "昨天", state: "current" as const },
  { code: "A-08-03", name: "A-08 剖面 3-3.dwg", project: "青浦朱家角艺术村", cat: "剖面图", v: "v3", size: "4.6 MB", author: "陈默", updated: "2 天前", state: "outdated" as const },
  { code: "A-12-01", name: "A-12 首层地面铺装.dwg", project: "苏州河公寓样板房", cat: "平面图", v: "v1", size: "2.2 MB", author: "刘洋", updated: "3 天前", state: "archived" as const },
  { code: "D-04-09", name: "D-04 门窗大样.dwg", project: "外滩 22 号会所", cat: "节点大样", v: "v9", size: "3.1 MB", author: "李泽", updated: "3 天前", state: "current" as const },
  { code: "A-02-06", name: "A-02 总平面图.dwg", project: "南京西路精品酒店", cat: "平面图", v: "v6", size: "9.8 MB", author: "李泽", updated: "上周", state: "current" as const },
];

export default function CadCenter() {
  const [cat, setCat] = useState("all");
  const [sel, setSel] = useState<Set<string>>(new Set());

  const toggle = (code: string) => {
    const n = new Set(sel);
    n.has(code) ? n.delete(code) : n.add(code);
    setSel(n);
  };

  const filtered = cat === "all" ? rows : rows.filter(r => {
    const c = cats.find(c => c.key === cat);
    return c && r.cat === c.label;
  });

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
        {/* segmented categories */}
        <div className="flex items-center gap-1 px-2 h-10 border-b hairline overflow-x-auto scroll-thin">
          {cats.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`h-7 px-2.5 rounded-[6px] text-[12px] transition-colors flex items-center gap-1.5 ${
                cat === c.key
                  ? "bg-surface-3 text-foreground border hairline"
                  : "text-foreground-subtle hover:text-foreground hover:bg-surface-2 border border-transparent"
              }`}
            >
              {c.label}
              <span className={`text-[10.5px] font-mono ${cat === c.key ? "text-foreground-muted" : "text-foreground-subtle"}`}>{c.count}</span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 h-11 border-b hairline">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
            <Input placeholder="搜索图号 / 图名 / 项目…" className="pl-7 w-[280px]" />
          </div>
          <Button variant="outline"><Filter className="h-3.5 w-3.5" />项目<span className="ml-1 text-foreground-subtle">全部</span></Button>
          <Button variant="ghost"><Clock className="h-3.5 w-3.5" />最近 30 天</Button>
          <div className="flex-1" />
          {sel.size > 0 ? (
            <div className="flex items-center gap-2 text-[12px]">
              <span className="text-foreground-muted">已选 <span className="tabular font-mono text-foreground">{sel.size}</span> 项</span>
              <Button variant="outline"><Download className="h-3.5 w-3.5" />批量导出</Button>
              <Button variant="outline"><GitBranch className="h-3.5 w-3.5" />对比版本</Button>
              <Button variant="ghost" onClick={() => setSel(new Set())}>取消</Button>
            </div>
          ) : (
            <div className="text-[11.5px] text-foreground-subtle">共 {filtered.length} 张图纸</div>
          )}
        </div>

        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-left text-[10.5px] uppercase tracking-wider text-foreground-subtle bg-surface-1/50">
              <th className="w-8 px-3 py-2">
                <input type="checkbox" className="accent-primary" />
              </th>
              <th className="w-[92px] font-medium py-2">图号</th>
              <th className="font-medium py-2">图名</th>
              <th className="font-medium py-2 w-[160px]">项目</th>
              <th className="font-medium py-2 w-[86px]">分类</th>
              <th className="font-medium py-2 w-[60px]">版本</th>
              <th className="font-medium py-2 w-[70px] text-right">大小</th>
              <th className="font-medium py-2 w-[70px]">作者</th>
              <th className="font-medium py-2 w-[110px]">更新</th>
              <th className="w-[110px] px-3 py-2 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.code} className="row-hover border-t hairline group">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    className="accent-primary"
                    checked={sel.has(r.code)}
                    onChange={() => toggle(r.code)}
                  />
                </td>
                <td className="py-2 font-mono text-[11px] text-foreground-subtle">{r.code}</td>
                <td className="py-2">
                  <div className="text-foreground font-medium truncate">{r.name}</div>
                </td>
                <td className="py-2 text-foreground-muted truncate">{r.project}</td>
                <td className="py-2"><Badge variant="neutral">{r.cat}</Badge></td>
                <td className="py-2">
                  <Badge variant={r.state === "current" ? "primary" : r.state === "review" ? "warning" : r.state === "outdated" ? "danger" : "neutral"} className="font-mono">
                    <StatusDot variant={r.state === "current" ? "success" : r.state === "review" ? "warning" : r.state === "outdated" ? "danger" : "neutral"} />
                    {r.v}
                  </Badge>
                </td>
                <td className="py-2 text-right tabular font-mono text-foreground-muted">{r.size}</td>
                <td className="py-2 text-foreground-muted">{r.author}</td>
                <td className="py-2 text-foreground-subtle">{r.updated}</td>
                <td className="px-3 py-2 text-right">
                  <div className="inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="h-6 w-6 grid place-items-center rounded-[4px] hover:bg-surface-3 text-foreground-muted" title="预览"><Eye className="h-3.5 w-3.5" /></button>
                    <button className="h-6 w-6 grid place-items-center rounded-[4px] hover:bg-surface-3 text-foreground-muted" title="版本"><GitBranch className="h-3.5 w-3.5" /></button>
                    <button className="h-6 w-6 grid place-items-center rounded-[4px] hover:bg-surface-3 text-foreground-muted" title="下载"><Download className="h-3.5 w-3.5" /></button>
                    <button className="h-6 w-6 grid place-items-center rounded-[4px] hover:bg-surface-3 text-foreground-muted"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-3 h-9 border-t hairline text-[11px] text-foreground-subtle">
          <div>显示 1–{filtered.length} 共 {cats[0].count}</div>
          <div className="flex items-center gap-1">
            <button className="h-6 px-2 rounded-[4px] hover:bg-surface-2 text-foreground-muted">上一页</button>
            <span className="kbd">1</span>
            <span className="text-foreground-subtle">/ 42</span>
            <button className="h-6 px-2 rounded-[4px] hover:bg-surface-2 text-foreground-muted">下一页</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
