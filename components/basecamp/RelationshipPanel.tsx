import Link from "next/link";
import type { ResolvedRelationshipItem } from "@/lib/repositories/RelationshipRepository";

interface RelationshipPanelProps {
  items: ResolvedRelationshipItem[];
}

interface GroupConfig {
  key: string;
  title: string;
  match: (item: ResolvedRelationshipItem) => boolean;
}

const groups: GroupConfig[] = [
  {
    key: "nearby-places",
    title: "Nearby Places",
    match: (item) => item.item.type === "place" && item.relationship.relationshipType === "nearby",
  },
  {
    key: "featured-in",
    title: "Featured In",
    match: (item) => item.relationship.relationshipType === "featured_in",
  },
  {
    key: "uses-media",
    title: "Uses Media",
    match: (item) => item.item.type === "media" || item.relationship.relationshipType === "uses_media",
  },
  {
    key: "related-collections",
    title: "Related Collections",
    match: (item) =>
      item.item.type === "collection" &&
      (item.relationship.relationshipType === "contains" || item.relationship.relationshipType === "related" || item.relationship.relationshipType === "featured_in"),
  },
  {
    key: "events",
    title: "Events",
    match: (item) => item.item.type === "event" || item.relationship.relationshipType === "hosts_event",
  },
  {
    key: "deals",
    title: "Deals",
    match: (item) => item.item.type === "deal" || item.relationship.relationshipType === "has_deal",
  },
];

export function RelationshipPanel({ items }: RelationshipPanelProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Relationships</h3>
      <p className="mt-1 text-sm text-slate-600">Connected content across places, collections, media, events, and deals.</p>

      <div className="mt-4 space-y-5">
        {groups.map((group) => {
          const groupItems = items.filter(group.match);
          return (
            <div key={group.key}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">{group.title}</p>
              {groupItems.length ? (
                <div className="mt-2 space-y-2">
                  {groupItems.map((entry) => (
                    <article key={entry.relationship.id} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{entry.item.title}</p>
                          <p className="mt-1 text-xs text-slate-600">{entry.item.subtitle}</p>
                        </div>
                        <span className="rounded-full bg-[#f1e8d5] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">
                          {entry.item.type}
                        </span>
                      </div>

                      <p className="mt-2 text-xs font-medium text-slate-500">{entry.relationship.label}</p>

                      <div className="mt-3 flex gap-2">
                        <Link href={entry.item.url} className="rounded-full bg-[#1f3b2f] px-3 py-1.5 text-xs font-semibold text-[#f8f2e4] transition hover:bg-[#3e5b4a]">
                          Open
                        </Link>
                        <button type="button" className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-[#f8f2e4]">
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No linked items yet.</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
