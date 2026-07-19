import { Comment } from "./types";

export const mockComments: Comment[] = [
  {
    id: "1",
    slug: "bro-really-said-ancient",
    sourcePlatform: "TikTok",
    studySentence:
      "bro really said 'ancient' like he found it in a museum 💀",
    meaningJa:
      "「まるで博物館で発掘したみたいに『ancient』って言うじゃん(笑)」というツッコミ。",
    backgroundNoteJa:
      "誰かが古い本を指して大げさに『ancient(古代の)』と言ったことに対する、からかい半分のリアクション。",
    regionAvailability: "US, general online",
    register: "very_casual",
    createdAt: "2026-07-18",
    vocabItems: [
      {
        id: "v1",
        term: "ancient",
        definitionJa:
          "古代の、大昔の(ここでは大げさな誇張表現として使われている)",
        definitionEn: "extremely old",
        exampleSentence: "This laptop is ancient, it still runs Windows 7.",
        register: "neutral",
        notes: "文字通りの意味より誇張表現として使われることが多い",
      },
      {
        id: "v2",
        term: "bro",
        definitionJa: "男友達への呼びかけ、または話し始めの間投詞的な使い方",
        definitionEn:
          "casual address term, often used as a conversational filler",
        exampleSentence: "Bro, you have to see this.",
        register: "very_casual",
      },
    ],
  },
  {
    id: "2",
    slug: "its-giving-museum-vibes",
    sourcePlatform: "TikTok",
    studySentence: "it's giving museum vibes ngl",
    meaningJa: "「なんか博物館っぽい雰囲気出てる、正直」というニュアンス。",
    regionAvailability: "US, Gen Z slang",
    register: "slang",
    createdAt: "2026-07-17",
    vocabItems: [
      {
        id: "v3",
        term: "it's giving ___",
        definitionJa: "「〜な感じがする、〜っぽい」という若者言葉の言い回し",
        definitionEn: "a slang construction meaning \"this has the vibe of ___\"",
        exampleSentence: "This outfit is giving 90s vibes.",
        register: "slang",
        notes: "Z世代のスラングとして急速に広まった表現",
      },
      {
        id: "v4",
        term: "ngl",
        definitionJa: "「正直言うと」の略語(not gonna lie)",
        definitionEn: "abbreviation for \"not gonna lie\"",
        exampleSentence: "ngl, that was actually really good.",
        register: "very_casual",
      },
    ],
  },
  {
    id: "3",
    slug: "the-audacity-honestly",
    sourcePlatform: "X",
    studySentence: "the audacity, honestly",
    meaningJa: "「その厚かましさ、正直ちょっと引くわ」という呆れの表現。",
    regionAvailability: "general online, UK/US",
    register: "casual",
    createdAt: "2026-07-16",
    vocabItems: [
      {
        id: "v5",
        term: "the audacity",
        definitionJa: "厚かましさ、図々しさ(呆れを込めた決まり文句として)",
        definitionEn:
          "boldness or nerve, often used sarcastically to express disbelief",
        exampleSentence: "She asked to borrow money she never paid back — the audacity.",
        register: "casual",
      },
    ],
  },
];

export const PAGE_SIZE = 10;

export function getPagedComments(page: number) {
  const start = (page - 1) * PAGE_SIZE;
  const items = mockComments.slice(start, start + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(mockComments.length / PAGE_SIZE));
  return { items, totalPages };
}

export function getCommentBySlug(slug: string) {
  return mockComments.find((c) => c.slug === slug);
}
