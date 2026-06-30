"use client";

import { useEffect, useMemo, useState } from "react";
import { ArticleFilters, ArticleTable, BasecampEmptyState, BasecampPageHeader, BasecampToolbar } from "@/components/basecamp";
import { archiveArticle, getArticles } from "@/repositories/ArticleRepository";
import type { Article, ArticleStatus, ArticleType } from "@/types/Article";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ArticleStatus | "All">("All");
  const [articleType, setArticleType] = useState<ArticleType | "All">("All");

  useEffect(() => {
    async function loadArticles() {
      const data = await getArticles();
      setArticles(Array.isArray(data) ? data : []);
    }

    loadArticles();
  }, []);

  const visibleArticles = useMemo(() => {
    return articles
      .filter((article) => {
        const query = `${article.title} ${article.subtitle} ${article.excerpt} ${article.author} ${article.tags.join(" ")}`.toLowerCase();
        const matchesSearch = query.includes(search.toLowerCase());
        const matchesStatus = status === "All" || article.status === status;
        const matchesType = articleType === "All" || article.articleType === articleType;
        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [articles, search, status, articleType]);

  const handleArchive = async (id: string) => {
    await archiveArticle(id);
    const refreshed = await getArticles();
    setArticles(refreshed);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <BasecampPageHeader
            eyebrow="Basecamp"
            title="Articles management"
            description="Manage editorial guides, stories, and itinerary content with publishing workflow controls."
            primaryAction={{ label: "+ Add Article", href: "/basecamp/articles/new" }}
          />

          <BasecampToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search articles"
            filters={<ArticleFilters search={search} status={status} articleType={articleType} onSearchChange={setSearch} onStatusChange={setStatus} onArticleTypeChange={setArticleType} />}
            sortLabel="Sort"
            viewLabel="View"
            bulkLabel="Bulk"
          />

          {visibleArticles.length === 0 ? (
            <BasecampEmptyState
              title="No articles found"
              description="Try a different search or create a new editorial draft."
              ctaLabel="Add Article"
              ctaHref="/basecamp/articles/new"
            />
          ) : (
            <ArticleTable articles={visibleArticles} onArchive={handleArchive} />
          )}
        </div>
      </div>
    </div>
  );
}
