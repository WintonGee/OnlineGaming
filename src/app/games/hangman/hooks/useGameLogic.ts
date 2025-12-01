"use client";

import { useEffect, useCallback, useRef } from "react";
import { useHangmanGameState } from "./useHangmanGameState";
import { useDialogState } from "@/hooks/useDialogState";

/**
 * Main game logic hook that coordinates state and handles keyboard input
 */
export function useGameLogic() {
  const {
    gameState,
    guessLetter,
    newGame: originalNewGame,
    newGameWithCategory: originalNewGameWithCategory,
    revealWord,
    mounted,
  } = useHangmanGameState();

  const instructionsDialog = useDialogState();
  const categoryDialog = useDialogState();
  const winDialog = useDialogState();
  const previousWonRef = useRef(false);

  // Wrap newGame to close win dialog
  const newGame = useCallback(() => {
    winDialog.close();
    originalNewGame();
  }, [originalNewGame, winDialog]);

  // Wrap newGameWithCategory to close win dialog
  const newGameWithCategory = useCallback(
    (categoryNames: string | string[]) => {
      winDialog.close();
      originalNewGameWithCategory(categoryNames);
    },
    [originalNewGameWithCategory, winDialog]
  );

  // Show win dialog when game is won (only when won transitions from false to true)
  useEffect(() => {
    if (gameState.won && !previousWonRef.current) {
      winDialog.open();
    }
    previousWonRef.current = gameState.won;
  }, [gameState.won, winDialog]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle input if game is over or dialog is open
      if (
        gameState.gameOver ||
        instructionsDialog.isOpen ||
        categoryDialog.isOpen ||
        winDialog.isOpen
      ) {
        return;
      }

      const key = e.key.toUpperCase();

      // Only accept A-Z letters
      if (key.length === 1 && key >= "A" && key <= "Z") {
        e.preventDefault();
        guessLetter(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    gameState.gameOver,
    guessLetter,
    instructionsDialog.isOpen,
    categoryDialog.isOpen,
    winDialog.isOpen,
  ]);

  return {
    gameState,
    guessLetter,
    newGame,
    newGameWithCategory,
    revealWord,
    instructionsDialog,
    categoryDialog,
    winDialog,
    mounted,
  };
}
