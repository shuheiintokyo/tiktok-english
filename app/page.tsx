import CommentCard from "@/components/CommentCard";
import Pagination from "@/components/Pagination";
import { getPagedComments } from "@/lib/mock-data";

export default function HomePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
  const { items, totalPages } = getPagedComments(page);

  return (
    <div>
      <p className="mb-6 font-jp text-sm text-muted">
        今日の一文。電車の中や隙間時間で、3〜5分で読める本物の英語表現。
      </p>
      <div className="space-y-4">
        {items.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}
