"use client";

import Link from "next/link";
import { useState, useCallback, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]";

interface GlitchLinkProps {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
}

export function GlitchLink({ href, label, className = "", onClick }: GlitchLinkProps) {
  const [display, setDisplay] = useState(label);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const frameRef = useRef(0);

  const scramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    frameRef.current = 0;

    const chars = label.split("");
    const totalFrames = label.length * 2 + 4;

    intervalRef.current = setInterval(() => {
      frameRef.current++;
      const progress = frameRef.current / totalFrames;

      const result = chars.map((char, i) => {
        if (char === " ") return " ";
        const charThreshold = i / chars.length;
        if (progress > charThreshold + 0.3) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });

      setDisplay(result.join(""));

      if (frameRef.current >= totalFrames) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplay(label);
      }
    }, 30);
  }, [label]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplay(label);
  }, [label]);

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={scramble}
      onMouseLeave={reset}
      className={`relative text-sm font-medium tracking-wide text-envrt-charcoal transition-colors hover:text-envrt-teal ${className}`}
    >
      <span
        data-glitch-wrap
        className="relative inline-block whitespace-nowrap"
      >
        <span
          data-glitch-reserver
          aria-hidden="true"
          className="invisible"
        >
          {label}
        </span>
        <span
          data-glitch-animated
          className="absolute inset-0"
        >
          {display}
        </span>
      </span>
    </Link>
  );
}
