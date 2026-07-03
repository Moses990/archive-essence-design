export type DrawingState = "current" | "review" | "outdated" | "archived";

export type Drawing = {
  code: string;
  name: string;
  project: string;
  projectCode: string;
  cat: "平面图" | "立面图" | "剖面图" | "节点大样" | "结构" | "机电";
  v: string;
  vNum: number;
  size: string;
  author: string;
  updated: string;
  state: DrawingState;
};

export const drawings: Drawing[] = [
  { code: "A-03-14", name: "A-03 二层平面图.dwg", project: "外滩 22 号会所", projectCode: "P-2041", cat: "平面图", v: "v14", vNum: 14, size: "8.4 MB", author: "李泽", updated: "12 分钟前", state: "current" },
  { code: "A-05-08", name: "A-05 南立面图.dwg", project: "外滩 22 号会所", projectCode: "P-2041", cat: "立面图", v: "v8", vNum: 8, size: "6.2 MB", author: "李泽", updated: "1 小时前", state: "current" },
  { code: "D-04-09", name: "D-04 门窗大样.dwg", project: "外滩 22 号会所", projectCode: "P-2041", cat: "节点大样", v: "v9", vNum: 9, size: "3.1 MB", author: "李泽", updated: "3 天前", state: "current" },
  { code: "S-01-02", name: "S-01 结构总平面.dwg", project: "松江云庐别墅群", projectCode: "P-2033", cat: "结构", v: "v2", vNum: 2, size: "12.6 MB", author: "王悦", updated: "今天 09:41", state: "review" },
  { code: "A-08-03", name: "A-08 剖面 3-3.dwg", project: "青浦朱家角艺术村", projectCode: "P-1998", cat: "剖面图", v: "v3", vNum: 3, size: "4.6 MB", author: "陈默", updated: "2 天前", state: "outdated" },
  { code: "M-04-05", name: "M-04 空调水系统.dwg", project: "西岸美术馆改造", projectCode: "P-2039", cat: "机电", v: "v5", vNum: 5, size: "5.1 MB", author: "陈默", updated: "昨天", state: "current" },
  { code: "D-11-22", name: "D-11 幕墙节点大样.dwg", project: "陆家嘴金融塔 T2", projectCode: "P-2028", cat: "节点大样", v: "v22", vNum: 22, size: "3.8 MB", author: "周颖", updated: "昨天", state: "current" },
  { code: "A-12-01", name: "A-12 首层地面铺装.dwg", project: "苏州河公寓样板房", projectCode: "P-2019", cat: "平面图", v: "v1", vNum: 1, size: "2.2 MB", author: "刘洋", updated: "3 天前", state: "archived" },
  { code: "A-02-06", name: "A-02 总平面图.dwg", project: "南京西路精品酒店", projectCode: "P-2015", cat: "平面图", v: "v6", vNum: 6, size: "9.8 MB", author: "李泽", updated: "上周", state: "current" },
];

export type DrawingVersion = { v: string; who: string; when: string; note: string };

export const versionHistory: Record<string, DrawingVersion[]> = {
  "A-03-14": [
    { v: "v14", who: "李泽", when: "今天 12:04", note: "调整东侧幕墙分格，与结构复核对齐" },
    { v: "v13", who: "李泽", when: "昨天 18:22", note: "更新会所大厅家具布置" },
    { v: "v12", who: "王悦", when: "2 天前", note: "增加二层平面细节标注" },
    { v: "v11", who: "李泽", when: "上周", note: "初版施工图定稿" },
  ],
};
