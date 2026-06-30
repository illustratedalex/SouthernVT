import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon?: ReactNode;
  children?: ReactNode;
};

export function EmptyState({ title, description, ctaLabel, ctaHref, icon, children, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn("rounded-3xl border border-dashed border-(--color-pine)/20 bg-white/70 p-8 text-center", className)} {...props}>
      {icon ? <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#d7cbb3] bg-white text-[#1f3b2f]">{icon}</div> : null}
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-600">{description}</p>
      {ctaLabel && ctaHref ? (
        <Link href={ctaHref} className="mt-5 inline-flex rounded-full bg-(--color-forest-green) px-5 py-3 text-sm font-semibold text-(--color-cream) transition hover:bg-(--color-pine)">
          {ctaLabel}
        </Link>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}