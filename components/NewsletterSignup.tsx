import { Button, Container, Input, Section } from "@/components/ui";

export default function NewsletterSignup() {
  return (
    <Section id="newsletter" className="pb-20">
      <Container>
        <div className="rounded-4xl bg-(--color-forest-green) px-8 py-12 text-(--color-cream) shadow-2xl sm:px-10 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-(--color-maple-gold)">
                Newsletter
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Receive curated weekend ideas, seasonal events, and hidden escapes.
              </h2>
            </div>

            <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="Email address"
                className="border-white/10 bg-[#101a15] text-(--color-cream) placeholder:text-slate-400"
              />
              <Button variant="primary" size="lg" className="h-14">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
