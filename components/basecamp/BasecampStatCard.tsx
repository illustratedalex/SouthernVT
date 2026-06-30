interface BasecampStatCardProps {
  label: string;
  value: string;
  detail?: string;
}

export function BasecampStatCard({ label, value, detail }: BasecampStatCardProps) {
  return (
    <article className="rounded-[26px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      {detail ? <p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p> : null}
    </article>
  );
}