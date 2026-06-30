import { Input } from "@/components/ui";
import type { ArticleStatus, ArticleType } from "@/types/Article";

interface ArticleFiltersProps {
  search: string;
  status: ArticleStatus | "All";
  articleType: ArticleType | "All";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ArticleStatus | "All") => void;
  onArticleTypeChange: (value: ArticleType | "All") => void;
}

const statuses: Array<ArticleStatus> = ["draft", "review", "scheduled", "published", "archived"];
const articleTypes: Array<ArticleType> = ["guide", "story", "list", "itinerary", "news"];

export function ArticleFilters({
  search,
  status,
  articleType,
  onSearchChange,
  onStatusChange,
  onArticleTypeChange,
}: ArticleFiltersProps) {
  return (
    <div className="grid gap-4 rounded-[24px] border border-[#e8dfc8] bg-white/80 p-4 shadow-sm lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
      <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search articles" className="h-12 rounded-full" />

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as ArticleStatus | "All")}
        className="h-12 rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none"
      >
        <option value="All">All statuses</option>
        {statuses.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <select
        value={articleType}
        onChange={(event) => onArticleTypeChange(event.target.value as ArticleType | "All")}
        className="h-12 rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none"
      >
        <option value="All">All article types</option>
        {articleTypes.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}
