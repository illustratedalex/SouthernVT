"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { FeatureFlags } from "@/types/Settings";
import {
  BASECAMP_FEATURE_FLAGS_CHANGE_EVENT,
  BASECAMP_FEATURE_FLAGS_STORAGE_KEY,
  BASECAMP_FEATURE_DEFAULTS,
  normalizeBasecampFeatureFlags,
} from "@/lib/basecampFeatureFlags";

type Listener = () => void;

let currentFeatureFlags: FeatureFlags = BASECAMP_FEATURE_DEFAULTS;
const listeners = new Set<Listener>();
let storageHydrated = false;
let browserListenersAttached = false;

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

function readStoredFeatureFlags(): FeatureFlags {
  if (typeof window === "undefined") {
    return currentFeatureFlags;
  }

  const raw = window.localStorage.getItem(BASECAMP_FEATURE_FLAGS_STORAGE_KEY);
  if (!raw) {
    return BASECAMP_FEATURE_DEFAULTS;
  }

  try {
    return normalizeBasecampFeatureFlags(JSON.parse(raw) as Partial<FeatureFlags>);
  } catch {
    return BASECAMP_FEATURE_DEFAULTS;
  }
}

function hydrateFeatureFlagsFromStorage() {
  if (storageHydrated || typeof window === "undefined") {
    return;
  }

  currentFeatureFlags = readStoredFeatureFlags();
  storageHydrated = true;
}

function persistFeatureFlags(nextFlags: FeatureFlags) {
  currentFeatureFlags = nextFlags;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(BASECAMP_FEATURE_FLAGS_STORAGE_KEY, JSON.stringify(nextFlags));
    window.dispatchEvent(new Event(BASECAMP_FEATURE_FLAGS_CHANGE_EVENT));
  }

  notifyListeners();
}

function handleStorageEvent(event: StorageEvent) {
  if (event.key !== BASECAMP_FEATURE_FLAGS_STORAGE_KEY) {
    return;
  }

  currentFeatureFlags = readStoredFeatureFlags();
  notifyListeners();
}

function handleCustomChangeEvent() {
  currentFeatureFlags = readStoredFeatureFlags();
  notifyListeners();
}

function ensureBrowserListeners() {
  if (browserListenersAttached || typeof window === "undefined") {
    return;
  }

  window.addEventListener("storage", handleStorageEvent);
  window.addEventListener(BASECAMP_FEATURE_FLAGS_CHANGE_EVENT, handleCustomChangeEvent);
  browserListenersAttached = true;
}

function subscribe(listener: Listener) {
  ensureBrowserListeners();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return currentFeatureFlags;
}

function getServerSnapshot() {
  return BASECAMP_FEATURE_DEFAULTS;
}

export function useFeatureFlags() {
  const featureFlags = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    hydrateFeatureFlagsFromStorage();
    notifyListeners();
  }, []);

  const setFeatureEnabled = (key: keyof FeatureFlags, enabled: boolean) => {
    persistFeatureFlags({
      ...currentFeatureFlags,
      [key]: enabled,
    });
  };

  const setFeatureFlags = (nextFlags: Partial<FeatureFlags>) => {
    persistFeatureFlags(normalizeBasecampFeatureFlags({ ...currentFeatureFlags, ...nextFlags }));
  };

  return {
    featureFlags,
    setFeatureEnabled,
    setFeatureFlags,
  };
}
