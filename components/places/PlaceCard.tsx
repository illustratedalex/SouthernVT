import Link from "next/link";
import { Badge, Button, Card } from "@/components/ui";
import type { Place } from "@/types/Place";
import { PlaceStatusBadge } from "./PlaceStatusBadge";

interface PlaceCardProps {
  place: Place;
  onDelete?: (id: string) => void;
}

export function PlaceCard({ place, onDelete }: PlaceCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img src={place.featuredImage} alt={place.name} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">{place.placeType}</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">{place.name}</h3>
          </div>
          <PlaceStatusBadge status={place.status} />
        </div>

        <p className="line-clamp-3 text-sm leading-7 text-slate-600">{place.description}</p>

        <div className="flex flex-wrap gap-2">
          {place.featured ? <Badge>Featured</Badge> : null}
          {place.status === "published" ? <Badge className="bg-emerald-100 text-emerald-800">Published</Badge> : null}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">{place.city}, {place.state}</p>
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
        </div>
      </div>
    </Card>
  );
}
