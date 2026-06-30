import { Badge, Card, Container, Section, SectionHeading } from "@/components/ui";
import { categoryCards } from "@/lib/constants";

export default function CategoryGrid() {
  return (
    <Section id="explore">
      <Container>
        <SectionHeading
          eyebrow="Explore categories"
          title="Curated experiences for every kind of Vermont getaway."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categoryCards.map((category) => (
            <Card key={category.title} className="p-7 rounded-3xl transition hover:-translate-y-1 hover:shadow-lg">
              <Badge className="border-(--color-maple-gold)/40 bg-(--color-maple-gold)/12 text-(--color-forest-green)">
                {category.badge}
              </Badge>
              <h3 className="mt-4 text-xl font-semibold text-(--color-slate)">{category.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{category.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
