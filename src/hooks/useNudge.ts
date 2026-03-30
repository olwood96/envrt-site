"use client";

import { useState, useEffect, useRef } from "react";
import { NUDGE_INTERVAL_MS } from "@/lib/constants";

export function useNudge(intervalMs = NUDGE_INTERVAL_MS) {
  const [nudge, setNudge] = useState(false);
  const hoveredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (hoveredRef.current) return;
      setNudge(true);
      setTimeout(() => setNudge(false), 700);
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [intervalMs]);

  const onEnter = () => {
    hoveredRef.current = true;
    setNudge(false);
  };
  const onLeave = () => {
    hoveredRef.current = false;
  };

  return { nudge, onEnter, onLeave };
}
