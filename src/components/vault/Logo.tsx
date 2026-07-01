import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

/**
 * Project Vault mark — original design.
 * An abstract vault door: a rounded-square vault with a grid interior
 * suggesting an archive/index, with a subtle "PV" formed by the negative
 * space of the vertical slot and the corner cutout.
 */
export function Logo({ className, size = 20, showWordmark = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="pv-g" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="hsl(var(--primary))" />
            <stop offset="1" stopColor="hsl(244 78% 46%)" />
          </linearGradient>
        </defs>
        {/* Outer vault */}
        <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#pv-g)" />
        {/* Grid interior — 3x3 archive cells */}
        <g stroke="hsl(240 20% 98% / 0.55)" strokeWidth="1" strokeLinecap="round">
          <path d="M8 7v10" />
          <path d="M12 7v10" />
          <path d="M16 7v10" />
          <path d="M6 10h12" />
          <path d="M6 14h12" />
        </g>
        {/* Vault handle dot */}
        <circle cx="18" cy="6" r="1.4" fill="hsl(240 20% 98%)" />
      </svg>
      {showWordmark && (
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className="text-[13px] font-semibold tracking-tight text-foreground">Project Vault</span>
        </div>
      )}
    </div>
  );
}
