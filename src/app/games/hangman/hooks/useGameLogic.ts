"use client";

import { useEffect, useCallback, useRef } from "react";
import { useHangmanGameState } from "./useHangmanGameState";
import { useDialogState } from "@/lib/hooks/useDialogState";

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
  const gameOverDialog = useDialogState();
  const previousWonRef = useRef(false);
  const previousGameOverRef = useRef(false);

  // Wrap newGame to close dialogs
  const newGame = useCallback(() => {
    winDialog.close();
    gameOverDialog.close();
    originalNewGame();
  }, [originalNewGame, winDialog, gameOverDialog]);

  // Wrap newGameWithCategory to close dialogs
  const newGameWithCategory = useCallback(
    (categoryNames: string | string[]) => {
      winDialog.close();
      gameOverDialog.close();
      originalNewGameWithCategory(categoryNames);
    },
    [originalNewGameWithCategory, winDialog, gameOverDialog]
  );

  // Show win dialog when game is won (only when won transitions from false to true)
  useEffect(() => {
    if (gameState.won && !previousWonRef.current) {
      winDialog.open();
    }
    previousWonRef.current = gameState.won;
  }, [gameState.won, winDialog]);

  // Show game over dialog when game is lost (only when gameOver transitions and not won)
  useEffect(() => {
    if (gameState.gameOver && !gameState.won && !previousGameOverRef.current) {
      gameOverDialog.open();
    }
    if (!gameState.gameOver) {
      previousGameOverRef.current = false;
    } else {
      previousGameOverRef.current = true;
    }
  }, [gameState.gameOver, gameState.won, gameOverDialog]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle input if game is over or dialog is open
      if (
        gameState.gameOver ||
        instructionsDialog.isOpen ||
        categoryDialog.isOpen ||
        winDialog.isOpen ||
        gameOverDialog.isOpen
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
    gameOverDialog.isOpen,
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
    gameOverDialog,
    mounted,
  };
}
