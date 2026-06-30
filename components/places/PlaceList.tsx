import Link from "next/link";
import { Button } from "@/components/ui";
import type { Place } from "@/types/Place";
import { PlaceStatusBadge } from "./PlaceStatusBadge";

interface PlaceListProps {
  places: Place[];
  onDelete?: (id: string) => void;
}

export function PlaceList({ places, onDelete }: PlaceListProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e8dfc8] bg-white/80 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-[#f7efe1] text-sm uppercase tracking-[0.2em] text-slate-600">
          <tr>
            <th className="px-4 py-3">Place</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Status</th>
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
                    {place.featured ? <p className="text-xs text-amber-700">Featured</p> : null}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">{place.placeType}</td>
              <td className="px-4 py-4">{place.city}, {place.state}</td>
              <td className="px-4 py-4">
                <PlaceStatusBadge status={place.status} />
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2">
                  <Link href={`/basecamp/places/${place.id}`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => onDelete?.(place.id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
