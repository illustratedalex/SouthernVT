import type { Story } from "@/types/Story";

type StorySummaryProps = {
  story: Story;
};

export function StorySummary({ story }: StorySummaryProps) {
  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-[0_18px_58px_rgba(31,59,47,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--color-forest-green)">Summary</p>
      <p className="mt-3 text-base leading-8 text-slate-700">{story.summary}</p>
      <div className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-700">{story.body}</div>
    </section>
  );
}
