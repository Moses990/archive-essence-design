import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* Small primitives shared across views */

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h1 className="text-[15px] font-semibold text-foreground tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-[12px] text-foreground-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  className,
  children,
  padded = true,
}: {
  className?: string;
  children: ReactNode;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[10px] border hairline bg-card text-card-foreground",
        padded && "p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Button({
  variant = "secondary",
  size = "sm",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "xs" | "sm";
}) {
  const sizes = {
    xs: "h-6 px-2 text-[11.5px]",
    sm: "h-7 px-2.5 text-[12px]",
  };
  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/60 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.08)]",
    secondary:
      "bg-surface-2 text-foreground hover:bg-surface-3 border hairline",
    outline:
      "bg-transparent text-foreground hover:bg-surface-2 border hairline",
    ghost:
      "bg-transparent text-foreground-muted hover:bg-surface-2 hover:text-foreground border border-transparent",
  };
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[6px] font-medium transition-colors focus-ring disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap",
        sizes[size],
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: "neutral" | "primary" | "success" | "warning" | "info" | "danger";
  className?: string;
}) {
  const map: Record<string, string> = {
    neutral:
      "bg-surface-3 text-foreground-muted border-border",
    primary:
      "bg-primary/12 text-[hsl(244_88%_78%)] border-primary/25",
    success:
      "bg-[hsl(152_55%_46%/0.12)] text-[hsl(152_55%_62%)] border-[hsl(152_55%_46%/0.25)]",
    warning:
      "bg-[hsl(38_92%_58%/0.12)] text-[hsl(38_92%_70%)] border-[hsl(38_92%_58%/0.28)]",
    info: "bg-[hsl(210_90%_62%/0.12)] text-[hsl(210_90%_74%)] border-[hsl(210_90%_62%/0.28)]",
    danger: "bg-[hsl(358_68%_58%/0.12)] text-[hsl(358_78%_72%)] border-[hsl(358_68%_58%/0.28)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 h-[18px] px-1.5 rounded-[4px] text-[10.5px] font-medium border",
        map[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ variant = "success" }: { variant?: "success" | "warning" | "danger" | "info" | "neutral" }) {
  const map: Record<string, string> = {
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
    info: "bg-info",
    neutral: "bg-foreground-subtle",
  };
  return <span className={cn("badge-dot", map[variant])} />;
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-7 px-2.5 rounded-[6px] border hairline bg-surface-2 text-[12px] text-foreground placeholder:text-foreground-subtle focus-ring",
        className
      )}
    />
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border", className)} />;
}
