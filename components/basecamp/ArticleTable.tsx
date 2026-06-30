import Link from "next/link";
import { Button } from "@/components/ui";
import type { Article } from "@/types/Article";
import { BasecampActionMenu } from "./BasecampActionMenu";
import { ArticleStatusBadge } from "./ArticleStatusBadge";

interface ArticleTableProps {
  articles: Article[];
  onArchive?: (id: string) => void;
}

export function ArticleTable({ articles, onArchive }: ArticleTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e8dfc8] bg-white/80 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-[#f7efe1] text-sm uppercase tracking-[0.2em] text-slate-600">
          <tr>
            <th className="px-4 py-3">Article</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Updated</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {articles.map((article) => (
            <tr key={article.id} className="text-sm text-slate-700">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img src={article.featuredImage} alt={article.title} className="h-12 w-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold text-slate-900">{article.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{article.author}</p>
                    {article.featured ? <p className="mt-1 text-xs font-semibold text-amber-700">Featured</p> : null}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">{article.articleType}</td>
              <td className="px-4 py-4"><ArticleStatusBadge status={article.status} /></td>
              <td className="px-4 py-4">{new Date(article.updatedAt).toLocaleDateString()}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <Link href={`/basecamp/articles/${article.id}`}>
                    <Button variant="secondary" size="sm">Edit</Button>
                  </Link>
                  <BasecampActionMenu items={[{ label: "Preview", href: `/guides/${article.slug}` }, { label: "Duplicate", disabled: true }, { label: "Archive", onClick: () => onArchive?.(article.id) }]} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
