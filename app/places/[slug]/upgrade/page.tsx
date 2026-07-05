import { redirect } from "next/navigation";

interface PlaceUpgradeRedirectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlaceUpgradeRedirectPage({ params }: PlaceUpgradeRedirectPageProps) {
  const { slug } = await params;
  redirect(`/places/${encodeURIComponent(slug)}?upgrade=business-only`);
}
