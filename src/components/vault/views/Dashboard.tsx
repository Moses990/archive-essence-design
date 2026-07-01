import { Card, PageHeader, Button, Badge, StatusDot, Divider } from "../ui";
import {
  FolderKanban, DraftingCompass, Package, TrendingUp, Plus, Upload,
  ArrowUpRight, Check, Circle, Sparkles, HardDrive
} from "lucide-react";
import type { ViewKey } from "../types";

interface Props { onNavigate: (v: ViewKey) => void }

const metrics = [
  { label: "项目", value: "38", delta: "+3 本周", icon: FolderKanban, color: "hsl(244 78% 66%)" },
  { label: "CAD 图纸", value: "1,284", delta: "+42 本周", icon: DraftingCompass, color: "hsl(210 90% 62%)" },
  { label: "材料文件", value: "612", delta: "+18 本周", icon: Package, color: "hsl(38 92% 58%)" },
  { label: "本月新增资产", value: "8.4 GB", delta: "较上月 +12%", icon: TrendingUp, color: "hsl(152 55% 46%)" },
];

const recent = [
  { code: "P-2041", name: "外滩 22 号会所", stage: "施工图", updated: "12 分钟前", owner: "李泽", drawings: 128, status: "active" as const },
  { code: "P-2039", name: "西岸美术馆改造", stage: "方案深化", updated: "1 小时前", owner: "王悦", drawings: 84, status: "active" as const },
  { code: "P-2033", name: "松江云庐别墅群", stage: "扩初", updated: "今天 09:41", owner: "陈默", drawings: 246, status: "review" as const },
  { code: "P-2028", name: "陆家嘴金融塔 T2", stage: "施工图", updated: "昨天", owner: "周颖", drawings: 512, status: "active" as const },
  { code: "P-2019", name: "苏州河公寓样板房", stage: "已交付", updated: "3 天前", owner: "刘洋", drawings: 96, status: "archived" as const },
];

const onboarding = [
  { done: true, label: "选择本地项目根目录", detail: "/Volumes/Design/Vault" },
  { done: true, label: "首次索引资产", detail: "已索引 1,284 个 CAD、612 份材料" },
  { done: false, label: "连接 AI 提供方", detail: "在 AI 中心配置密钥引用" },
  { done: false, label: "配置本地备份", detail: "推荐每日 03:00 增量备份" },
];

const activity = [
  { time: "12:04", who: "李泽", action: "更新了", target: "A-03-立面图.dwg", ver: "v14" },
  { time: "11:38", who: "王悦", action: "新建了图纸", target: "S-01-总平面.dwg", ver: "v1" },
  { time: "10:21", who: "陈默", action: "归档了项目", target: "苏州河公寓样板房", ver: "" },
  { time: "09:47", who: "周颖", action: "上传材料", target: "石材_米黄大理石.pdf", ver: "" },
  { time: "09:12", who: "系统", action: "完成索引", target: "外滩 22 号会所 (+18 项)", ver: "" },
];

export default function Dashboard({ onNavigate }: Props) {
  const hasData = true;

  return (
    <div className="p-6 max-w-[1240px] mx-auto">
      <PageHeader
        title="工作台"
        description="今天是 2026 年 7 月 1 日 · 3 位成员在线 · 索引服务运行中"
        actions={
          <>
            <Button variant="outline"><Upload className="h-3.5 w-3.5" />导入图纸</Button>
            <Button variant="primary"><Plus className="h-3.5 w-3.5" />新建项目</Button>
          </>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11.5px] text-foreground-muted">{m.label}</div>
                  <div className="mt-1.5 text-[22px] font-semibold tabular tracking-tight text-foreground leading-none">
                    {m.value}
                  </div>
                  <div className="mt-2 text-[10.5px] text-foreground-subtle inline-flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3 text-success" />
                    {m.delta}
                  </div>
                </div>
                <div
                  className="h-7 w-7 rounded-[6px] grid place-items-center"
                  style={{ backgroundColor: `${m.color.replace(")", " / 0.12)")}`, color: m.color }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              {/* sparkline stub */}
              <svg className="mt-3 w-full h-8" viewBox="0 0 200 32" preserveAspectRatio="none">
                <path
                  d="M0,24 L20,20 L40,22 L60,14 L80,18 L100,10 L120,12 L140,6 L160,10 L180,4 L200,8"
                  fill="none"
                  stroke={m.color}
                  strokeOpacity="0.75"
                  strokeWidth="1.25"
                />
                <path
                  d="M0,24 L20,20 L40,22 L60,14 L80,18 L100,10 L120,12 L140,6 L160,10 L180,4 L200,8 L200,32 L0,32 Z"
                  fill={m.color}
                  fillOpacity="0.08"
                />
              </svg>
            </Card>
          );
        })}
      </div>

      {/* Main grid: recent projects (2/3) + side (1/3) */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        <Card padded={false} className="col-span-2">
          <div className="flex items-center justify-between px-4 h-10 border-b hairline">
            <div className="flex items-center gap-2">
              <h2 className="text-[12.5px] font-semibold text-foreground">最近项目</h2>
              <Badge variant="neutral" className="font-mono">{recent.length}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <button className="text-[11.5px] text-foreground-muted hover:text-foreground px-1.5 h-6 rounded-[4px] hover:bg-surface-2">全部</button>
              <button className="text-[11.5px] text-foreground-subtle hover:text-foreground px-1.5 h-6 rounded-[4px] hover:bg-surface-2">仅我参与</button>
              <button className="text-[11.5px] text-foreground-subtle hover:text-foreground px-1.5 h-6 rounded-[4px] hover:bg-surface-2">已归档</button>
              <div className="mx-1 h-4 w-px bg-border" />
              <button onClick={() => onNavigate("projects")} className="text-[11.5px] text-primary hover:underline">查看全部 →</button>
            </div>
          </div>
          {hasData ? (
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-left text-[10.5px] uppercase tracking-wider text-foreground-subtle bg-surface-1/50">
                  <th className="font-medium px-4 py-2 w-[86px]">编号</th>
                  <th className="font-medium py-2">名称</th>
                  <th className="font-medium py-2 w-[92px]">阶段</th>
                  <th className="font-medium py-2 w-[70px] text-right tabular">图纸</th>
                  <th className="font-medium py-2 w-[80px]">负责人</th>
                  <th className="font-medium py-2 w-[110px]">更新</th>
                  <th className="font-medium px-4 py-2 w-[70px]"></th>
                </tr>
              </thead>
              <tbody className="text-foreground-muted">
                {recent.map((r) => (
                  <tr key={r.code} className="row-hover border-t hairline cursor-pointer" onClick={() => onNavigate("project-detail")}>
                    <td className="px-4 py-2 font-mono text-[11px] text-foreground-subtle">{r.code}</td>
                    <td className="py-2 text-foreground font-medium">{r.name}</td>
                    <td className="py-2">
                      <Badge variant={r.status === "review" ? "warning" : r.status === "archived" ? "neutral" : "primary"}>
                        <StatusDot variant={r.status === "review" ? "warning" : r.status === "archived" ? "neutral" : "success"} />
                        {r.stage}
                      </Badge>
                    </td>
                    <td className="py-2 text-right tabular font-mono text-foreground-muted">{r.drawings}</td>
                    <td className="py-2">{r.owner}</td>
                    <td className="py-2 text-foreground-subtle">{r.updated}</td>
                    <td className="px-4 py-2 text-right">
                      <ArrowUpRight className="inline h-3.5 w-3.5 text-foreground-subtle" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyProjects onNavigate={onNavigate} />
          )}
        </Card>

        {/* Side column */}
        <div className="col-span-1 flex flex-col gap-3">
          {/* Onboarding */}
          <Card padded={false}>
            <div className="flex items-center justify-between px-4 h-10 border-b hairline">
              <h2 className="text-[12.5px] font-semibold text-foreground">上手指引</h2>
              <span className="text-[10.5px] font-mono text-foreground-subtle">2 / 4</span>
            </div>
            <ul className="p-2">
              {onboarding.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 px-2 py-1.5 rounded-[6px] hover:bg-surface-2 transition-colors">
                  <div className={`mt-0.5 h-4 w-4 rounded-full grid place-items-center border ${s.done ? "bg-success/15 border-success/40" : "border-border-strong"}`}>
                    {s.done ? <Check className="h-2.5 w-2.5 text-success" /> : <Circle className="h-2 w-2 text-foreground-subtle" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[12px] ${s.done ? "text-foreground-muted line-through" : "text-foreground"}`}>{s.label}</div>
                    <div className="text-[10.5px] text-foreground-subtle mt-0.5 truncate">{s.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
            <Divider />
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11.5px] text-foreground-muted">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                智能建议已启用
              </div>
              <Button size="xs" variant="ghost" onClick={() => onNavigate("ai")}>去配置 →</Button>
            </div>
          </Card>

          {/* Activity */}
          <Card padded={false} className="flex-1">
            <div className="flex items-center justify-between px-4 h-10 border-b hairline">
              <h2 className="text-[12.5px] font-semibold text-foreground">最近活动</h2>
              <button onClick={() => onNavigate("history")} className="text-[11.5px] text-primary hover:underline">全部历史</button>
            </div>
            <ul className="p-2 space-y-0.5">
              {activity.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5 px-2 py-1.5 rounded-[6px] hover:bg-surface-2">
                  <span className="mt-1 badge-dot bg-primary/70" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] text-foreground truncate">
                      <span className="text-foreground-muted">{a.who}</span> {a.action}{" "}
                      <span className="text-foreground font-medium">{a.target}</span>
                      {a.ver && <span className="ml-1 font-mono text-[10.5px] text-foreground-subtle">{a.ver}</span>}
                    </div>
                    <div className="text-[10.5px] text-foreground-subtle font-mono">{a.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Bottom: empty-state showcase (as a mini panel) + system */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        <Card padded={false} className="col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-4 h-10 border-b hairline">
            <h2 className="text-[12.5px] font-semibold text-foreground">新建工作区提示</h2>
            <span className="text-[10.5px] text-foreground-subtle">这些卡片在无数据时会显示</span>
          </div>
          <div className="grid-bg p-8">
            <div className="max-w-[420px] mx-auto text-center">
              <div className="mx-auto h-10 w-10 rounded-[8px] bg-surface-3 border hairline grid place-items-center">
                <FolderKanban className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mt-3 text-[13px] font-semibold text-foreground">还没有项目</h3>
              <p className="mt-1 text-[11.5px] text-foreground-muted">
                将本地设计资产目录加入 Project Vault，即可自动识别 CAD 图纸、材料与文档，并建立可追溯的版本历史。
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Button variant="primary"><Plus className="h-3.5 w-3.5" />新建项目</Button>
                <Button variant="outline"><Upload className="h-3.5 w-3.5" />导入现有目录</Button>
              </div>
              <div className="mt-4 text-[10.5px] text-foreground-subtle inline-flex items-center gap-1">
                <span className="kbd">⌘</span><span className="kbd">K</span> 快速搜索项目、图纸
              </div>
            </div>
          </div>
        </Card>

        <Card padded={false}>
          <div className="flex items-center justify-between px-4 h-10 border-b hairline">
            <h2 className="text-[12.5px] font-semibold text-foreground">系统状态</h2>
            <Badge variant="success"><StatusDot />健康</Badge>
          </div>
          <div className="p-4 space-y-3 text-[12px]">
            {[
              { label: "本地索引", value: "运行中", state: "success" as const, sub: "上次: 09:12" },
              { label: "文件监听", value: "已开启", state: "success" as const, sub: "1,896 个句柄" },
              { label: "AI 网关", value: "已连接", state: "info" as const, sub: "延迟 138 ms" },
              { label: "增量备份", value: "未配置", state: "warning" as const, sub: "建议每日备份" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusDot variant={s.state} />
                  <span className="text-foreground-muted">{s.label}</span>
                </div>
                <div className="text-right">
                  <div className="text-foreground">{s.value}</div>
                  <div className="text-[10.5px] text-foreground-subtle font-mono">{s.sub}</div>
                </div>
              </div>
            ))}
            <Divider />
            <div className="flex items-center gap-2 text-[11.5px] text-foreground-muted">
              <HardDrive className="h-3.5 w-3.5 text-foreground-subtle" />
              本地路径 <span className="font-mono text-foreground">/Volumes/Design/Vault</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function EmptyProjects({ onNavigate }: { onNavigate: (v: ViewKey) => void }) {
  return (
    <div className="p-10 grid-bg text-center">
      <FolderKanban className="mx-auto h-6 w-6 text-foreground-subtle" />
      <h3 className="mt-2 text-[13px] font-semibold text-foreground">尚无项目</h3>
      <p className="mt-1 text-[11.5px] text-foreground-muted">从本地导入或新建一个项目开始。</p>
      <Button variant="primary" className="mt-3" onClick={() => onNavigate("projects")}>
        <Plus className="h-3.5 w-3.5" />新建项目
      </Button>
    </div>
  );
}
