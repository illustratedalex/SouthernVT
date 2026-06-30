import { mockArticles } from "@/data/articles";
import type { Article } from "@/types/Article";

export type ArticleInput = Omit<Article, "id" | "createdAt" | "updatedAt">;

let articleStore: Article[] = mockArticles.map((article) => ({ ...article }));

function createId(slug: string) {
  return `article-${slug}-${Date.now().toString(36)}`;
}

function clone(article: Article) {
  return { ...article };
}

function sortByUpdatedAt(items: Article[]) {
  return [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getArticles(): Promise<Article[]> {
  return sortByUpdatedAt(articleStore).map(clone);
}

export async function getPublishedArticles(): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter((article) => article.status === "published");
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles.filter((article) => article.featured);
}

export async function getArticleById(id: string): Promise<Article | null> {
  const article = articleStore.find((item) => item.id === id);
  return article ? clone(article) : null;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = articleStore.find((item) => item.slug === slug);
  return article ? clone(article) : null;
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  const now = new Date().toISOString();
  const created: Article = {
    ...input,
    id: createId(input.slug),
    createdAt: now,
    updatedAt: now,
  };

  articleStore = [created, ...articleStore];
  return clone(created);
}

export async function updateArticle(id: string, updates: Partial<ArticleInput>): Promise<Article | null> {
  const index = articleStore.findIndex((article) => article.id === id);
  if (index < 0) {
    return null;
  }

  const current = articleStore[index];
  const updated: Article = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  articleStore[index] = updated;
  return clone(updated);
}

export async function archiveArticle(id: string): Promise<Article | null> {
  return updateArticle(id, { status: "archived" });
}

export const mockArticleRepository = {
  getArticles,
  getPublishedArticles,
  getFeaturedArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  archiveArticle,
};
