import type { Story } from "@/types/Story";

type BestTimeSectionProps = {
  story: Story;
};

export function BestTimeSection({ story }: BestTimeSectionProps) {
  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6">
      <h3 className="text-2xl font-semibold text-slate-900">Best Time to Visit</h3>
      <p className="mt-3 text-sm leading-7 text-slate-700">{story.bestTimeToVisit}</p>
    </section>
  );
}
