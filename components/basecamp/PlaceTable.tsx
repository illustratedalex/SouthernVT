import Link from "next/link";
import { Button } from "@/components/ui";
import type { CompletenessScore } from "@/types/Completeness";
import type { Place } from "@/types/Place";
import { BasecampActionMenu } from "./BasecampActionMenu";
import { CompletenessMeter } from "./CompletenessMeter";
import { PlaceStatusBadge } from "./PlaceStatusBadge";
import { PlaceTypeBadge } from "./PlaceTypeBadge";

interface PlaceTableProps {
  places: Place[];
  completenessById?: Record<string, CompletenessScore>;
  onDelete?: (id: string) => void;
}

export function PlaceTable({ places, completenessById = {}, onDelete }: PlaceTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e8dfc8] bg-white/80 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-[#f7efe1] text-sm uppercase tracking-[0.2em] text-slate-600">
          <tr>
            <th className="px-4 py-3">Place</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Completeness</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {places.map((place) => (
            <tr key={place.id} className="text-sm text-slate-700">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img src={place.featuredImage} alt={place.name} className="h-12 w-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold text-slate-900">{place.name}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {place.featured ? <span className="text-xs font-semibold text-amber-700">Featured</span> : null}
                      <span className="text-xs text-slate-500">{place.city}, {place.state}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <PlaceTypeBadge placeType={place.placeType} />
              </td>
              <td className="px-4 py-4">
                <PlaceStatusBadge status={place.status} />
              </td>
              <td className="px-4 py-4">{place.address}</td>
              <td className="px-4 py-4">
                {completenessById[place.id] ? <CompletenessMeter score={completenessById[place.id]} compact /> : null}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <Link href={`/basecamp/places/${place.id}`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <BasecampActionMenu
                    items={[
                      { label: "Preview", href: `/places/${place.slug}` },
                      { label: "Duplicate", disabled: true },
                      { label: "Archive", onClick: () => onDelete?.(place.id) },
                    ]}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
