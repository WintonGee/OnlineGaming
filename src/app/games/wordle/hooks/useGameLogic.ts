"use client";

import { useEffect } from "react";
import { useWordleGameState } from "./useWordleGameState";
import { useDialogState } from "@/lib/hooks/useDialogState";
import { getKeyboardStatuses } from "../logic/validation";

export function useGameLogic() {
  const gameState = useWordleGameState();
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

      if (key === "Enter") {
        e.preventDefault();
        gameState.submitGuess();
      } else if (key === "Backspace") {
        e.preventDefault();
        gameState.removeLetter();
      } else if (/^[a-zA-Z]$/.test(key)) {
        e.preventDefault();
        gameState.addLetter(key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, instructionsDialog.isOpen]);

  const keyboardStatuses = getKeyboardStatuses(gameState.gameState.guesses);

  return {
    // Game state
    gameState: gameState.gameState,
    errorMessage: gameState.errorMessage,
    shake: gameState.shake,
    dailyCompleted: gameState.dailyCompleted,
    justCompleted: gameState.justCompleted,
    keyboardStatuses,

    // Actions
    addLetter: gameState.addLetter,
    removeLetter: gameState.removeLetter,
    submitGuess: gameState.submitGuess,
    newGame: gameState.newGame,
    setMode: gameState.setMode,
    dismissResult: gameState.dismissResult,
    revealWord: gameState.revealWord,

    // Dialogs
    instructionsDialog,
  };
}
