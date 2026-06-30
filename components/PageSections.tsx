import Link from "next/link";
import { SectionHeading } from "./SectionHeading";

const exploreCards = [
  {
    title: "Waterfalls & Trails",
    description: "Follow forest paths to cascades, overlooks, and picture-perfect summits.",
    tag: "Outdoors",
  },
  {
    title: "Farm-to-Table Dining",
    description: "Taste seasonal menus, cider houses, and cozy cafés tucked into the hills.",
    tag: "Food",
  },
  {
    title: "Historic Towns",
    description: "Wander Main Streets with galleries, antique shops, and local makers.",
    tag: "Culture",
  },
  {
    title: "Mountain Stays",
    description: "Book a cabin, inn, or boutique hotel with warm hospitality and big views.",
    tag: "Stay",
  },
];

const featuredEvents = [
  {
    title: "Summer Music on the Green",
    date: "July 19",
    location: "Brattleboro",
  },
  {
    title: "Fall Foliage Scenic Drive",
    date: "October 5",
    location: "Manchester",
  },
  {
    title: "Riverfront Art Walk",
    date: "Every Saturday",
    location: "Bennington",
  },
];

const partnerOffers = [
  "15% off stays at riverside cabins",
  "Free tasting flight at local cideries",
  "Buy-one-get-one on guided kayak rentals",
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-stone-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.35),_transparent_35%),linear-gradient(120deg,rgba(10,10,10,0.9),rgba(10,10,10,0.4))]" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-40" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-24 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.4em] text-emerald-300">
            Southern Vermont • Curated escapes
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Discover the quiet magic of New England adventures.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-200 sm:text-xl">
            Find waterfalls, farm stands, scenic roads, cozy stays, and local events in one beautiful guide.
          </p>
        </div>

        <div className="mt-10 w-full max-w-3xl rounded-3xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-3 rounded-[1.4rem] bg-stone-950/80 p-3 sm:flex-row sm:items-center">
            <input
              className="h-14 flex-1 rounded-2xl border border-stone-700 bg-stone-900/80 px-4 text-base text-white outline-none ring-0 placeholder:text-stone-400"
              placeholder="Search hikes, stays, food, or events"
            />
            <button className="h-14 rounded-2xl bg-emerald-500 px-6 text-base font-semibold text-stone-950 transition hover:bg-emerald-400">
              Start exploring
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PhotoShowcaseSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="Moments worth slowing down for"
        title="A landscape of rolling hills, hidden trails, and unforgettable views"
        description="From covered bridges to mountaintop overlooks, this corner of Vermont invites you to linger a little longer."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[2rem] bg-stone-200 shadow-xl">
          <div className="h-[420px] bg-[url('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
        </div>
        <div className="grid gap-6">
          <div className="overflow-hidden rounded-[2rem] bg-stone-200 shadow-xl">
            <div className="h-[200px] bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center" />
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-stone-200 shadow-xl">
            <div className="h-[200px] bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExploreSection() {
  return (
    <section className="bg-stone-50 py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Plan your next escape"
          title="Explore Southern Vermont your way"
          description="Choose from slow mornings, spontaneous drives, and outdoor adventures that fit your pace."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {exploreCards.map((card) => (
            <article
              key={card.title}
              className="group rounded-[1.75rem] border border-stone-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                {card.tag}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-stone-900">{card.title}</h3>
              <p className="mt-3 text-base leading-7 text-stone-600">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AdventureSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
      <div className="overflow-hidden rounded-[2.5rem] bg-stone-900 text-white shadow-2xl">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
              Today’s adventure
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Start at a waterfall, linger over lunch, and linger in the golden evening light.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-stone-300">
              Spend the day in the Green Mountains with a scenic drive, a local brewery stop, and a sunset overlook that feels like your own secret.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] p-6">
            <div className="h-56 rounded-[1.5rem] bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HiddenGemSection() {
  return (
    <section className="bg-emerald-950 py-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <div className="rounded-[2rem] border border-white/15 bg-white/10 p-8 backdrop-blur-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
            Hidden gem of the week
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Discover an old mill trail and a riverside picnic spot just beyond the usual route.
          </h2>
          <p className="mt-5 text-lg leading-8 text-stone-300">
            Tucked between hills and stone walls, this favorite local stop offers a peaceful detour, fresh air, and a view worth the extra mile.
          </p>
        </div>
        <div className="overflow-hidden rounded-[2rem] shadow-2xl">
          <div className="h-[360px] bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
        </div>
      </div>
    </section>
  );
}

export function EventsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="What’s happening"
        title="Featured events worth planning around"
        description="From seasonal festivals to intimate evenings, Southern Vermont keeps the calendar full."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {featuredEvents.map((event) => (
          <article key={event.title} className="rounded-[1.75rem] border border-stone-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{event.date}</p>
            <h3 className="mt-4 text-2xl font-semibold text-stone-900">{event.title}</h3>
            <p className="mt-3 text-base text-stone-600">{event.location}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function OffersSection() {
  return (
    <section className="bg-stone-100 py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="rounded-[2.5rem] border border-stone-200 bg-white p-8 shadow-sm lg:p-10">
          <SectionHeading
            eyebrow="Partner discounts"
            title="Save on the experiences that make the trip feel special"
            description="Local businesses are sharing exclusive perks for visitors exploring the region."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {partnerOffers.map((offer) => (
              <div key={offer} className="rounded-[1.25rem] bg-stone-50 p-5 text-stone-700 shadow-sm">
                {offer}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
      <div className="rounded-[2.5rem] bg-stone-900 px-8 py-12 text-white shadow-2xl lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">Newsletter</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Get seasonal guides, hidden gems, and weekend ideas in your inbox.
            </h2>
          </div>
          <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              className="h-14 flex-1 rounded-2xl border border-stone-700 bg-stone-800 px-4 text-base text-white outline-none placeholder:text-stone-400"
              placeholder="Email address"
            />
            <button className="h-14 rounded-2xl bg-emerald-500 px-6 font-semibold text-stone-950 transition hover:bg-emerald-400">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 px-6 py-12 text-stone-300 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-2xl font-semibold text-white">Southern Vermont</p>
          <p className="mt-3 max-w-xl text-base leading-7 text-stone-400">
            Discover the slower side of New England with scenic routes, local flavor, and memorable stays.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-stone-400">
          <Link className="transition hover:text-white" href="/places">Explore</Link>
          <Link className="transition hover:text-white" href="/events">Events</Link>
          <Link className="transition hover:text-white" href="/places">Stay</Link>
          <Link className="transition hover:text-white" href="/planner/new">Newsletter</Link>
        </div>
      </div>
    </footer>
  );
}
