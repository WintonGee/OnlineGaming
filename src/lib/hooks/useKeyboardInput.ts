"use client";

import { useEffect } from "react";

/**
 * Direction type for keyboard input
 */
export type Direction = "up" | "down" | "left" | "right";

/**
 * Arrow key mapping configuration
 */
export interface ArrowKeyConfig {
  ArrowUp: Direction;
  ArrowDown: Direction;
  ArrowLeft: Direction;
  ArrowRight: Direction;
}

/**
 * Default arrow key mapping
 */
const DEFAULT_ARROW_KEYS: ArrowKeyConfig = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

/**
 * Custom hook for handling keyboard arrow key input
 * Prevents default scrolling behavior for arrow keys
 *
 * @param onMove - Callback function called when a direction key is pressed
 * @param enabled - Whether keyboard input is enabled (default: true)
 * @param arrowKeys - Custom arrow key mapping (optional)
 *
 * @example
 * ```tsx
 * const handleMove = (direction: Direction) => {
 *   // Handle move logic
 * };
 *
 * useKeyboardInput({ onMove: handleMove, enabled: !gameOver });
 * ```
 */
export function useKeyboardInput({
  onMove,
  enabled = true,
  arrowKeys = DEFAULT_ARROW_KEYS,
}: {
  onMove: (direction: Direction) => void;
  enabled?: boolean;
  arrowKeys?: ArrowKeyConfig;
}) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default scrolling behavior for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
      }

      const direction = arrowKeys[event.key as keyof ArrowKeyConfig];
      if (direction) {
        onMove(direction);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onMove, enabled, arrowKeys]);
}
