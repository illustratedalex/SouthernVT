import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge, Button, Card, EditorialSection, Input, MetaText, Prose } from "@/components/ui";
import { ExperienceService } from "@/lib/experience/ExperienceService";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { createPageMetadata } from "@/lib/seo";
import { getPlaces } from "@/repositories/PlaceRepository";

export const metadata = createPageMetadata({
  title: "Southern Vermont | Travel & Adventure",
  description: "Discover Southern Vermont with curated guides, local events, scenic adventures, and partner offers.",
  path: "/",
});

export default async function Home() {
  const [feed, premiumProfilesEnabled, places, collections] = await Promise.all([
    ExperienceService.getHomeFeed(6),
    isFeatureEnabled("premiumProfiles"),
    getPlaces(),
    getCollections(),
  ]);

  const publishedPlaces = places.filter((place) => place.status === "published");
  const publishedCollections = collections.filter((collection) => collection.status === "published");

  const premiumPartners = publishedPlaces
    .filter((place) => place.status === "published" && place.isPremium)
    .sort((a, b) => (b.sponsorLevel ?? "").localeCompare(a.sponsorLevel ?? ""))
    .slice(0, 8);

  const featuredPlace = feed.dailyAdventure.place ?? null;
  const todaysAdventure = feed.dailyAdventure.place ?? null;
  const placesBySlug = new Map(publishedPlaces.map((place) => [place.slug, place]));

  const hamiltonFalls = placesBySlug.get("hamilton-falls") ?? featuredPlace ?? publishedPlaces[0] ?? null;

  const featuredCollections = publishedCollections.filter((collection) => collection.featured).slice(0, 3);

  const hiddenGems = publishedPlaces
    .filter(
      (place) =>
        place.tags.some((tag) => tag.toLowerCase().includes("hidden")) ||
        place.categories.some((category) => category.toLowerCase().includes("hidden")),
    )
    .slice(0, 3);

  const mostPhotographed = publishedPlaces
    .filter(
      (place) =>
        place.tags.some((tag) => ["photography", "foliage", "views", "waterfall"].includes(tag.toLowerCase())) ||
        place.categories.some((category) => ["photography", "scenic drive", "waterfalls"].includes(category.toLowerCase())),
    )
    .slice(0, 3);

  const dogFriendly = publishedPlaces
    .filter((place) => {
      const amenityMatch = place.amenities.some((amenity) => {
        const normalized = amenity.toLowerCase();
        return normalized.includes("dog") || normalized.includes("pet friendly");
      });
      const trailMatch = place.metadata.trail?.dogsAllowed ?? false;
      const hotelMatch = place.metadata.hotel?.petFriendly ?? false;
      return amenityMatch || trailMatch || hotelMatch;
    })
    .slice(0, 3);

  const weekendEscapes = publishedPlaces
    .filter((place) => ["Hotel", "Scenic Overlook", "Trail", "Waterfall"].includes(place.placeType))
    .slice(0, 3);

  const todaysAdventureRail = [
    todaysAdventure,
    ...publishedPlaces.filter((place) => feed.dailyAdventure.place?.relatedPlaces.includes(place.id)),
  ].filter((place, index, array): place is NonNullable<typeof todaysAdventure> => {
    if (!place) {
      return false;
    }
    return array.findIndex((candidate) => candidate?.id === place.id) === index;
  });

  const editorsPicks = [
    "hamilton-falls",
    "mount-equinox-skyline-drive",
    "grafton-inn",
    "brattleboro-farmers-market",
    "vermont-country-store",
  ]
    .map((slug) => placesBySlug.get(slug))
    .filter((place): place is NonNullable<(typeof publishedPlaces)[number]> => Boolean(place));

  const isFall = feed.season.toLowerCase().includes("fall");
  const seasonalCollection =
    publishedCollections.find((collection) => collection.season === (isFall ? "Fall" : "Summer")) ??
    featuredCollections[0] ??
    null;
  const seasonalTitle = isFall ? "Fall Foliage in Southern Vermont" : "Summer in Southern Vermont";
  const seasonalSubtitle = isFall
    ? "Scenic drives, mountain overlooks, and village stops tuned for peak color."
    : "Waterfalls, riverside trails, and fresh-air weekends made for long days outside.";

  const magazineGrid = [
    {
      key: "magazine-hamilton",
      title: "Hamilton Falls Photo Journal",
      subtitle: "Misty mornings, trail textures, and one of the region's most cinematic cascades.",
      href: "/places/hamilton-falls",
      imageClass:
        "bg-[linear-gradient(145deg,rgba(18,44,34,0.84),rgba(214,177,93,0.32)),url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=80')]",
      layoutClass: "lg:col-span-2 lg:row-span-2",
      badge: "Feature Story",
    },
    {
      key: "magazine-equinox",
      title: "Skyline Drive at Golden Hour",
      subtitle: "A summit viewpoint where the entire valley opens in layers.",
      href: "/places/mount-equinox-skyline-drive",
      imageClass:
        "bg-[linear-gradient(145deg,rgba(20,49,39,0.83),rgba(198,161,86,0.34)),url('https://images.unsplash.com/photo-1506424482690-f7cd225efb41?auto=format&fit=crop&w=1400&q=80')]",
      layoutClass: "",
      badge: "Scenic Drive",
    },
    {
      key: "magazine-market",
      title: "Saturday at the Farmers Market",
      subtitle: "Seasonal produce, local makers, and downtown rhythm.",
      href: "/places/brattleboro-farmers-market",
      imageClass:
        "bg-[linear-gradient(145deg,rgba(28,56,43,0.8),rgba(212,164,93,0.38)),url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=80')]",
      layoutClass: "",
      badge: "Local Flavor",
    },
    {
      key: "magazine-grafton",
      title: "Historic Stay: Grafton Inn",
      subtitle: "A village-center retreat blending heritage and comfort.",
      href: "/places/grafton-inn",
      imageClass:
        "bg-[linear-gradient(145deg,rgba(22,43,34,0.86),rgba(207,169,94,0.31)),url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1700&q=80')]",
      layoutClass: "lg:col-span-2",
      badge: "Stay",
    },
  ];

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="relative overflow-hidden border-b border-[#d7cbb3] bg-[#10261e] text-[#f8f2e4]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,180,99,0.18),transparent_35%),linear-gradient(150deg,rgba(6,17,13,0.82),rgba(16,38,30,0.68)),url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=80')] bg-cover bg-center" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:px-10 lg:py-20">
          <div className="space-y-6">
            <MetaText as="p" variant="eyebrow" className="text-(--color-maple-gold)">
              Southern Vermont Travel Magazine
            </MetaText>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">Discover Southern Vermont Like a Local</h1>
            <Prose size="lg" className="max-w-2xl text-[#e8dfcf]">
              <p>Hidden waterfalls.</p>
              <p>Historic villages.</p>
              <p>Scenic drives.</p>
              <p>Original stories.</p>
            </Prose>

            <form action="/explorer" method="get" className="max-w-2xl space-y-3">
              <label htmlFor="home-search" className="sr-only">
                Search places, guides, and collections
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  id="home-search"
                  name="q"
                  placeholder="Search waterfalls, scenic drives, villages..."
                  className="h-14 border-white/30 bg-white/95 text-slate-900 placeholder:text-slate-500"
                />
                <Button type="submit" size="lg" className="h-14 px-7 uppercase tracking-[0.12em]">
                  Search
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/places"
                className="inline-flex h-12 items-center justify-center rounded-full bg-(--color-maple-gold) px-6 text-sm font-semibold uppercase tracking-[0.12em] text-(--color-forest-green) motion-safe:transition motion-safe:hover:opacity-90"
              >
                Explore Places
              </Link>
              <Link
                href="/planner/new"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 text-sm font-semibold uppercase tracking-[0.12em] text-(--color-cream) motion-safe:transition motion-safe:hover:bg-white/15"
              >
                I&apos;m Feeling Adventurous
              </Link>
            </div>
          </div>

          <div className="flex items-end">
            <Card variant="hero" className="w-full bg-black/25 p-5 text-(--color-cream) backdrop-blur-sm">
              <MetaText as="p" variant="eyebrow" className="text-(--color-maple-gold)">
                Today&apos;s Adventure
              </MetaText>
              <h2 className="mt-2 text-2xl font-semibold">
                {todaysAdventure ? `Route anchored at ${todaysAdventure.name}` : "Build your day from local signals"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-100">
                {todaysAdventure
                  ? todaysAdventure.description
                  : "Start with the strongest recommendation, then add food, views, and an evening stop nearby."}
              </p>
              {todaysAdventure ? (
                <Link
                  href={`/places/${todaysAdventure.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-(--color-maple-gold) underline underline-offset-4"
                >
                  Open today&apos;s route
                </Link>
              ) : null}
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-9 px-6 py-10 sm:px-8 lg:px-10">
        <EditorialSection
          eyebrow="Magazine Grid"
          title="Editorial highlights from around Southern Vermont"
          description="An alternating visual grid of standout places and stories."
        >
          <div className="grid gap-4 lg:grid-cols-3 lg:auto-rows-[210px]">
            {magazineGrid.map((item) => (
              <Link key={item.key} href={item.href} className={`group relative overflow-hidden rounded-[26px] ${item.layoutClass}`}>
                <div className={`absolute inset-0 bg-cover bg-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105 ${item.imageClass}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-5 text-(--color-cream)">
                  <Badge variant="featured" className="w-fit text-[10px] tracking-[0.16em]">
                    {item.badge}
                  </Badge>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-100">{item.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </EditorialSection>

        {hamiltonFalls ? (
          <EditorialSection eyebrow="Featured Destination" title="Hamilton Falls" description="A flagship Southern Vermont destination in a full magazine-style feature.">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <div className="overflow-hidden rounded-[24px]">
                <div className="h-80 w-full bg-[linear-gradient(135deg,rgba(20,49,38,0.82),rgba(216,177,93,0.34)),url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center" />
              </div>
              <Card variant="compact" className="p-5">
                <MetaText as="p" variant="eyebrow">
                  Destination Story
                </MetaText>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Waterfall drama and deep-forest atmosphere</h3>
                <Prose className="mt-3">
                  <p>{hamiltonFalls.description}</p>
                  <p>Plan a slow morning hike, then pair it with a village lunch or scenic drive for a complete Southern Vermont day.</p>
                </Prose>
                <Link
                  href={`/places/${hamiltonFalls.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-(--color-forest-green) underline underline-offset-4"
                >
                  Read More
                </Link>
              </Card>
            </div>
          </EditorialSection>
        ) : null}

        <EditorialSection
          eyebrow="Experience Rails"
          title="Curated rails for trip planning"
          description="Visual rails replace utility lists with richer story-led browsing."
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Featured Collections</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {featuredCollections.map((collection) => (
                  <Link key={collection.id} href={`/collections/${collection.slug}`}>
                    <Card variant="compact" className="h-full p-4">
                      <MetaText as="p" variant="eyebrow">
                        {collection.season}
                      </MetaText>
                      <h4 className="mt-2 text-lg font-semibold text-slate-900">{collection.title}</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{collection.subtitle}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {[
              { title: "Hidden Gems", items: hiddenGems },
              { title: "Today's Adventure", items: todaysAdventureRail },
              { title: "Most Photographed", items: mostPhotographed },
              { title: "Dog Friendly", items: dogFriendly },
              { title: "Weekend Escapes", items: weekendEscapes },
            ].map((rail) => (
              <div key={rail.title}>
                <h3 className="text-xl font-semibold text-slate-900">{rail.title}</h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {rail.items.length ? (
                    rail.items.map((place) => (
                      <Link key={place.id} href={`/places/${place.slug}`}>
                        <Card variant="compact" className="h-full p-4">
                          <MetaText as="p" variant="eyebrow">
                            {place.placeType}
                          </MetaText>
                          <h4 className="mt-2 text-lg font-semibold text-slate-900">{place.name}</h4>
                          <p className="mt-2 text-sm leading-7 text-slate-600">{place.description}</p>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <Card variant="compact" className="p-4 sm:col-span-2 xl:col-span-3">
                      <p className="text-sm text-slate-600">This rail is warming up with fresh recommendations.</p>
                    </Card>
                  )}
                </div>
              </div>
            ))}
          </div>
        </EditorialSection>

        <EditorialSection eyebrow="Seasonal Feature" title={seasonalTitle} description={seasonalSubtitle}>
          <Card variant="hero" className="overflow-hidden">
            <div className="relative h-64">
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(20,50,38,0.88),rgba(216,177,93,0.28)),url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center" />
              <div className="relative flex h-full flex-col justify-end p-6 text-(--color-cream)">
                <MetaText as="p" variant="eyebrow" className="text-(--color-maple-gold)">
                  Seasonal Spotlight
                </MetaText>
                <h3 className="mt-2 text-3xl font-semibold">{seasonalCollection ? seasonalCollection.title : seasonalTitle}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-100">
                  {seasonalCollection ? seasonalCollection.description : "Seasonal routes and stories updated for right-now travel planning."}
                </p>
                <Link
                  href={seasonalCollection ? `/collections/${seasonalCollection.slug}` : "/collections"}
                  className="mt-4 inline-flex w-fit text-sm font-semibold text-(--color-maple-gold) underline underline-offset-4"
                >
                  Explore seasonal guide
                </Link>
              </div>
            </div>
          </Card>
        </EditorialSection>

        <EditorialSection
          eyebrow="Editor's Picks"
          title="Five places our editors keep recommending"
          description="Curated for first-time visitors and repeat explorers."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {editorsPicks.map((place) => (
              <Link key={place.id} href={`/places/${place.slug}`}>
                <Card variant="sidebar" className="h-full p-4">
                  <MetaText as="p" variant="eyebrow">
                    {place.placeType}
                  </MetaText>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">{place.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {place.city}, {place.state}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </EditorialSection>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <EditorialSection
            eyebrow="Trust"
            title="Built to help travelers decide with confidence"
            description="Every page is shaped for useful, local-first trip planning."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {["Original Photography", "Local Recommendations", "Verified Places", "Built in Vermont"].map((item) => (
                <Card key={item} variant="compact" className="p-4">
                  <Badge variant="forest" className="text-[10px] tracking-[0.16em]">
                    Compass Standard
                  </Badge>
                  <p className="mt-2 text-base font-semibold text-slate-900">{item}</p>
                </Card>
              ))}
            </div>
          </EditorialSection>

          <EditorialSection
            eyebrow="Newsletter"
            title="Get one thoughtful weekend idea each week"
            description="Scenic routes, seasonal picks, and local stories. No spam."
            className="h-fit"
          >
            <form action="/updates" method="get" className="space-y-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Input id="newsletter-email" name="email" type="email" placeholder="you@example.com" />
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </form>
          </EditorialSection>
        </section>

        {premiumProfilesEnabled ? (
          <EditorialSection
            eyebrow="Premium Partners"
            title="Featured local businesses"
            description="Verified partners highlighted for planning and booking."
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {premiumPartners.length ? (
                premiumPartners.slice(0, 4).map((partner) => (
                  <Link key={partner.id} href={`/places/${partner.slug}`}>
                    <Card variant="sidebar" className="h-full p-4">
                      <MetaText as="p" variant="eyebrow" className="text-[#7c5b13]">
                        {partner.sponsorLevel ?? "premium"}
                      </MetaText>
                      <h3 className="mt-1 text-base font-semibold text-slate-900">{partner.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {partner.city}, {partner.state}
                      </p>
                    </Card>
                  </Link>
                ))
              ) : (
                <Card variant="sidebar" className="p-4 sm:col-span-2 xl:col-span-4">
                  <p className="text-sm text-slate-600">Featured partners are being updated.</p>
                </Card>
              )}
            </div>
          </EditorialSection>
        ) : null}

        <EditorialSection
          eyebrow="Footer"
          title="Plan your next Southern Vermont weekend"
          description="Save routes, browse destination stories, and explore trusted local recommendations."
          className="bg-[#f9f4e8]"
        >
          <div className="flex flex-wrap gap-3">
            <Link
              href="/places"
              className="inline-flex h-11 items-center justify-center rounded-full bg-(--color-forest-green) px-5 text-sm font-semibold text-(--color-cream) motion-safe:transition motion-safe:hover:bg-(--color-pine)"
            >
              Browse places
            </Link>
            <Link
              href="/collections"
              className="inline-flex h-11 items-center justify-center rounded-full border border-(--color-pine)/20 px-5 text-sm font-semibold text-(--color-forest-green) motion-safe:transition motion-safe:hover:bg-white"
            >
              Browse collections
            </Link>
            <Link
              href="/guides"
              className="inline-flex h-11 items-center justify-center rounded-full border border-(--color-pine)/20 px-5 text-sm font-semibold text-(--color-forest-green) motion-safe:transition motion-safe:hover:bg-white"
            >
              Read guides
            </Link>
          </div>
        </EditorialSection>
      </section>

      <div className="mt-6">
        <Footer />
      </div>
    </main>
  );
}