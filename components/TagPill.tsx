const REGISTER_LABEL: Record<string, string> = {
  casual: "casual",
  very_casual: "very casual",
  neutral: "neutral",
  slang: "slang",
  jargon: "jargon",
};

export function RegisterTag({ register }: { register: string }) {
  return (
    <span className="rounded-full border border-line bg-surface2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-mint">
      {REGISTER_LABEL[register] ?? register}
    </span>
  );
}

export function PlatformTag({ platform }: { platform: string }) {
  return (
    <span className="rounded-full bg-amber/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-amber">
      {platform}
    </span>
  );
}
