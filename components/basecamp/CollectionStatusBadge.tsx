import type { CollectionStatus } from "@/types/Collection";
import { StatusBadge } from "./StatusBadge";

export function CollectionStatusBadge({ status }: { status: CollectionStatus }) {
  return <StatusBadge status={status} />;
}
