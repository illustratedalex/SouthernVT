import { isFeatureEnabled } from "@/lib/featureFlags";
import { resolveRepositoryMode } from "@/lib/repositories/mode";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { Article } from "@/types/Article";
import type { ArticleInput } from "@/lib/repositories/articleRepository.mock";
import * as mockRepository from "@/lib/repositories/articleRepository.mock";
import * as supabaseRepository from "@/lib/repositories/articleRepository.supabase";

type ArticleRepositoryModule = {
  getArticles: () => Promise<Article[]>;
  getPublishedArticles: () => Promise<Article[]>;
  getFeaturedArticles: () => Promise<Article[]>;
  getArticleById: (id: string) => Promise<Article | null>;
  getArticleBySlug: (slug: string) => Promise<Article | null>;
  createArticle: (input: ArticleInput) => Promise<Article>;
  updateArticle: (id: string, updates: Partial<ArticleInput>) => Promise<Article | null>;
  archiveArticle: (id: string) => Promise<Article | null>;
};

async function getActiveArticleRepository(): Promise<ArticleRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  const mode = resolveRepositoryMode({ supabaseEnv: hasSupabaseEnv(), featureFlagSupabaseEnabled: supabaseEnabled });
  if (mode === "supabase") {
    return supabaseRepository;
  }
  return mockRepository;
}

export async function getArticles(): Promise<Article[]> {
  const repository = await getActiveArticleRepository();
  try {
    return await repository.getArticles();
  } catch {
    return mockRepository.getArticles();
  }
}

export async function getPublishedArticles(): Promise<Article[]> {
  const repository = await getActiveArticleRepository();
  try {
    return await repository.getPublishedArticles();
  } catch {
    return mockRepository.getPublishedArticles();
  }
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const repository = await getActiveArticleRepository();
  try {
    return await repository.getFeaturedArticles();
  } catch {
    return mockRepository.getFeaturedArticles();
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  const repository = await getActiveArticleRepository();
  try {
    return await repository.getArticleById(id);
  } catch {
    return mockRepository.getArticleById(id);
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const repository = await getActiveArticleRepository();
  try {
    return await repository.getArticleBySlug(slug);
  } catch {
    return mockRepository.getArticleBySlug(slug);
  }
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  const repository = await getActiveArticleRepository();
  try {
    return await repository.createArticle(input);
  } catch {
    return mockRepository.createArticle(input);
  }
}

export async function updateArticle(id: string, updates: Partial<ArticleInput>): Promise<Article | null> {
  const repository = await getActiveArticleRepository();
  try {
    return await repository.updateArticle(id, updates);
  } catch {
    return mockRepository.updateArticle(id, updates);
  }
}

export async function archiveArticle(id: string): Promise<Article | null> {
  const repository = await getActiveArticleRepository();
  try {
    return await repository.archiveArticle(id);
  } catch {
    return mockRepository.archiveArticle(id);
  }
}

export const articleRepository = {
  getAll: getArticles,
  getPublished: getPublishedArticles,
  getFeatured: getFeaturedArticles,
  getById: getArticleById,
  getBySlug: getArticleBySlug,
  create: createArticle,
  update: updateArticle,
  archive: archiveArticle,
  getArticles,
  getPublishedArticles,
  getFeaturedArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  archiveArticle,
};
