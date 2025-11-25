"use client";

import { useEffect, useState } from "react";

interface ResponsiveSizes {
  gap: number;
  padding: number;
}

/**
 * Hook to get responsive gap and padding values based on screen width
 * Matches Tailwind's breakpoints: sm: 640px, md: 768px
 */
export function useResponsiveSizes(): ResponsiveSizes {
  const [sizes, setSizes] = useState<ResponsiveSizes>({ gap: 15, padding: 15 });

  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth;
      // Match Tailwind breakpoints: sm: 640px, md: 768px
      if (width >= 768) {
        setSizes({ gap: 15, padding: 15 }); // Consistent for classic 2048 look
      } else if (width >= 640) {
        setSizes({ gap: 12, padding: 12 });
      } else {
        setSizes({ gap: 10, padding: 10 });
      }
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  return sizes;
}
