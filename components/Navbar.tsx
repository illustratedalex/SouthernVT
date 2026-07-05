import Link from "next/link";
import { Container } from "@/components/ui";
import { SearchButton } from "@/components/search/SearchButton";
import { publicNavigationGroups } from "@/lib/navigation";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--color-pine)/15 bg-(--color-cream)/90 backdrop-blur">
      <Container className="flex items-center justify-between py-3 sm:py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-forest-green) text-sm font-semibold uppercase tracking-[0.24em] text-(--color-cream)">
            SV
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-(--color-forest-green)">
              SouthernVT
            </p>
            <p className="hidden text-xs text-slate-600 sm:block">Travel guide</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 whitespace-nowrap lg:flex">
          {publicNavigationGroups.map((group) => (
            <div key={group.label} className="group relative">
              <Link
                href={group.href}
                className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-(--color-forest-green)"
              >
                {group.label}
                <svg className="h-3 w-3 text-slate-500" viewBox="0 0 10 6" fill="none" aria-hidden>
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <div className="pointer-events-none invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
                <div className="min-w-56 rounded-2xl border border-[#e8dfc8] bg-white p-2 shadow-[0_18px_48px_rgba(31,59,47,0.14)]">
                  {group.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#fcfaf6] hover:text-[#1f5a3d]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <details className="relative lg:hidden">
            <summary className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#d8c9ad] bg-[#fcfaf6] text-[#1f3b2f] marker:content-none">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 w-[min(90vw,22rem)] rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-[0_20px_60px_rgba(31,59,47,0.18)]">
              <div className="max-h-[70vh] space-y-4 overflow-auto pr-1">
                {publicNavigationGroups.map((group) => (
                  <div key={group.label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f5a3d]">{group.label}</p>
                    <div className="mt-2 space-y-1">
                      {group.items.map((item) => (
                        <Link key={`${group.label}-${item.label}`} href={item.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#fcfaf6]">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </details>
          <SearchButton />
          <Link
            href="/planner/new"
            className="hidden rounded-full bg-(--color-forest-green) px-4 py-2 text-sm font-semibold whitespace-nowrap text-(--color-cream) transition hover:bg-(--color-pine) sm:inline-flex"
          >
            Plan a trip
          </Link>
        </div>
      </Container>
    </header>
  );
}
