"use client";

import { useEffect } from "react";
import { Direction } from "../types";
import { SWIPE_THRESHOLD } from "../constants";

interface UseSwipeInputProps {
  onMove: (direction: Direction) => void;
  enabled?: boolean;
}

interface SwipeStart {
  x: number;
  y: number;
  time: number;
}

/**
 * Custom hook for detecting swipe gestures
 * Optimized for mobile with smooth touch handling
 */
export function useSwipeInput({ onMove, enabled = true }: UseSwipeInputProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    let swipeStart: SwipeStart | null = null;
    let isSwipe = false;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      swipeStart = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      isSwipe = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!swipeStart) return;

      const touch = event.touches[0];
      const deltaX = Math.abs(touch.clientX - swipeStart.x);
      const deltaY = Math.abs(touch.clientY - swipeStart.y);

      // If we've moved enough to be considered a swipe, prevent scrolling
      if (deltaX > 5 || deltaY > 5) {
        isSwipe = true;
        event.preventDefault();
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!swipeStart) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - swipeStart.x;
      const deltaY = touch.clientY - swipeStart.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Reset swipe start
      swipeStart = null;

      // Only process if it was a swipe gesture
      if (!isSwipe) return;

      // Check if swipe distance exceeds threshold
      if (Math.max(absDeltaX, absDeltaY) < SWIPE_THRESHOLD) {
        return;
      }

      // Determine swipe direction based on dominant axis
      if (absDeltaX > absDeltaY) {
        onMove(deltaX > 0 ? "right" : "left");
      } else {
        onMove(deltaY > 0 ? "down" : "up");
      }

      isSwipe = false;
    };

    const handleTouchCancel = () => {
      swipeStart = null;
      isSwipe = false;
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

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [onMove, enabled]);
}
