import { FileEdit, Upload, Trash2, GitBranch, Archive, Sparkles, type LucideIcon } from "lucide-react";

export type HistoryOp = "edit" | "upload" | "version" | "archive" | "delete" | "system";

export type HistoryEvent = {
  id: string;
  time: string;
  day: "今天" | "昨天" | "本周" | "更早";
  date: string;
  who: string;
  op: HistoryOp;
  action: string;
  target: string;
  meta?: string;
  project?: string;
};

export const OP_META: Record<HistoryOp, { label: string; icon: LucideIcon; color: string }> = {
  edit:    { label: "编辑",   icon: FileEdit,  color: "hsl(210 90% 62%)" },
  upload:  { label: "上传",   icon: Upload,    color: "hsl(152 55% 46%)" },
  version: { label: "版本",   icon: GitBranch, color: "hsl(244 78% 66%)" },
  archive: { label: "归档",   icon: Archive,   color: "hsl(220 8% 62%)" },
  delete:  { label: "删除",   icon: Trash2,    color: "hsl(358 68% 58%)" },
  system:  { label: "系统",   icon: Sparkles,  color: "hsl(38 92% 58%)" },
};

export const historyEvents: HistoryEvent[] = [
  { id: "h1", time: "12:04", day: "今天", date: "2026-07-01", who: "李泽", op: "edit", action: "更新了图纸", target: "A-03 二层平面图.dwg", meta: "v13 → v14", project: "外滩 22 号会所" },
  { id: "h2", time: "11:38", day: "今天", date: "2026-07-01", who: "王悦", op: "upload", action: "新建了图纸", target: "S-01 结构总平面.dwg", meta: "v1", project: "松江云庐别墅群" },
  { id: "h3", time: "10:21", day: "今天", date: "2026-07-01", who: "陈默", op: "archive", action: "归档了项目", target: "苏州河公寓样板房", meta: "P-2019" },
  { id: "h4", time: "09:47", day: "今天", date: "2026-07-01", who: "周颖", op: "upload", action: "上传材料", target: "石材_米黄大理石.pdf", meta: "3.2 MB", project: "陆家嘴金融塔 T2" },
  { id: "h5", time: "09:12", day: "今天", date: "2026-07-01", who: "系统", op: "system", action: "完成索引", target: "外滩 22 号会所 (+18 项)", meta: "自动" },
  { id: "h6", time: "18:22", day: "昨天", date: "2026-06-30", who: "李泽", op: "edit", action: "更新了图纸", target: "A-05 南立面图.dwg", meta: "v7 → v8", project: "外滩 22 号会所" },
  { id: "h7", time: "16:04", day: "昨天", date: "2026-06-30", who: "周颖", op: "version", action: "创建分支", target: "T2 幕墙优化 v2", meta: "从 v22", project: "陆家嘴金融塔 T2" },
  { id: "h8", time: "14:48", day: "昨天", date: "2026-06-30", who: "陈默", op: "edit", action: "更新了图纸", target: "M-04 空调水系统.dwg", meta: "v4 → v5", project: "西岸美术馆改造" },
  { id: "h9", time: "11:12", day: "昨天", date: "2026-06-30", who: "刘洋", op: "delete", action: "删除了旧版本", target: "A-12 v0 草稿", meta: "-820 KB", project: "苏州河公寓样板房" },
  { id: "h10", time: "17:36", day: "本周", date: "2026-06-29", who: "王悦", op: "upload", action: "批量导入", target: "78 份 CAD 图纸", meta: "自 SVN", project: "松江云庐别墅群" },
  { id: "h11", time: "10:04", day: "本周", date: "2026-06-29", who: "系统", op: "system", action: "AI 摘要", target: "生成 12 份材料说明", meta: "gpt-5.1" },
  { id: "h12", time: "09:41", day: "更早", date: "2026-06-24", who: "李泽", op: "edit", action: "定稿", target: "外滩 22 号 施工图 v1.0", meta: "" , project: "外滩 22 号会所" },
];

export const allPeople = Array.from(new Set(historyEvents.map(e => e.who)));
export const allProjects = Array.from(new Set(historyEvents.map(e => e.project).filter(Boolean))) as string[];
