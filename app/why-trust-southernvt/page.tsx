import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge, Button, EditorialSection, Prose } from "@/components/ui";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Why Trust SouthernVT? | Verification Promise",
  description: "Learn how SouthernVT verifies places through editorial standards, field checks, photography, and ongoing review.",
  path: "/why-trust-southernvt",
});

const verificationLevels = [
  {
    icon: "📍",
    title: "Location Verified",
    description: "Core map location, arrival details, and practical access notes are checked for accuracy.",
  },
  {
    icon: "📸",
    title: "Photo Verified",
    description: "Photos reflect what travelers can reasonably expect, with current visual context and quality standards.",
  },
  {
    icon: "🥾",
    title: "Personally Visited",
    description: "A SouthernVT team member has directly visited and validated on-the-ground experience details.",
  },
  {
    icon: "⭐",
    title: "SouthernVT Recommended",
    description: "Top editorial confidence based on quality, consistency, and verified local traveler value.",
  },
];

const verificationSteps = ["Research", "Visit or verify", "Photograph", "Review details", "Publish", "Recheck over time"];

export default function WhyTrustSouthernVTPage() {
  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="relative overflow-hidden border-b border-[#d7cbb3] bg-[#10261e] text-(--color-cream)">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,180,99,0.18),transparent_35%),linear-gradient(125deg,rgba(6,17,13,0.86),rgba(16,38,30,0.54)),url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=80')] bg-cover bg-center" />
        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:px-10 lg:py-20">
          <Badge variant="featured" className="text-[10px] tracking-[0.18em]">
            Trust & Verification
          </Badge>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-[#fff9ee] md:text-6xl">Why Trust SouthernVT?</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#eee5d6]">
            We don&apos;t sell rankings. We verify, photograph, and tell the story.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-10 sm:px-8 lg:px-10">
        <EditorialSection
          eyebrow="Brand Promise"
          title="Our recommendations are editorial, not pay-to-play"
          description="SouthernVT is built around trust signals that are earned through process, not purchased through placement."
        >
          <Prose>
            <p>We focus on quality over quantity so each recommended stop is useful in the real world.</p>
            <p>Recommendations are editorial decisions based on verification and story value, not ad ranking slots.</p>
            <p>Premium listings can be bought, but verification must be earned.</p>
          </Prose>
        </EditorialSection>

        <EditorialSection
          eyebrow="Verification Levels"
          title="How places earn trust signals"
          description="Each level adds confidence and reflects the depth of SouthernVT review."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {verificationLevels.map((level) => (
              <article key={level.title} className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-forest-green)">
                  {level.icon} {level.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{level.description}</p>
              </article>
            ))}
          </div>
        </EditorialSection>

        <EditorialSection
          eyebrow="How Verification Works"
          title="A repeatable process, not a one-time claim"
          description="Every trusted listing follows this editorial verification cycle."
        >
          <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {verificationSteps.map((step, index) => (
              <li key={step} className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f5a3d]">Step {index + 1}</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{step}</p>
              </li>
            ))}
          </ol>
        </EditorialSection>

        <EditorialSection
          eyebrow="Next Actions"
          title="Explore trusted places or suggest one we should verify"
          description="Help shape a stronger local-first guide for Southern Vermont travelers."
          className="bg-[#f9f4e8]"
        >
          <div className="flex flex-wrap gap-3">
            <Link href="/places">
              <Button variant="secondary">Explore Verified Places</Button>
            </Link>
            <Link href="/feedback">
              <Button variant="ghost" className="border border-(--color-forest-green)/20 bg-white text-(--color-forest-green) motion-safe:hover:bg-[#f4efe1]">
                Suggest a Place
              </Button>
            </Link>
          </div>
        </EditorialSection>
      </section>

      <Footer />
    </main>
  );
}

