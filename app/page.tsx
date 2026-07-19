import CommentCard from "@/components/CommentCard";
import Pagination from "@/components/Pagination";
import { getPagedComments } from "@/lib/comments";
import { supabase } from "@/lib/supabase";

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

  // TEMPORARY DEBUG - raw, unprocessed query straight from the client library
  const raw = await supabase
    .from("comments")
    .select("slug, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  // TEMPORARY DEBUG - exact replica of getPagedComments's query, to isolate
  // whether select("*") or .range() is what causes the discrepancy
  const raw2 = await supabase
    .from("comments")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(0, 9);

  // TEMPORARY DEBUG - same minimal select as `raw`, but with .range() added,
  // to isolate whether .range() itself is the cause (independent of select *)
  const raw3 = await supabase
    .from("comments")
    .select("slug, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(0, 9);

  const debugInfo = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    slugOrder: items.map((c) => c.slug),
    rawCount: raw.count,
    rawDataLength: raw.data?.length,
    rawData: raw.data,
    rawError: raw.error,
    rawStatus: raw.status,
    raw2Count: raw2.count,
    raw2DataLength: raw2.data?.length,
    raw2Slugs: raw2.data?.map((d: any) => d.slug),
    raw2Error: raw2.error,
    raw2Status: raw2.status,
    raw3Count: raw3.count,
    raw3DataLength: raw3.data?.length,
    raw3Slugs: raw3.data?.map((d: any) => d.slug),
    raw3Error: raw3.error,
    raw3Status: raw3.status,
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