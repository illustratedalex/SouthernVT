import type { Story } from "@/types/Story";

type HistorySectionProps = {
  story: Story;
};

export function HistorySection({ story }: HistorySectionProps) {
  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6">
      <h3 className="text-2xl font-semibold text-slate-900">History</h3>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
        {story.history.map((entry) => (
          <li key={entry} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-maple-gold)" />
            <span>{entry}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
