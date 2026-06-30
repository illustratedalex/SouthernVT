import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-(--color-maple-gold)/40 bg-(--color-maple-gold)/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-(--color-forest-green)",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
