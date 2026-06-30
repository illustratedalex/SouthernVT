"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRelationshipStore } from "@/components/relationships/RelationshipStoreProvider";
import type { RelationshipType } from "@/types/Relationship";

interface PlaceRelationshipSectionsLiveProps {
  placeId: string;
}

function RelationshipBlock({
  title,
  emptyText,
  rows,
}: {
  title: string;
  emptyText: string;
  rows: Array<{ id: string; title: string; subtitle?: string; href?: string; label?: string }>;
}) {
  return (
    <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <div className="mt-3 space-y-2">
        {rows.length ? (
          rows.map((row) =>
            row.href ? (
              <Link
                key={row.id}
                href={row.href}
                className="block rounded-xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#d8b15d]"
              >
                {row.title}
                {row.subtitle ? <span className="mt-1 block text-xs font-medium text-slate-500">{row.subtitle}</span> : null}
                {row.label ? <span className="mt-1 block text-xs text-slate-500">{row.label}</span> : null}
              </Link>
            ) : (
              <div key={row.id} className="rounded-xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2 text-sm text-slate-700">
                <p className="font-semibold">{row.title}</p>
                {row.subtitle ? <p className="mt-1 text-xs text-slate-500">{row.subtitle}</p> : null}
                {row.label ? <p className="mt-1 text-xs text-slate-500">{row.label}</p> : null}
              </div>
            ),
          )
        ) : (
          <p className="text-sm text-slate-600">{emptyText}</p>
        )}
      </div>
    </article>
  );
}

export function PlaceRelationshipSectionsLive({ placeId }: PlaceRelationshipSectionsLiveProps) {
  const { getRelationships, getCatalogItem } = useRelationshipStore();

  const rows = useMemo(() => {
    const items = getRelationships({ contentType: "place", contentId: placeId });

    const toRows = (relationshipType: RelationshipType, targetType: "place" | "collection" | "media") =>
      items
        .filter((relationship) => relationship.relationshipType === relationshipType)
        .flatMap((relationship) => {
          const isFromCurrent = relationship.fromType === "place" && relationship.fromId === placeId;
          const resolvedType = isFromCurrent ? relationship.toType : relationship.fromType;
          const resolvedId = isFromCurrent ? relationship.toId : relationship.fromId;

          if (resolvedType !== targetType) {
            return [];
          }

          const target = getCatalogItem(resolvedType, resolvedId);
          if (!target) {
            return [];
          }

          return [
            {
              id: relationship.id,
              title: target.title,
              subtitle: target.subtitle,
              href: target.url,
              label: relationship.label,
            },
          ];
        })
        .slice(0, 3);

    return {
      nearby: toRows("nearby", "place"),
      featured: toRows("featured_in", "collection"),
      media: toRows("uses_media", "media"),
    };
  }, [getCatalogItem, getRelationships, placeId]);

  return (
    <section className="grid gap-6 xl:grid-cols-3">
      <RelationshipBlock title="Nearby Places" emptyText="No nearby relationship data linked yet." rows={rows.nearby} />
      <RelationshipBlock title="Featured Collections" emptyText="No featured collection relationships linked yet." rows={rows.featured} />
      <RelationshipBlock title="Related Media" emptyText="Media placeholders will appear as links are added." rows={rows.media} />
    </section>
  );
}
