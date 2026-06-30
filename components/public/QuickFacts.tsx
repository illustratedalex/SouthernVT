interface QuickFact {
  label: string;
  value: string;
  detail?: string;
}

interface QuickFactsProps {
  facts: QuickFact[];
}

export function QuickFacts({ facts }: QuickFactsProps) {
  if (!facts.length) {
    return null;
  }

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {facts.map((fact) => (
        <div key={fact.label} className="rounded-[26px] border border-[#e8dfc8] bg-white p-5 shadow-[0_14px_45px_rgba(31,59,47,0.06)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--color-pine)">{fact.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{fact.value}</p>
          {fact.detail ? <p className="mt-1 text-sm leading-6 text-slate-600">{fact.detail}</p> : null}
        </div>
      ))}
    </section>
  );
}