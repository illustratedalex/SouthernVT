import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type BadgeVariant = "default" | "forest" | "amber" | "subtle" | "featured";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  /** Brand gold — general category, season, type labels. */
  default:
    "border-(--color-maple-gold)/40 bg-(--color-maple-gold)/12 text-(--color-forest-green)",
  /** Deep green — place type or collection tags. */
  forest:
    "border-(--color-forest-green)/25 bg-(--color-forest-green)/10 text-(--color-forest-green)",
  /** Warm amber — seasonal highlights, warm-weather tags. */
  amber:
    "border-amber-300/50 bg-amber-50 text-amber-800",
  /** Neutral grey — secondary metadata, status labels. */
  subtle:
    "border-slate-200 bg-slate-50 text-slate-600",
  /** Featured / editorial spotlight. */
  featured:
    "border-[#d8b15d]/50 bg-[#fff3d4] text-[#7c5b13]",
};

export function Badge({ children, variant = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em]",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
