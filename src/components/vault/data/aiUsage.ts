export type UsageDay = { d: string; openai: number; anthropic: number; ollama: number };

// 30 天用量（K tokens）
export const usage30d: UsageDay[] = Array.from({ length: 30 }, (_, i) => {
  const seed = (i * 37) % 100;
  return {
    d: `06-${String(i + 2).padStart(2, "0")}`,
    openai:    Math.round(20 + (Math.sin(i * 0.6) + 1) * 22 + seed * 0.15),
    anthropic: Math.round(6 + (Math.cos(i * 0.4) + 1) * 8 + seed * 0.06),
    ollama:    Math.round(4 + (Math.sin(i * 0.9 + 1) + 1) * 6),
  };
});

export const promptTemplates = [
  { id: "drawing-desc", name: "图纸说明生成", desc: "根据 CAD 元数据生成中文施工说明段落", vars: 4, tag: "图纸" },
  { id: "material-match", name: "材料匹配", desc: "从设计意图关键词匹配材料库中的近似项", vars: 3, tag: "材料" },
  { id: "meeting-notes", name: "会议纪要整理", desc: "把录音转写为结构化的决策 / 待办 / 遗留问题", vars: 2, tag: "文档" },
  { id: "review-check", name: "施工图审核清单", desc: "按项目模板自动检查图号、图签与图层规范", vars: 5, tag: "审核" },
  { id: "rfi-draft", name: "RFI 起草", desc: "针对施工方问题生成规范化答复初稿", vars: 3, tag: "沟通" },
  { id: "spec-diff", name: "规范差异对比", desc: "对比两个版本图纸的规范条款引用差异", vars: 2, tag: "版本" },
];

export const taskAssignments = [
  { task: "默认对话",   options: ["gpt-5.1-mini", "claude-sonnet-4.5", "qwen2.5-coder:14b"], current: "gpt-5.1-mini" },
  { task: "语义检索",   options: ["text-embedding-3-large", "bge-m3 (本地)"], current: "bge-m3 (本地)" },
  { task: "长文档摘要", options: ["claude-sonnet-4.5", "gpt-5.1-mini"], current: "claude-sonnet-4.5" },
  { task: "图纸说明生成", options: ["gpt-5.1-mini", "qwen2.5-coder:14b"], current: "gpt-5.1-mini" },
];
