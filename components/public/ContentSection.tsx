import type { ReactNode } from "react";

interface ContentSectionProps {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ContentSection({ title, eyebrow, description, children, className = "" }: ContentSectionProps) {
  return (
    <section className={`rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-[0_18px_58px_rgba(31,59,47,0.08)] ${className}`.trim()}>
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.24em] text-(--color-pine)">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-sm leading-6 sm:leading-7 text-slate-600">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}