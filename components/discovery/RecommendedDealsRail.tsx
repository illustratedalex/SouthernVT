import { RelatedContentRail } from "@/components/public/RelatedContentRail";
import type { Deal } from "@/types/Deal";

type RecommendedDealsRailProps = {
  deals: Deal[];
  title?: string;
};

export function RecommendedDealsRail({ deals, title = "Recommended Deals" }: RecommendedDealsRailProps) {
  return (
    <RelatedContentRail
      title={title}
      items={deals.map((deal) => ({
        id: deal.id,
        title: deal.title,
        subtitle: deal.shortDescription,
        href: `/deals/${deal.slug}`,
        badge: deal.dealType,
      }))}
      emptyTitle="No deal recommendations yet"
      emptyDescription="Partner deals will appear here when matched offers are available."
    />
  );
}
