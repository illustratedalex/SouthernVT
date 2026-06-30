import Link from "next/link";
import { Button } from "@/components/ui";
import type { Collection } from "@/types/Collection";
import { BasecampActionMenu } from "./BasecampActionMenu";
import { CollectionStatusBadge } from "./CollectionStatusBadge";

interface CollectionTableProps {
  collections: Collection[];
  onArchive?: (id: string) => void;
}

export function CollectionTable({ collections, onArchive }: CollectionTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e8dfc8] bg-white/80 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-[#f7efe1] text-sm uppercase tracking-[0.2em] text-slate-600">
          <tr>
            <th className="px-4 py-3">Collection</th>
            <th className="px-4 py-3">Season</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Places</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {collections.map((collection) => (
            <tr key={collection.id} className="text-sm text-slate-700">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img src={collection.featuredImage} alt={collection.title} className="h-12 w-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold text-slate-900">{collection.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{collection.subtitle}</p>
                    {collection.featured ? <p className="mt-1 text-xs font-semibold text-amber-700">Featured</p> : null}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">{collection.season}</td>
              <td className="px-4 py-4">
                <CollectionStatusBadge status={collection.status} />
              </td>
              <td className="px-4 py-4">{collection.places.length}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <Link href={`/basecamp/collections/${collection.id}`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <BasecampActionMenu items={[{ label: "Preview", href: `/collections/${collection.slug}` }, { label: "Duplicate", disabled: true }, { label: "Archive", onClick: () => onArchive?.(collection.id) }]} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
