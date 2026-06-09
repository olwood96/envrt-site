// Small typographic divider between major content groups. ENVRT wordmark
// (rendered from /brand/envrt-logo.png) with an index + label, flanked by
// hairline rules. `dark` flips it for envrt-brand-black grounds.

import { EnvrtLogo } from "@/components/v3/EnvrtLogo";

type SceneMarkProps = {
  index: string;
  label: string;
  dark?: boolean;
};

export function SceneMark({ index, label, dark = false }: SceneMarkProps) {
  const muted = dark ? "text-envrt-brand-vista/40" : "text-envrt-brand-black/40";
  const rule = dark ? "bg-envrt-brand-vista/12" : "bg-envrt-brand-black/8";
  const bg = dark ? "bg-envrt-brand-black" : "bg-envrt-brand-vista";

  return (
    <div aria-hidden className={bg}>
      <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-5 py-10 sm:px-8 sm:py-14 lg:px-16">
        <span className={`h-px flex-1 ${rule}`} />
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span
            aria-hidden
            className="font-mono text-[10px] leading-none tracking-[0.16em] text-envrt-brand-ultramarine sm:text-[11px]"
          >
            ▽
          </span>
          <EnvrtLogo size="xs" tone={dark ? "inverted" : "default"} />
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
