import type { EventStatus } from "@/types/Event";
import { StatusBadge } from "./StatusBadge";

export function EventStatusBadge({ status }: { status: EventStatus }) {
  return <StatusBadge status={status} />;
}
