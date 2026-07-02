import type { ReactNode } from "react";
import { cn } from "./cn";

type ProseProps = {
  children: ReactNode;
  /** "md" is normal body copy; "sm" is article captions / sidebar text. */
  size?: "sm" | "md" | "lg";
  className?: string;
  as?: "div" | "article" | "section";
};

const sizeStyles = {
  sm: "text-sm leading-7 text-slate-600",
  md: "text-base leading-8 text-slate-700",
  lg: "text-lg leading-9 text-slate-700",
};

/**
 * Prose — a consistent typography wrapper for flowing body copy.
 * Sets line-height, font-size, text color, and vertical paragraph rhythm.
 */
export function Prose({ children, size = "md", className, as: Tag = "div" }: ProseProps) {
  return (
    <Tag
      className={cn(
        sizeStyles[size],
        "[&>p+p]:mt-4 [&>p:first-child]:mt-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
