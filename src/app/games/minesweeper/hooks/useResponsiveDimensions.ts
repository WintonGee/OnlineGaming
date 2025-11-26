import { useState, useEffect } from 'react';

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

