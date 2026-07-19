import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BackButton from "@/components/BackButton";
import VocabBlock from "@/components/VocabBlock";
import SaveButton from "@/components/SaveButton";
import { RegisterTag, PlatformTag } from "@/components/TagPill";
import { getCommentBySlug } from "@/lib/comments";
import LogView from "@/components/LogView";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const comment = await getCommentBySlug(params.slug);
  if (!comment) return {};
  return {
    title: `"${comment.studySentence}" — TikTok English`,
    description: comment.meaningJa,
  };
}

export default async function CommentDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const comment = await getCommentBySlug(params.slug);
  if (!comment) notFound();

  return (
    <div>
      <LogView commentId={comment.id} />
      <BackButton />

      <div className="mt-4 rounded-frame border border-line bg-surface p-6">
        <div className="flex items-center gap-2">
          <PlatformTag platform={comment.sourcePlatform} />
          <RegisterTag register={comment.register} />
          <span className="font-mono text-[10px] uppercase tracking-wide text-muted">
            {comment.regionAvailability}
          </span>
        </div>

        <p className="mt-5 font-display text-2xl font-medium leading-snug text-ink">
          &ldquo;{comment.studySentence}&rdquo;
        </p>

        <p className="mt-4 font-jp text-base text-ink">{comment.meaningJa}</p>

        {comment.backgroundNoteJa && (
          <p className="mt-3 font-jp text-sm text-muted">
            {comment.backgroundNoteJa}
          </p>
        )}

        <div className="mt-5">
          <SaveButton
            label="Save all words in this sentence"
            vocabItemIds={comment.vocabItems.map((v) => v.id)}
          />
        </div>
      </div>

      <h2 className="mb-3 mt-8 font-mono text-xs uppercase tracking-wide text-muted">
        Vocab & idioms in this sentence
      </h2>
      <div className="space-y-3">
        {comment.vocabItems.map((item) => (
          <VocabBlock key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}