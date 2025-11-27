"use client";

import { useCallback, useRef } from 'react';

/**
 * Options for long press detection
 */
export interface LongPressOptions {
  /**
   * Callback function called when long press is detected
   */
  onLongPress: (event: React.TouchEvent | React.MouseEvent) => void;
  
  /**
   * Optional callback function called for regular click (if not a long press)
   */
  onClick?: (event: React.TouchEvent | React.MouseEvent) => void;
  
  /**
   * Delay in milliseconds before long press is triggered (default: 500ms)
   */
  delay?: number;
}

/**
 * Return value from useLongPress hook
 */
export interface LongPressHandlers {
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchEnd: (event: React.TouchEvent) => void;
  onTouchMove: () => void;
  onMouseDown: (event: React.MouseEvent) => void;
  onMouseUp: (event: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

/**
 * Custom hook for detecting long press gestures
 * Supports both touch and mouse events
 * Provides haptic feedback on mobile devices when long press is detected
 * 
 * @param options - Configuration options for long press detection
 * @returns Event handlers to attach to elements
 * 
 * @example
 * ```tsx
 * const longPress = useLongPress({
 *   onLongPress: (e) => {
 *     // Handle long press (e.g., flag a cell)
 *     handleFlag(row, col);
 *   },
 *   onClick: (e) => {
 *     // Handle regular click (e.g., reveal a cell)
 *     handleReveal(row, col);
 *   },
 *   delay: 500
 * });
 * 
 * return (
 *   <div
 *     {...longPress}
 *   >
 *     Cell content
 *   </div>
 * );
 * ```
 */
export function useLongPress({
  onLongPress,
  onClick,
  delay = 500,
}: LongPressOptions): LongPressHandlers {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const preventClickRef = useRef(false);

  const start = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      isLongPressRef.current = false;
      preventClickRef.current = false;

      timerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        preventClickRef.current = true;
        // Provide haptic feedback on mobile devices
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
        onLongPress(event);
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(
    (event: React.TouchEvent | React.MouseEvent, shouldTriggerClick = true) => {
      const wasLongPress = isLongPressRef.current;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // Only trigger onClick if it wasn't a long press and click handler exists
      if (shouldTriggerClick && !preventClickRef.current && !wasLongPress && onClick) {
        onClick(event);
      }

      // Reset the flag after a short delay to allow for the next interaction
      setTimeout(() => {
        isLongPressRef.current = false;
        preventClickRef.current = false;
      }, 50);
    },
    [onClick]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      start(event);
    },
    [start]
  );

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      clear(event);
    },
    [clear]
  );

  const handleTouchMove = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      start(event);
    },
    [start]
  );

  const handleMouseUp = useCallback(
    (event: React.MouseEvent) => {
      clear(event);
    },
    [clear]
  );

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
  };
}

