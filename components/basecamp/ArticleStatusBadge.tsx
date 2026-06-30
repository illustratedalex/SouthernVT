import type { ArticleStatus } from "@/types/Article";
import { StatusBadge } from "./StatusBadge";

export function ArticleStatusBadge({ status }: { status: ArticleStatus }) {
  return <StatusBadge status={status} />;
}
