"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook to detect if we're on a mobile device
 * Uses a breakpoint of 768px (md breakpoint in Tailwind)
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Hook to get the current window size
 * Returns width and height, with optional debouncing
 */
export function useWindowSize(options?: { debounceMs?: number }) {
  const { debounceMs = 0 } = options || {};
  const [size, setSize] = useState<{ width: number; height: number }>(() => {
    if (typeof window === "undefined") {
      return { width: 0, height: 0 };
    }
    return { width: window.innerWidth, height: window.innerHeight };
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const handleResize = () => {
      if (debounceMs > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(updateSize, debounceMs);
      } else {
        updateSize();
      }
    };

    // Initial size
    updateSize();

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [debounceMs]);

  return size;
}

/**
 * Hook to get the current window width
 * Useful for responsive calculations
 */
export function useWindowWidth(options?: { debounceMs?: number }): number {
  const { width } = useWindowSize(options);
  return width;
}

