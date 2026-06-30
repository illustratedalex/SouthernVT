import type { DealStatus } from "@/types/Deal";
import { StatusBadge } from "./StatusBadge";

interface DealStatusBadgeProps {
  status: DealStatus;
}

export function DealStatusBadge({ status }: DealStatusBadgeProps) {
  return <StatusBadge status={status} />;
}
