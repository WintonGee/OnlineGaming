"use client";

import { useEffect } from "react";
import { useGameState } from "./useGameState";
import { useDialogState } from "@/lib/hooks/useDialogState";
import { COLORS, CODE_LENGTH } from "../constants";
import { PegColor } from "../types";
import { isGuessComplete } from "../logic/validation";

export function useGameLogic() {
  const gameState = useGameState();
  const instructionsDialog = useDialogState();

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameState.gameOver) return;

      // Don't handle keyboard if a dialog is open
      if (instructionsDialog.isOpen) {
        return;
      }

      const key = e.key;

      // Arrow keys - navigate slots
      if (key === "ArrowLeft") {
        e.preventDefault();
        const newSlot = Math.max(0, gameState.gameState.selectedSlot - 1);
        gameState.setSelectedSlot(newSlot);
      } else if (key === "ArrowRight") {
        e.preventDefault();
        const newSlot = Math.min(CODE_LENGTH - 1, gameState.gameState.selectedSlot + 1);
        gameState.setSelectedSlot(newSlot);
      }
      // Enter - submit guess
      else if (key === "Enter") {
        e.preventDefault();
        gameState.submitGuess();
      }
      // Backspace - clear current slot
      else if (key === "Backspace") {
        e.preventDefault();
        gameState.setColorInSlot(null);
      }
      // Number keys - select color by index (1-6)
      else if (/^[1-6]$/.test(key)) {
        e.preventDefault();
        const colorIndex = parseInt(key) - 1;
        if (colorIndex >= 0 && colorIndex < COLORS.length) {
          gameState.setColorInSlot(COLORS[colorIndex]);
        }
      }
      // Letter keys - select color by first letter
      else if (/^[a-zA-Z]$/.test(key)) {
        e.preventDefault();
        const letter = key.toLowerCase();
        let selectedColor: PegColor | null = null;

        switch (letter) {
          case "r":
            selectedColor = "red";
            break;
          case "b":
            selectedColor = "blue";
            break;
          case "g":
            selectedColor = "green";
            break;
          case "y":
            selectedColor = "yellow";
            break;
          case "o":
            selectedColor = "orange";
            break;
          case "p":
            selectedColor = "purple";
            break;
        }

        if (selectedColor && COLORS.includes(selectedColor)) {
          gameState.setColorInSlot(selectedColor);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, instructionsDialog.isOpen]);

  // Computed properties
  const canSubmitGuess = isGuessComplete(gameState.gameState.currentGuess);

  return {
    // Game state
    gameState: gameState.gameState,
    mounted: gameState.mounted,

    // Computed
    canSubmitGuess,

    // Actions
    selectSlot: gameState.setSelectedSlot,
    selectColor: gameState.setColorInSlot,
    submitGuess: gameState.submitGuess,
    newGame: gameState.resetGame,
    revealCode: gameState.revealCode,

    // Dialogs
    instructionsDialog,
  };
}
