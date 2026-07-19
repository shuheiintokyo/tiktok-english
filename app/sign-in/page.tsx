export default function SignInPage() {
  return (
    <div>
      <h1 className="font-display text-xl font-bold text-ink">Sign in</h1>
      <p className="mt-1 font-jp text-sm text-muted">
        メールアドレスにリンクを送って、ログインします
      </p>

      <div className="mt-6 rounded-frame border border-line bg-surface p-6">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-muted">
          Placeholder — real Supabase email-link auth arrives in build step 4
        </p>
        <input
          type="email"
          placeholder="you@example.com"
          disabled
          className="w-full rounded-xl border border-line bg-surface2 px-3 py-2 text-sm text-ink placeholder:text-muted"
        />
        <button
          disabled
          className="mt-3 w-full rounded-full bg-amber/40 px-4 py-2 font-mono text-xs uppercase tracking-wide text-night/70"
        >
          Send sign-in link
        </button>
      </div>
    </div>
  );
}
