import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui";

interface BasecampEmptyStateProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  icon?: ReactNode;
}

export function BasecampEmptyState({ title, description, ctaLabel, ctaHref, icon }: BasecampEmptyStateProps) {
  return (
    <EmptyState title={title} description={description} ctaLabel={ctaLabel} ctaHref={ctaHref} icon={icon ?? <span aria-hidden>◎</span>} />
  );
}