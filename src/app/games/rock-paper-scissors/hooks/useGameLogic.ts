"use client";

import { useCallback } from "react";
import { useGameState } from "./useGameState";
import { useDialogState } from "@/lib/hooks/useDialogState";
import { Choice } from "../types";
import { calculateWinPercentage } from "../logic/game";

export function useGameLogic() {
  const {
    gameState,
    makeChoice,
    resetGame,
    dismissConfetti,
  } = useGameState();

  const instructionsDialog = useDialogState();

  // Handle player selecting a choice
  const handleChoice = useCallback(
    (choice: Choice) => {
      // Only allow choices in idle state
      if (gameState.phase !== "idle") return;
      makeChoice(choice);
    },
    [gameState.phase, makeChoice]
  );

  // Handle new game (reset stats)
  const handleNewGame = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Calculate derived stats
  const totalGames = gameState.stats.wins + gameState.stats.losses + gameState.stats.ties;
  const winPercentage = calculateWinPercentage(gameState.stats);

  return {
    // State
    phase: gameState.phase,
    playerChoice: gameState.playerChoice,
    aiChoice: gameState.aiChoice,
    currentResult: gameState.currentResult,
    showConfetti: gameState.showConfetti,

    // Stats
    stats: gameState.stats,
    totalGames,
    winPercentage,

    // History
    history: gameState.history,

    // Actions
    handleChoice,
    handleNewGame,
    dismissConfetti,

    // Dialogs
    instructionsDialog,
  };
}
