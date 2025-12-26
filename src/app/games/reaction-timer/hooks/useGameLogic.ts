"use client";

import { useCallback } from "react";
import { useDialogState } from "@/lib/hooks/useDialogState";
import { useGameState } from "./useGameState";

export function useGameLogic() {
  const { gameState, stats, startGame, handleClick, resetGame } = useGameState();
  const instructionsDialog = useDialogState();

  // Handle area click - determines action based on current phase
  const handleAreaClick = useCallback(() => {
    switch (gameState.phase) {
      case "idle":
      case "result":
      case "too_early":
        // Start a new round
        startGame();
        break;
      case "waiting":
      case "ready":
        // Process the click
        handleClick();
        break;
    }
  }, [gameState.phase, startGame, handleClick]);

  // Handle new game (reset all session data)
  const handleNewGame = useCallback(() => {
    resetGame();
  }, [resetGame]);

  return {
    // State
    phase: gameState.phase,
    currentTime: gameState.currentTime,
    bestTime: gameState.bestTime,
    attempts: gameState.attempts,

    // Stats
    stats,

    // Actions
    handleAreaClick,
    handleNewGame,

    // Dialogs
    instructionsDialog,
  };
}
