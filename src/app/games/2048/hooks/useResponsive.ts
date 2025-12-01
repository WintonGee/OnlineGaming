"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook to calculate responsive gap and padding values based on screen width
 * Optimized with debouncing to prevent excessive re-renders on mobile
 *
 * @param breakpoints - Array of breakpoints with their corresponding gap and padding values
 * @param defaultSizes - Default gap and padding values
 * @returns Object with gap and padding values
 *
 * @example
 * ```tsx
 * const sizes = useResponsiveSizes({
 *   breakpoints: [
 *     { width: 768, gap: 15, padding: 15 },
 *     { width: 640, gap: 12, padding: 12 },
 *   ],
 *   defaultSizes: { gap: 10, padding: 10 }
 * });
 * ```
 */
export interface ResponsiveSizes {
  gap: number;
  padding: number;
}

interface BreakpointConfig {
  width: number;
  gap: number;
  padding: number;
}

interface UseResponsiveSizesOptions {
  breakpoints: BreakpointConfig[];
  defaultSizes: ResponsiveSizes;
  debounceMs?: number;
}

export function useResponsiveSizes({
  breakpoints,
  defaultSizes,
  debounceMs = 150,
}: UseResponsiveSizesOptions): ResponsiveSizes {
  // Sort breakpoints by width descending
  const sortedBreakpoints = [...breakpoints].sort((a, b) => b.width - a.width);

  const calculateSizes = useCallback(
    (width: number): ResponsiveSizes => {
      for (const breakpoint of sortedBreakpoints) {
        if (width >= breakpoint.width) {
          return { gap: breakpoint.gap, padding: breakpoint.padding };
        }
      }
      return defaultSizes;
    },
    [sortedBreakpoints, defaultSizes]
  );

  const [sizes, setSizes] = useState<ResponsiveSizes>(() => {
    if (typeof window === "undefined") return defaultSizes;
    return calculateSizes(window.innerWidth);
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSizesRef = useRef<ResponsiveSizes>(sizes);

  const updateSizes = useCallback(() => {
    const width = window.innerWidth;
    const newSizes = calculateSizes(width);

    // Only update if sizes actually changed (prevents unnecessary renders)
    if (
      newSizes.gap !== lastSizesRef.current.gap ||
      newSizes.padding !== lastSizesRef.current.padding
    ) {
      lastSizesRef.current = newSizes;
      setSizes(newSizes);
    }
  }, [calculateSizes]);

  useEffect(() => {
    // Initial size calculation
    updateSizes();

    // Debounced resize handler to prevent excessive updates
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(updateSizes, debounceMs);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [updateSizes, debounceMs]);

  return sizes;
}

/**
 * Hook to calculate responsive cell size based on available viewport width.
 * Ensures the board fits within the screen with a small gap from edges.
 *
 * @param cols - Number of columns in the grid
 * @param options - Configuration options
 * @returns Cell size in pixels
 *
 * @example
 * ```tsx
 * const cellSize = useResponsiveCellSize(16, {
 *   horizontalPadding: 160,
 *   minSize: 16,
 *   maxSize: 36
 * });
 * ```
 */
interface UseResponsiveCellSizeOptions {
  horizontalPadding?: number;
  minSize?: number;
  maxSize?: number;
}

export function useResponsiveCellSize(
  cols: number,
  options: UseResponsiveCellSizeOptions = {}
): number {
  const { horizontalPadding = 160, minSize = 16, maxSize = 36 } = options;

  const calculateCellSize = useCallback(
    (viewportWidth: number): number => {
      const availableWidth = viewportWidth - horizontalPadding;
      const calculatedSize = Math.floor(availableWidth / cols);
      return Math.max(minSize, Math.min(maxSize, calculatedSize));
    },
    [cols, horizontalPadding, minSize, maxSize]
  );

  const [cellSize, setCellSize] = useState<number>(() => {
    if (typeof window === "undefined") return minSize;
    return calculateCellSize(window.innerWidth);
  });

  useEffect(() => {
    const handleResize = () => {
      setCellSize(calculateCellSize(window.innerWidth));
    };

    // Initial calculation
    handleResize();

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateCellSize]);

  return cellSize;
}

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
