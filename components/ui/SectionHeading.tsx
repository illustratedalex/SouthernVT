import { cn } from "./cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={cn("max-w-2xl", alignment, className)}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-(--color-forest-green)">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-(--color-slate) sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}
