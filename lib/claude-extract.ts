import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export type ExtractedVocabItem = {
  term: string;
  definition_ja: string;
  definition_en: string;
  example_sentence: string;
  register: "casual" | "very_casual" | "neutral" | "slang" | "jargon";
  notes: string | null;
};

export type ExtractedComment = {
  skip: boolean; // true if nothing worth extracting was found
  study_sentence: string;
  meaning_ja: string;
  background_note_ja: string | null;
  region_availability: string;
  register: "casual" | "very_casual" | "neutral" | "slang" | "jargon";
  vocab_items: ExtractedVocabItem[];
};

const SYSTEM_PROMPT = `You help build a Japanese-learner English study app called "TikTok English".
You are given a raw piece of text captured from social media (TikTok, X, Google Maps reviews, etc.)
by a curator, along with which platform it came from and an optional personal note about why they
found it interesting.

Your job: extract exactly ONE short representative sentence or phrase from the raw text — not the
whole thing — that's genuinely useful for a Japanese learner to study natural, casual English. Then
explain it.

Respond with ONLY a single JSON object, no other text, no markdown code fences, matching this shape:

{
  "skip": boolean,
  "study_sentence": string,
  "meaning_ja": string,
  "background_note_ja": string | null,
  "region_availability": string,
  "register": "casual" | "very_casual" | "neutral" | "slang" | "jargon",
  "vocab_items": [
    {
      "term": string,
      "definition_ja": string,
      "definition_en": string,
      "example_sentence": string,
      "register": "casual" | "very_casual" | "neutral" | "slang" | "jargon",
      "notes": string | null
    }
  ]
}

Rules:
- Set "skip" to true (and leave other fields as empty strings/arrays) if the raw text has nothing
  genuinely useful to study — too short, not real English, purely spam, etc.
- study_sentence must be short — one sentence or phrase, never the entire raw text verbatim if the
  raw text is long or contains multiple unrelated sentences.
- meaning_ja is a natural Japanese explanation of what the sentence means/implies, not a literal
  word-for-word translation.
- background_note_ja is optional — only include it if there's real situational/cultural context
  that helps understanding beyond the meaning itself. Otherwise set it to null.
- vocab_items should cover words/idioms/slang a Japanese learner would likely stumble on — usually
  1-3 items, sometimes 0 if the sentence is already simple.
- Output valid JSON only. No commentary before or after.`;

export async function extractComment(
  rawText: string,
  sourcePlatform: string,
  myNote: string
): Promise<ExtractedComment> {
  const userMessage = `Source platform: ${sourcePlatform}
Curator's note: ${myNote || "(none)"}

Raw text:
${rawText}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned no text content");
  }

  // Defensive: strip markdown fences if the model adds them despite instructions
  const cleaned = textBlock.text.trim().replace(/^```json\n?|\n?```$/g, "");
  return JSON.parse(cleaned) as ExtractedComment;
}