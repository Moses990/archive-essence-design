import { useEffect, useMemo, useRef, useState } from "react";
import { Card, PageHeader, Button, Badge, StatusDot, Divider, Input } from "../ui";
import {
  FolderKanban, DraftingCompass, Package, Plus, Upload,
  ArrowUpRight, Check, Circle, Sparkles, HardDrive, FolderOpen, Scan,
  BrainCircuit, ShieldCheck, ChevronRight, ChevronLeft, X, RotateCcw,
  PartyPopper, Command as CommandIcon, RefreshCw, Trash2,
} from "lucide-react";
import type { ViewKey } from "../types";

interface Props { onNavigate: (v: ViewKey) => void; onOpenPalette?: () => void }

/* ────────────────────── Demo data (revealed after onboarding) ────────────────────── */

const metrics = [
  { label: "项目", value: "38", delta: "+3 本周", icon: FolderKanban, color: "hsl(244 78% 66%)" },
  { label: "CAD 图纸", value: "1,284", delta: "+42 本周", icon: DraftingCompass, color: "hsl(210 90% 62%)" },
  { label: "材料文件", value: "612", delta: "+18 本周", icon: Package, color: "hsl(38 92% 58%)" },
];

const recent = [
  { code: "P-2041", name: "外滩 22 号会所", stage: "施工图", updated: "12 分钟前", owner: "李泽", drawings: 128, status: "active" as const },
  { code: "P-2039", name: "西岸美术馆改造", stage: "方案深化", updated: "1 小时前", owner: "王悦", drawings: 84, status: "active" as const },
  { code: "P-2033", name: "松江云庐别墅群", stage: "扩初", updated: "今天 09:41", owner: "陈默", drawings: 246, status: "review" as const },
  { code: "P-2028", name: "陆家嘴金融塔 T2", stage: "施工图", updated: "昨天", owner: "周颖", drawings: 512, status: "active" as const },
  { code: "P-2019", name: "苏州河公寓样板房", stage: "已交付", updated: "3 天前", owner: "刘洋", drawings: 96, status: "archived" as const },
];

const activity = [
  { time: "12:04", who: "李泽", action: "更新了", target: "A-03-立面图.dwg", ver: "v14" },
  { time: "11:38", who: "王悦", action: "新建了图纸", target: "S-01-总平面.dwg", ver: "v1" },
  { time: "10:21", who: "陈默", action: "归档了项目", target: "苏州河公寓样板房", ver: "" },
  { time: "09:47", who: "周颖", action: "上传材料", target: "石材_米黄大理石.pdf", ver: "" },
  { time: "09:12", who: "系统", action: "完成索引", target: "外滩 22 号会所 (+18 项)", ver: "" },
];

type TaskKind = "review" | "material" | "rfi" | "archive" | "meeting";
const initialTasks: {
  id: string; label: string; project: string; owner: string; due: string;
  priority: "high" | "med" | "low"; kind: TaskKind; overdue?: boolean;
}[] = [
  { id: "t1", label: "审阅 A-03 立面图 v14", project: "外滩 22 号会所", owner: "李泽", due: "今天 18:00", priority: "high", kind: "review" },
  { id: "t2", label: "确认外滩 22 号材料清单", project: "外滩 22 号会所", owner: "周颖", due: "明天", priority: "med", kind: "material" },
  { id: "t3", label: "回复 T2 幕墙 RFI-024", project: "陆家嘴金融塔 T2", owner: "周颖", due: "本周五", priority: "med", kind: "rfi" },
  { id: "t4", label: "归档 苏州河公寓 v0 草稿", project: "苏州河公寓样板房", owner: "刘洋", due: "本周", priority: "low", kind: "archive" },
  { id: "t5", label: "西岸美术馆施工图周会纪要", project: "西岸美术馆改造", owner: "王悦", due: "昨天", priority: "high", kind: "meeting", overdue: true },
];

const weekMilestones = [
  { d: "07-02", w: "周四", title: "外滩 22 号 · 90% 施工图评审", project: "P-2041", owner: "李泽",  state: "urgent" as const, days: 1 },
  { d: "07-03", w: "周五", title: "陆家嘴 T2 幕墙 RFI-024 回复截止", project: "P-2028", owner: "周颖", state: "urgent" as const, days: 2 },
  { d: "07-04", w: "周六", title: "西岸美术馆材料样板确认", project: "P-2039", owner: "王悦", state: "normal" as const, days: 3 },
  { d: "07-07", w: "周二", title: "松江云庐 · 结构复核提交", project: "P-2033", owner: "刘洋", state: "normal" as const, days: 6 },
];

/* ────────────────────── Onboarding wizard ────────────────────── */

type StepKey = "root" | "index" | "ai" | "backup";
const STEPS: { key: StepKey; label: string; icon: typeof FolderOpen; hint: string }[] = [
  { key: "root",   label: "选择根目录", icon: FolderOpen,    hint: "指定本地资产存放路径" },
  { key: "index",  label: "索引资产",   icon: Scan,          hint: "扫描 CAD、材料与文档" },
  { key: "ai",     label: "连接 AI",    icon: BrainCircuit,  hint: "为搜索与建议接入模型（可选）" },
  { key: "backup", label: "配置备份",   icon: ShieldCheck,   hint: "启用本地增量备份（可选）" },
];

interface Config {
  rootPath: string;
  aiProvider: "none" | "openai" | "anthropic" | "ollama";
  backup: "off" | "daily" | "hourly";
  indexed: { cad: number; materials: number; docs: number } | null;
}

const DEFAULT_CONFIG: Config = {
  rootPath: "/Volumes/Design/Vault",
  aiProvider: "none",
  backup: "off",
  indexed: null,
};

export default function Dashboard({ onNavigate, onOpenPalette }: Props) {
  const [ready, setReady] = useState(false);            // ← controls empty vs populated
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  if (!ready) {
    return (
      <OnboardingFlow
        onComplete={(cfg) => {
          setConfig(cfg);
          setReady(true);
        }}
      />
    );
  }

  return (
    <PopulatedDashboard
      onNavigate={onNavigate}
      config={config}
      onOpenPalette={onOpenPalette}
      onReset={() => {
        setConfig(DEFAULT_CONFIG);
        setReady(false);
      }}
    />
  );
}

/* ────────────────────── The onboarding flow ────────────────────── */

function OnboardingFlow({ onComplete }: { onComplete: (cfg: Config) => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [cfg, setCfg] = useState<Config>(DEFAULT_CONFIG);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const timer = useRef<number | null>(null);

  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  const canProceed =
    step.key === "root" ? cfg.rootPath.trim().length > 0
    : step.key === "index" ? cfg.indexed !== null
    : true;

  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);

  const runScan = () => {
    if (scanning) return;
    setScanning(true);
    setScanProgress(0);
    setCfg((c) => ({ ...c, indexed: null }));
    timer.current = window.setInterval(() => {
      setScanProgress((p) => {
        const next = Math.min(100, p + Math.random() * 14 + 6);
        if (next >= 100) {
          if (timer.current) window.clearInterval(timer.current);
          setScanning(false);
          setCfg((c) => ({ ...c, indexed: { cad: 1284, materials: 612, docs: 348 } }));
        }
        return next;
      });
    }, 220);
  };

  const goNext = () => {
    if (!canProceed) return;
    if (isLast) {
      setFinishing(true);
      window.setTimeout(() => onComplete(cfg), 650);
      return;
    }
    setStepIdx((i) => i + 1);
  };
  const goBack = () => setStepIdx((i) => Math.max(0, i - 1));
  const skipStep = () => {
    if (step.key === "ai" || step.key === "backup") {
      if (isLast) onComplete(cfg);
      else setStepIdx((i) => i + 1);
    }
  };

  const pct = ((stepIdx + (canProceed ? 1 : 0.35)) / STEPS.length) * 100;

  return (
    <div className="min-h-full grid-bg">
      <div className="max-w-[880px] mx-auto px-6 pt-10 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-[8px] bg-primary/12 border border-primary/25 grid place-items-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-foreground tracking-tight">欢迎使用 Project Vault</h1>
              <p className="text-[11.5px] text-foreground-muted mt-0.5">四个步骤完成初始化，随后即可自动加载示例项目与指标。</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => onComplete(cfg)}>
            <X className="h-3.5 w-3.5" />跳过并加载示例
          </Button>
        </div>

        {/* Stepper */}
        <Card padded={false} className="overflow-hidden">
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => {
                const done = i < stepIdx;
                const active = i === stepIdx;
                const Icon = s.icon;
                return (
                  <button
                    key={s.key}
                    onClick={() => i <= stepIdx && setStepIdx(i)}
                    className={`group flex items-center gap-2 flex-1 min-w-0 text-left ${i <= stepIdx ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div
                      className={[
                        "h-6 w-6 shrink-0 rounded-full grid place-items-center border transition-colors",
                        done ? "bg-success/15 border-success/40 text-success"
                        : active ? "bg-primary/15 border-primary/50 text-primary"
                        : "bg-surface-2 border-border text-foreground-subtle",
                      ].join(" ")}
                    >
                      {done ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                    </div>
                    <div className="min-w-0 hidden sm:block">
                      <div className={`text-[11.5px] font-medium truncate ${active ? "text-foreground" : "text-foreground-muted"}`}>
                        {s.label}
                      </div>
                      <div className="text-[10px] text-foreground-subtle truncate">{s.hint}</div>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-px bg-border mx-1 hidden sm:block" />
                    )}
                  </button>
                );
              })}
            </div>
            {/* progress bar */}
            <div className="mt-3 h-[3px] w-full rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${finishing ? 100 : pct}%` }}
              />
            </div>
          </div>

          <Divider />

          {/* Step body */}
          <div className="p-6 min-h-[280px]">
            {step.key === "root" && (
              <StepRoot cfg={cfg} setCfg={setCfg} />
            )}
            {step.key === "index" && (
              <StepIndex
                cfg={cfg}
                scanning={scanning}
                progress={scanProgress}
                onScan={runScan}
              />
            )}
            {step.key === "ai" && (
              <StepAI cfg={cfg} setCfg={setCfg} />
            )}
            {step.key === "backup" && (
              <StepBackup cfg={cfg} setCfg={setCfg} />
            )}
          </div>

          <Divider />

          {/* Footer actions */}
          <div className="flex items-center justify-between px-4 h-12">
            <div className="text-[11px] text-foreground-subtle font-mono tabular">
              步骤 {stepIdx + 1} / {STEPS.length}
            </div>
            <div className="flex items-center gap-2">
              {stepIdx > 0 && (
                <Button variant="ghost" onClick={goBack}>
                  <ChevronLeft className="h-3.5 w-3.5" />上一步
                </Button>
              )}
              {(step.key === "ai" || step.key === "backup") && (
                <Button variant="outline" onClick={skipStep}>暂不设置</Button>
              )}
              <Button variant="primary" onClick={goNext} disabled={!canProceed || finishing}>
                {finishing
                  ? <><PartyPopper className="h-3.5 w-3.5" />正在生成示例…</>
                  : isLast
                    ? <><Check className="h-3.5 w-3.5" />完成并加载示例</>
                    : <>下一步<ChevronRight className="h-3.5 w-3.5" /></>}
              </Button>
            </div>
          </div>
        </Card>

        {/* Foot note */}
        <p className="text-center text-[10.5px] text-foreground-subtle mt-4">
          所有配置仅保存在本地会话，不会上传任何文件或路径。
        </p>
      </div>
    </div>
  );
}

/* ---------- Step 1: pick root ---------- */
function StepRoot({ cfg, setCfg }: { cfg: Config; setCfg: (u: (c: Config) => Config) => void }) {
  const presets = [
    "/Volumes/Design/Vault",
    "~/Documents/项目资产",
    "D:/Studio/Projects",
  ];
  return (
    <div>
      <StepHeader
        icon={FolderOpen}
        title="选择本地项目根目录"
        desc="Project Vault 将监听该目录下的所有 CAD、材料与文档，并建立可追溯的版本历史。文件永远保留在本地。"
      />
      <div className="mt-5">
        <label className="text-[11px] font-medium text-foreground-muted">本地路径</label>
        <div className="mt-1.5 flex items-center gap-2">
          <Input
            className="flex-1 h-8 font-mono"
            value={cfg.rootPath}
            onChange={(e) => setCfg((c) => ({ ...c, rootPath: e.target.value }))}
            placeholder="/Volumes/Design/Vault"
          />
          <Button variant="outline"><FolderOpen className="h-3.5 w-3.5" />浏览…</Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setCfg((c) => ({ ...c, rootPath: p }))}
              className="text-[11px] font-mono px-2 h-6 rounded-[4px] border hairline bg-surface-2 hover:bg-surface-3 text-foreground-muted hover:text-foreground"
            >
              {p}
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-[6px] border hairline bg-surface-1/60 p-3 text-[11.5px] text-foreground-muted">
          <div className="flex items-center gap-1.5 text-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-success" /> 本地优先
          </div>
          <p className="mt-1 text-foreground-subtle">
            索引数据存储于 <span className="font-mono text-foreground-muted">{cfg.rootPath || "…"}/.vault</span>，可随时移除。
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 2: index ---------- */
function StepIndex({
  cfg, scanning, progress, onScan,
}: { cfg: Config; scanning: boolean; progress: number; onScan: () => void }) {
  const done = cfg.indexed !== null && !scanning;
  return (
    <div>
      <StepHeader
        icon={Scan}
        title="首次索引资产"
        desc="扫描根目录以识别 CAD 图纸、材料与文档。此过程仅读取文件，不会移动或修改任何内容。"
      />
      <div className="mt-5 rounded-[8px] border hairline bg-surface-1/60 p-4">
        <div className="flex items-center justify-between">
          <div className="text-[11.5px] text-foreground-muted">
            扫描路径 <span className="font-mono text-foreground">{cfg.rootPath}</span>
          </div>
          {done && <Badge variant="success"><StatusDot />索引完成</Badge>}
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-surface-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-200 ${done ? "bg-success" : "bg-primary"}`}
            style={{ width: `${done ? 100 : progress}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: "CAD 图纸", value: cfg.indexed?.cad, icon: DraftingCompass },
            { label: "材料文件", value: cfg.indexed?.materials, icon: Package },
            { label: "文档",     value: cfg.indexed?.docs,      icon: FolderKanban },
          ].map((k) => {
            const I = k.icon;
            return (
              <div key={k.label} className="rounded-[6px] bg-surface-2 border hairline p-2.5">
                <div className="flex items-center gap-1.5 text-[10.5px] text-foreground-subtle">
                  <I className="h-3 w-3" />{k.label}
                </div>
                <div className="mt-1 text-[16px] font-semibold tabular text-foreground leading-none">
                  {scanning ? "…" : (k.value ?? 0).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Button variant="primary" onClick={onScan} disabled={scanning}>
            {scanning ? <><Scan className="h-3.5 w-3.5 animate-pulse" />扫描中 {Math.floor(progress)}%</>
              : done ? <><RotateCcw className="h-3.5 w-3.5" />重新扫描</>
              : <><Scan className="h-3.5 w-3.5" />开始扫描</>}
          </Button>
          {!done && !scanning && (
            <span className="text-[11px] text-foreground-subtle">通常在 10 秒内完成</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 3: AI ---------- */
function StepAI({ cfg, setCfg }: { cfg: Config; setCfg: (u: (c: Config) => Config) => void }) {
  const options: { key: Config["aiProvider"]; name: string; sub: string; badge?: string }[] = [
    { key: "openai",    name: "OpenAI",           sub: "GPT-4o / o-series，云端",          badge: "推荐" },
    { key: "anthropic", name: "Anthropic",        sub: "Claude Sonnet，云端" },
    { key: "ollama",    name: "Ollama（本地）",   sub: "在本机运行开源模型，离线可用",     badge: "本地" },
    { key: "none",      name: "暂不启用",         sub: "稍后可在 AI 中心配置" },
  ];
  return (
    <div>
      <StepHeader
        icon={BrainCircuit}
        title="连接 AI 提供方"
        desc="AI 用于自然语言检索、图纸说明生成和材料匹配。密钥仅以引用形式保存在系统钥匙串中。"
      />
      <div className="mt-4 grid grid-cols-2 gap-2">
        {options.map((o) => {
          const active = cfg.aiProvider === o.key;
          return (
            <button
              key={o.key}
              onClick={() => setCfg((c) => ({ ...c, aiProvider: o.key }))}
              className={[
                "text-left rounded-[8px] border p-3 transition-colors",
                active ? "border-primary/60 bg-primary/8 ring-1 ring-primary/40"
                       : "hairline bg-surface-2 hover:bg-surface-3",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="text-[12.5px] font-medium text-foreground">{o.name}</div>
                {o.badge && <Badge variant={o.badge === "本地" ? "info" : "primary"}>{o.badge}</Badge>}
              </div>
              <div className="mt-1 text-[11px] text-foreground-muted">{o.sub}</div>
              <div className="mt-2 flex items-center gap-1.5 text-[10.5px]">
                <div className={`h-3 w-3 rounded-full border grid place-items-center ${active ? "bg-primary border-primary" : "border-border-strong"}`}>
                  {active && <Check className="h-2 w-2 text-primary-foreground" />}
                </div>
                <span className={active ? "text-foreground" : "text-foreground-subtle"}>
                  {active ? "已选择" : "选择"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Step 4: backup ---------- */
function StepBackup({ cfg, setCfg }: { cfg: Config; setCfg: (u: (c: Config) => Config) => void }) {
  const options: { key: Config["backup"]; name: string; sub: string }[] = [
    { key: "daily",  name: "每日 03:00 增量备份", sub: "推荐 · 仅备份变更块，占用极小" },
    { key: "hourly", name: "每小时快照",           sub: "适合活跃项目，占用较多" },
    { key: "off",    name: "暂不启用",             sub: "可随时在 设置 中开启" },
  ];
  return (
    <div>
      <StepHeader
        icon={ShieldCheck}
        title="配置本地备份"
        desc="将快照写入本地或挂载的备份卷。Project Vault 永远不会将您的图纸上传至云端。"
      />
      <div className="mt-4 space-y-2">
        {options.map((o) => {
          const active = cfg.backup === o.key;
          return (
            <button
              key={o.key}
              onClick={() => setCfg((c) => ({ ...c, backup: o.key }))}
              className={[
                "w-full text-left rounded-[8px] border p-3 flex items-start gap-3 transition-colors",
                active ? "border-primary/60 bg-primary/8 ring-1 ring-primary/40"
                       : "hairline bg-surface-2 hover:bg-surface-3",
              ].join(" ")}
            >
              <div className={`mt-0.5 h-4 w-4 rounded-full border grid place-items-center ${active ? "bg-primary border-primary" : "border-border-strong"}`}>
                {active && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-medium text-foreground">{o.name}</div>
                <div className="mt-0.5 text-[11px] text-foreground-muted">{o.sub}</div>
              </div>
              {o.key === "daily" && <Badge variant="success">推荐</Badge>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepHeader({ icon: Icon, title, desc }: { icon: typeof FolderOpen; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 shrink-0 rounded-[8px] bg-primary/12 border border-primary/25 grid place-items-center text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-[13.5px] font-semibold text-foreground tracking-tight">{title}</h2>
        <p className="mt-1 text-[11.5px] text-foreground-muted leading-relaxed max-w-[560px]">{desc}</p>
      </div>
    </div>
  );
}

/* ────────────────────── Populated dashboard (post-onboarding) ────────────────────── */

function PopulatedDashboard({
  onNavigate, config, onReset, onOpenPalette,
}: { onNavigate: (v: ViewKey) => void; config: Config; onReset: () => void; onOpenPalette?: () => void }) {
  const [tasks, setTasks] = useState(initialTasks);
  const completeTask = (id: string) => setTasks((ts) => ts.filter((t) => t.id !== id));

  const used = storageParts.reduce((s, p) => s + p.gb, 0);
  const pct = Math.round((used / STORAGE_TOTAL_GB) * 100);

  return (
    <div className="p-6 max-w-[1240px] mx-auto animate-fade-in">
      <PageHeader
        title="工作台"
        description={`今天是 2026 年 7 月 1 日 · 3 位成员在线 · 索引服务运行中 · 根目录 ${config.rootPath}`}
        actions={
          <>
            <Button variant="ghost" onClick={onReset} title="重新查看空状态引导">
              <RotateCcw className="h-3.5 w-3.5" />重置演示
            </Button>
            <Button variant="outline"><Upload className="h-3.5 w-3.5" />导入图纸</Button>
            <Button variant="primary"><Plus className="h-3.5 w-3.5" />新建项目</Button>
          </>
        }
      />

      {/* Metrics — 3 列 */}
      <div className="grid grid-cols-3 gap-3">
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
              <svg className="mt-3 w-full h-8" viewBox="0 0 200 32" preserveAspectRatio="none">
                <path d="M0,24 L20,20 L40,22 L60,14 L80,18 L100,10 L120,12 L140,6 L160,10 L180,4 L200,8"
                  fill="none" stroke={m.color} strokeOpacity="0.75" strokeWidth="1.25" />
                <path d="M0,24 L20,20 L40,22 L60,14 L80,18 L100,10 L120,12 L140,6 L160,10 L180,4 L200,8 L200,32 L0,32 Z"
                  fill={m.color} fillOpacity="0.08" />
              </svg>
            </Card>
          );
        })}
      </div>

      {/* 待办 + 存储 */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        <Card padded={false} className="col-span-2">
          <div className="flex items-center justify-between px-4 h-10 border-b hairline">
            <div className="flex items-center gap-2">
              <h2 className="text-[12.5px] font-semibold text-foreground">待办 / 待审阅</h2>
              <Badge variant="warning" className="font-mono">{tasks.length}</Badge>
            </div>
            <button className="text-[11.5px] text-primary hover:underline">全部待办 →</button>
          </div>
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-[12px] text-foreground-subtle">
              <Check className="h-4 w-4 mx-auto text-success mb-1.5" />
              全部完成，今天可以早点下班 ☕️
            </div>
          ) : (
            <ul>
              {tasks.map((t) => (
                <li key={t.id} className="row-hover border-t hairline first:border-t-0 flex items-start gap-3 px-4 py-2.5">
                  <button
                    onClick={() => completeTask(t.id)}
                    className="mt-0.5 h-4 w-4 rounded-full border border-border-strong hover:border-success hover:bg-success/15 grid place-items-center group"
                    title="标记完成"
                  >
                    <Check className="h-2.5 w-2.5 text-transparent group-hover:text-success" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-foreground truncate">{t.label}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-[10.5px] text-foreground-subtle">
                      <span className="truncate">{t.project}</span>
                      <span>·</span>
                      <span>{t.owner}</span>
                      <span>·</span>
                      <span className="font-mono">{t.due}</span>
                    </div>
                  </div>
                  <Badge variant={t.priority === "high" ? "danger" : t.priority === "med" ? "warning" : "neutral"}>
                    {t.priority === "high" ? "紧急" : t.priority === "med" ? "常规" : "低"}
                  </Badge>
                  <button
                    onClick={() => onNavigate("project-detail")}
                    className="text-[11px] text-foreground-muted hover:text-foreground px-2 h-6 rounded-[4px] hover:bg-surface-3"
                  >
                    打开
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card padded={false}>
          <div className="flex items-center justify-between px-4 h-10 border-b hairline">
            <h2 className="text-[12.5px] font-semibold text-foreground">存储用量</h2>
            <Badge variant="neutral" className="font-mono">{pct}%</Badge>
          </div>
          <div className="p-4">
            <div className="flex items-baseline gap-1.5">
              <div className="text-[22px] font-semibold tabular tracking-tight text-foreground leading-none font-mono">{used.toFixed(1)}</div>
              <div className="text-[11.5px] text-foreground-subtle">/ {STORAGE_TOTAL_GB} GB</div>
            </div>
            <div className="mt-3 flex h-2 w-full rounded-full overflow-hidden bg-surface-3">
              {storageParts.map((p) => (
                <div key={p.key}
                  style={{ width: `${(p.gb / STORAGE_TOTAL_GB) * 100}%`, backgroundColor: p.color }}
                  title={`${p.key} ${p.gb} GB`}
                />
              ))}
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              {storageParts.map((p) => (
                <li key={p.key} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: p.color }} />
                  <span className="flex-1 text-foreground-muted">{p.key}</span>
                  <span className="font-mono tabular text-foreground">{p.gb} GB</span>
                </li>
              ))}
            </ul>
            <Divider className="my-3" />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-foreground-subtle inline-flex items-center gap-1">
                <Trash2 className="h-3 w-3" />清理建议 3 项
              </span>
              <button onClick={() => onNavigate("settings")} className="text-primary hover:underline">前往清理 →</button>
            </div>
          </div>
        </Card>
      </div>

      {/* 最近项目 + 快速操作/活动 */}
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
        </Card>

        <div className="col-span-1 flex flex-col gap-3">
          <Card padded={false}>
            <div className="flex items-center justify-between px-4 h-10 border-b hairline">
              <h2 className="text-[12.5px] font-semibold text-foreground">快速操作</h2>
              <span className="text-[10.5px] text-foreground-subtle">高频入口</span>
            </div>
            <div className="p-2 grid grid-cols-2 gap-1.5">
              <QuickAction icon={Plus} label="新建项目" hint="N" onClick={() => onNavigate("projects")} />
              <QuickAction icon={Upload} label="导入 CAD" hint="U" onClick={() => onNavigate("cad")} />
              <QuickAction icon={RefreshCw} label="重新索引" hint="R I" onClick={() => { /* demo */ }} />
              <QuickAction icon={CommandIcon} label="命令面板" hint="⌘K" onClick={() => onOpenPalette?.()} />
            </div>
          </Card>

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

      {/* 系统状态一行式 */}
      <Card padded={false} className="mt-3">
        <div className="flex items-center gap-5 px-4 h-11 text-[11.5px] flex-wrap">
          <div className="inline-flex items-center gap-1.5 text-foreground-muted">
            <StatusDot /> 系统 <span className="text-foreground">健康</span>
          </div>
          <span className="text-border">·</span>
          <div className="inline-flex items-center gap-1.5 text-foreground-muted">
            <StatusDot /> 本地索引 <span className="text-foreground">运行中</span>
            <span className="text-foreground-subtle font-mono">09:12</span>
          </div>
          <span className="text-border">·</span>
          <div className="inline-flex items-center gap-1.5 text-foreground-muted">
            <StatusDot variant={config.aiProvider === "none" ? "warning" : "info"} />
            AI 网关 <span className="text-foreground">{config.aiProvider === "none" ? "未连接" : labelForProvider(config.aiProvider)}</span>
          </div>
          <span className="text-border">·</span>
          <div className="inline-flex items-center gap-1.5 text-foreground-muted">
            <StatusDot variant={config.backup === "off" ? "warning" : "success"} />
            备份 <span className="text-foreground">{config.backup === "off" ? "未配置" : config.backup === "daily" ? "每日 03:00" : "每小时"}</span>
          </div>
          <div className="flex-1" />
          <div className="inline-flex items-center gap-1.5 text-foreground-subtle">
            <HardDrive className="h-3 w-3" />
            <span className="font-mono text-foreground-muted truncate max-w-[240px]">{config.rootPath}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function QuickAction({ icon: Icon, label, hint, onClick }: { icon: typeof Plus; label: string; hint: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-start gap-2.5 p-2.5 rounded-[6px] border hairline bg-surface-1/60 hover:bg-surface-2 hover:border-primary/40 transition-colors text-left"
    >
      <div className="h-6 w-6 shrink-0 rounded-[5px] bg-surface-3 border hairline grid place-items-center text-foreground-muted group-hover:text-primary">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11.5px] font-medium text-foreground truncate">{label}</div>
        <div className="text-[10px] font-mono text-foreground-subtle mt-0.5">{hint}</div>
      </div>
    </button>
  );
}


function labelForProvider(p: Config["aiProvider"]) {
  switch (p) {
    case "openai": return "OpenAI";
    case "anthropic": return "Anthropic";
    case "ollama": return "Ollama（本地）";
    default: return "未连接";
  }
}
