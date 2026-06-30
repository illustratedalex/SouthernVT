"use client";

import { useEffect, useState } from "react";

type AutosaveIndicatorProps = {
  enabled: boolean;
  isAutosaving: boolean;
  lastSavedAt: string | null;
};

function getRelativeLabel(value: string) {
  const date = new Date(value);
  const now = new Date();
  const minutes = Math.max(0, Math.floor((now.getTime() - date.getTime()) / (1000 * 60)));

  if (minutes < 1) {
    return "just now";
  }

  if (minutes === 1) {
    return "1 minute ago";
  }

  return `${minutes} minutes ago`;
}

export function AutosaveIndicator({ enabled, isAutosaving, lastSavedAt }: AutosaveIndicatorProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((value) => value + 1);
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  void tick;

  if (!enabled) {
    return <p className="text-sm font-medium text-slate-500">Autosave off</p>;
  }

  if (isAutosaving) {
    return <p className="text-sm font-medium text-[#1f5a3d]">Autosaving...</p>;
  }

  if (!lastSavedAt) {
    return <p className="text-sm font-medium text-slate-600">All changes saved</p>;
  }

  return <p className="text-sm font-medium text-slate-600">Last saved {getRelativeLabel(lastSavedAt)}</p>;
}
