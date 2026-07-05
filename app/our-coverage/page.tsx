import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge, Button, EditorialSection, Prose } from "@/components/ui";
import { coverageBadgeExamples } from "@/lib/editorial/CoveragePolicy";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Our Coverage | SouthernVT",
  description: "How SouthernVT chooses the places, stories, and businesses we feature.",
  path: "/our-coverage",
});

const coreRegions = [
  { title: "Windham County", detail: "Brattleboro, West River Valley, Mount Snow corridor, village centers, and local story routes." },
  { title: "Bennington County", detail: "Bennington region, Manchester area, mountain drives, heritage villages, and editorial field coverage." },
  { title: "Southern Windsor County", detail: "Ludlow and nearby southern Windsor connections that naturally shape Southern Vermont itineraries." },
];

const regionalFeatures = [
  "Road trips",
  "Fall foliage",
  "Scenic drives",
  "Breweries",
  "Covered Bridges",
];

const editorialProcess = ["Research", "Assignment", "Photography", "Verification", "Story", "Publication"];

export default function OurCoveragePage() {
  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="relative overflow-hidden border-b border-[#d7cbb3] bg-[#10261e] text-(--color-cream)">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,180,99,0.18),transparent_35%),linear-gradient(125deg,rgba(6,17,13,0.86),rgba(16,38,30,0.54)),url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=80')] bg-cover bg-center" />
        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:px-10 lg:py-20">
          <Badge variant="featured" className="text-[10px] tracking-[0.18em]">
            Editorial Policy
          </Badge>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-[#fff9ee] md:text-6xl">Our Coverage</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#eee5d6]">How SouthernVT chooses the places, stories, and businesses we feature.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-10 sm:px-8 lg:px-10">
        <EditorialSection eyebrow="Section 1" title="Our Philosophy" description="SouthernVT is not trying to list every location.">
          <Prose>
            <p>
              Our goal is to curate the most memorable Southern Vermont experiences through trusted editorial recommendations.
            </p>
            <p>
              We prioritize quality, context, and traveler usefulness over large unfiltered directories.
            </p>
          </Prose>
        </EditorialSection>

        <EditorialSection eyebrow="Section 2" title="Core Southern Vermont" description="Our primary editorial coverage area.">
          <div className="grid gap-4 md:grid-cols-3">
            {coreRegions.map((region) => (
              <article key={region.title} className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-5">
                <Badge variant="forest">📍 Core Region</Badge>
                <h3 className="mt-3 text-xl font-semibold text-slate-900">{region.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{region.detail}</p>
              </article>
            ))}
          </div>
        </EditorialSection>

        <EditorialSection eyebrow="Section 3" title="Worth the Drive" description="Exceptional destinations just outside core coverage that enhance a Southern Vermont trip.">
          <div className="rounded-2xl border border-[#e8dfc8] bg-white p-5">
            <Badge variant="featured">🚗 Worth the Drive</Badge>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Some exceptional destinations just outside our core coverage naturally enhance a Southern Vermont trip. These are clearly labeled so readers understand context and travel expectations.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-slate-700">
              {["Dorset Quarry", "Hildene", "Mount Greylock", "Okemo", "Keene (selected)"].map((item) => (
                <li key={item} className="rounded-xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2">{item}</li>
              ))}
            </ul>
          </div>
        </EditorialSection>

        <EditorialSection eyebrow="Section 4" title="Regional Features" description="Some stories naturally cross regional boundaries.">
          <div className="rounded-2xl border border-[#e8dfc8] bg-white p-5">
            <p className="text-sm leading-7 text-slate-700">
              Road trips, foliage coverage, scenic drives, brewery trails, and covered bridge routes often span multiple connected areas.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {regionalFeatures.map((topic) => (
                <Badge key={topic} variant="amber">🗺 {topic}</Badge>
              ))}
            </div>
          </div>
        </EditorialSection>

        <EditorialSection eyebrow="Section 5" title="Editorial Promise" description="What guides SouthernVT recommendations.">
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-5">
              <ul className="space-y-2 text-sm text-slate-700">
                {["Original storytelling", "Editorial independence", "Verification", "Photography", "Community"].map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">Businesses cannot buy</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {["Recommendations", "Verification", "Editorial rankings", "SouthernVT Recommended status"].map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          </div>
        </EditorialSection>

        <EditorialSection eyebrow="Section 6" title="Coverage Badges" description="How coverage context appears on the site.">
          <div className="space-y-4 rounded-2xl border border-[#e8dfc8] bg-white p-5">
            <div className="flex flex-wrap gap-2">
              {coverageBadgeExamples.map((badge) => (
                <Badge key={badge.key} variant={badge.badgeVariant}>
                  {badge.icon} {badge.label}
                </Badge>
              ))}
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Place pages near the hero to set coverage context quickly.</li>
              <li>• Editorial planning systems in Basecamp when prioritizing stories.</li>
              <li>• Coverage-focused policy and newsroom references.</li>
            </ul>
          </div>
        </EditorialSection>

        <EditorialSection eyebrow="Section 7" title="How Places Are Chosen" description="Our editorial workflow from idea to publication.">
          <ol className="grid gap-3 md:grid-cols-3">
            {editorialProcess.map((step, index) => (
              <li key={step} className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f5a3d]">Step {index + 1}</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{step}</p>
              </li>
            ))}
          </ol>
        </EditorialSection>

        <EditorialSection eyebrow="Section 8" title="Help Us Discover Places" description="Know a destination we should review next?">
          <div className="flex flex-wrap gap-3">
            <Link href="/suggest-place">
              <Button variant="secondary">Suggest a Place</Button>
            </Link>
          </div>
        </EditorialSection>
      </section>

      <Footer />
    </main>
  );
}
