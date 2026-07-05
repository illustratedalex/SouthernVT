import Link from "next/link";
import { Badge } from "@/components/ui";
import {
  getBusinessListingCategoryIcon,
  getBusinessListingClaimLabel,
  getBusinessListingStatusLabel,
  getBusinessListingStatusTone,
} from "@/lib/businessListings";
import type { BusinessListing } from "@/types/BusinessListing";

interface BusinessListingCardProps {
  listing: BusinessListing;
  ctaLabel?: string;
}

export function BusinessListingCard({ listing, ctaLabel = "View listing" }: BusinessListingCardProps) {
  return (
    <article className="rounded-[26px] border border-[#e8dfc8] bg-white p-5 shadow-[0_14px_48px_rgba(31,59,47,0.08)]">
      <div className="flex flex-wrap gap-2">
        <Badge variant={getBusinessListingStatusTone(listing.status)}>{getBusinessListingStatusLabel(listing.status)}</Badge>
        <Badge variant="subtle">{getBusinessListingClaimLabel(listing.claimStatus)}</Badge>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold text-slate-900">{listing.name}</h3>
        <p className="mt-1 text-sm text-slate-600">{listing.town}, {listing.county}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        <span>{getBusinessListingCategoryIcon(listing.category)} {listing.category}</span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span>{listing.completenessScore}% complete</span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-700">{listing.description}</p>

      <Link
        href={`/businesses/${listing.slug}`}
        className="mt-5 inline-flex rounded-full bg-(--color-forest-green) px-4 py-2 text-sm font-semibold text-(--color-cream) motion-safe:transition motion-safe:hover:bg-(--color-pine)"
      >
        {ctaLabel}
      </Link>
    </article>
  );
}