import "server-only";
import { basicBusinessListings } from "@/data/basicBusinessListings";
import { getBusinessClaimStatusMap } from "@/lib/claims/liveClaims";
import type { BusinessListing } from "@/types/BusinessListing";

export async function getBusinessListingsWithLiveClaimStatus(): Promise<BusinessListing[]> {
  const statusMap = await getBusinessClaimStatusMap();

  if (!statusMap.size) {
    return basicBusinessListings;
  }

  return basicBusinessListings.map((listing) => {
    const liveClaimStatus = statusMap.get(listing.id);
    if (!liveClaimStatus) {
      return listing;
    }

    return {
      ...listing,
      claimStatus: liveClaimStatus,
    };
  });
}

export async function getBusinessListingBySlugWithLiveClaimStatus(slug: string): Promise<BusinessListing | null> {
  const listings = await getBusinessListingsWithLiveClaimStatus();
  return listings.find((listing) => listing.slug === slug) ?? null;
}
