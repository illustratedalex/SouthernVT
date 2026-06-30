type ExplorerHeroProps = {
  title: string;
  subtitle: string;
};

export function ExplorerHero({ title, subtitle }: ExplorerHeroProps) {
  return (
    <section className="rounded-[30px] border border-[#204233] bg-[linear-gradient(140deg,#163126_0%,#214536_52%,#2a5643_100%)] p-7 text-[#f8f2e4] shadow-[0_24px_84px_rgba(15,28,22,0.35)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d8b15d]">Explorer Mode</p>
      <h1 className="mt-2 text-4xl font-semibold leading-tight">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-8 text-[#e9e2d3]">{subtitle}</p>
    </section>
  );
}
