// Re-export shared responsive sizes hook
import { useResponsiveSizes as useResponsiveSizesShared } from "@/lib/hooks/useResponsive";

/**
 * Hook to get responsive gap and padding values for 2048 game
 * Matches Tailwind's breakpoints: sm: 640px, md: 768px
 */
export function useResponsiveSizes() {
  return useResponsiveSizesShared({
    breakpoints: [
      { width: 768, gap: 15, padding: 15 }, // Consistent for classic 2048 look
      { width: 640, gap: 12, padding: 12 },
    ],
    defaultSizes: { gap: 10, padding: 10 },
  });
}
