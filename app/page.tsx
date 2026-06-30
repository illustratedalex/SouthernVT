import Link from "next/link";
import { NextAdventureCard } from "@/components/discovery/NextAdventureCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { DiscoveryService } from "@/lib/discovery/DiscoveryService";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Southern Vermont | Travel & Adventure",
  description: "Discover Southern Vermont with curated guides, local events, scenic adventures, and partner offers.",
  path: "/",
});

export default async function Home() {
  const adventure = await DiscoveryService.getNextAdventure();
  const anchorPlaceId = adventure.place?.id;

  const [featuredCollection] = await DiscoveryService.getRecommendedCollections({ placeId: anchorPlaceId, limit: 1 });
  const [featuredDeal] = await DiscoveryService.getRecommendedDeals({ placeId: anchorPlaceId, limit: 1 });
  const [featuredGuide] = await DiscoveryService.getRecommendedArticles({ placeId: anchorPlaceId, limit: 1 });

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <NextAdventureCard adventure={adventure} title="Today's Adventure" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FeatureCard
            title="Featured Collection"
            heading={featuredCollection?.title ?? "No collection picked"}
            subtitle={featuredCollection?.subtitle ?? "Discovery will surface a featured collection soon."}
            href={featuredCollection ? `/collections/${featuredCollection.slug}` : "/collections"}
            cta="Open collection"
          />

          <FeatureCard
            title="Featured Place"
            heading={adventure.place?.name ?? "No place picked"}
            subtitle={adventure.place?.description ?? "Discovery will surface a featured place soon."}
            href={adventure.place ? `/places/${adventure.place.slug}` : "/places"}
            cta="Open place"
          />

          <FeatureCard
            title="Featured Deal"
            heading={featuredDeal?.title ?? "No deal picked"}
            subtitle={featuredDeal?.shortDescription ?? "Discovery will surface a featured deal soon."}
            href={featuredDeal ? `/deals/${featuredDeal.slug}` : "/deals"}
            cta="Open deal"
          />

          <FeatureCard
            title="Featured Guide"
            heading={featuredGuide?.title ?? "No guide picked"}
            subtitle={featuredGuide?.excerpt ?? "Discovery will surface a featured guide soon."}
            href={featuredGuide ? `/guides/${featuredGuide.slug}` : "/guides"}
            cta="Open guide"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}

type FeatureCardProps = {
  title: string;
  heading: string;
  subtitle: string;
  href: string;
  cta: string;
};

function FeatureCard({ title, heading, subtitle, href, cta }: FeatureCardProps) {
  return (
    <article className="rounded-[26px] border border-[#e8dfc8] bg-white p-5 shadow-[0_16px_52px_rgba(31,59,47,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-forest-green)">{title}</p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900">{heading}</h2>
      <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-600">{subtitle}</p>
      <Link href={href} className="mt-4 inline-flex rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white">
        {cta}
      </Link>
    </article>
  );
}