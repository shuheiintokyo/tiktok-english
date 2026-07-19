import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-between font-mono text-xs uppercase tracking-wide text-muted">
      {page > 1 ? (
        <Link href={`/?page=${page - 1}`} className="hover:text-mint">
          ← Newer
        </Link>
      ) : (
        <span />
      )}
      <span>
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={`/?page=${page + 1}`} className="hover:text-mint">
          Older →
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
