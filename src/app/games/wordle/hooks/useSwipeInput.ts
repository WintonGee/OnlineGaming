"use client";

import { useEffect, useRef, useCallback, RefObject } from "react";
import { Direction } from "./useKeyboardInput";

/**
 * Minimum movement in pixels to consider it a swipe (prevents accidental triggers)
 */
const MIN_SWIPE_START = 10;

/**
 * Default swipe threshold in pixels
 */
const DEFAULT_SWIPE_THRESHOLD = 50;

interface SwipeState {
  startX: number;
  startY: number;
  isSwipe: boolean;
  touchStartedInElement: boolean;
}

interface UseSwipeInputProps {
  onMove: (direction: Direction) => void;
  enabled?: boolean;
  elementRef: RefObject<HTMLElement | null>;
  threshold?: number;
}

/**
 * Custom hook for detecting swipe gestures on touch devices
 * Optimized for mobile with smooth touch handling
 * Only detects swipes that start within the referenced element
 *
 * @param onMove - Callback function called when a swipe is detected
 * @param enabled - Whether swipe input is enabled (default: true)
 * @param elementRef - React ref to the element that should detect swipes
 * @param threshold - Minimum swipe distance in pixels (default: 50)
 *
 * @example
 * ```tsx
 * const boardRef = useRef<HTMLDivElement>(null);
 * const handleMove = (direction: Direction) => {
 *   // Handle move logic
 * };
 *
 * useSwipeInput({
 *   onMove: handleMove,
 *   enabled: !gameOver,
 *   elementRef: boardRef,
 *   threshold: 50
 * });
 *
 * return <div ref={boardRef}>...</div>;
 * ```
 */
export function useSwipeInput({
  onMove,
  enabled = true,
  elementRef,
  threshold = DEFAULT_SWIPE_THRESHOLD,
}: UseSwipeInputProps) {
  // Use refs to avoid recreating handlers on every render
  const onMoveRef = useRef(onMove);
  const swipeStateRef = useRef<SwipeState | null>(null);
  const cachedRectRef = useRef<DOMRect | null>(null);

  // Keep onMove ref updated
  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  // Cache bounding rect - update on resize/scroll
  const updateCachedRect = useCallback(() => {
    const element = elementRef.current;
    if (element) {
      cachedRectRef.current = element.getBoundingClientRect();
    }
  }, [elementRef]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Initial rect calculation
    updateCachedRect();

    const handleTouchStart = (event: TouchEvent) => {
      const element = elementRef.current;
      if (!element) return;

      const touch = event.touches[0];

      // Use cached rect, refresh if null
      let rect = cachedRectRef.current;
      if (!rect) {
        rect = element.getBoundingClientRect();
        cachedRectRef.current = rect;
      }

      const touchStartedInElement =
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom;

      if (!touchStartedInElement) {
        swipeStateRef.current = null;
        return;
      }

      swipeStateRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        isSwipe: false,
        touchStartedInElement: true,
      };
    };

    const handleTouchMove = (event: TouchEvent) => {
      const state = swipeStateRef.current;
      if (!state || !state.touchStartedInElement) return;

      const touch = event.touches[0];
      const deltaX = Math.abs(touch.clientX - state.startX);
      const deltaY = Math.abs(touch.clientY - state.startY);

      // If we've moved enough to be considered a swipe, prevent scrolling
      // Increased threshold slightly for better differentiation from scrolling
      if (deltaX > MIN_SWIPE_START || deltaY > MIN_SWIPE_START) {
        state.isSwipe = true;
        event.preventDefault();
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const state = swipeStateRef.current;
      if (!state || !state.touchStartedInElement) {
        swipeStateRef.current = null;
        return;
      }

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - state.startX;
      const deltaY = touch.clientY - state.startY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      const wasSwipe = state.isSwipe;

      // Reset state immediately
      swipeStateRef.current = null;

      // Only process if it was a swipe gesture
      if (!wasSwipe) return;

      // Check if swipe distance exceeds threshold
      if (Math.max(absDeltaX, absDeltaY) < threshold) {
        return;
      }

      // Determine swipe direction based on dominant axis
      // Use requestAnimationFrame to batch with next paint
      requestAnimationFrame(() => {
        if (absDeltaX > absDeltaY) {
          onMoveRef.current(deltaX > 0 ? "right" : "left");
        } else {
          onMoveRef.current(deltaY > 0 ? "down" : "up");
        }
      });
    };

    const handleTouchCancel = () => {
      swipeStateRef.current = null;
    };

    // Update cached rect on scroll/resize (debounced via passive)
    const handleScrollOrResize = () => {
      cachedRectRef.current = null; // Invalidate cache, will refresh on next touchstart
    };

    // Add event listeners
    // touchmove needs to be non-passive so we can preventDefault
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("touchcancel", handleTouchCancel, {
      passive: true,
    });
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchCancel);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [enabled, elementRef, threshold, updateCachedRect]);
}
