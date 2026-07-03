type FoundingPartnerSlotsProps = {
  filled: number;
  total: number;
  label: string;
  caption?: string;
};

export function FoundingPartnerSlots({ filled, total, label, caption }: FoundingPartnerSlotsProps) {
  const progress = total > 0 ? Math.min(100, Math.round((filled / total) * 100)) : 0;

  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-[0_18px_58px_rgba(31,59,47,0.07)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1f5a3d]">Founding Partner slots</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{filled} / {total} {label}</h2>
          {caption ? <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{caption}</p> : null}
        </div>
        <div className="rounded-full bg-[#f7efe1] px-4 py-2 text-sm font-semibold text-slate-700">{progress}% full</div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#d8b15d,#1f5a3d)]" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}