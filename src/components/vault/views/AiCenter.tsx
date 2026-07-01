import { Card, PageHeader, Badge, Button, StatusDot, Divider } from "../ui";
import { Sparkles, Plus, KeyRound, Zap, ShieldCheck, RefreshCw, Wand2, Check, X } from "lucide-react";

const providers = [
  {
    name: "OpenAI",
    id: "openai",
    desc: "GPT 系列 · 兼容 Responses API",
    model: "gpt-5.1-mini",
    key: "sk-••••••••••••••4c9a",
    status: "connected" as const,
    latency: "138 ms",
    tokens: "48.2K / 月",
  },
  {
    name: "Anthropic",
    id: "anthropic",
    desc: "Claude 系列 · 长上下文与推理",
    model: "claude-sonnet-4.5",
    key: "sk-ant-••••••••••••3f21",
    status: "connected" as const,
    latency: "212 ms",
    tokens: "12.6K / 月",
  },
  {
    name: "本地 Ollama",
    id: "ollama",
    desc: "本机推理 · 无外发数据",
    model: "qwen2.5-coder:14b",
    key: "无需密钥 · localhost:11434",
    status: "connected" as const,
    latency: "38 ms",
    tokens: "无限制",
  },
  {
    name: "智谱 GLM",
    id: "zhipu",
    desc: "GLM-4 系列 · 中文优化",
    model: "glm-4.6",
    key: "未配置",
    status: "disconnected" as const,
    latency: "—",
    tokens: "—",
  },
];

const abilities = [
  { name: "图纸摘要", desc: "对上传的 DWG 生成中文说明", provider: "OpenAI · gpt-5.1-mini", enabled: true },
  { name: "材料匹配", desc: "根据设计意图推荐材料库项", provider: "本地 Ollama · qwen2.5", enabled: true },
  { name: "命名规范检查", desc: "检查图号是否符合项目模板", provider: "Anthropic · claude-sonnet-4.5", enabled: true },
  { name: "会议纪要", desc: "从录音生成结构化纪要", provider: "未指定", enabled: false },
];

export default function AiCenter() {
  return (
    <div className="p-6 max-w-[1240px] mx-auto">
      <PageHeader
        title="AI 中心"
        description="管理模型提供方、密钥引用与能力开关 · 所有密钥仅保存在本机 Keychain"
        actions={
          <>
            <Button variant="outline"><RefreshCw className="h-3.5 w-3.5" />测试全部连接</Button>
            <Button variant="primary"><Plus className="h-3.5 w-3.5" />添加提供方</Button>
          </>
        }
      />

      {/* Security banner */}
      <div className="mb-3 flex items-start gap-2.5 rounded-[8px] border border-primary/25 bg-primary/8 px-3.5 py-2.5">
        <ShieldCheck className="h-4 w-4 text-primary mt-0.5" />
        <div className="text-[12px] text-foreground-muted">
          <span className="text-foreground font-medium">密钥安全引用</span> · 所有 API 密钥仅存储于本机系统 Keychain，Project Vault 通过引用 ID 访问，不会写入项目文件或同步至云端。
        </div>
        <Button variant="ghost" className="ml-auto"><KeyRound className="h-3.5 w-3.5" />管理 Keychain 引用</Button>
      </div>

      {/* Providers grid */}
      <div className="grid grid-cols-2 gap-3">
        {providers.map((p) => (
          <Card key={p.id} padded={false}>
            <div className="flex items-start justify-between px-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-[8px] bg-surface-3 border hairline grid place-items-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-semibold text-foreground">{p.name}</h3>
                    {p.status === "connected" ? (
                      <Badge variant="success"><StatusDot />已连接</Badge>
                    ) : (
                      <Badge variant="neutral"><StatusDot variant="neutral" />未连接</Badge>
                    )}
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
              {p.status === "connected" ? (
                <span className="text-[11px] text-success inline-flex items-center gap-1">
                  <Check className="h-3 w-3" />上次测试成功 · 2 分钟前
                </span>
              ) : (
                <span className="text-[11px] text-foreground-subtle inline-flex items-center gap-1">
                  <X className="h-3 w-3" />未配置密钥
                </span>
              )}
              <div className="flex-1" />
              <Zap className="h-3 w-3 text-foreground-subtle" />
              <span className="text-[11px] text-foreground-subtle">流式响应</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Abilities */}
      <div className="mt-4">
        <PageHeader title="能力开关" description="配置 Project Vault 在不同工作流中使用哪个提供方" />
        <Card padded={false}>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left text-[10.5px] uppercase tracking-wider text-foreground-subtle bg-surface-1/50">
                <th className="font-medium px-4 py-2">能力</th>
                <th className="font-medium py-2 w-[280px]">默认提供方</th>
                <th className="font-medium py-2 w-[100px]">状态</th>
                <th className="font-medium px-4 py-2 w-[110px] text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {abilities.map((a) => (
                <tr key={a.name} className="row-hover border-t hairline">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-3.5 w-3.5 text-primary" />
                      <div>
                        <div className="text-foreground font-medium">{a.name}</div>
                        <div className="text-[10.5px] text-foreground-subtle">{a.desc}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-foreground-muted font-mono text-[11.5px]">{a.provider}</td>
                  <td className="py-2.5">
                    {a.enabled ? <Badge variant="success"><StatusDot />启用</Badge> : <Badge variant="neutral"><StatusDot variant="neutral" />已禁用</Badge>}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Button size="xs" variant="ghost">{a.enabled ? "配置" : "启用"}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
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
