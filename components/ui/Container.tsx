import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <section className={cn("mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10", className)} {...props}>
      {children}
    </section>
  );
}
