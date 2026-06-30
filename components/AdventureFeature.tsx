import { Card, Container, Section } from "@/components/ui";

export default function AdventureFeature() {
  return (
    <Section id="adventure" className="bg-(--color-cream)/70">
      <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-4xl bg-(--color-forest-green) p-8 text-(--color-cream) shadow-xl sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-(--color-maple-gold)">
            Today&apos;s adventure
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Begin with a waterfall walk, then slow down over cider and a mountain view.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-200">
            Spend the day moving from a hidden trailhead to a local farm stand, then settle in for dinner with a view of the hills at dusk.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-200">
            <span className="rounded-full border border-white/15 px-4 py-2">3-4 hours</span>
            <span className="rounded-full border border-white/15 px-4 py-2">Scenic route</span>
            <span className="rounded-full border border-white/15 px-4 py-2">Family friendly</span>
          </div>
        </Card>

        <div className="overflow-hidden rounded-4xl shadow-xl">
          <div
            className="h-full min-h-80 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80')",
            }}
          />
        </div>
      </Container>
    </Section>
  );
}
