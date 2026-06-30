import type { ReactNode } from "react";

interface BasecampSectionProps {
  title: string;
  description?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

export function BasecampSection({ title, description, eyebrow, children, className = "" }: BasecampSectionProps) {
  return (
    <section className={`rounded-[32px] border border-[#e8dfc8] bg-white/80 p-6 shadow-sm backdrop-blur ${className}`.trim()}>
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}