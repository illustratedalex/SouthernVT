"use client";

import { useState } from "react";

export type SavePhase = "idle" | "saving" | "saved" | "error";

export function useSaveState() {
  const [status, setStatus] = useState<SavePhase>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startSaving = () => {
    setStatus("saving");
    setErrorMessage(null);
  };

  const markSaved = () => {
    setStatus("saved");
    setErrorMessage(null);
  };

  const markError = (message: string) => {
    setStatus("error");
    setErrorMessage(message);
  };

  const reset = () => {
    setStatus("idle");
    setErrorMessage(null);
  };

  return {
    status,
    errorMessage,
    startSaving,
    markSaved,
    markError,
    reset,
  };
}
