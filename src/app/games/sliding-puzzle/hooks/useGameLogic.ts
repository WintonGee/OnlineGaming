"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { useDialogState } from "@/lib/hooks/useDialogState";
import { useKeyboardInput } from "@/lib/hooks/useKeyboardInput";
import { useSlidingPuzzleState } from "./useSlidingPuzzleState";
import { Difficulty } from "../types";
import { getPosition, canMoveTile } from "../logic/puzzleLogic";

export function useGameLogic() {
  const instructionsDialog = useDialogState();
  const winDialog = useDialogState();
  const hasShownWinDialog = useRef(false);

  const {
    gameState,
    bestRecords,
    mounted,
    handleTileClick,
    handleMove,
    startNewGame,
    shufflePuzzle,
  } = useSlidingPuzzleState();

  const { won } = gameState;

  // Keyboard input for arrow keys
  useKeyboardInput({
    onMove: handleMove,
    enabled: !won && !instructionsDialog.isOpen && !winDialog.isOpen,
  });

  // Handle new game with optional difficulty change
  const handleNewGame = useCallback(
    (newDifficulty?: Difficulty) => {
      startNewGame(newDifficulty);
      winDialog.close();
      hasShownWinDialog.current = false;
    },
    [startNewGame, winDialog]
  );

  // Show win dialog when game is won (only once per game)
  useEffect(() => {
    if (won && !hasShownWinDialog.current) {
      // Small delay so the winning move animation completes
      setTimeout(() => {
        winDialog.open();
      }, 300);
      hasShownWinDialog.current = true;
    }
  }, [won, winDialog]);

  // Reset win dialog tracking when starting new game
  useEffect(() => {
    if (!won) {
      hasShownWinDialog.current = false;
    }
  }, [won]);

  // Compute tile metadata (position and movability)
  const tilesWithMetadata = useMemo(() => {
    return gameState.tiles.map((value, index) => ({
      value,
      index,
      position: getPosition(index, gameState.gridSize),
      isMovable: canMoveTile(gameState.tiles, index, gameState.gridSize),
    }));
  }, [gameState.tiles, gameState.gridSize]);

  return {
    // State
    gameState,
    bestRecords,
    mounted,

    // Computed
    tilesWithMetadata,

    // Actions
    handleTileClick,
    handleMove,
    handleNewGame,
    shufflePuzzle,

    // Dialog states
    instructionsDialog,
    winDialog,
  };
}
