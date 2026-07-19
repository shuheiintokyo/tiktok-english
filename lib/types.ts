export type Register =
  | "casual"
  | "very_casual"
  | "neutral"
  | "slang"
  | "jargon";

export type VocabItem = {
  id: string;
  term: string;
  definitionJa: string;
  definitionEn: string;
  exampleSentence: string;
  register: Register;
  notes?: string;
};

export type Comment = {
  id: string;
  slug: string;
  sourcePlatform: string; // "TikTok" | "X" | "Google Maps Reviews" | ...
  studySentence: string;
  meaningJa: string;
  backgroundNoteJa?: string;
  regionAvailability: string;
  register: Register;
  createdAt: string; // ISO date
  vocabItems: VocabItem[];
};
