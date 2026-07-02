import { EditorialSection } from "@/components/ui";

type TimelineEntry = {
  time: string;
  title: string;
  detail: string;
};

type RecommendationTimelineProps = {
  entries: TimelineEntry[];
};

export function RecommendationTimeline({ entries }: RecommendationTimelineProps) {
  return (
    <EditorialSection
      eyebrow="Suggested Timeline"
      title="Your day at a glance"
      description="A calm, paced itinerary generated from your selections."
    >
      <ol className="space-y-3">
        {entries.map((entry) => (
          <li key={`${entry.time}-${entry.title}`} className="grid gap-2 rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4 md:grid-cols-[90px_minmax(0,1fr)]">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-(--color-forest-green)">{entry.time}</p>
            <div>
              <p className="text-base font-semibold text-slate-900">{entry.title}</p>
              <p className="mt-1 text-sm leading-7 text-slate-600">{entry.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </EditorialSection>
  );
}

