import { mockComments } from "@/lib/mock-data";

export default function HistoryPage() {
  return (
    <div>
      <div className="mb-6 rounded-2xl border border-line bg-surface2 p-3 font-mono text-[11px] uppercase tracking-wide text-muted">
        Sign-in isn&apos;t wired up yet — showing sample history (build step
        4).
      </div>
      <h1 className="font-display text-xl font-bold text-ink">History</h1>
      <p className="mt-1 font-jp text-sm text-muted">これまで読んだセッション</p>

      <div className="mt-5 space-y-3">
        {mockComments.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4"
          >
            <span className="font-display text-sm text-ink">
              {c.studySentence}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wide text-muted">
              {c.createdAt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
