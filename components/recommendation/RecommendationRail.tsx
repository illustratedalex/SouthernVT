import type { Recommendation } from "@/types/Recommendation";
import type { RecommendationReason } from "@/types/RecommendationReason";
import { RecommendationCard } from "./RecommendationCard";

type RecommendationRailItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  score: number;
  badge?: string;
  reasons: RecommendationReason[];
};

type RecommendationRailProps<T> = {
  title: string;
  recommendations: Recommendation<T>[];
  mapItem: (recommendation: Recommendation<T>) => RecommendationRailItem;
  emptyMessage: string;
};

export function RecommendationRail<T>({ title, recommendations, mapItem, emptyMessage }: RecommendationRailProps<T>) {
  if (!recommendations.length) {
    return (
      <section className="rounded-[26px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-3 text-sm text-slate-600">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="rounded-[26px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {recommendations.map((recommendation) => {
          const item = mapItem(recommendation);
          return (
            <RecommendationCard
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              href={item.href}
              score={item.score}
              badge={item.badge}
              reasons={item.reasons}
            />
          );
        })}
      </div>
    </section>
  );
}
