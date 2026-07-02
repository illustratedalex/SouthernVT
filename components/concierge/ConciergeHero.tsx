import { Badge, Prose } from "@/components/ui";

export function ConciergeHero() {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[#d7cbb3] bg-[#10261e] text-(--color-cream) shadow-[0_22px_64px_rgba(31,59,47,0.22)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,180,99,0.2),transparent_38%),linear-gradient(130deg,rgba(7,18,14,0.82),rgba(16,38,30,0.6)),url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=80')] bg-cover bg-center" />
      <div className="relative px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <Badge variant="featured" className="text-[10px] tracking-[0.18em]">
          Compass Concierge
        </Badge>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-[#fff9ee] md:text-6xl">
          What kind of day are you hoping for?
        </h1>
        <Prose size="lg" className="mt-4 max-w-3xl text-[#eee4d4]">
          <p>A guided planning experience powered by Compass and local editorial signals.</p>
          <p>No chat. No noise. Just thoughtful recommendations you can use.</p>
        </Prose>
      </div>
    </section>
  );
}

