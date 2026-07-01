import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { RecommendationRail } from "@/components/recommendation/RecommendationRail";
import { ExperienceService } from "@/lib/experience/ExperienceService";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { createPageMetadata } from "@/lib/seo";
import { getPlaces } from "@/repositories/PlaceRepository";

export const metadata = createPageMetadata({
  title: "Southern Vermont | Travel & Adventure",
  description: "Discover Southern Vermont with curated guides, local events, scenic adventures, and partner offers.",
  path: "/",
});

export default async function Home() {
  const [feed, premiumProfilesEnabled, places] = await Promise.all([
    ExperienceService.getHomeFeed(6),
    isFeatureEnabled("premiumProfiles"),
    getPlaces(),
  ]);

  const premiumPartners = places
    .filter((place) => place.status === "published" && place.isPremium)
    .sort((a, b) => (b.sponsorLevel ?? "").localeCompare(a.sponsorLevel ?? ""))
    .slice(0, 8);

  const featuredPlace = feed.dailyAdventure.place;
  const featuredCollection = feed.dailyAdventure.collection;
  const todaysAdventure = feed.dailyAdventure;

  const visualCards = [
    {
      title: "Hamilton Falls",
      badge: "Waterfall",
      description: "A dramatic forest waterfall with a short, rewarding hike and peak foliage color in fall.",
      href: "/places/hamilton-falls",
      imageClass: "bg-[linear-gradient(135deg,rgba(20,48,37,0.82),rgba(107,143,120,0.58)),url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80')]",
    },
    {
      title: "Jamaica State Park",
      badge: "Trail",
      description: "Riverside trails, shaded picnic spots, and a flexible half-day base for outdoor plans.",
      href: "/places/jamaica-state-park",
      imageClass: "bg-[linear-gradient(135deg,rgba(27,60,46,0.78),rgba(187,164,96,0.44)),url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80')]",
    },
    {
      title: "Grafton Inn",
      badge: "Hotel",
      description: "Historic New England character, warm hospitality, and a premium village-stay experience.",
      href: "/places/grafton-inn",
      imageClass: "bg-[linear-gradient(135deg,rgba(18,39,31,0.78),rgba(177,138,74,0.52)),url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80')]",
    },
    {
      title: "Vermont Country Store",
      badge: "Shop",
      description: "Classic Vermont goods, pantry finds, and local-made favorites in a timeless general store.",
      href: "/places/vermont-country-store",
      imageClass: "bg-[linear-gradient(135deg,rgba(33,57,43,0.8),rgba(198,169,94,0.5)),url('https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1400&q=80')]",
    },
    {
      title: "Brattleboro Farmers Market",
      badge: "Farm Stand",
      description: "Seasonal produce, artisan makers, and a lively Saturday morning local-food ritual.",
      href: "/places/brattleboro-farmers-market",
      imageClass: "bg-[linear-gradient(135deg,rgba(26,52,40,0.79),rgba(194,146,78,0.53)),url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=80')]",
    },
    {
      title: "Mount Equinox",
      badge: "Scenic Overlook",
      description: "A summit drive with broad mountain views and one of Southern Vermont's iconic panoramas.",
      href: "/places/mount-equinox-skyline-drive",
      imageClass: "bg-[linear-gradient(135deg,rgba(17,44,34,0.8),rgba(154,120,62,0.45)),url('https://images.unsplash.com/photo-1506424482690-f7cd225efb41?auto=format&fit=crop&w=1400&q=80')]",
    },
  ];

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="relative overflow-hidden border-b border-[#d7cbb3] bg-[#112a21] text-[#f8f2e4]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,180,99,0.2),transparent_36%),linear-gradient(135deg,rgba(7,20,15,0.8),rgba(18,42,33,0.72)),url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center" />
        <div className="relative mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d8b15d]">Southern Vermont Travel Magazine</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Discover the wild edges, village stories, and premium stays of Southern Vermont.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[#e6ded0] md:text-lg">
            A visual guide to scenic water, mountain drives, local markets, and seasonal travel moments curated for modern explorers.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/explorer"
              className="inline-flex rounded-full bg-[#d8b15d] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#12261d] shadow-sm transition hover:opacity-90"
            >
              Start Exploring
            </Link>
            <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#f8f2e4]">
              Seasonal Engine: {feed.season}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10 sm:px-8 lg:px-10">
        <section className="rounded-4xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Destination Gallery</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visualCards.map((card) => (
              <article key={card.title} className="overflow-hidden rounded-4xl border border-[#e8dfc8] bg-[#fcfaf6] shadow-sm">
                <div className={`h-48 bg-cover bg-center ${card.imageClass}`} />
                <div className="space-y-3 p-4">
                  <span className="inline-flex rounded-full border border-[#d7cbb3] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">
                    {card.badge}
                  </span>
                  <h2 className="text-xl font-semibold text-slate-900">{card.title}</h2>
                  <p className="text-sm leading-7 text-slate-600">{card.description}</p>
                  <Link href={card.href} className="inline-flex text-sm font-semibold text-[#1f3b2f] underline underline-offset-4">
                    View destination
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="overflow-hidden rounded-4xl border border-[#e8dfc8] bg-white shadow-sm">
            <div className="h-56 bg-[linear-gradient(135deg,rgba(22,51,39,0.82),rgba(216,177,93,0.38)),url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
            <div className="space-y-3 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Featured Place</p>
              <h2 className="text-2xl font-semibold text-slate-900">{featuredPlace ? featuredPlace.name : "Hamilton Falls"}</h2>
              <p className="text-sm leading-7 text-slate-600">
                {featuredPlace ? featuredPlace.description : "A flagship scenic stop with immersive trail atmosphere and local route options."}
              </p>
              {featuredPlace ? <Link href={`/places/${featuredPlace.slug}`} className="inline-flex text-sm font-semibold text-[#1f3b2f] underline underline-offset-4">Read place story</Link> : null}
            </div>
          </article>

          <article className="overflow-hidden rounded-4xl border border-[#e8dfc8] bg-white shadow-sm">
            <div className="h-56 bg-[linear-gradient(135deg,rgba(24,53,41,0.82),rgba(197,161,86,0.42)),url('https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
            <div className="space-y-3 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Featured Collection</p>
              <h2 className="text-2xl font-semibold text-slate-900">{featuredCollection ? featuredCollection.title : "Summer Swimming Holes"}</h2>
              <p className="text-sm leading-7 text-slate-600">
                {featuredCollection ? featuredCollection.description : "Curated places that shape an easy, photo-friendly warm weather day trip."}
              </p>
              {featuredCollection ? <Link href={`/collections/${featuredCollection.slug}`} className="inline-flex text-sm font-semibold text-[#1f3b2f] underline underline-offset-4">Open collection</Link> : null}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="overflow-hidden rounded-4xl border border-[#e8dfc8] bg-white shadow-sm">
            <div className="h-64 bg-[linear-gradient(135deg,rgba(17,45,34,0.84),rgba(214,180,99,0.38)),url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1700&q=80')] bg-cover bg-center" />
            <div className="space-y-3 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Today&apos;s Adventure</p>
              <h2 className="text-3xl font-semibold text-slate-900">
                {todaysAdventure.place ? `Route anchored at ${todaysAdventure.place.name}` : "Build your day from the strongest local signals"}
              </h2>
              <p className="text-sm leading-7 text-slate-600">
                {todaysAdventure.place ? todaysAdventure.place.description : "Compass and discovery recommendations are refreshed to highlight what works today."}
              </p>
              {todaysAdventure.place ? <Link href={`/places/${todaysAdventure.place.slug}`} className="inline-flex text-sm font-semibold text-[#1f3b2f] underline underline-offset-4">Start this route</Link> : null}
            </div>
          </article>

          <article className="rounded-4xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Featured Partners</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">Premium local businesses highlighted for travel planning and booking.</p>
            <div className="mt-4 space-y-3">
              {premiumProfilesEnabled && premiumPartners.length ? (
                premiumPartners.slice(0, 4).map((partner) => (
                  <Link key={partner.id} href={`/places/${partner.slug}`} className="block rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-3 hover:bg-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7c5b13]">{partner.sponsorLevel ?? "premium"}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{partner.name}</p>
                    <p className="text-xs text-slate-600">{partner.city}, {partner.state}</p>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-3 text-sm text-slate-600">Featured partners placeholder</div>
              )}
            </div>
          </article>
        </section>

        {feed.rails.map((rail) => (
          <RecommendationRail
            key={rail.key}
            title={rail.title}
            recommendations={rail.recommendations}
            emptyMessage="This rail is warming up as data is refreshed."
            mapItem={(recommendation) => ({
              id: recommendation.item.id,
              title: recommendation.item.name,
              subtitle: recommendation.item.description,
              href: `/places/${recommendation.item.slug}`,
              score: recommendation.score,
              badge: recommendation.item.placeType,
              reasons: recommendation.reasons,
            })}
          />
        ))}
      </section>

      <Footer />
    </main>
  );
}