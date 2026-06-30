type ContentScoreGaugeProps = {
  current: number;
  target: number;
};

export function ContentScoreGauge({ current, target }: ContentScoreGaugeProps) {
  const clamped = Math.max(0, Math.min(100, current));

  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Content Score</p>
      <div className="mt-5 flex items-center gap-6">
        <div
          className="relative h-44 w-44 rounded-full"
          style={{
            background: `conic-gradient(#1f3b2f ${clamped * 3.6}deg, #e6dcc8 ${clamped * 3.6}deg 360deg)`,
          }}
        >
          <div className="absolute inset-[14px] flex items-center justify-center rounded-full bg-[#fcfaf6] text-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Current</p>
              <p className="mt-1 text-4xl font-semibold text-slate-900">{clamped}%</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-600">
          <p>Target score</p>
          <p className="text-3xl font-semibold text-[#1f3b2f]">{target}%</p>
          <p className="max-w-xs leading-7">Calculated from completeness signals across Places, Collections, Articles, Events, Deals, and Media.</p>
        </div>
      </div>
    </section>
  );
}
