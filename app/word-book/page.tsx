"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

type SavedRow = {
  id: string;
  saved_at: string;
  vocab_items: {
    id: string;
    term: string;
    definition_ja: string;
    definition_en: string;
    example_sentence: string | null;
  };
};

export default function WordBookPage() {
  const { user, loading } = useUser();
  const [rows, setRows] = useState<SavedRow[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setFetching(false);
      return;
    }
    supabase
      .from("user_saved_vocab")
      .select("id, saved_at, vocab_items(id, term, definition_ja, definition_en, example_sentence)")
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setRows(data as unknown as SavedRow[]);
        setFetching(false);
      });
  }, [user, loading]);

  if (loading || fetching) {
    return <p className="font-mono text-xs uppercase tracking-wide text-muted">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="rounded-frame border border-line bg-surface p-6 text-center">
        <p className="font-jp text-sm text-muted">
          単語帳を見るにはサインインしてください
        </p>
        <Link
          href="/sign-in"
          className="mt-4 inline-block rounded-full bg-amber px-4 py-2 font-mono text-xs uppercase tracking-wide text-night"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-xl font-bold text-ink">Word book</h1>
      <p className="mt-1 font-jp text-sm text-muted">保存した単語・イディオム一覧</p>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-frame border border-line bg-surface p-6 text-center font-jp text-sm text-muted">
          まだ保存した単語がありません。気になる表現を見つけたら保存してみましょう。
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-line bg-surface p-4">
              <p className="font-display text-base font-medium text-ink">
                {row.vocab_items.term}
              </p>
              <p className="mt-1 font-jp text-sm text-muted">
                {row.vocab_items.definition_ja}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}