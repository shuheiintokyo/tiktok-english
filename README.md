# TikTok English

Mock-data scaffold for build step 2 (Next.js pages against placeholder content —
no Supabase, no auth wired in yet). Matches the spec in `tiktok-english-spec.md`.

## Run it locally

```
npm install
npm run dev
```

Then open http://localhost:3000 in your browser. Resize the window or open it
on your phone (same wifi, use your computer's local IP) to check the mobile
layout.

## What's real vs. placeholder right now

- **Real:** page structure, routing, the public/private split, all styling
- **Placeholder:** all content comes from `lib/mock-data.ts` — three sample
  comments standing in for what the Notion → Claude → Supabase pipeline will
  eventually produce
- **Not wired up yet:** sign-in, saving words, quiz results, and history are
  all just visual mockups (build step 4 connects these to Supabase)

## Pages

| Route | Access | Purpose |
|---|---|---|
| `/` | public | Home feed, newest first, 10/page |
| `/comments/[slug]` | public | One study sentence + explanation + vocab |
| `/sign-in` | public | Email-link sign-in (placeholder) |
| `/word-book` | private (mock) | Saved words |
| `/quiz` | private (mock) | Random review |
| `/history` | private (mock) | Past sessions |

## Next steps (build order from the spec)

1. ~~Spec sign-off~~
2. **You are here** — Next.js scaffold on mock data
3. Set up the Supabase project (tables from the spec's Section 4) and swap in
   real email-link auth
4. Wire these pages up to real Supabase queries
5. Word book save button + quiz logic hooked to real tables
6. Notion + Claude pipeline
7. Deploy to Vercel
8. Turn the pipeline on for real

## Deploying later (once you're ready)

This is a completely standard Next.js app, so when the time comes:
1. Push this folder to a GitHub repo
2. Import that repo on vercel.com (free Hobby tier) — it auto-detects Next.js,
   no config needed
3. Add Supabase environment variables in Vercel's project settings once step 3
   is done
