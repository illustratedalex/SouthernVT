type StatCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <article className="rounded-[24px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-maple-gold)]">Snapshot</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-sm font-medium text-slate-700">{label}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </article>
  );
}
