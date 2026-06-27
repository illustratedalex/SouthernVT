import AdventureFeature from "@/components/AdventureFeature";
import CategoryGrid from "@/components/CategoryGrid";
import EventPreview from "@/components/EventPreview";
import Footer from "@/components/Footer";
import HiddenGemFeature from "@/components/HiddenGemFeature";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import NewsletterSignup from "@/components/NewsletterSignup";
import PartnerDeals from "@/components/PartnerDeals";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fcfaf5] text-slate-900">
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