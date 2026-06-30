import type { CompletenessScore } from "@/types/Completeness";

type CompletenessMeterProps = {
  score: CompletenessScore;
  compact?: boolean;
};

function getStateStyles(percentage: number) {
  if (percentage < 40) {
    return {
      text: "text-[#8b2e1f]",
      bar: "bg-[#d8583b]",
      chip: "bg-[#fff2f0] border-[#f0d7d2] text-[#8b2e1f]",
    };
  }

  if (percentage < 80) {
    return {
      text: "text-[#7a5c17]",
      bar: "bg-[#d5a842]",
      chip: "bg-[#fff8e8] border-[#efe0b8] text-[#7a5c17]",
    };
  }

  return {
    text: "text-[#1f5a3d]",
    bar: "bg-[#2f8a5b]",
    chip: "bg-[#ecf8f0] border-[#cde8d6] text-[#1f5a3d]",
  };
}

export function CompletenessMeter({ score, compact = false }: CompletenessMeterProps) {
  const styles = getStateStyles(score.percentage);
  const missingItems = compact ? score.missingItems.slice(0, 3) : score.missingItems;

  return (
    <section className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Completeness</p>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${styles.chip}`}>
          {score.percentage}%
        </span>
      </div>

      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#e5decd]">
        <div
          className={`h-full rounded-full transition-all ${styles.bar}`}
          style={{ width: `${score.percentage}%` }}
          aria-hidden
        />
      </div>

      {!compact ? (
        <p className={`mt-3 text-sm font-medium ${styles.text}`}>
          {score.score} / {score.maxScore} points
        </p>
      ) : null}

      {missingItems.length > 0 ? (
        <div className="mt-3 space-y-1">
          {missingItems.map((item) => (
            <p key={item.key} className="text-xs leading-6 text-slate-600">
              {item.label}
            </p>
          ))}
          {compact && score.missingItems.length > missingItems.length ? (
            <p className="text-xs text-slate-500">+{score.missingItems.length - missingItems.length} more</p>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-xs font-semibold text-[#1f5a3d]">Launch-ready content</p>
      )}
    </section>
  );
}
