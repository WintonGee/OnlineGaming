import { useState, useEffect, useMemo } from 'react';

/**
 * Hook to detect if we're on a mobile device
 * Uses a breakpoint of 768px (md breakpoint in Tailwind)
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

/**
 * Gets Expert mode dimensions based on screen size
 * Desktop: 30x16 (wider)
 * Mobile: 16x30 (taller)
 */
export function getExpertDimensions(isMobile: boolean): { width: number; height: number } {
  if (isMobile) {
    return { width: 16, height: 30 };
  }
  return { width: 30, height: 16 };
}

/**
 * Hook to calculate responsive cell size based on available viewport width.
 * Ensures the board fits within the screen with a small gap from edges.
 */
export function useResponsiveCellSize(cols: number): number {
  const [cellSize, setCellSize] = useState<number>(() => {
    if (typeof window === 'undefined') return 24;
    return calculateCellSize(window.innerWidth, cols);
  });

  useEffect(() => {
    const handleResize = () => {
      setCellSize(calculateCellSize(window.innerWidth, cols));
    };

    // Initial calculation
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cols]);

  return cellSize;
}

/**
 * Calculates the optimal cell size to fit the board within the viewport.
 * Accounts for padding, borders, and leaves a gap from screen edges.
 */
function calculateCellSize(viewportWidth: number, cols: number): number {
  // Horizontal space taken by padding/borders:
  // - Page px-4: 16px * 2 = 32px
  // - ms-container padding (8px) + border (4px) on each side = 24px total
  // - ms-board-container border: 4px * 2 = 8px
  // - Extra gap from screen edges: 16px on each side = 32px
  const horizontalPadding = 32 + 24 + 8 + 32; // 96px total
  
  const availableWidth = viewportWidth - horizontalPadding;
  const calculatedSize = Math.floor(availableWidth / cols);
  
  // Clamp between reasonable min/max sizes
  const minSize = 16;
  const maxSize = 36;
  
  return Math.max(minSize, Math.min(maxSize, calculatedSize));
}

