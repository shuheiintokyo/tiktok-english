"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

type SavedVocab = {
  id: string;
  term: string;
  definition_ja: string;
};

type SavedRow = {
  vocab_items: SavedVocab;
};

export default function QuizPage() {
  const { user, loading } = useUser();
  const [pool, setPool] = useState<SavedVocab[]>([]);
  const [fetching, setFetching] = useState(true);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setFetching(false);
      return;
    }
    supabase
      .from("user_saved_vocab")
      .select("vocab_items(id, term, definition_ja)")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (!error && data) {
          const items = (data as unknown as SavedRow[]).map((r) => r.vocab_items);
          setPool(items);
        }
        setFetching(false);
      });
  }, [user, loading]);

  async function recordAttempt(correct: boolean) {
    const current = pool[index % pool.length];
    if (user && current) {
      await supabase.from("quiz_attempts").insert({
        user_id: user.id,
        source_type: "vocab",
        source_id: current.id,
        self_rated_correct: correct,
      });
    }
    setRevealed(false);
    setIndex((i) => (i + 1) % pool.length);
  }

  if (loading || fetching) {
    return <p className="font-mono text-xs uppercase tracking-wide text-muted">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="rounded-frame border border-line bg-surface p-6 text-center">
        <p className="font-jp text-sm text-muted">クイズを受けるにはサインインしてください</p>
        <Link
          href="/sign-in"
          className="mt-4 inline-block rounded-full bg-amber px-4 py-2 font-mono text-xs uppercase tracking-wide text-night"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (pool.length === 0) {
    return (
      <div className="rounded-frame border border-line bg-surface p-6 text-center font-jp text-sm text-muted">
        まだ保存した単語がありません。単語帳にいくつか保存してから、クイズに挑戦しましょう。
      </div>
    );
  }

  const current = pool[index % pool.length];

  return (
    <div>
      <h1 className="font-display text-xl font-bold text-ink">Quiz</h1>
      <p className="mt-1 font-jp text-sm text-muted">
        英単語を見て、日本語の意味を思い出せるか試そう
      </p>

      <div className="mt-6 rounded-frame border border-line bg-surface p-6">
        <p className="font-display text-xl font-medium text-ink">{current.term}</p>

        {revealed ? (
          <p className="mt-4 font-jp text-base text-mint">{current.definition_ja}</p>
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
            onClick={() => recordAttempt(true)}
            className="rounded-full bg-mint px-4 py-2 font-mono text-xs uppercase tracking-wide text-night"
          >
            Got it →
          </button>
          <button
            onClick={() => recordAttempt(false)}
            className="rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-wide text-muted"
          >
            Still shaky →
          </button>
        </div>
      )}
    </div>
  );
}