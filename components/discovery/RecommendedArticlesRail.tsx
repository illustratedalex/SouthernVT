import { RelatedContentRail } from "@/components/public/RelatedContentRail";
import type { Article } from "@/types/Article";

type RecommendedArticlesRailProps = {
  articles: Article[];
  title?: string;
};

export function RecommendedArticlesRail({ articles, title = "Recommended Guides" }: RecommendedArticlesRailProps) {
  return (
    <RelatedContentRail
      title={title}
      items={articles.map((article) => ({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle,
        href: `/guides/${article.slug}`,
        badge: article.articleType,
      }))}
      emptyTitle="No guide recommendations yet"
      emptyDescription="Guide recommendations will appear as editorial links expand."
    />
  );
}
