import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-6 sm:px-8 lg:px-10">
      <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--color-pine)">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition hover:text-(--color-forest-green)">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-(--color-forest-green)" : undefined}>{item.label}</span>
              )}
              {!isLast ? <span className="text-(--color-maple-gold)">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}