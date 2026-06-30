import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";
import { Button } from "./Button";

type ErrorStateProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
};

export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this content right now.",
  actionLabel,
  onAction,
  children,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div className={cn("rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center", className)} role="alert" {...props}>
      <h2 className="text-lg font-semibold text-rose-950">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-rose-900/80">{description}</p>
      {actionLabel && onAction ? (
        <div className="mt-4">
          <Button type="button" variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}