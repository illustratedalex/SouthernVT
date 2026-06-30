import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />
      <section className="mx-auto max-w-5xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <header className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">About SouthernVT</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">A local-first discovery guide for Southern Vermont</h1>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Mission</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">Make it easier to discover meaningful destinations, scenic routes, and local businesses across Southern Vermont.</p>
          </article>
          <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">How SouthernVT Works</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">Our editorial system curates places, collections, events, and deals into practical discovery rails and trip planning paths.</p>
          </article>
          <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Meet the Founder</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">SouthernVT was founded by Alex to spotlight the region through better storytelling, maps, and route-focused planning.</p>
          </article>
          <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Original Photography</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">Photography direction highlights authentic local moments, seasonal texture, and route-level context for travelers.</p>
          </article>
        </section>

        <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Support Local Businesses</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">Every destination discovery can become local impact. We prioritize regional partners, independent operators, and community events.</p>
        </section>
      </section>
      <Footer />
    </main>
  );
}
