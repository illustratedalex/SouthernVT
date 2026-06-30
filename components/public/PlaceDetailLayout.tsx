import type { ReactNode } from "react";

interface PlaceDetailLayoutProps {
  main: ReactNode;
  sidebar: ReactNode;
}

export function PlaceDetailLayout({ main, sidebar }: PlaceDetailLayoutProps) {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-10">
      <div className="space-y-8">{main}</div>
      <aside className="space-y-6 lg:sticky lg:top-22 lg:h-fit">{sidebar}</aside>
    </section>
  );
}
