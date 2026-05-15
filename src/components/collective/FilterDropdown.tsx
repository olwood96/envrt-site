"use client";

import { useState, useRef, useEffect } from "react";

export interface FilterDropdownOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: FilterDropdownOption[];
  onChange: (value: string) => void;
  className?: string;
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  className = "",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected?.label ?? label;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div ref={ref} className={`relative w-full sm:w-auto ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border bg-white pl-3 pr-2.5 text-left text-xs transition-all sm:w-auto sm:min-w-[140px] ${
          open
            ? "border-envrt-charcoal/20 ring-2 ring-envrt-charcoal/8"
            : "border-envrt-charcoal/8 hover:border-envrt-charcoal/15"
        }`}
      >
        <span
          className={`truncate ${
            selected && selected.value
              ? "font-medium text-envrt-charcoal"
              : "text-envrt-muted"
          }`}
        >
          {displayLabel}
        </span>
        {/* ChevronDown */}
        <svg
          className={`h-3.5 w-3.5 shrink-0 text-envrt-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[180px] overflow-y-auto rounded-xl border border-envrt-charcoal/8 bg-white py-1 shadow-lg max-h-56">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors ${
                opt.value === value
                  ? "bg-envrt-cream/60 font-medium text-envrt-charcoal"
                  : "text-envrt-muted hover:bg-envrt-cream/40"
              }`}
            >
              {opt.value === value && (
                /* Check icon */
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-envrt-teal"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              )}
              <span className={opt.value !== value ? "pl-[22px]" : ""}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
