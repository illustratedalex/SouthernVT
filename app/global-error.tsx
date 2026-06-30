"use client";

import { GlobalErrorPage } from "@/components/ui/GlobalErrorPage";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <GlobalErrorPage reset={reset} message={error.message} />;
}