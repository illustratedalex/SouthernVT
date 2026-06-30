import type { Article } from "@/types/Article";
import type { ArticleInput } from "@/lib/repositories/articleRepository.mock";

function notReady(functionName: string): never {
  throw new Error(`${functionName} is not implemented for Supabase yet.`);
}

export async function getArticles(): Promise<Article[]> {
  return notReady("getArticles");
}

export async function getPublishedArticles(): Promise<Article[]> {
  return notReady("getPublishedArticles");
}

export async function getFeaturedArticles(): Promise<Article[]> {
  return notReady("getFeaturedArticles");
}

export async function getArticleById(_id: string): Promise<Article | null> {
  return notReady("getArticleById");
}

export async function getArticleBySlug(_slug: string): Promise<Article | null> {
  return notReady("getArticleBySlug");
}

export async function createArticle(_input: ArticleInput): Promise<Article> {
  return notReady("createArticle");
}

export async function updateArticle(_id: string, _updates: Partial<ArticleInput>): Promise<Article | null> {
  return notReady("updateArticle");
}

export async function archiveArticle(_id: string): Promise<Article | null> {
  return notReady("archiveArticle");
}

export const supabaseArticleRepository = {
  getArticles,
  getPublishedArticles,
  getFeaturedArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  archiveArticle,
};
