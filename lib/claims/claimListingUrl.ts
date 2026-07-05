export function buildClaimListingHref(slug: string) {
  return `/claim-listing?listing=${encodeURIComponent(slug)}`;
}
