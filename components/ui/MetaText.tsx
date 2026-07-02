import type { ReactNode } from "react";
import { cn } from "./cn";

type MetaVariant = "eyebrow" | "caption" | "meta" | "score";

type MetaTextProps = {
  children: ReactNode;
  variant?: MetaVariant;
  as?: "p" | "span" | "div" | "time";
  className?: string;
};

const variantStyles: Record<MetaVariant, string> = {
  /** Small all-caps label used as a section divider or category marker. */
  eyebrow: "text-xs font-semibold uppercase tracking-[0.26em] text-[#1f5a3d]",
  /** Image caption or footnote — light, de-emphasised. */
  caption: "text-xs leading-5 text-slate-500",
  /** Inline metadata: dates, distances, town names, etc. */
  meta: "text-sm font-medium text-slate-600",
  /** Numeric score or stat highlighted in brand gold. */
  score: "text-sm font-semibold tabular-nums text-[#d8b15d]",
};

/**
 * MetaText — typographic atom for small non-body text roles:
 * eyebrows, captions, inline metadata, and scores.
 */
export function MetaText({
  children,
  variant = "meta",
  as: Tag = "span",
  className,
}: MetaTextProps) {
  return <Tag className={cn(variantStyles[variant], className)}>{children}</Tag>;
}
