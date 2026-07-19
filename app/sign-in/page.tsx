"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <div>
      <h1 className="font-display text-xl font-bold text-ink">Sign in</h1>
      <p className="mt-1 font-jp text-sm text-muted">
        メールアドレスにリンクを送って、ログインします
      </p>

      <div className="mt-6 rounded-frame border border-line bg-surface p-6">
        {status === "sent" ? (
          <p className="font-jp text-sm text-mint">
            リンクを送りました。メールを確認してください。
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-line bg-surface2 px-3 py-2 text-sm text-ink placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-3 w-full rounded-full bg-amber px-4 py-2 font-mono text-xs uppercase tracking-wide text-night disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Send sign-in link"}
            </button>
            {status === "error" && (
              <p className="mt-2 text-xs text-red-400">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

