interface BadgeRowProps {
  badges: string[];
}

export function BadgeRow({ badges }: BadgeRowProps) {
  if (!badges.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          key={badge}
          className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--color-cream)"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}