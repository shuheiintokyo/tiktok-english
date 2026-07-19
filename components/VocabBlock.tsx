"use client";

import { useState } from "react";
import { VocabItem } from "@/lib/types";
import { RegisterTag } from "./TagPill";
import SaveButton from "./SaveButton";

export default function VocabBlock({ item }: { item: VocabItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-line bg-surface2 p-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="font-display text-base font-medium text-ink">
          {item.term}
        </span>
        <div className="flex items-center gap-2">
          <RegisterTag register={item.register} />
          <span className="font-mono text-xs text-muted">
            {open ? "−" : "+"}
          </span>
        </div>
      </button>
      {open && (
        <div className="mt-3 space-y-2 border-t border-line pt-3">
          <p className="font-jp text-sm text-ink">{item.definitionJa}</p>
          <p className="text-sm text-muted">{item.definitionEn}</p>
          <p className="text-sm italic text-muted">
            &ldquo;{item.exampleSentence}&rdquo;
          </p>
          {item.notes && (
            <p className="font-jp text-xs text-muted">{item.notes}</p>
          )}
          <div className="pt-1">
            <SaveButton label="Save to word book" />
          </div>
        </div>
      )}
    </div>
  );
}
