"use client";

import { useState } from "react";
import Image from "next/image";

const TRANSPARENT_ICON_SRC = "/images/deadsignal/deadsignal-icon-transparent.png";
const FALLBACK_ICON_SRC = "/images/deadsignal/deadsignal-icon.png";

export default function DeadSignalCredit() {
  const [iconSrc, setIconSrc] = useState<string | null>(TRANSPARENT_ICON_SRC);

  const handleIconError = () => {
    setIconSrc((currentSrc) => {
      if (currentSrc === TRANSPARENT_ICON_SRC) {
        return FALLBACK_ICON_SRC;
      }

      return null;
    });
  };

  return (
    <a
      href="https://deadsignal.co"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-xs text-slate-400 transition hover:text-slate-300"
    >
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt=""
          aria-hidden
          width={20}
          height={20}
          className="h-5 w-auto opacity-100 brightness-125 contrast-125"
          onError={handleIconError}
        />
      ) : null}
      <span>Built &amp; Managed by DeadSignal</span>
    </a>
  );
}
