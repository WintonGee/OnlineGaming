"use client";

import { useEffect } from "react";
import { Direction } from "../types";

interface UseKeyboardInputProps {
  onMove: (direction: Direction) => void;
  enabled?: boolean;
}

export function useKeyboardInput({ onMove, enabled = true }: UseKeyboardInputProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default scrolling behavior for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case "ArrowUp":
          onMove("up");
          break;
        case "ArrowDown":
          onMove("down");
          break;
        case "ArrowLeft":
          onMove("left");
          break;
        case "ArrowRight":
          onMove("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onMove, enabled]);
}
