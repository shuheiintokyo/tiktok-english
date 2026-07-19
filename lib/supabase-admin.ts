import { createClient } from "@supabase/supabase-js";

// This client uses the SECRET key, not the publishable key.
// It bypasses Row Level Security entirely, so it must ONLY ever run
// on the server (this file has no "use client" and is only imported
// from app/api/pipeline/route.ts). Never import this from a page or
// component that runs in the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey);