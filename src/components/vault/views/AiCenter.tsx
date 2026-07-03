import { useMemo, useState } from "react";
import { Card, PageHeader, Badge, Button, StatusDot, Divider } from "../ui";
import {
  Sparkles, Plus, KeyRound, Zap, ShieldCheck, RefreshCw, Wand2, Check, X,
  BarChart3, Coins, ArrowUpRight, Copy, ChevronDown,
} from "lucide-react";
import { usage30d, promptTemplates, taskAssignments } from "../data/aiUsage";

const providers = [
  { name: "OpenAI",        id: "openai", desc: "GPT 系列 · 兼容 Responses API", model: "gpt-5.1-mini", key: "sk-••••••••••••••4c9a", status: "connected" as const, latency: "138 ms", tokens: "48.2K / 月", color: "hsl(152 55% 46%)" },
  { name: "Anthropic",     id: "anthropic", desc: "Claude 系列 · 长上下文与推理", model: "claude-sonnet-4.5", key: "sk-ant-••••••••••••3f21", status: "connected" as const, latency: "212 ms", tokens: "12.6K / 月", color: "hsl(38 92% 58%)" },
  { name: "本地 Ollama",   id: "ollama", desc: "本机推理 · 无外发数据", model: "qwen2.5-coder:14b", key: "无需密钥 · localhost:11434", status: "connected" as const, latency: "38 ms", tokens: "无限制", color: "hsl(244 78% 66%)" },
  { name: "智谱 GLM",      id: "zhipu", desc: "GLM-4 系列 · 中文优化", model: "glm-4.6", key: "未配置", status: "disconnected" as const, latency: "—", tokens: "—", color: "hsl(210 90% 62%)" },
];

export default function AiCenter() {
  const [assignments, setAssignments] = useState(taskAssignments);
  const [openTask, setOpenTask] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const totals = useMemo(() => {
    const days = usage30d;
    const openai = days.reduce((s, d) => s + d.openai, 0);
    const anthropic = days.reduce((s, d) => s + d.anthropic, 0);
    const ollama = days.reduce((s, d) => s + d.ollama, 0);
    const totalTokens = openai + anthropic + ollama; // in K
    // 简易费用估算：OpenAI 0.6/1K, Anthropic 0.9/1K, Ollama 0
    const cost = openai * 0.6 + anthropic * 0.9;
    return { requests: days.length * 42, tokensK: totalTokens, cost, openai, anthropic, ollama };
  }, []);

  const copyId = (id: string) => {
    navigator.clipboard?.writeText(id).catch(() => {});
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1400);
  };

  return (
    <div className="p-6 max-w-[1240px] mx-auto">
      <PageHeader
        title="AI 中心"
        description="管理模型提供方、用量与能力分配 · 所有密钥仅保存在本机 Keychain"
        actions={
          <>
            <Button variant="outline"><RefreshCw className="h-3.5 w-3.5" />测试全部连接</Button>
            <Button variant="primary"><Plus className="h-3.5 w-3.5" />添加提供方</Button>
          </>
        }
      />

      {/* Usage summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { k: "本月请求数", v: totals.requests.toLocaleString(), delta: "+12% 环比", icon: BarChart3, color: "hsl(210 90% 62%)" },
          { k: "消耗 Tokens", v: `${totals.tokensK.toLocaleString()} K`, delta: "+8% 环比", icon: Sparkles, color: "hsl(244 78% 66%)" },
          { k: "预计费用",   v: `¥ ${totals.cost.toFixed(2)}`, delta: "本机模型 0 元", icon: Coins, color: "hsl(38 92% 58%)" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.k}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11.5px] text-foreground-muted">{s.k}</div>
                  <div className="mt-1.5 text-[22px] font-semibold tabular font-mono text-foreground leading-none">{s.v}</div>
                  <div className="mt-2 text-[10.5px] text-foreground-subtle inline-flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3 text-success" />{s.delta}
                  </div>
                </div>
                <div className="h-7 w-7 rounded-[6px] grid place-items-center"
                  style={{ backgroundColor: `${s.color.replace(")", " / 0.12)")}`, color: s.color }}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Security banner */}
      <div className="mt-3 flex items-start gap-2.5 rounded-[8px] border border-primary/25 bg-primary/8 px-3.5 py-2.5">
        <ShieldCheck className="h-4 w-4 text-primary mt-0.5" />
        <div className="text-[12px] text-foreground-muted">
          <span className="text-foreground font-medium">密钥安全引用</span> · 所有 API 密钥仅存储于本机系统 Keychain，Project Vault 通过引用 ID 访问，不会写入项目文件或同步至云端。
        </div>
        <Button variant="ghost" className="ml-auto"><KeyRound className="h-3.5 w-3.5" />管理 Keychain 引用</Button>
      </div>

      {/* Usage chart + task assignments */}
      <div className="mt-3 grid grid-cols-[1.4fr_1fr] gap-3">
        <Card padded={false}>
          <div className="flex items-center justify-between px-4 h-10 border-b hairline">
            <h3 className="text-[12.5px] font-semibold text-foreground">近 30 天用量</h3>
            <div className="flex items-center gap-2 text-[10.5px]">
              <LegendDot color="hsl(152 55% 46%)" label="OpenAI" />
              <LegendDot color="hsl(38 92% 58%)"  label="Anthropic" />
              <LegendDot color="hsl(244 78% 66%)" label="Ollama" />
            </div>
          </div>
          <div className="p-4">
            <StackedBars data={usage30d} />
            <div className="mt-2 flex items-center justify-between text-[10.5px] text-foreground-subtle font-mono">
              <span>{usage30d[0].d}</span>
              <span>{usage30d[Math.floor(usage30d.length / 2)].d}</span>
              <span>{usage30d[usage30d.length - 1].d}</span>
            </div>
          </div>
        </Card>

        <Card padded={false}>
          <div className="flex items-center justify-between px-4 h-10 border-b hairline">
            <h3 className="text-[12.5px] font-semibold text-foreground">能力 → 模型</h3>
            <span className="text-[10.5px] text-foreground-subtle">按任务分配</span>
          </div>
          <div className="p-2">
            {assignments.map((a, i) => (
              <div key={a.task} className={`px-2 py-2 ${i > 0 ? "border-t hairline" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="text-[12px] text-foreground font-medium">{a.task}</div>
                  <div className="relative">
                    <button
                      onClick={() => setOpenTask(openTask === i ? null : i)}
                      className="inline-flex items-center gap-1.5 h-7 px-2 rounded-[6px] border hairline bg-surface-2 hover:bg-surface-3 text-[11.5px] text-foreground font-mono"
                    >
                      {a.current}<ChevronDown className="h-3 w-3 text-foreground-subtle" />
                    </button>
                    {openTask === i && (
                      <div className="absolute top-8 right-0 z-20 w-[200px] rounded-[8px] border border-border-strong bg-popover shadow-xl p-1">
                        {a.options.map((o) => (
                          <button
                            key={o}
                            onClick={() => {
                              const n = [...assignments];
                              n[i] = { ...a, current: o };
                              setAssignments(n);
                              setOpenTask(null);
                            }}
                            className={`w-full text-left h-7 px-2 rounded-[4px] text-[11.5px] font-mono flex items-center gap-2 ${
                              a.current === o ? "bg-primary/12 text-foreground" : "text-foreground-muted hover:bg-surface-3"
                            }`}
                          >
                            {a.current === o && <Check className="h-3 w-3 text-primary" />}
                            <span className={a.current === o ? "" : "ml-5"}>{o}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Providers grid */}
      <PageHeader title="提供方" description="密钥引用与连接状态" />
      <div className="grid grid-cols-2 gap-3">
        {providers.map((p) => (
          <Card key={p.id} padded={false}>
            <div className="flex items-start justify-between px-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-[8px] border hairline grid place-items-center" style={{ backgroundColor: `${p.color.replace(")", " / 0.14)")}`, color: p.color }}>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-semibold text-foreground">{p.name}</h3>
                    {p.status === "connected"
                      ? <Badge variant="success"><StatusDot />已连接</Badge>
                      : <Badge variant="neutral"><StatusDot variant="neutral" />未连接</Badge>}
                  </div>
                  <p className="text-[11.5px] text-foreground-subtle mt-0.5">{p.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="h-6 px-2 rounded-[4px] text-[11.5px] text-foreground-muted hover:bg-surface-3 hover:text-foreground">
                  <RefreshCw className="inline h-3 w-3 mr-1" />测试
                </button>
                <button className="h-6 px-2 rounded-[4px] text-[11.5px] text-foreground-muted hover:bg-surface-3 hover:text-foreground">编辑</button>
              </div>
            </div>
            <div className="mt-3 mx-4 rounded-[6px] border hairline surface-1 text-[11.5px]">
              <Row k="模型" v={<span className="font-mono">{p.model}</span>} />
              <Row k="密钥引用" v={<span className="font-mono text-foreground-muted">{p.key}</span>} />
              <Row k="延迟" v={<span className="font-mono tabular">{p.latency}</span>} />
              <Row k="用量" v={<span className="font-mono tabular">{p.tokens}</span>} last />
            </div>
            <div className="flex items-center gap-2 px-4 py-3">
              {p.status === "connected"
                ? <span className="text-[11px] text-success inline-flex items-center gap-1"><Check className="h-3 w-3" />上次测试成功 · 2 分钟前</span>
                : <span className="text-[11px] text-foreground-subtle inline-flex items-center gap-1"><X className="h-3 w-3" />未配置密钥</span>}
              <div className="flex-1" />
              <Zap className="h-3 w-3 text-foreground-subtle" />
              <span className="text-[11px] text-foreground-subtle">流式响应</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Prompt templates */}
      <PageHeader title="提示词模板库" description="团队共享 · 支持变量替换与版本管理" />
      <div className="grid grid-cols-3 gap-3">
        {promptTemplates.map((t) => (
          <Card key={t.id} className="group">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Wand2 className="h-3.5 w-3.5 text-primary" />
                  <div className="text-[12.5px] font-semibold text-foreground">{t.name}</div>
                </div>
                <div className="mt-1 text-[11.5px] text-foreground-muted leading-relaxed">{t.desc}</div>
              </div>
              <Badge variant="neutral">{t.tag}</Badge>
            </div>
            <Divider className="my-3" />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-foreground-subtle font-mono">
                {t.vars} 个变量 · id: <span className="text-foreground-muted">{t.id}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyId(t.id)}
                  className="h-6 px-1.5 rounded-[4px] text-foreground-muted hover:bg-surface-3 hover:text-foreground inline-flex items-center gap-1"
                  title="复制 ID"
                >
                  <Copy className="h-3 w-3" />{copied === t.id ? "已复制" : "复制"}
                </button>
                <button className="h-6 px-1.5 rounded-[4px] text-foreground-muted hover:bg-surface-3 hover:text-foreground">编辑</button>
                <Button size="xs" variant="primary">使用</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-foreground-muted">
      <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />{label}
    </span>
  );
}

function StackedBars({ data }: { data: typeof usage30d }) {
  const max = Math.max(...data.map(d => d.openai + d.anthropic + d.ollama)) || 1;
  const H = 140;
  const W = 620;
  const barW = W / data.length - 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[140px]" preserveAspectRatio="none">
      {/* baseline */}
      <line x1="0" y1={H - 0.5} x2={W} y2={H - 0.5} stroke="hsl(228 10% 20%)" strokeWidth="0.5" />
      {[0.25, 0.5, 0.75].map((r) => (
        <line key={r} x1="0" y1={H * (1 - r)} x2={W} y2={H * (1 - r)} stroke="hsl(228 10% 15%)" strokeWidth="0.5" strokeDasharray="2 3" />
      ))}
      {data.map((d, i) => {
        const total = d.openai + d.anthropic + d.ollama;
        const h = (total / max) * (H - 4);
        const x = i * (W / data.length) + 1;
        const y0 = H - h;
        const hO = (d.openai / total) * h;
        const hA = (d.anthropic / total) * h;
        const hL = (d.ollama / total) * h;
        return (
          <g key={i}>
            <rect x={x} y={y0}                fill="hsl(152 55% 46%)" width={barW} height={hO} rx="1.5" />
            <rect x={x} y={y0 + hO}           fill="hsl(38 92% 58%)"  width={barW} height={hA} />
            <rect x={x} y={y0 + hO + hA}      fill="hsl(244 78% 66%)" width={barW} height={hL} />
          </g>
        );
      })}
    </svg>
  );
}

function Row({ k, v, last }: { k: string; v: React.ReactNode; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-3 h-8 ${last ? "" : "border-b hairline"}`}>
      <span className="text-foreground-subtle">{k}</span>
      <span className="text-foreground">{v}</span>
    </div>
  );
}
