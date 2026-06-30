type WeeklyGoalCardProps = {
  title: string;
  current: number;
  target: number;
};

export function WeeklyGoalCard({ title, current, target }: WeeklyGoalCardProps) {
  const percentage = target > 0 ? Math.round(Math.min(100, (current / target) * 100)) : 0;

  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{target} {title}</p>
      <div className="mt-3 h-3 rounded-full bg-[#ece3cf]">
        <div className="h-3 rounded-full bg-[#1f3b2f]" style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{percentage}% complete</p>
    </article>
  );
}
