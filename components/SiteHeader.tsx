"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AUTH_ENABLED } from "@/lib/config";
import { supabase } from "@/lib/supabase";

export default function SiteHeader() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!AUTH_ENABLED) return;

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setEmail(null);
    window.location.href = "/";
  }

  return (
    <header className="flex items-center justify-between border-b border-line px-4 py-4 md:px-6">
      <Link href="/" className="flex flex-col leading-tight">
        <span className="font-display text-lg font-bold tracking-tight text-ink">
          TikTok English
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
          Learn TikTok English with Claude
        </span>
      </Link>
      <nav className="flex items-center gap-4 font-mono text-xs uppercase tracking-wide text-muted">
        {AUTH_ENABLED ? (
          <>
            <Link href="/word-book" className="hover:text-mint">
              Word book
            </Link>
            <Link href="/quiz" className="hover:text-mint">
              Quiz
            </Link>
            {email ? (
              <>
                <span className="hidden text-[10px] normal-case text-muted/70 sm:inline">
                  {email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="hover:text-mint"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/sign-in" className="hover:text-mint">
                Sign in
              </Link>
            )}
          </>
        ) : (
          <>
            <span className="cursor-not-allowed opacity-40" title="Coming soon">
              Word book
            </span>
            <span className="cursor-not-allowed opacity-40" title="Coming soon">
              Quiz
            </span>
          </>
        )}
      </nav>
    </header>
  );
}