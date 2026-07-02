import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type CardVariant = "default" | "hero" | "compact" | "sidebar";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
};

const variantStyles: Record<CardVariant, string> = {
  /**
   * Standard editorial card — rounded corners, cream background, soft shadow.
   * Has a subtle hover lift for interactive cards.
   */
  default:
    "rounded-[1.75rem] border border-(--color-pine)/15 bg-(--color-cream)/90 shadow-[0_18px_58px_rgba(31,59,47,0.08)] motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[0_24px_68px_rgba(31,59,47,0.13)]",
  /**
   * Hero card — larger shadow, white background for stronger foreground presence.
   */
  hero: "rounded-[2rem] border border-(--color-pine)/12 bg-white shadow-[0_24px_72px_rgba(31,59,47,0.12)] motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_32px_80px_rgba(31,59,47,0.16)]",
  /**
   * Compact card — flat, tighter border, no shadow. For dense lists.
   */
  compact:
    "rounded-[1.25rem] border border-(--color-pine)/12 bg-white",
  /**
   * Sidebar card — flat border-only style, no shadow, full width.
   * For use inside narrow sidebar columns.
   */
  sidebar:
    "rounded-[1.25rem] border border-[#e8dfc8] bg-white",
};

export function Card({ children, variant = "default", className, ...props }: CardProps) {
  return (
    <article
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      {children}
    </article>
  );
}
