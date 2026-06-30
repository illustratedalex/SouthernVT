interface BasecampActionMenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface BasecampActionMenuProps {
  label?: string;
  items: BasecampActionMenuItem[];
}

export function BasecampActionMenu({ label = "Actions", items }: BasecampActionMenuProps) {
  return (
    <details className="relative">
      <summary className="cursor-pointer list-none rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#f4ebd5] focus:outline-none focus:ring-2 focus:ring-(--color-maple-gold)/30">
        {label}
      </summary>
      <div className="absolute right-0 z-10 mt-2 min-w-44 rounded-2xl border border-[#e8dfc8] bg-white p-2 shadow-[0_20px_50px_rgba(31,59,47,0.16)]">
        {items.map((item) => {
          const className = "block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-[#f7efe1] focus:outline-none focus:ring-2 focus:ring-(--color-maple-gold)/30";

          if (item.href) {
            return (
              <a key={item.label} href={item.href} className={className}>
                {item.label}
              </a>
            );
          }

          return (
            <button key={item.label} type="button" disabled={item.disabled} onClick={item.onClick} className={className}>
              {item.label}
            </button>
          );
        })}
      </div>
    </details>
  );
}