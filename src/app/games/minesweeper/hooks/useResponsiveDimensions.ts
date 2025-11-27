import { useIsMobile as useIsMobileShared } from "@/lib/shared/hooks/useResponsive";
import { useResponsiveCellSize as useResponsiveCellSizeShared } from "@/lib/games/hooks/useResponsive";

/**
 * Hook to detect if we're on a mobile device
 * Uses a breakpoint of 768px (md breakpoint in Tailwind)
 * Re-exports shared hook for game-specific usage
 */
export function useIsMobile(): boolean {
  return useIsMobileShared(768);
}

/**
 * Gets Expert mode dimensions based on screen size
 * Desktop: 30x16 (wider)
 * Mobile: 16x30 (taller)
 */
export function getExpertDimensions(isMobile: boolean): {
  width: number;
  height: number;
} {
  if (isMobile) {
    return { width: 16, height: 30 };
  }
  return { width: 30, height: 16 };
}

/**
 * Hook to calculate responsive cell size based on available viewport width.
 * Ensures the board fits within the screen with a small gap from edges.
 * Uses shared responsive hook with minesweeper-specific configuration.
 */
export function useResponsiveCellSize(cols: number): number {
  // Horizontal space taken by padding/borders:
  // - Page px-4: 16px * 2 = 32px
  // - ms-container padding (8px) + border (4px) on each side = 24px total
  // - ms-board-container border: 4px * 2 = 8px
  // - Minimum edge spacing: 48px on each side = 96px (ensures visible edges on large boards)
  const horizontalPadding = 32 + 24 + 8 + 96; // 160px total

  return useResponsiveCellSizeShared(cols, {
    horizontalPadding,
    minSize: 16,
    maxSize: 36,
  });
}
