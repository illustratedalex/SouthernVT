import type { ReactNode } from "react";
import { cn } from "./cn";

type HeadingLevel = "h1" | "h2" | "h3";

type EditorialSectionProps = {
  /** Small uppercase label rendered above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  /**
   * Semantic heading level. Defaults to h2. Use h1 only for the main page title,
   * h3 when nested inside another section.
   */
  headingLevel?: HeadingLevel;
  align?: "left" | "center";
  /** Wrap content in the standard card container. Default true. */
  contained?: boolean;
  className?: string;
};

const headingStyles: Record<HeadingLevel, string> = {
  h1: "text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl",
  h2: "text-2xl font-semibold tracking-tight text-slate-900",
  h3: "text-xl font-semibold text-slate-900",
};

export function EditorialSection({
  eyebrow,
  title,
  description,
  children,
  headingLevel = "h2",
  align = "left",
  contained = true,
  className,
}: EditorialSectionProps) {
  const Heading = headingLevel;
  const alignment = align === "center" ? "text-center" : "text-left";

  const wrapper = contained
    ? "rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-[0_18px_58px_rgba(31,59,47,0.07)] motion-safe:transition-shadow motion-safe:duration-200"
    : "";

  return (
    <section className={cn(wrapper, className)}>
      <header className={cn("space-y-2", alignment)}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.26em] text-[#1f5a3d]">
            {eyebrow}
          </p>
        ) : null}
        <Heading className={headingStyles[headingLevel]}>{title}</Heading>
        {description ? (
          <p className="mt-1 max-w-3xl text-sm leading-6 sm:leading-7 text-slate-600">{description}</p>
        ) : null}
      </header>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}
