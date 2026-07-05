import { redirect } from "next/navigation";

interface ClaimRedirectPageProps {
  params: Promise<{ placeSlug: string }>;
}

export default async function ClaimRedirectPage({ params }: ClaimRedirectPageProps) {
  const { placeSlug } = await params;
  redirect(`/claim-listing?listing=${encodeURIComponent(placeSlug)}`);
}
