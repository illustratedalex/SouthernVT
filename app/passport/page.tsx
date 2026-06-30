import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { PassportProgress } from "@/components/passport/PassportProgress";
import { RewardCard } from "@/components/passport/RewardCard";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { createPageMetadata } from "@/lib/seo";
import { getPlaces } from "@/repositories/PlaceRepository";
import { getMembers, getRewards, getStampsByMemberId } from "@/repositories/PassportRepository";

export const metadata: Metadata = createPageMetadata({
  title: "SouthernVT Adventure Passport",
  description: "Collect Southern Vermont passport stamps and unlock local rewards.",
  path: "/passport",
});

const featuredPlaceIds = [
  "place-hamilton-falls",
  "place-grafton-inn",
  "place-vermont-country-store",
  "place-brattleboro-farmers-market",
  "place-jamaica-state-park",
];

export default async function PassportPage() {
  const passportEnabled = await isFeatureEnabled("passport");

  const [members, rewards, places] = await Promise.all([getMembers(), getRewards(), getPlaces()]);
  const safeMembers = Array.isArray(members) ? members : [];
  const safeRewards = Array.isArray(rewards) ? rewards : [];
  const safePlaces = Array.isArray(places) ? places : [];

  const previewMember = safeMembers[0] ?? null;
  const previewStamps = previewMember ? await getStampsByMemberId(previewMember.id) : [];

  const featuredPlaces = safePlaces.filter((place) => featuredPlaceIds.includes(place.id));
  const sampleRewards = safeRewards.filter((reward) => reward.status === "active").slice(0, 3);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="relative overflow-hidden border-b border-(--color-pine)/20 bg-linear-to-br from-[#12241d] via-[#1f3b2f] to-[#3d5d4b] text-(--color-cream)">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">Adventure Passport</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">Collect stamps. Unlock local rewards.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">Explore participating Southern Vermont places and earn reward milestones in this mock-first passport experience.</p>
          {!passportEnabled ? (
            <p className="mt-5 inline-flex rounded-full border border-[#d7cbb3] bg-[#fff7e4] px-4 py-2 text-sm font-semibold text-[#6b5a30]">
              Adventure Passport is in preview mode.
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10 sm:px-8 lg:px-10">
        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
          <ol className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-3">
            <li className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] p-4">1. Visit participating places and check in.</li>
            <li className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] p-4">2. Collect passport stamps in your progress track.</li>
            <li className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] p-4">3. Unlock reward milestones from local partners.</li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Sample rewards</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sampleRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} stampCount={previewStamps.length} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Featured participating places</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {featuredPlaces.map((place) => (
              <article key={place.id} className="rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{place.name}</p>
                <p className="mt-1 text-xs text-slate-500">{place.city}, {place.state}</p>
                <Link href={`/passport/check-in/${place.id}`} className="mt-3 inline-flex text-sm font-semibold text-[#1f3b2f]">
                  Check in
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[#d7cbb3] bg-[#fcfaf6] p-6 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Start your Passport</h2>
          <p className="mt-2 text-sm text-slate-600">Jump into a mock check-in flow and collect your first preview stamp.</p>
          <Link href="/passport/check-in/place-hamilton-falls" className="mt-4 inline-flex rounded-full bg-[#1f3b2f] px-5 py-3 text-sm font-semibold text-[#f8f2e4]">
            Start your Passport
          </Link>
        </section>

        {previewMember ? <PassportProgress member={previewMember} stamps={previewStamps} rewards={safeRewards} /> : null}
      </section>

      <Footer />
    </main>
  );
}
