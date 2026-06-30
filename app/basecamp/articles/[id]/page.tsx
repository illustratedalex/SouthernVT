import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/basecamp";
import { getArticleById } from "@/repositories/ArticleRepository";

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <ArticleForm initialArticle={article} />
      </div>
    </div>
  );
}
