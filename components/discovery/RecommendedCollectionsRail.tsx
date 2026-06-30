import { RelatedContentRail } from "@/components/public/RelatedContentRail";
import type { Collection } from "@/types/Collection";

type RecommendedCollectionsRailProps = {
  collections: Collection[];
  title?: string;
};

export function RecommendedCollectionsRail({ collections, title = "Recommended Collections" }: RecommendedCollectionsRailProps) {
  return (
    <RelatedContentRail
      title={title}
      items={collections.map((collection) => ({
        id: collection.id,
        title: collection.title,
        subtitle: `${collection.season} · ${collection.audience}`,
        href: `/collections/${collection.slug}`,
        badge: collection.featured ? "Featured" : collection.season,
      }))}
      emptyTitle="No collection recommendations yet"
      emptyDescription="Collection matches will appear as tags and relationships grow."
    />
  );
}
