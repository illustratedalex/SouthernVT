import { Card, Container, Section, SectionHeading } from "@/components/ui";
import { partnerOffers } from "@/lib/constants";

export default function PartnerDeals() {
  return (
    <Section id="deals">
      <Container>
        <Card className="rounded-4xl border-(--color-pine)/20 bg-(--color-forest-green) p-8 text-(--color-cream) shadow-xl sm:p-10">
          <SectionHeading
            eyebrow="Partner discounts"
            title="Exclusive offers from the people who know Vermont best."
            className="text-(--color-cream)"
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {partnerOffers.map((deal) => (
              <div key={deal} className="rounded-[1.25rem] border border-white/10 bg-white/10 p-5 text-sm leading-7 text-slate-100">
                {deal}
              </div>
            ))}
          </div>
        </Card>
      </Container>
    </Section>
  );
}
