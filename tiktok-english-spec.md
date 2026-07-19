# TikTok English
### Learn TikTok English with Claude

A mobile-first web app that teaches Japanese English learners the English people actually speak — sourced from real TikTok comments — instead of textbook phrasing.

---

## 1. Why this app exists

Two things make English hard to reach for Japanese learners in a way that, say, Korean isn't:

1. **Grammar/word-order mismatch** — Japanese and Korean share enough sentence structure that near word-for-word translation gets you somewhere. English doesn't give you that shortcut.
2. **Textbook English ≠ real English** — the way native speakers actually talk (casual register, slang, idioms, regional expressions) is much simpler in vocabulary than textbooks suggest, but it's invisible until someone explains the *implication*, not just the dictionary meaning.

TikTok comments are a rich, constantly-refreshed source of exactly this kind of real, casual language — short enough to study in a few minutes, and naturally tagged with tone, slang, and cultural context.

**Core loop:** you find an interesting comment on TikTok → you and Claude unpack it together in chat (meaning, implication, register, regional notes, key vocab) → that explanation becomes a structured entry → the entry is imported into the app → learners read it in a 3–5 minute session and can save any word/idiom to their personal word book → later, the app quizzes them by showing the English and asking for the Japanese meaning.

---

## 2. Who does what

| Role | Does |
|---|---|
| **You (curator)** | Find comments on TikTok, bring them to Claude in chat, answer Claude's clarifying questions about context |
| **Claude (in chat)** | Breaks the comment down: overall meaning, register/formality, regional availability, key vocab/idioms with explanations and example sentences; outputs a structured file ready to import |
| **You (importer)** | Runs a small import step to load the structured file into the database |
| **Learners (app users)** | Sign in, read short sessions, tap words to save them, take quizzes on saved material |

No in-app admin page for v1 — content authoring stays in chat, which keeps the app itself simple and free of any content-management UI to build or secure.

---

## 3. Tech stack (all free-tier)

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js** (React), mobile-first responsive layout | You already know this pattern from EDI Manager / obj-viewer; deploys cleanly to Vercel |
| Hosting | **Vercel** (free tier) | Already your default; git-push-to-deploy |
| Database + Auth | **Supabase** (Postgres, free tier) | Relational data (comments → vocab → users' saved words) fits Postgres well; built-in auth means no separate login system to build |
| Content source | **Notion** (your own account) as the resource hub — free | You already collect/organize things there; no new tool to learn |
| Processing | **Claude API**, called from a scheduled backend job, not manually per item | Used sparingly — only on new entries, once each — to keep cost minimal |
| Scheduler | **cron-job.org** (already set up and in use for GoldenGaiPortal) | Vercel's free Hobby tier caps cron jobs to once/day with only hour-level timing precision — fine for this cadence, but cron-job.org has no such ceiling if the schedule ever needs to tighten, and it's a tool already in use rather than a new one to learn; it just hits the same API route Vercel Cron would have |
| Manual fallback | Claude in chat + hand-pasted JSON (Section 5b) | Still available for one-off items not routed through Notion |

**Free-tier ceilings to know about:**
- Supabase free tier: ~500MB database, pauses after a week of inactivity (auto-wakes on next request — first load just feels slow). Non-issue at this data scale.
- Claude API: pay-as-you-go, not free, but the pipeline is designed to make calls cheap — one call per new Notion entry, once, never reprocessed. Worth picking a smaller/faster model for this structured-extraction task rather than the top-tier one; check current model options and pricing when you set this up.

---

## 4. Data model (Supabase / Postgres)

```
users                 → handled by Supabase Auth automatically (id, email, created_at)

comments               id, notion_page_id, source_platform (TikTok / X / Google Maps / ...),
                        slug, study_sentence, region_availability,
                        register (casual / very_casual / neutral / slang / jargon),
                        meaning_ja, background_note_ja (optional), created_at

vocab_items             id, comment_id (FK → comments), term,
                        definition_ja, definition_en, example_sentence,
                        register, notes

user_saved_vocab        id, user_id (FK → users), vocab_item_id (FK → vocab_items),
                        saved_at

session_logs            id, user_id (FK → users), comment_id (FK → comments),
                        viewed_at

quiz_attempts           id, user_id (FK → users), source_type (comment/vocab),
                        source_id, self_rated_correct, attempted_at
```

Notes:
- `slug` gives each comment a clean, human-readable public URL (e.g. `/comments/bro-really-said-ancient`) instead of a bare numeric ID — needed because comment detail pages are now public (see Section 6).
- `study_sentence` replaces "full original comment" — the app only ever stores and shows **one representative sentence or short phrase**, not the whole source text. That's both lighter to read and keeps the app from reproducing entire third-party posts.
- `source_platform` is what makes this extensible — TikTok, X, Google Maps reviews, etc. are just different values of the same field, sharing one pipeline.
- `notion_page_id` links back to the source Notion page, so the pipeline can mark it processed and never touch it again.
- `background_note_ja` is optional — only filled in when the extra cultural/situational context genuinely helps understanding, not on every entry.
- `register` and `region_availability` still cover casualness and "US-only vs UK" type flags.
- `session_logs` and `quiz_attempts` still power "see your past sessions" and the review quiz.

---

## 5. Content pipeline

### 5a. Notion → Claude → Supabase automation (primary path)

**Your side — Notion setup:**
Create one Notion database ("resource hub") with these columns:

| Column | Purpose |
|---|---|
| Title | Short label (optional, for your own browsing) |
| Source Platform | Select: `TikTok`, `X`, `Google Maps Reviews`, etc. — add new options anytime |
| Raw Text | The full snippet you captured |
| My Note | Optional — any context only you know (why it caught your eye) |
| Status | Select: `New` → `Processed` (or `Skipped`) |

You just paste new finds in with Status = `New`. Adding a second or third source box later (X, Google reviews, ...) is just a new Source Platform option in the same database — the pipeline doesn't change.

**Daily automated job:**
1. Query the Notion database for rows where Status = `New`
2. For each row, one Claude API call with the raw text + platform + your note, asking Claude to return:
   - one representative **study sentence or short phrase** pulled from the text (not the whole thing)
   - a Japanese meaning for that sentence
   - register and likely regional availability
   - a short background/context note *only if it genuinely helps* (otherwise omit)
   - the vocab/idiom breakdown for anything a learner would likely stumble on
3. Insert the result into `comments` + `vocab_items` in Supabase, tagged with `notion_page_id`
4. Update that Notion row's Status to `Processed` (or `Skipped` if Claude judges there's nothing worth extracting) so it's never reprocessed

This keeps Claude API usage to exactly one call per new item, ever — which is what keeps this cheap.

### 5b. Manual fallback (for one-off items outside Notion)

For anything you'd rather hand-process in chat instead of routing through Notion, the same structured format works — ask Claude **"give me the import JSON for this one"** at the end of a chat explanation:

```json
{
  "study_sentence": "bro really said 'ancient' like he found it in a museum 💀",
  "source_platform": "TikTok",
  "region_availability": "US, general online",
  "register": "very_casual",
  "meaning_ja": "「まるで博物館で発掘したみたいに『ancient』って言うじゃん(笑)」というツッコミ",
  "background_note_ja": null,
  "vocab_items": [
    {
      "term": "ancient",
      "definition_ja": "古代の、大昔の(ここでは大げさな表現として使われている)",
      "definition_en": "extremely old",
      "example_sentence": "This laptop is ancient, it still runs Windows 7.",
      "register": "neutral_but_used_hyperbolically",
      "notes": "文字通りの意味より誇張表現として使われることが多い"
    }
  ]
}
```

Paste entries into a running file (e.g. `content/batch-01.json`) and run the same import step used by the automated pipeline.

---

## 6. App pages (v1)

**Public vs. private:** so far every page required sign-in, which means nothing is findable via search. Fixed by splitting pages into two tiers — this needed deciding now, before the Supabase schema (Section 4) is finalized, since adding `slug` after the fact would mean a migration.

**Public (no sign-in, indexable):**
1. **Home feed** — newest-first, 10/page, blog-style pagination
2. **Comment detail** — `study_sentence` + meaning + background note + vocab breakdown, at `/comments/{slug}`; basic page `<title>`/description metadata per entry for search indexing (viable now specifically *because* the page holds one distilled sentence, not the full source post)

**Private (sign-in required):**
3. **Sign in / Sign up** — Supabase auth (email link)
4. **Word book** — everything the user has saved, searchable
5. **Quiz** — pulls a random saved sentence or vocab item, shows the English, learner recalls/types the Japanese meaning, then reveals the answer and lets them self-mark right/wrong (feeds `quiz_attempts`)
6. **History** — past session log (what they've read, when)

The "save to word book" button on a public comment page is what nudges an anonymous reader toward signing in — click it while logged out, and it prompts sign-in first.

---

## 7. Build order

**Auth confirmed:** Supabase email-link sign-in (free, no password flow to build).

**Sequencing decision:** since there's no real content yet, build the page(s) first against placeholder/mock data, then wire up the real database once the UI shape is settled — avoids designing tables around a UI that's still changing. The public/private split and `slug` field (Section 6) are locked in now, ahead of that, since retrofitting `slug` after the schema is finalized would mean a migration.

1. **Spec sign-off** — this document (in progress — currently under separate review before build starts)
2. **Next.js scaffold** — mobile-first shell, pages built against placeholder/mock data (no Supabase yet): paginated home feed, comment detail, word book, quiz, history
3. **Supabase project setup** — create project once page shapes are settled, define the tables (Section 4), enable email-link auth
4. **Wire pages to Supabase** — swap mock data for real queries (including pagination), add sign-in flow
5. **Word book save button + quiz logic** — connect to `user_saved_vocab` / `quiz_attempts`
6. **Notion + Claude pipeline** — set up the Notion database (Section 5a), write the scheduled job, test it end-to-end on a small batch before relying on it daily
7. **Deploy to Vercel**, connect real domain if wanted (optional)
8. **Turn the pipeline on for real** and let it start feeding the feed

---

## 8. Open questions for later (not blocking v1)

- Which source boxes to start with in Notion — just TikTok, or TikTok + X + Google Maps reviews from day one?
- How many `New` Notion entries per day is realistic for you to capture — helps size how "fresh" the feed will feel
- Model choice for the extraction call — worth revisiting once you're ready to build, based on current Claude API pricing/options
- Spaced repetition scheduling for the quiz (vs. fully random) — nice-to-have for v2
