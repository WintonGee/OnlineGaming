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
 * Simplified and optimized for better performance
 */
export function useSwipeInput({ onMove, enabled = true }: UseSwipeInputProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    let swipeStart: SwipeStart | null = null;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      swipeStart = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
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
    };

    const handleTouchCancel = () => {
      swipeStart = null;
    };

    // Add event listeners
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("touchcancel", handleTouchCancel, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [onMove, enabled]);
}
