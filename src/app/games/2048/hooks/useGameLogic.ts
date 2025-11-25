"use client";

import { useTileGameState } from "./useTileGameState";
import { useKeyboardInput } from "./useKeyboardInput";
import { useSwipeInput } from "./useSwipeInput";
import { useDialogState } from "./useDialogState";

/**
 * Main orchestrator hook that composes all game logic hooks
 */
export function useGameLogic() {
  // Compose all sub-hooks
  const gameState = useTileGameState();
  const dialogState = useDialogState();

  // Enable keyboard and swipe input
  useKeyboardInput({
    onMove: gameState.handleMove,
    enabled: true,
  });

  useSwipeInput({
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
    showInstructions: dialogState.showInstructions,
    openInstructions: dialogState.openInstructions,
    closeInstructions: dialogState.closeInstructions,
  };
}
