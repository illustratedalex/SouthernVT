import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CheckInPanel } from "@/components/passport/CheckInPanel";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { createPageMetadata } from "@/lib/seo";
import { getPlaces } from "@/repositories/PlaceRepository";
import { getMembers, getRewards, getStampsByMemberId } from "@/repositories/PassportRepository";

interface PassportCheckInPageProps {
  params: Promise<{ placeId: string }>;
}

export const metadata: Metadata = createPageMetadata({
  title: "Adventure Passport Check-In",
  description: "Collect an Adventure Passport stamp for a participating SouthernVT place.",
  path: "/passport/check-in",
});

export default async function PassportCheckInPage({ params }: PassportCheckInPageProps) {
  const { placeId } = await params;
  const passportEnabled = await isFeatureEnabled("passport");

  const [places, members, rewards] = await Promise.all([getPlaces(), getMembers(), getRewards()]);
  const place = places.find((item) => item.id === placeId) ?? null;

  if (!place) {
    notFound();
  }

  const member = members[0] ?? null;
  if (!member) {
    notFound();
  }

  const stamps = await getStampsByMemberId(member.id);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-10">
        <Link href="/passport" className="text-sm font-semibold text-[#1f3b2f]">Back to passport</Link>
        <div className="mt-4">
          <CheckInPanel
            member={member}
            placeId={place.id}
            placeSlug={place.slug}
            placeName={place.name}
            currentStampCount={stamps.length}
            rewards={rewards}
            previewMode={!passportEnabled}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
