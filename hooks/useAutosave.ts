"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type UseAutosaveOptions<T> = {
  enabled: boolean;
  data: T;
  delayMs?: number;
  onSave: (payload: T) => Promise<void>;
};

export function useAutosave<T>({ enabled, data, delayMs = 1200, onSave }: UseAutosaveOptions<T>) {
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const hasMounted = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dataSignature = useMemo(() => JSON.stringify(data), [data]);

  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Safe reset when autosave toggles off; no external side effects are triggered.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAutosaving(false);
      return;
    }

    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setIsAutosaving(true);
      try {
        // Mock async autosave path for now; repositories will be called here when Supabase writes are enabled.
        await onSave(data);
        setLastSavedAt(new Date().toISOString());
      } finally {
        setIsAutosaving(false);
      }
    }, delayMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, data, dataSignature, delayMs, onSave]);

  return {
    isAutosaving,
    lastSavedAt,
  };
}
