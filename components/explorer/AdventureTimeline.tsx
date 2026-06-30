import type { ExplorerResultDetails } from "@/lib/discovery/ExplorerService";

type AdventureTimelineProps = {
  details: ExplorerResultDetails | null;
};

export function AdventureTimeline({ details }: AdventureTimelineProps) {
  if (!details || !details.primaryPlace) {
    return null;
  }

  const steps = [
    `Start at ${details.primaryPlace.name}`,
    details.foodPlace ? `Break for food or drinks at ${details.foodPlace.name}` : null,
    details.collection ? `Follow the ${details.collection.title} collection route` : null,
    details.article ? `Use ${details.article.title} as your narrative guide` : null,
    details.deal ? `Redeem ${details.deal.title}` : null,
    details.event ? `Optional event stop: ${details.event.title}` : null,
  ].filter((item): item is string => Boolean(item));

  return (
    <section className="rounded-[26px] border border-[#e8dfc8] bg-white p-6 shadow-[0_16px_52px_rgba(31,59,47,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Day plan timeline</p>
      <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f7efe1] text-xs font-semibold text-[#1f3b2f]">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-slate-600">
        Estimated duration: <span className="font-semibold text-slate-900">{details.result.estimatedDuration}</span> · Best season: <span className="font-semibold text-slate-900">{details.result.bestSeason}</span>
      </p>
    </section>
  );
}
