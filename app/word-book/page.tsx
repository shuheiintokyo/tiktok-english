import { mockComments } from "@/lib/mock-data";

export default function WordBookPage() {
  const savedSample = mockComments[0].vocabItems;

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-line bg-surface2 p-3 font-mono text-[11px] uppercase tracking-wide text-muted">
        Sign-in isn&apos;t wired up yet — showing sample saved words (build
        step 4).
      </div>
      <h1 className="font-display text-xl font-bold text-ink">Word book</h1>
      <p className="mt-1 font-jp text-sm text-muted">
        保存した単語・イディオム一覧
      </p>

      <div className="mt-5 space-y-3">
        {savedSample.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-line bg-surface p-4"
          >
            <p className="font-display text-base font-medium text-ink">
              {item.term}
            </p>
            <p className="mt-1 font-jp text-sm text-muted">
              {item.definitionJa}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
