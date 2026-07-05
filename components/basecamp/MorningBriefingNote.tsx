"use client";

import { useState } from "react";

const EDITOR_NOTE_STORAGE_KEY = "basecamp.morning-briefing.editor-note";
const defaultNote = "Focus on swimming holes before the weekend.";

export function MorningBriefingNote() {
  const [note, setNote] = useState(() => {
    if (typeof window === "undefined") {
      return defaultNote;
    }

    return window.localStorage.getItem(EDITOR_NOTE_STORAGE_KEY) ?? defaultNote;
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    window.localStorage.setItem(EDITOR_NOTE_STORAGE_KEY, note);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <article className="rounded-[28px] border border-[#e8dfc8] bg-white/90 p-6 shadow-sm backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Editor&apos;s Note</p>
      <p className="mt-2 text-sm text-slate-600">A quick focus reminder for the newsroom team.</p>

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        rows={4}
        className="mt-4 w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] p-3 text-sm leading-7 text-slate-700 outline-none focus:border-[#1f3b2f]"
      />

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-[#1f3b2f] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#2a4a3f]"
        >
          Save note
        </button>
        {saved ? <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1f5a3d]">Saved</span> : null}
      </div>
    </article>
  );
}
