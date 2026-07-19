import Link from "next/link";

export default function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-muted hover:text-mint"
    >
      ← Back to feed
    </Link>
  );
}
