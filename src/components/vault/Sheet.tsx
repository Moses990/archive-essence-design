import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  width?: number;
  children: ReactNode;
  footer?: ReactNode;
}

export function Sheet({ open, onClose, title, subtitle, width = 460, children, footer }: SheetProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 transition-opacity duration-200",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <aside
        style={{ width }}
        className={cn(
          "absolute top-0 right-0 h-full bg-popover border-l border-border-strong shadow-2xl flex flex-col transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <header className="flex items-start justify-between gap-3 px-4 h-12 border-b hairline shrink-0">
          <div className="min-w-0">
            {title && <div className="text-[13px] font-semibold text-foreground truncate">{title}</div>}
            {subtitle && <div className="text-[11px] text-foreground-subtle truncate mt-0.5">{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 grid place-items-center rounded-[6px] text-foreground-muted hover:bg-surface-3 hover:text-foreground"
            aria-label="关闭"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto scroll-thin">{children}</div>
        {footer && <div className="border-t hairline px-4 py-2.5 shrink-0">{footer}</div>}
      </aside>
    </div>
  );
}
