import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b border-line px-4 py-4 md:px-6">
      <Link href="/" className="flex flex-col leading-tight">
        <span className="font-display text-lg font-bold tracking-tight text-ink">
          TikTok English
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
          Learn TikTok English with Claude
        </span>
      </Link>
      <nav className="flex items-center gap-4 font-mono text-xs uppercase tracking-wide text-muted">
        <Link href="/word-book" className="hover:text-mint">
          Word book
        </Link>
        <Link href="/quiz" className="hover:text-mint">
          Quiz
        </Link>
      </nav>
    </header>
  );
}
