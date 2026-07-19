"use client";

import { useState } from "react";

export default function SaveButton({ label }: { label: string }) {
  const [saved, setSaved] = useState(false);

  // NOTE: in this mockup stage there is no real auth yet (see build step 4).
  // Once Supabase auth is wired in, clicking this while signed out should
  // redirect to /sign-in first, then save on return.
  return (
    <button
      onClick={() => setSaved(!saved)}
      className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors ${
        saved
          ? "bg-mint text-night"
          : "border border-line text-muted hover:border-mint hover:text-mint"
      }`}
    >
      {saved ? "Saved ✓" : label}
    </button>
  );
}
