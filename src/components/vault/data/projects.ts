export type ProjectTag = "住宅" | "商业空间" | "文化建筑" | "办公";
export type ProjectStatus = "active" | "review" | "archived";

export type Project = {
  code: string;
  name: string;
  client: string;
  tag: ProjectTag;
  stage: "方案" | "扩初" | "施工图" | "已交付";
  status: ProjectStatus;
  drawings: number;
  materials: number;
  size: string;
  updated: string;
  owner: string;
  fav: boolean;
};

export const projects: Project[] = [
  { code: "P-2041", name: "外滩 22 号会所", client: "外滩集团", tag: "商业空间", stage: "施工图", status: "active", drawings: 128, materials: 46, size: "2.4 GB", updated: "12 分钟前", owner: "李泽", fav: true },
  { code: "P-2039", name: "西岸美术馆改造", client: "西岸集团", tag: "文化建筑", stage: "扩初", status: "active", drawings: 84, materials: 32, size: "1.1 GB", updated: "1 小时前", owner: "王悦", fav: true },
  { code: "P-2033", name: "松江云庐别墅群", client: "云庐置业", tag: "住宅", stage: "扩初", status: "review", drawings: 246, materials: 88, size: "5.6 GB", updated: "今天 09:41", owner: "陈默", fav: true },
  { code: "P-2028", name: "陆家嘴金融塔 T2", client: "陆金置业", tag: "办公", stage: "施工图", status: "active", drawings: 512, materials: 124, size: "12.3 GB", updated: "昨天", owner: "周颖", fav: false },
  { code: "P-2019", name: "苏州河公寓样板房", client: "润庭地产", tag: "住宅", stage: "已交付", status: "archived", drawings: 96, materials: 40, size: "820 MB", updated: "3 天前", owner: "刘洋", fav: false },
  { code: "P-2015", name: "南京西路精品酒店", client: "锦江酒店", tag: "商业空间", stage: "方案", status: "active", drawings: 38, materials: 12, size: "460 MB", updated: "上周", owner: "李泽", fav: false },
  { code: "P-2008", name: "张江科学城办公楼 B 座", client: "张江科技", tag: "办公", stage: "已交付", status: "archived", drawings: 302, materials: 96, size: "7.8 GB", updated: "2 周前", owner: "王悦", fav: false },
  { code: "P-1998", name: "青浦朱家角艺术村", client: "朱家角文旅", tag: "文化建筑", stage: "施工图", status: "active", drawings: 178, materials: 64, size: "3.2 GB", updated: "2 周前", owner: "陈默", fav: false },
];

export const clients = Array.from(new Set(projects.map(p => p.client)));
export const tagOptions: ProjectTag[] = ["住宅", "商业空间", "文化建筑", "办公"];

export type ProjectsFilter = {
  query: string;
  client: string | "all";
  status: ProjectStatus | "all";
  tag: ProjectTag | "all";
  favOnly: boolean;
};

export const defaultFilter: ProjectsFilter = {
  query: "",
  client: "all",
  status: "all",
  tag: "all",
  favOnly: false,
};

export function applyFilter(list: Project[], f: ProjectsFilter): Project[] {
  const q = f.query.trim().toLowerCase();
  return list.filter(p => {
    if (f.favOnly && !p.fav) return false;
    if (f.client !== "all" && p.client !== f.client) return false;
    if (f.status !== "all" && p.status !== f.status) return false;
    if (f.tag !== "all" && p.tag !== f.tag) return false;
    if (q) {
      const hay = `${p.code} ${p.name} ${p.client} ${p.owner}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function filterSummary(f: ProjectsFilter): string[] {
  const parts: string[] = [];
  if (f.favOnly) parts.push("收藏");
  if (f.status !== "all") parts.push({ active: "进行中", review: "待审阅", archived: "已归档" }[f.status]);
  if (f.tag !== "all") parts.push(f.tag);
  if (f.client !== "all") parts.push(f.client);
  if (f.query) parts.push(`"${f.query}"`);
  return parts;
}
