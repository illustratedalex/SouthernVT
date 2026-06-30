"use client";

import { ErrorState } from "@/components/ui";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-6 py-16">
      <ErrorState title="Page failed to load" description={error.message || "Try loading this page again."} actionLabel="Try again" onAction={reset} className="w-full" />
    </div>
  );
}