"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const DISMISS_KEY = "southernvt-beta-banner-dismissed";

function isPublicPath(pathname: string): boolean {
  return !pathname.startsWith("/basecamp") && !pathname.startsWith("/partner-portal") && !pathname.startsWith("/admin");
}

export function BetaBanner() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (!isPublicPath(pathname) || dismissed) {
    return null;
  }

  return (
    <div className="border-b border-[#d7cbb3] bg-[#f7efe1] px-4 py-2 text-sm text-slate-700 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <p className="leading-6">
          SouthernVT is currently in public beta. We&apos;re adding new destinations every week. Found an error or have a suggestion?{" "}
          <Link href="/feedback" className="font-semibold text-[#1f3b2f] underline">
            Let us know.
          </Link>
        </p>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            try {
              window.localStorage.setItem(DISMISS_KEY, "1");
            } catch {
              // ignore local storage failures
            }
          }}
          className="shrink-0 rounded-full border border-[#d7cbb3] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
