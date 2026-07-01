import { Card, PageHeader, Button, Badge, StatusDot, Input, Divider } from "../ui";
import { FolderOpen, HardDrive, Palette, Database, ShieldCheck, RefreshCw, Download } from "lucide-react";

const sections = [
  { key: "general", label: "通用" },
  { key: "storage", label: "存储与路径" },
  { key: "scan", label: "扫描与索引" },
  { key: "appearance", label: "外观" },
  { key: "backup", label: "备份与维护" },
  { key: "advanced", label: "高级" },
];

export default function Settings() {
  return (
    <div className="p-6 max-w-[1080px] mx-auto">
      <PageHeader
        title="设置"
        description="所有设置仅保存在本机 · 工作区级偏好可以随项目导出"
      />

      <div className="grid grid-cols-[180px_1fr] gap-4">
        {/* Section rail */}
        <nav className="sticky top-4 self-start">
          <div className="rounded-[8px] border hairline bg-surface-1 p-1">
            {sections.map((s, i) => (
              <button
                key={s.key}
                className={`w-full text-left px-2.5 h-7 rounded-[6px] text-[12px] transition-colors ${
                  i === 1 ? "bg-surface-3 text-foreground" : "text-foreground-subtle hover:text-foreground hover:bg-surface-2"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-[8px] border hairline bg-surface-1 p-3 text-[11.5px] text-foreground-subtle">
            <div className="flex items-center gap-2 text-foreground-muted mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              本地隐私
            </div>
            设置数据保存在 <span className="font-mono text-foreground-muted">~/Library/Application Support/Vault</span>
          </div>
        </nav>

        {/* Sections */}
        <div className="space-y-3">
          {/* Storage & path */}
          <Card padded={false}>
            <SectionHeader icon={FolderOpen} title="项目根目录" desc="Project Vault 将扫描该目录下的所有项目文件夹" />
            <div className="p-4 space-y-3">
              <Field label="根路径">
                <div className="flex items-center gap-2">
                  <Input defaultValue="/Volumes/Design/Vault" className="flex-1 font-mono" />
                  <Button variant="outline"><FolderOpen className="h-3.5 w-3.5" />浏览</Button>
                </div>
                <FieldHelp>更改根目录将触发全量重新索引，请确保磁盘可用空间充足。</FieldHelp>
              </Field>
              <Field label="次要目录">
                <div className="space-y-1.5">
                  {[
                    { p: "/Volumes/Archive/2024", size: "84.2 GB" },
                    { p: "/Users/lz/Documents/Vault-临时", size: "2.4 GB" },
                  ].map((d) => (
                    <div key={d.p} className="flex items-center justify-between px-2.5 h-8 rounded-[6px] border hairline bg-surface-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <HardDrive className="h-3.5 w-3.5 text-foreground-subtle" />
                        <span className="font-mono text-[11.5px] text-foreground truncate">{d.p}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10.5px] font-mono text-foreground-subtle">{d.size}</span>
                        <button className="text-[11px] text-foreground-subtle hover:text-destructive">移除</button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button size="xs" variant="ghost" className="mt-2">+ 添加目录</Button>
              </Field>
            </div>
          </Card>

          {/* Scan */}
          <Card padded={false}>
            <SectionHeader icon={Database} title="扫描与索引" desc="控制资产识别、缩略图与全文索引" />
            <div className="p-4 divide-y divide-border">
              <Toggle label="自动监听文件变动" hint="使用系统 FSEvents · 无需手动刷新" defaultOn />
              <Toggle label="生成 CAD 缩略图" hint="使用 ODA 转换器生成 512px 预览" defaultOn />
              <Toggle label="启用全文搜索" hint="索引 PDF / DOC / Markdown 文本内容" defaultOn />
              <Toggle label="忽略隐藏文件" hint=".DS_Store · thumbs.db 等" defaultOn />
              <div className="pt-3 pb-1 flex items-center gap-3">
                <Field label="扫描频率" inline>
                  <select className="h-7 rounded-[6px] border hairline bg-surface-2 text-[12px] px-2 text-foreground focus-ring">
                    <option>实时 (推荐)</option>
                    <option>每 15 分钟</option>
                    <option>每小时</option>
                    <option>手动</option>
                  </select>
                </Field>
                <div className="flex-1" />
                <Button variant="outline"><RefreshCw className="h-3.5 w-3.5" />立即重新索引</Button>
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card padded={false}>
            <SectionHeader icon={Palette} title="外观" desc="主题、字号与信息密度" />
            <div className="p-4 space-y-3">
              <Field label="主题">
                <div className="grid grid-cols-3 gap-2 max-w-[420px]">
                  {[
                    { k: "dark", label: "深色", active: true, bg: "bg-[hsl(228_12%_7%)]" },
                    { k: "midnight", label: "午夜", bg: "bg-[hsl(228_20%_4%)]" },
                    { k: "system", label: "跟随系统", bg: "bg-gradient-to-br from-[hsl(228_12%_7%)] to-[hsl(220_15%_92%)]" },
                  ].map((t) => (
                    <button
                      key={t.k}
                      className={`rounded-[8px] border p-2 text-left transition-colors ${
                        t.active ? "border-primary/60 bg-primary/8" : "hairline hover:bg-surface-2"
                      }`}
                    >
                      <div className={`h-10 rounded-[4px] border hairline ${t.bg}`} />
                      <div className="mt-2 flex items-center justify-between text-[11.5px]">
                        <span className={t.active ? "text-foreground" : "text-foreground-muted"}>{t.label}</span>
                        {t.active && <Badge variant="primary"><StatusDot />当前</Badge>}
                      </div>
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="信息密度">
                <div className="inline-flex rounded-[6px] border hairline overflow-hidden">
                  {["紧凑", "标准", "宽松"].map((d, i) => (
                    <button key={d} className={`h-7 px-3 text-[12px] ${i === 0 ? "bg-surface-3 text-foreground" : "text-foreground-subtle hover:text-foreground"}`}>{d}</button>
                  ))}
                </div>
              </Field>
              <Field label="强调色">
                <div className="flex items-center gap-2">
                  {["hsl(244 78% 66%)", "hsl(210 90% 62%)", "hsl(152 55% 46%)", "hsl(38 92% 58%)", "hsl(358 68% 58%)"].map((c, i) => (
                    <button
                      key={c}
                      className={`h-6 w-6 rounded-full border ${i === 0 ? "ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : "hairline"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </Field>
            </div>
          </Card>

          {/* Backup */}
          <Card padded={false}>
            <SectionHeader icon={ShieldCheck} title="备份与维护" desc="本地快照与元数据备份" />
            <div className="p-4 space-y-3">
              <Toggle label="每日增量备份" hint="03:00 · 目标: /Volumes/Backup/Vault" defaultOn />
              <Toggle label="每周全量快照" hint="周日 04:00 · 保留 8 周" />
              <Toggle label="崩溃报告匿名上报" hint="仅堆栈信息 · 不含文件内容" />

              <Divider />

              <div className="grid grid-cols-3 gap-2">
                {[
                  { k: "元数据库大小", v: "128 MB" },
                  { k: "缩略图缓存", v: "1.8 GB" },
                  { k: "上次备份", v: "今天 03:00" },
                ].map((s) => (
                  <div key={s.k} className="rounded-[6px] border hairline bg-surface-1 p-2.5">
                    <div className="text-[10.5px] text-foreground-subtle">{s.k}</div>
                    <div className="mt-1 text-[13px] font-semibold text-foreground tabular font-mono">{s.v}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline"><Download className="h-3.5 w-3.5" />导出元数据</Button>
                <Button variant="outline">清理缩略图缓存</Button>
                <div className="flex-1" />
                <button className="text-[11.5px] text-destructive hover:underline">重建索引数据库…</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-3 px-4 h-14 border-b hairline">
      <div className="mt-1 h-7 w-7 rounded-[6px] bg-surface-3 border hairline grid place-items-center">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div>
        <div className="text-[13px] font-semibold text-foreground">{title}</div>
        <div className="text-[11px] text-foreground-subtle">{desc}</div>
      </div>
    </div>
  );
}

function Field({ label, inline, children }: { label: string; inline?: boolean; children: React.ReactNode }) {
  return (
    <div className={inline ? "flex items-center gap-3" : "space-y-1.5"}>
      <label className="text-[11.5px] font-medium text-foreground-muted min-w-[80px]">{label}</label>
      <div className={inline ? "" : "block"}>{children}</div>
    </div>
  );
}
function FieldHelp({ children }: { children: React.ReactNode }) {
  return <div className="text-[10.5px] text-foreground-subtle mt-1">{children}</div>;
}

function Toggle({ label, hint, defaultOn }: { label: string; hint?: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-start justify-between py-2.5">
      <div className="min-w-0">
        <div className="text-[12.5px] text-foreground">{label}</div>
        {hint && <div className="text-[10.5px] text-foreground-subtle mt-0.5">{hint}</div>}
      </div>
      <button
        className={`shrink-0 relative h-4 w-7 rounded-full transition-colors ${defaultOn ? "bg-primary" : "bg-surface-3 border hairline"}`}
        aria-pressed={defaultOn}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ${
            defaultOn ? "translate-x-3.5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
