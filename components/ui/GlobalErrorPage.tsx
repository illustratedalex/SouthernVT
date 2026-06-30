"use client";

import { ErrorState } from "./ErrorState";

export function GlobalErrorPage({ reset, message }: { reset: () => void; message?: string }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <ErrorState title="Something went wrong" description={message ?? "Please try again."} actionLabel="Try again" onAction={reset} className="w-full" />
    </div>
  );
}