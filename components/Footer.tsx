import { Container } from "@/components/ui";
import { footerLinks } from "@/lib/navigation";
import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-(--color-pine)/15 bg-(--color-forest-green) px-6 py-12 text-slate-300 sm:px-8 lg:px-10">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xl font-semibold text-(--color-cream)">{SITE_NAME}</p>
          <p className="mt-3 text-base leading-8 text-slate-400">
            Public beta travel guide for scenic drives, local dining, mountain stays, and unforgettable outdoor moments across Southern Vermont.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href} className="transition hover:text-(--color-cream)">
              {link.label}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}
