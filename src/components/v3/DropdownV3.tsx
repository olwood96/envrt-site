"use client";

import { forwardRef, useEffect, useId, useRef, useState } from "react";

// v3 dropdown. Single primitive for any value-picker dropdown across the
// site. Two visual variants:
//   form  — full-width, rounded-xl, label-like. Drop-in replacement for
//           native <select> in forms.
//   chip  — rounded-full pill, shows "Label: Value". Used by collective
//           filter bar and similar inline filter contexts.
//
// Behaviour: controlled value, listbox semantics, keyboard navigation
// (arrow up/down, home/end, enter, escape), click-outside closes.

export type DropdownV3Option = {
  value: string;
  label: string;
};

type Props = {
  variant?: "form" | "chip";
  label?: string;
  placeholder?: string;
  value: string;
  options: DropdownV3Option[];
  onChange: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
};

export function DropdownV3({
  variant = "form",
  label,
  placeholder = "Select…",
  value,
  options,
  onChange,
  invalid = false,
  disabled = false,
  id,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const autoId = useId();
  const listboxId = `${id ?? autoId}-list`;

  const selected = options.find((o) => o.value === value);
  const selectedIndex = options.findIndex((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const item = listRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const select = (v: string) => {
    onChange(v);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < options.length) {
          select(options[activeIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };

  const isActive = !!value;

  if (variant === "chip") {
    return (
      <div
        ref={rootRef}
        className={`relative w-full sm:w-auto ${className}`}
      >
        <button
          ref={triggerRef}
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          className={`flex h-10 w-full items-center gap-2 rounded-full border px-4 transition-colors duration-200 sm:w-auto ${
            disabled
              ? "cursor-not-allowed border-envrt-brand-black/8 bg-envrt-brand-black/4 text-envrt-brand-black/35"
              : isActive
                ? "border-envrt-brand-ultramarine/40 bg-envrt-brand-ultramarine/8 text-envrt-brand-ultramarine"
                : "border-envrt-brand-black/12 bg-white text-envrt-brand-black/70 hover:border-envrt-brand-ultramarine/30 hover:text-envrt-brand-ultramarine"
          }`}
        >
          {label && (
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px]">
              {label}
            </span>
          )}
          <span className="truncate text-xs font-medium tracking-tight">
            {isActive ? selected?.label : placeholder}
          </span>
          <Chevron open={open} />
        </button>

        {open && (
          <DropdownMenu
            ref={listRef}
            listboxId={listboxId}
            label={label}
            options={options}
            value={value}
            activeIndex={activeIndex}
            onHover={setActiveIndex}
            onSelect={select}
          />
        )}
      </div>
    );
  }

  // form variant
  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        data-invalid={invalid || undefined}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 font-karla text-sm transition-colors duration-200 ${
          disabled
            ? "cursor-not-allowed border-envrt-brand-black/8 bg-envrt-brand-black/4 text-envrt-brand-black/35"
            : invalid
              ? "border-envrt-brand-crimson text-envrt-brand-black"
              : "border-envrt-brand-black/15 text-envrt-brand-black hover:border-envrt-brand-black/30 focus:border-envrt-brand-ultramarine focus:outline-none focus:ring-2 focus:ring-envrt-brand-ultramarine/20"
        }`}
      >
        <span
          className={`truncate ${
            isActive ? "text-envrt-brand-black" : "text-envrt-brand-black/45"
          }`}
        >
          {isActive ? selected?.label : placeholder}
        </span>
        <Chevron open={open} />
      </button>

      {open && (
        <DropdownMenu
          ref={listRef}
          listboxId={listboxId}
          label={label}
          options={options}
          value={value}
          activeIndex={activeIndex}
          onHover={setActiveIndex}
          onSelect={select}
        />
      )}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      className={`h-3 w-3 flex-shrink-0 text-envrt-brand-black/55 transition-transform duration-200 ${
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
  );
}

type MenuProps = {
  listboxId: string;
  label?: string;
  options: DropdownV3Option[];
  value: string;
  activeIndex: number;
  onHover: (i: number) => void;
  onSelect: (v: string) => void;
};

const DropdownMenu = forwardRef<HTMLUListElement, MenuProps>(function DropdownMenu(
  { listboxId, label, options, value, activeIndex, onHover, onSelect },
  ref,
) {
  return (
    <ul
      ref={ref}
      id={listboxId}
      role="listbox"
      aria-label={label}
      className="absolute left-0 z-50 mt-2 max-h-72 w-full min-w-[220px] overflow-y-auto rounded-2xl border border-envrt-brand-black/12 bg-white p-1 shadow-[0_24px_50px_-22px_rgba(14,14,14,0.18)] sm:w-auto"
    >
      {label && (
        <li
          aria-hidden
          className="px-3 pb-1.5 pt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/45 sm:text-[11px]"
        >
          {label}
        </li>
      )}
      {options.map((opt, i) => {
        const isSelected = opt.value === value;
        const isFocus = i === activeIndex;
        return (
          <li
            key={opt.value || "__any"}
            role="option"
            aria-selected={isSelected}
            onMouseEnter={() => onHover(i)}
            onClick={() => onSelect(opt.value)}
            className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors duration-150 ${
              isSelected
                ? "bg-envrt-brand-ultramarine/10 text-envrt-brand-ultramarine"
                : isFocus
                  ? "bg-envrt-brand-black/5 text-envrt-brand-black"
                  : "text-envrt-brand-black/80"
            }`}
          >
            <span className="truncate">{opt.label}</span>
            {isSelected && (
              <svg
                aria-hidden
                className="h-3.5 w-3.5 shrink-0"
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
          </li>
        );
      })}
    </ul>
  );
});
