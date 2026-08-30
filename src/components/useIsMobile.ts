"use client";

import { useState, useEffect } from "react";

/**
 * Detects mobile / touch devices for performance gating.
 * Checks both pointer capability and viewport width.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;
      const isNarrow = window.innerWidth <= breakpoint;
      setIsMobile(isTouch || isNarrow);
    };

    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Returns true if the device has limited GPU / memory.
 * Useful for deciding whether to render WebGL scenes.
 */
export function useIsLowEnd(): boolean {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;

    const lowMemory = nav.deviceMemory !== undefined && nav.deviceMemory < 4;
    const slowConnection = conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g";

    setIsLowEnd(lowMemory || slowConnection);
  }, []);

  return isLowEnd;
}
