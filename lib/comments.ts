import { supabase } from "./supabase";
import { Comment, VocabItem, Register } from "./types";

export const PAGE_SIZE = 10;

type CommentRow = {
  id: string;
  slug: string;
  source_platform: string;
  study_sentence: string;
  meaning_ja: string;
  background_note_ja: string | null;
  region_availability: string | null;
  register: Register;
  created_at: string;
};

type VocabRow = {
  id: string;
  comment_id: string;
  term: string;
  definition_ja: string;
  definition_en: string;
  example_sentence: string | null;
  register: Register;
  notes: string | null;
};

function mapVocab(row: VocabRow): VocabItem {
  return {
    id: row.id,
    term: row.term,
    definitionJa: row.definition_ja,
    definitionEn: row.definition_en,
    exampleSentence: row.example_sentence ?? "",
    register: row.register,
    notes: row.notes ?? undefined,
  };
}

function mapComment(row: CommentRow, vocabItems: VocabItem[] = []): Comment {
  return {
    id: row.id,
    slug: row.slug,
    sourcePlatform: row.source_platform,
    studySentence: row.study_sentence,
    meaningJa: row.meaning_ja,
    backgroundNoteJa: row.background_note_ja ?? undefined,
    regionAvailability: row.region_availability ?? "",
    register: row.register,
    createdAt: row.created_at,
    vocabItems,
  };
}

export async function getPagedComments(
  page: number
): Promise<{ items: Comment[]; totalPages: number }> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("getPagedComments error:", error.message);
    return { items: [], totalPages: 1 };
  }

  const items = (data as CommentRow[]).map((row) => mapComment(row));
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  return { items, totalPages };
}

export async function getCommentBySlug(
  slug: string
): Promise<Comment | undefined> {
  const { data: commentRow, error: commentError } = await supabase
    .from("comments")
    .select("*")
    .eq("slug", slug)
    .single();

  if (commentError || !commentRow) {
    if (commentError) console.error("getCommentBySlug error:", commentError.message);
    return undefined;
  }

  const { data: vocabRows, error: vocabError } = await supabase
    .from("vocab_items")
    .select("*")
    .eq("comment_id", (commentRow as CommentRow).id);

  if (vocabError) {
    console.error("getCommentBySlug vocab error:", vocabError.message);
  }

  const vocabItems = ((vocabRows as VocabRow[]) ?? []).map(mapVocab);
  return mapComment(commentRow as CommentRow, vocabItems);
}
