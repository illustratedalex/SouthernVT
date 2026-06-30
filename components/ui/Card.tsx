import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <article
      className={cn(
        "rounded-[1.75rem] border border-(--color-pine)/15 bg-(--color-cream)/90 shadow-[0_20px_60px_rgba(31,59,47,0.08)] backdrop-blur",
        className,
      )}
      {...props}
    >
      {children}
    </article>
  );
}
