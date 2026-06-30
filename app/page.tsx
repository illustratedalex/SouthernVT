import AdventureFeature from "@/components/AdventureFeature";
import CategoryGrid from "@/components/CategoryGrid";
import EventPreview from "@/components/EventPreview";
import Footer from "@/components/Footer";
import HiddenGemFeature from "@/components/HiddenGemFeature";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import NewsletterSignup from "@/components/NewsletterSignup";
import PartnerDeals from "@/components/PartnerDeals";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Southern Vermont | Travel & Adventure",
  description: "Discover Southern Vermont with curated guides, local events, scenic adventures, and partner offers.",
  path: "/",
});

export default function Home() {
  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />
      <Hero />
      <CategoryGrid />
      <AdventureFeature />
      <HiddenGemFeature />
      <EventPreview />
      <PartnerDeals />
      <NewsletterSignup />
      <Footer />
    </main>
  );
}