import { Badge, Button, Container, Input } from "@/components/ui";
import { heroHighlights } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-(--color-cream)">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(14,24,20,0.9) 0%, rgba(14,24,20,0.65) 45%, rgba(14,24,20,0.3) 100%), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80')",
        }}
      />
      <Container className="relative flex min-h-[88vh] flex-col justify-center py-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-(--color-maple-gold)">
            Premium Vermont travel guide
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">
            Discover Southern Vermont at the pace you love.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            Follow forest trails, sip local cider, and linger in mountain towns with thoughtful recommendations for every kind of escape.
          </p>
        </div>

        <div className="mt-10 w-full max-w-3xl rounded-[1.75rem] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-3 rounded-[1.35rem] bg-[#14261f]/90 p-3 sm:flex-row sm:items-center">
            <Input
              type="text"
              placeholder="Search hikes, inns, food, and events"
              className="border-slate-700 bg-[#101a15] text-(--color-cream) placeholder:text-slate-400"
            />
            <Button variant="primary" size="lg" className="h-14">
              Start exploring
            </Button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {heroHighlights.map((item) => (
            <Badge key={item} className="border-white/15 bg-white/10 text-slate-100">
              {item}
            </Badge>
          ))}
        </div>
      </Container>
    </section>
  );
}
