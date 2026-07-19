"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

type HistoryRow = {
  id: string;
  viewed_at: string;
  comments: {
    slug: string;
    study_sentence: string;
  };
};

export default function HistoryPage() {
  const { user, loading } = useUser();
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setFetching(false);
      return;
    }
    supabase
      .from("session_logs")
      .select("id, viewed_at, comments(slug, study_sentence)")
      .eq("user_id", user.id)
      .order("viewed_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setRows(data as unknown as HistoryRow[]);
        setFetching(false);
      });
  }, [user, loading]);

  if (loading || fetching) {
    return <p className="font-mono text-xs uppercase tracking-wide text-muted">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="rounded-frame border border-line bg-surface p-6 text-center">
        <p className="font-jp text-sm text-muted">履歴を見るにはサインインしてください</p>
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
      <h1 className="font-display text-xl font-bold text-ink">History</h1>
      <p className="mt-1 font-jp text-sm text-muted">これまで読んだセッション</p>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-frame border border-line bg-surface p-6 text-center font-jp text-sm text-muted">
          まだ閲覧履歴がありません。
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {rows.map((row) => (
            <Link
              key={row.id}
              href={`/comments/${row.comments.slug}`}
              className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4 hover:border-amber/60"
            >
              <span className="font-display text-sm text-ink">
                {row.comments.study_sentence}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wide text-muted">
                {new Date(row.viewed_at).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}