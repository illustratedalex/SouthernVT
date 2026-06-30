import type { PlaceStatus } from "@/types/Place";
import { StatusBadge } from "./StatusBadge";

export function PlaceStatusBadge({ status }: { status: PlaceStatus }) {
  return <StatusBadge status={status} />;
}
