// ─── ENVRT cipher + scene break ──────────────────────────────────────────
// A small typographic divider that doubles as a brand fingerprint. The cipher
// itself is a small ∇ glyph in monospace tracking with the wordmark — quiet
// enough to read as decoration, distinctive enough to repeat.
//
// Used between major content groups on the v3 page. Light backgrounds get
// "default" tone; place the `dark` variant inside any envrt-brand-black section.

type SceneMarkProps = {
  index: string;
  label: string;
  /** Use on dark grounds. */
  dark?: boolean;
};

export function SceneMark({ index, label, dark = false }: SceneMarkProps) {
  const accent = dark ? "text-envrt-brand-ultramarine" : "text-envrt-brand-ultramarine";
  const muted = dark ? "text-envrt-brand-vista/40" : "text-envrt-brand-black/40";
  const rule = dark ? "bg-envrt-brand-vista/12" : "bg-envrt-brand-black/8";

  return (
    <div
      aria-hidden
      className={`${dark ? "bg-envrt-brand-black" : "bg-envrt-brand-vista"}`}
    >
      <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-5 py-10 sm:px-8 sm:py-14 lg:px-16">
        <span className={`h-px flex-1 ${rule}`} />
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span
            className={`font-mono text-[10px] font-medium leading-none tracking-[0.28em] sm:text-[11px] ${accent}`}
          >
            ▽&nbsp;ENVRT
          </span>
          <span className={`font-mono text-[10px] leading-none ${muted}`}>/</span>
          <span
            className={`font-mono text-[10px] font-semibold uppercase leading-none tracking-[0.22em] sm:text-[11px] ${muted}`}
          >
            {index} · {label}
          </span>
        </div>
        <span className={`h-px flex-1 ${rule}`} />
      </div>
    </div>
  );
}
