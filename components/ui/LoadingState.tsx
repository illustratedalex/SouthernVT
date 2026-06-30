import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type LoadingStateProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  children?: ReactNode;
};

export function LoadingState({ title = "Loading", description = "Please wait while content loads.", children, className, ...props }: LoadingStateProps) {
  return (
    <div className={cn("rounded-3xl border border-(--color-pine)/15 bg-white/80 p-6 text-center shadow-sm backdrop-blur", className)} aria-busy="true" {...props}>
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-(--color-maple-gold)/30 border-t-(--color-forest-green)" />
      <h2 className="mt-4 text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}