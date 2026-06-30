import { Badge, Card, Container, Section, SectionHeading } from "@/components/ui";
import { weekendEvents } from "@/lib/constants";

export default function EventPreview() {
  return (
    <Section id="events" className="bg-(--color-cream)/70">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="This weekend"
            title="A few of the best local plans for the next few days."
          />
          <a href="#newsletter" className="text-sm font-semibold text-(--color-forest-green) transition hover:text-(--color-pine)">
            Get seasonal ideas →
          </a>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {weekendEvents.map((event) => (
            <Card key={event.title} className="rounded-3xl p-7">
              <Badge className="border-(--color-maple-gold)/40 bg-(--color-maple-gold)/12 text-(--color-forest-green)">
                Local plan
              </Badge>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{event.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{event.detail}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
