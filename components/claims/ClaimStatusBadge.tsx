import type { ClaimStatus } from "@/types/Claim";
import { StatusBadge } from "@/components/basecamp";

interface ClaimStatusBadgeProps {
  status: ClaimStatus;
}

export function ClaimStatusBadge({ status }: ClaimStatusBadgeProps) {
  return <StatusBadge status={status} />;
}
