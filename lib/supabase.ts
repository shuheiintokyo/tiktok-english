import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// This uses the publishable (anon) key only — safe to expose to the browser
// because every table's Row Level Security policy (set up in build step 3)
// controls exactly what this key is allowed to read or write.
//
// The custom fetch below forces every Supabase request to skip Vercel's
// data cache — without this, GET requests to Supabase's REST API can get
// cached and keep returning stale results even after new rows are added.
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }),
  },
});