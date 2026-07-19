"use client";

import { useState } from "react";
import { mockComments } from "@/lib/mock-data";

export default function QuizPage() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const comment = mockComments[index % mockComments.length];

  function next() {
    setRevealed(false);
    setIndex((i) => (i + 1) % mockComments.length);
  }

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-line bg-surface2 p-3 font-mono text-[11px] uppercase tracking-wide text-muted">
        Sign-in isn&apos;t wired up yet — cycling through sample sentences
        (build step 4).
      </div>
      <h1 className="font-display text-xl font-bold text-ink">Quiz</h1>
      <p className="mt-1 font-jp text-sm text-muted">
        英文を見て、日本語の意味を思い出せるか試そう
      </p>

      <div className="mt-6 rounded-frame border border-line bg-surface p-6">
        <p className="font-display text-xl font-medium text-ink">
          &ldquo;{comment.studySentence}&rdquo;
        </p>

        {revealed ? (
          <p className="mt-4 font-jp text-base text-mint">
            {comment.meaningJa}
          </p>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="mt-4 rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-wide text-muted hover:border-mint hover:text-mint"
          >
            Reveal meaning
          </button>
        )}
      </div>

      {revealed && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={next}
            className="rounded-full bg-mint px-4 py-2 font-mono text-xs uppercase tracking-wide text-night"
          >
            Got it →
          </button>
          <button
            onClick={next}
            className="rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-wide text-muted"
          >
            Still shaky →
          </button>
        </div>
      )}
    </div>
  );
}
