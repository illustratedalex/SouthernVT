import Link from "next/link";
import type { Article } from "@/types/Article";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="overflow-hidden rounded-[26px] border border-[#e8dfc8] bg-white shadow-[0_14px_48px_rgba(31,59,47,0.1)] motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_18px_55px_rgba(31,59,47,0.14)]">
      <div className="relative h-48 overflow-hidden">
        <img src={article.featuredImage} alt={article.title} className="h-full w-full object-cover" />
        <div className="absolute left-4 top-4 rounded-full bg-(--color-cream)/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-(--color-forest-green)">
          {article.articleType}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <h3 className="text-xl font-semibold text-slate-900">{article.title}</h3>
        <p className="text-sm font-medium text-slate-600">{article.subtitle}</p>
        <p className="line-clamp-3 text-sm leading-7 text-slate-700">{article.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {article.categories.slice(0, 2).map((category) => (
            <span key={category} className="rounded-full bg-[#f7efe1] px-3 py-1 text-xs font-semibold text-[#1f3b2f]">
              {category}
            </span>
          ))}
          {article.featured ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Featured</span> : null}
        </div>
        <Link href={`/guides/${article.slug}`} className="inline-flex rounded-full bg-(--color-forest-green) px-4 py-2 text-sm font-semibold text-(--color-cream) motion-safe:transition motion-safe:hover:bg-(--color-pine) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-maple-gold) focus-visible:ring-offset-2">
          Read guide
        </Link>
      </div>
    </article>
  );
}
