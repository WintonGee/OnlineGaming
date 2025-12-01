"use client";

import { useTileGameState } from "./useTileGameState";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { useDialogState } from "@/hooks/useDialogState";

/**
 * Main orchestrator hook that composes all game logic hooks
 */
export function useGameLogic() {
  // Compose all sub-hooks
  const gameState = useTileGameState();
  const instructionsDialog = useDialogState();

  // Enable keyboard input (swipe is handled in TileGameBoard)
  useKeyboardInput({
    onMove: gameState.handleMove,
    enabled: true,
  });

  // Return unified interface
  return {
    // Game state
    tiles: gameState.tiles,
    score: gameState.score,
    bestScore: gameState.bestScore,
    gameOver: gameState.gameOver,
    won: gameState.won,
    keepPlaying: gameState.keepPlaying,

    // Game actions
    startNewGame: gameState.startNewGame,
    handleMove: gameState.handleMove,
    continueAfterWin: gameState.continueAfterWin,

    // Dialog state
    showInstructions: instructionsDialog.isOpen,
    openInstructions: instructionsDialog.open,
    closeInstructions: instructionsDialog.close,
  };
}
