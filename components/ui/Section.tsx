import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  className?: string;
};

export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section className={cn("py-20 sm:py-24", className)} {...props}>
      {children}
    </section>
  );
}
