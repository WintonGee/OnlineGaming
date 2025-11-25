"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface ResponsiveSizes {
  gap: number;
  padding: number;
}

/**
 * Calculate sizes based on screen width
 * Matches Tailwind's breakpoints: sm: 640px, md: 768px
 */
function calculateSizes(width: number): ResponsiveSizes {
  if (width >= 768) {
    return { gap: 15, padding: 15 }; // Consistent for classic 2048 look
  } else if (width >= 640) {
    return { gap: 12, padding: 12 };
  }
  return { gap: 10, padding: 10 };
}

/**
 * Hook to get responsive gap and padding values based on screen width
 * Optimized with debouncing to prevent excessive re-renders on mobile
 */
export function useResponsiveSizes(): ResponsiveSizes {
  // Initialize with a reasonable default that works for SSR
  const [sizes, setSizes] = useState<ResponsiveSizes>({ gap: 15, padding: 15 });
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
  }, []);

  useEffect(() => {
    // Initial size calculation
    updateSizes();

    // Debounced resize handler to prevent excessive updates
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // 150ms debounce - fast enough to feel responsive, slow enough to batch
      timeoutRef.current = setTimeout(updateSizes, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [updateSizes]);

  return sizes;
}
