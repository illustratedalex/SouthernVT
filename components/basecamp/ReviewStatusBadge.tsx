import type { ReviewStatus } from "@/types/Review";
import { StatusBadge } from "./StatusBadge";

interface ReviewStatusBadgeProps {
  status: ReviewStatus;
}

export function ReviewStatusBadge({ status }: ReviewStatusBadgeProps) {
  return <StatusBadge status={status} />;
}
