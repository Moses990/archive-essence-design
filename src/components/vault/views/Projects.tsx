import { useState } from "react";
import { Card, PageHeader, Button, Badge, StatusDot, Input } from "../ui";
import {
  Plus, Search, Filter, ArrowUpDown, LayoutGrid, List as ListIcon, Star, MoreHorizontal, Upload
} from "lucide-react";
import type { ViewKey } from "../types";

interface Props { onNavigate: (v: ViewKey) => void }

type Project = {
  code: string;
  name: string;
  client: string;
  tag: "住宅" | "商业空间" | "文化建筑" | "办公";
  stage: "方案" | "扩初" | "施工图" | "已交付";
  status: "active" | "review" | "archived";
  drawings: number;
  materials: number;
  size: string;
  updated: string;
  owner: string;
  fav: boolean;
};

const data: Project[] = [
  { code: "P-2041", name: "外滩 22 号会所", client: "外滩集团", tag: "商业空间", stage: "施工图", status: "active", drawings: 128, materials: 46, size: "2.4 GB", updated: "12 分钟前", owner: "李泽", fav: true },
  { code: "P-2039", name: "西岸美术馆改造", client: "西岸集团", tag: "文化建筑", stage: "扩初", status: "active", drawings: 84, materials: 32, size: "1.1 GB", updated: "1 小时前", owner: "王悦", fav: true },
  { code: "P-2033", name: "松江云庐别墅群", client: "云庐置业", tag: "住宅", stage: "扩初", status: "review", drawings: 246, materials: 88, size: "5.6 GB", updated: "今天 09:41", owner: "陈默", fav: true },
  { code: "P-2028", name: "陆家嘴金融塔 T2", client: "陆金置业", tag: "办公", stage: "施工图", status: "active", drawings: 512, materials: 124, size: "12.3 GB", updated: "昨天", owner: "周颖", fav: false },
  { code: "P-2019", name: "苏州河公寓样板房", client: "润庭地产", tag: "住宅", stage: "已交付", status: "archived", drawings: 96, materials: 40, size: "820 MB", updated: "3 天前", owner: "刘洋", fav: false },
  { code: "P-2015", name: "南京西路精品酒店", client: "锦江酒店", tag: "商业空间", stage: "方案", status: "active", drawings: 38, materials: 12, size: "460 MB", updated: "上周", owner: "李泽", fav: false },
  { code: "P-2008", name: "张江科学城办公楼 B 座", client: "张江科技", tag: "办公", stage: "已交付", status: "archived", drawings: 302, materials: 96, size: "7.8 GB", updated: "2 周前", owner: "王悦", fav: false },
  { code: "P-1998", name: "青浦朱家角艺术村", client: "朱家角文旅", tag: "文化建筑", stage: "施工图", status: "active", drawings: 178, materials: 64, size: "3.2 GB", updated: "2 周前", owner: "陈默", fav: false },
];

const tags = ["全部", "住宅", "商业空间", "文化建筑", "办公", "已归档"];

export default function Projects({ onNavigate }: Props) {
  const [mode, setMode] = useState<"list" | "grid">("list");
  const [tag, setTag] = useState("全部");

  const filtered = tag === "全部"
    ? data
    : tag === "已归档"
    ? data.filter(p => p.status === "archived")
    : data.filter(p => p.tag === tag);

  return (
    <div className="p-6 max-w-[1240px] mx-auto">
      <PageHeader
        title="项目"
        description={`${data.length} 个项目 · 索引大小 34.8 GB · 最近同步 09:12`}
        actions={
          <>
            <Button variant="outline"><Upload className="h-3.5 w-3.5" />导入</Button>
            <Button variant="primary"><Plus className="h-3.5 w-3.5" />新建项目</Button>
          </>
        }
      />

      {/* Toolbar */}
      <Card padded={false} className="mb-3">
        <div className="flex items-center gap-2 px-3 h-11 border-b hairline">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle pointer-events-none" />
            <Input placeholder="搜索项目名 / 编号 / 客户…" className="pl-7 w-[260px]" />
          </div>
          <Button variant="outline"><Filter className="h-3.5 w-3.5" />筛选<span className="ml-1 text-foreground-subtle">3</span></Button>
          <Button variant="ghost"><ArrowUpDown className="h-3.5 w-3.5" />最近更新</Button>
          <div className="flex-1" />
          <div className="text-[11.5px] text-foreground-subtle">显示 {filtered.length} 项</div>
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
        {/* segmented filters */}
        <div className="flex items-center gap-1 px-3 h-9 border-b hairline overflow-x-auto scroll-thin">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`h-6 px-2 rounded-[4px] text-[11.5px] transition-colors ${
                tag === t
                  ? "bg-surface-3 text-foreground border hairline"
                  : "text-foreground-subtle hover:text-foreground hover:bg-surface-2 border border-transparent"
              }`}
            >
              {t}
              {tag === t && <span className="ml-1.5 font-mono text-foreground-muted">{filtered.length}</span>}
            </button>
          ))}
        </div>

        {mode === "list" ? (
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
    </div>
  );
}
