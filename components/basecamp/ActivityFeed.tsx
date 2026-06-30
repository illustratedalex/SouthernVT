"use client";

import type { Activity, ActivityContentType, ActivityType } from "@/types/Activity";

interface ActivityFeedProps {
  items: Activity[];
  compact?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

const typeIcon: Record<ActivityType, string> = {
  created: "+",
  updated: "U",
  published: "P",
  archived: "A",
  uploaded: "M",
  related: "R",
  commented: "C",
  status_changed: "S",
};

const contentTypeColor: Record<ActivityContentType, string> = {
  place: "bg-[#e8f2ec] text-[#1f5a3d]",
  collection: "bg-[#f3ecff] text-[#5b3ea6]",
  media: "bg-[#fdeee0] text-[#8b4f1f]",
  relationship: "bg-[#e5f3ff] text-[#1d5f8a]",
  workflow: "bg-[#fdf1dc] text-[#7a5411]",
  user: "bg-[#eceff4] text-[#4a5568]",
  system: "bg-[#fce8ef] text-[#8a2d58]",
};

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
}

function toRelativeTimestamp(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const minutes = Math.floor(diffMs / (1000 * 60));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function groupByDay(items: Activity[]) {
  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

  const today: Activity[] = [];
  const yesterday: Activity[] = [];
  const earlier: Activity[] = [];

  items.forEach((item) => {
    const created = new Date(item.createdAt);
    const createdStart = startOfDay(created);

    if (createdStart === todayStart) {
      today.push(item);
      return;
    }

    if (createdStart === yesterdayStart) {
      yesterday.push(item);
      return;
    }

    earlier.push(item);
  });

  return [
    { label: "Today", items: today },
    { label: "Yesterday", items: yesterday },
    { label: "Earlier", items: earlier },
  ].filter((group) => group.items.length > 0);
}

export function ActivityFeed({
  items,
  compact = false,
  emptyTitle = "No activity yet",
  emptyDescription = "Activity will appear here as editors publish updates and connect content.",
}: ActivityFeedProps) {
  if (!items.length) {
    return (
      <div className="rounded-[26px] border border-[#e8dfc8] bg-[#fcfaf6] p-6 text-center">
        <h3 className="text-lg font-semibold text-slate-900">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-slate-600">{emptyDescription}</p>
      </div>
    );
  }

  const grouped = groupByDay(items);

  return (
    <div className="space-y-6">
      {grouped.map((group) => (
        <section key={group.label}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">{group.label}</p>

          <div className="mt-3 space-y-3">
            {group.items.map((item) => (
              <article key={item.id} className={`rounded-[22px] border border-[#e8dfc8] bg-white ${compact ? "p-3" : "p-4"}`}>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5ebd8] text-sm font-semibold text-[#1f3b2f]">
                    {typeIcon[item.type]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${contentTypeColor[item.contentType]}`}>
                        {item.contentType}
                      </span>
                    </div>

                    {!compact ? <p className="mt-1 text-sm text-slate-600">{item.description}</p> : null}

                    <p className="mt-2 text-xs text-slate-500">
                      {item.actor} · {toRelativeTimestamp(item.createdAt)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
