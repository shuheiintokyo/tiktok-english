import Link from "next/link";
import { Comment } from "@/lib/types";
import { RegisterTag, PlatformTag } from "./TagPill";

export default function CommentCard({ comment }: { comment: Comment }) {
  return (
    <Link
      href={`/comments/${comment.slug}`}
      className="group block rounded-frame border border-line bg-surface p-5 transition-colors hover:border-amber/60"
    >
      <div className="flex items-center gap-2">
        <PlatformTag platform={comment.sourcePlatform} />
        <RegisterTag register={comment.register} />
      </div>
      <p className="mt-4 font-display text-xl font-medium leading-snug text-ink">
        &ldquo;{comment.studySentence}&rdquo;
      </p>
      <p className="mt-3 font-jp text-sm text-muted line-clamp-2">
        {comment.meaningJa}
      </p>
      <span className="mt-4 inline-block font-mono text-[11px] uppercase tracking-wide text-mint opacity-0 transition-opacity group-hover:opacity-100">
        Read the full breakdown →
      </span>
    </Link>
  );
}
