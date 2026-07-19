import CommentCard from "@/components/CommentCard";
import Pagination from "@/components/Pagination";
import { getPagedComments } from "@/lib/comments";

// Always fetch fresh from Supabase - never serve a cached snapshot,
// since new comments arrive continuously via the Notion pipeline.
export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
  const { items, totalPages } = await getPagedComments(page);

  // TEMPORARY DEBUG - remove once the ordering issue is resolved
  const debugInfo = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    slugOrder: items.map((c) => c.slug),
  };

  return (
    <div>
      <pre className="mb-4 whitespace-pre-wrap break-all rounded-lg border border-red-400 bg-red-950 p-3 text-[10px] text-red-200">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <p className="mb-6 font-jp text-sm text-muted">
        今日の一文。電車の中や隙間時間で、3〜5分で読める本物の英語表現。
      </p>
      {items.length === 0 ? (
        <p className="rounded-frame border border-line bg-surface p-6 text-center font-jp text-sm text-muted">
          まだ投稿がありません。もうすぐ新しい表現が届きます。
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}