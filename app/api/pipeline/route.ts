import { NextRequest, NextResponse } from "next/server";
import { getNewNotionEntries, setNotionStatus } from "@/lib/notion";
import { extractComment } from "@/lib/claude-extract";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { slugify } from "@/lib/slug";

export const maxDuration = 60; // seconds — Notion + Claude calls can take a moment

export async function GET(req: NextRequest) {
  // Simple shared-secret check so only cron-job.org (or you, manually) can trigger this.
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.PIPELINE_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const entries = await getNewNotionEntries();
  const results: any[] = [];

  for (const entry of entries) {
    try {
      const extracted = await extractComment(
        entry.rawText,
        entry.sourcePlatform,
        entry.myNote
      );

      if (extracted.skip || !extracted.study_sentence) {
        await setNotionStatus(entry.pageId, "Skipped");
        results.push({ pageId: entry.pageId, status: "skipped" });
        continue;
      }

      const baseSlug = slugify(extracted.study_sentence);
      let slug = baseSlug;
      let attempt = 1;
      // Handle rare slug collisions by appending a number
      while (true) {
        const { data: existing } = await supabaseAdmin
          .from("comments")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();
        if (!existing) break;
        attempt += 1;
        slug = `${baseSlug}-${attempt}`;
      }

      const { data: insertedComment, error: commentError } = await supabaseAdmin
        .from("comments")
        .insert({
          notion_page_id: entry.pageId,
          source_platform: entry.sourcePlatform,
          slug,
          study_sentence: extracted.study_sentence,
          meaning_ja: extracted.meaning_ja,
          background_note_ja: extracted.background_note_ja,
          region_availability: extracted.region_availability,
          register: extracted.register,
        })
        .select()
        .single();

      if (commentError || !insertedComment) {
        throw new Error(commentError?.message ?? "insert failed");
      }

      if (extracted.vocab_items.length > 0) {
        const { error: vocabError } = await supabaseAdmin
          .from("vocab_items")
          .insert(
            extracted.vocab_items.map((v) => ({
              comment_id: insertedComment.id,
              term: v.term,
              definition_ja: v.definition_ja,
              definition_en: v.definition_en,
              example_sentence: v.example_sentence,
              register: v.register,
              notes: v.notes,
            }))
          );
        if (vocabError) throw new Error(vocabError.message);
      }

      await setNotionStatus(entry.pageId, "Processed");
      results.push({ pageId: entry.pageId, status: "processed", slug });
    } catch (err: any) {
      // Leave this entry's Notion Status as "New" so it gets retried next run,
      // rather than silently losing it.
      results.push({
        pageId: entry.pageId,
        status: "error",
        message: err.message,
      });
    }
  }

  return NextResponse.json({ checked: entries.length, results });
}
