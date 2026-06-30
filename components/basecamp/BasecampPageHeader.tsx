import Link from "next/link";
import { Button } from "@/components/ui";

type PageAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
};

interface BasecampPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: PageAction;
  secondaryAction?: PageAction;
  statusPill?: string;
  meta?: string;
}

function ActionButton({ action }: { action: PageAction }) {
  const button = (
    <Button
      type={action.type ?? "button"}
      variant={action.variant === "primary" ? "primary" : action.variant === "ghost" ? "ghost" : "secondary"}
      onClick={action.onClick}
    >
      {action.label}
    </Button>
  );

  return action.href ? <Link href={action.href}>{button}</Link> : button;
}

export function BasecampPageHeader({ eyebrow, title, description, primaryAction, secondaryAction, statusPill, meta }: BasecampPageHeaderProps) {
  return (
    <header className="rounded-[32px] border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--color-forest-green)]">{eyebrow}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
          <p className="max-w-3xl text-base leading-8 text-slate-600">{description}</p>
          {meta || statusPill ? (
            <div className="flex flex-wrap items-center gap-3">
              {meta ? <p className="text-sm font-medium text-slate-500">{meta}</p> : null}
              {statusPill ? <span className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">{statusPill}</span> : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          {secondaryAction ? <ActionButton action={secondaryAction} /> : null}
          {primaryAction ? <ActionButton action={primaryAction} /> : null}
        </div>
      </div>
    </header>
  );
}