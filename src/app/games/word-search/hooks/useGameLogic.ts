"use client";

import { useCallback, useEffect, useRef } from "react";
import { useWordSearchState } from "./useWordSearchState";
import { useDialogState } from "@/hooks/useDialogState";
import { useSelectionState } from "./useSelectionState";
import { checkWordMatch } from "../logic/gridGenerator";

/**
 * Main game logic hook that coordinates state and handles game flow
 */
export function useGameLogic() {
  const {
    gameState,
    mounted,
    startNewGame,
    markWordFound,
    changeDifficulty,
    changeCategory,
    resetGame,
  } = useWordSearchState();

  const instructionsDialog = useDialogState();
  const categoryDialog = useDialogState();
  const winDialog = useDialogState();

  const {
    selectionState,
    handleSelectionStart,
    handleSelectionMove,
    handleSelectionEnd,
    clearSelection,
  } = useSelectionState(gameState.grid.length);

  const previousWonRef = useRef(false);

  // Show win dialog when game is won
  useEffect(() => {
    if (gameState.gameWon && !previousWonRef.current) {
      winDialog.open();
    }
    previousWonRef.current = gameState.gameWon;
  }, [gameState.gameWon, winDialog]);

  /**
   * Handle when selection is completed (mouse up / touch end)
   */
  const handleSelectionComplete = useCallback(() => {
    const { selectedCells } = selectionState;

    if (selectedCells.length >= 2) {
      const matchedWord = checkWordMatch(
        selectedCells,
        gameState.grid,
        gameState.words
      );

      if (matchedWord) {
        markWordFound(matchedWord);
      }
    }

    clearSelection();
  }, [
    selectionState,
    gameState.grid,
    gameState.words,
    markWordFound,
    clearSelection,
  ]);

  /**
   * Wrapper for selection end that also checks for word match
   */
  const onSelectionEnd = useCallback(() => {
    handleSelectionComplete();
  }, [handleSelectionComplete]);

  /**
   * Handle new game with same settings
   */
  const handleNewGame = useCallback(() => {
    winDialog.close();
    resetGame();
  }, [resetGame, winDialog]);

  /**
   * Handle category change
   */
  const handleCategoryChange = useCallback(
    (category: string) => {
      winDialog.close();
      categoryDialog.close();
      changeCategory(category);
    },
    [changeCategory, categoryDialog, winDialog]
  );

  /**
   * Handle difficulty change
   */
  const handleDifficultyChange = useCallback(
    (difficulty: "easy" | "medium" | "hard") => {
      winDialog.close();
      changeDifficulty(difficulty);
    },
    [changeDifficulty, winDialog]
  );

  return {
    gameState,
    mounted,
    selectionState,
    handleSelectionStart,
    handleSelectionMove,
    onSelectionEnd,
    handleNewGame,
    handleCategoryChange,
    handleDifficultyChange,
    instructionsDialog,
    categoryDialog,
    winDialog,
  };
}
