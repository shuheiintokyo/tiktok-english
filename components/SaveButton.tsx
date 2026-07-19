"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

export default function SaveButton({
  label,
  vocabItemIds,
}: {
  label: string;
  vocabItemIds: string[];
}) {
  const { user } = useUser();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleClick() {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    setSaving(true);
    const rows = vocabItemIds.map((id) => ({
      user_id: user.id,
      vocab_item_id: id,
    }));
    const { error } = await supabase
      .from("user_saved_vocab")
      .upsert(rows, { onConflict: "user_id,vocab_item_id" });
    setSaving(false);
    if (!error) setSaved(true);
  }

  return (
    <button
      onClick={handleClick}
      disabled={saving}
      className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors ${
        saved
          ? "bg-mint text-night"
          : "border border-line text-muted hover:border-mint hover:text-mint"
      }`}
    >
      {saved ? "Saved ✓" : saving ? "Saving..." : label}
    </button>
  );
}