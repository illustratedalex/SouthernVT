import Link from "next/link";
import { Container } from "@/components/ui";
import { SearchButton } from "@/components/search/SearchButton";
import { navigationItems } from "@/lib/navigation";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--color-pine)/15 bg-(--color-cream)/90 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-forest-green) text-sm font-semibold uppercase tracking-[0.24em] text-(--color-cream)">
            SV
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-(--color-forest-green)">
              SouthernVT
            </p>
            <p className="text-xs text-slate-600">Travel guide</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition hover:text-(--color-forest-green)"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SearchButton />
          <Link
            href="/planner/new"
            className="hidden rounded-full bg-(--color-forest-green) px-4 py-2 text-sm font-semibold text-(--color-cream) transition hover:bg-(--color-pine) sm:inline-flex"
          >
            Plan a trip
          </Link>
        </div>
      </Container>
    </header>
  );
}
