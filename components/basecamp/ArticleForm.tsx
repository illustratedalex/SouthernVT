"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Input, useToasts } from "@/components/ui";
import { ArticleStatusBadge } from "@/components/basecamp/ArticleStatusBadge";
import { SaveStatus } from "@/components/basecamp/SaveStatus";
import { useSaveState } from "@/hooks/useSaveState";
import { articleRepository } from "@/lib/repositories/articleRepository";
import { executeWriteWithQueueFallback } from "@/lib/services";
import { validateArticleForm } from "@/lib/validation/basecampForms";
import type { Article, ArticleStatus, ArticleType } from "@/types/Article";
import { BasecampPageHeader } from "./BasecampPageHeader";
import { BasecampPreviewPanel } from "./BasecampPreviewPanel";
import { BasecampTabs } from "./BasecampTabs";

interface ArticleFormProps {
  initialArticle?: Article;
}

type TabKey = "basic" | "content" | "media" | "relationships" | "seo" | "preview";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "basic", label: "Basic" },
  { key: "content", label: "Content" },
  { key: "media", label: "Media" },
  { key: "relationships", label: "Relationships" },
  { key: "seo", label: "SEO" },
  { key: "preview", label: "Preview" },
];

const articleTypes: ArticleType[] = ["guide", "story", "list", "itinerary", "news"];
const statusOptions: ArticleStatus[] = ["draft", "review", "scheduled", "published", "archived"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createEmptyArticle(): Article {
  const now = new Date().toISOString();
  return {
    id: "",
    slug: "",
    title: "",
    subtitle: "",
    excerpt: "",
    body: "",
    articleType: "guide",
    status: "draft",
    author: "",
    featuredImage: "",
    gallery: [],
    relatedPlaces: [],
    relatedCollections: [],
    relatedEvents: [],
    categories: [],
    tags: [],
    featured: false,
    seoTitle: "",
    seoDescription: "",
    createdAt: now,
    updatedAt: now,
    publishedAt: "",
  };
}

export function ArticleForm({ initialArticle }: ArticleFormProps) {
  const [article, setArticle] = useState<Article>(initialArticle ?? createEmptyArticle());
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialArticle?.slug));
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const saveState = useSaveState();
  const { pushToast } = useToasts();

  useEffect(() => {
    if (initialArticle) {
      // Safe local state hydration when editing an existing record.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setArticle(initialArticle);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSlugTouched(Boolean(initialArticle.slug));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDirty(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrors({});
      saveState.reset();
    }
  }, [initialArticle]);

  const generatedSlug = useMemo(() => slugify(article.title), [article.title]);
  const displaySlug = article.slug || generatedSlug;

  const markDirty = () => {
    setIsDirty(true);
    if (saveState.status !== "saving") {
      saveState.reset();
    }
  };

  const updateField = <K extends keyof Article>(key: K, value: Article[K]) => {
    markDirty();
    setArticle((current) => ({ ...current, [key]: value }));
  };

  const toArticleInput = (value: Article): Omit<Article, "id" | "createdAt" | "updatedAt"> => {
    const { id, createdAt, updatedAt, ...input } = value;
    return input;
  };

  const persistArticle = async () => {
    const payload = toArticleInput(article);

    if (article.id) {
      return executeWriteWithQueueFallback("article.update", { id: article.id, updates: payload }, async () => {
        const updated = await articleRepository.update(article.id, payload);
        if (!updated) {
          throw new Error("Article update returned no record.");
        }

        return updated;
      });
    }

    return executeWriteWithQueueFallback("article.create", payload, () => articleRepository.create(payload));
  };

  const handleSave = async () => {
    const validationErrors = validateArticleForm(article);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      saveState.markError("Please fix the highlighted fields.");
      pushToast({ tone: "warning", title: "Article validation failed", description: "Complete required fields before saving." });
      return;
    }

    saveState.startSaving();
    try {
      const persisted = await persistArticle();
      setArticle(persisted);
      setIsDirty(false);
      saveState.markSaved();
      pushToast({ tone: "success", title: "Article saved", description: "Draft changes are up to date." });
    } catch {
      saveState.markError("Unable to save article right now.");
      pushToast({ tone: "error", title: "Save failed", description: "Unable to save article right now." });
    }
  };

  return (
    <div className="space-y-6">
      <BasecampPageHeader
        eyebrow="Basecamp"
        title={initialArticle ? "Edit article" : "Create an article"}
        description="Create and manage Southern Vermont guides, itineraries, and editorial stories."
        statusPill={article.status}
        meta={`Last updated ${new Date(article.updatedAt).toLocaleDateString()}`}
        primaryAction={{ label: "Save draft", onClick: handleSave }}
        secondaryAction={{ label: "Back to articles", href: "/basecamp/articles", variant: "ghost" }}
      />

      <BasecampTabs tabs={tabs} activeKey={activeTab} onChange={(key) => setActiveTab(key as TabKey)} />

      <form className="space-y-6">
        {activeTab === "basic" ? (
          <section className="grid gap-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
                <Input
                  value={article.title}
                  onChange={(inputEvent) => {
                    const value = inputEvent.target.value;
                    setArticle((current) => ({
                      ...current,
                      title: value,
                      slug: slugTouched ? current.slug : slugify(value),
                    }));
                    markDirty();
                  }}
                />
                {errors.title ? <p className="mt-1 text-xs text-rose-700">{errors.title}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Slug</label>
                <Input
                  value={displaySlug}
                  onChange={(inputEvent) => {
                    setSlugTouched(true);
                    updateField("slug", inputEvent.target.value);
                  }}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Subtitle</label>
                <Input value={article.subtitle} onChange={(event) => updateField("subtitle", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Excerpt</label>
                <textarea
                  rows={4}
                  value={article.excerpt}
                  onChange={(event) => updateField("excerpt", event.target.value)}
                  className="w-full rounded-3xl border border-(--color-pine)/25 bg-white px-4 py-4 text-base text-(--color-slate) outline-none"
                />
                {errors.excerpt ? <p className="mt-1 text-xs text-rose-700">{errors.excerpt}</p> : null}
              </div>
            </div>

            <div className="space-y-5 rounded-3xl border border-[#f2e6cb] bg-[#fcfaf6] p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Article Type</label>
                <select value={article.articleType} onChange={(e) => updateField("articleType", e.target.value as ArticleType)} className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate)">
                  {articleTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
                <select value={article.status} onChange={(e) => updateField("status", e.target.value as ArticleStatus)} className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate)">
                  {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Author</label>
                <Input value={article.author} onChange={(e) => updateField("author", e.target.value)} />
                {errors.author ? <p className="mt-1 text-xs text-rose-700">{errors.author}</p> : null}
              </div>
              <label className="flex items-center gap-3 rounded-full border border-[#e8dfc8] bg-white px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" checked={article.featured} onChange={(e) => updateField("featured", e.target.checked)} />
                Featured article
              </label>
            </div>
          </section>
        ) : null}

        {activeTab === "content" ? (
          <section className="rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Body</label>
            <textarea
              rows={16}
              value={article.body}
              onChange={(event) => updateField("body", event.target.value)}
              className="w-full rounded-3xl border border-(--color-pine)/25 bg-white px-4 py-4 text-base leading-7 text-(--color-slate) outline-none"
            />
            {errors.body ? <p className="mt-1 text-xs text-rose-700">{errors.body}</p> : null}
          </section>
        ) : null}

        {activeTab === "media" ? (
          <section className="grid gap-5 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Featured image</label>
              <Input value={article.featuredImage} onChange={(e) => updateField("featuredImage", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Gallery</label>
              <Input value={article.gallery.join(", ")} onChange={(e) => updateField("gallery", parseList(e.target.value))} />
            </div>
          </section>
        ) : null}

        {activeTab === "relationships" ? (
          <section className="grid gap-5 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Related Places</label>
              <Input value={article.relatedPlaces.join(", ")} onChange={(e) => updateField("relatedPlaces", parseList(e.target.value))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Related Collections</label>
              <Input value={article.relatedCollections.join(", ")} onChange={(e) => updateField("relatedCollections", parseList(e.target.value))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Related Events</label>
              <Input value={article.relatedEvents.join(", ")} onChange={(e) => updateField("relatedEvents", parseList(e.target.value))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Categories</label>
              <Input value={article.categories.join(", ")} onChange={(e) => updateField("categories", parseList(e.target.value))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Tags</label>
              <Input value={article.tags.join(", ")} onChange={(e) => updateField("tags", parseList(e.target.value))} />
            </div>
          </section>
        ) : null}

        {activeTab === "seo" ? (
          <section className="grid gap-5 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">SEO title</label>
              <Input value={article.seoTitle} onChange={(e) => updateField("seoTitle", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">SEO description</label>
              <Input value={article.seoDescription} onChange={(e) => updateField("seoDescription", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Published at</label>
              <Input type="datetime-local" value={article.publishedAt ? article.publishedAt.slice(0, 16) : ""} onChange={(e) => updateField("publishedAt", e.target.value ? new Date(e.target.value).toISOString() : "")} />
            </div>
          </section>
        ) : null}

        {activeTab === "preview" ? (
          <BasecampPreviewPanel
            heroTitle={article.title || "Untitled article"}
            heroDescription={article.subtitle || article.excerpt || "No summary yet."}
            badges={[article.articleType, article.status, article.author || "Unassigned"]}
            seoSnippet={article.seoDescription || article.excerpt || "No SEO description yet."}
            relatedPlaceholder={article.relatedPlaces.length ? "Related places are connected in the relationships tab." : "Related places, collections, events, and deals will appear here once connected."}
          />
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <SaveStatus status={saveState.status} isDirty={isDirty} errorMessage={saveState.errorMessage} />

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={handleSave} disabled={saveState.status === "saving"}>
              {saveState.status === "saving" ? "Saving..." : "Save"}
            </Button>
            <Link href="/basecamp/articles">
              <Button type="button" variant="ghost">Back to articles</Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
