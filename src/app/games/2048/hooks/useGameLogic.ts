"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTileGameState } from "./useTileGameState";
import { useKeyboardInput } from "@/lib/hooks/useKeyboardInput";
import { useDialogState } from "@/lib/hooks/useDialogState";

/**
 * Main orchestrator hook that composes all game logic hooks
 */
export function useGameLogic() {
  // Compose all sub-hooks
  const gameState = useTileGameState();
  const instructionsDialog = useDialogState();
  const winDialog = useDialogState();
  const gameOverDialog = useDialogState();

  // Track if we've shown dialogs for the current game
  const hasShownWinDialog = useRef(false);
  const hasShownGameOverDialog = useRef(false);

  // Enable keyboard input (swipe is handled in TileGameBoard)
  useKeyboardInput({
    onMove: gameState.handleMove,
    enabled: true,
  });

  // Show win dialog when player wins (only once per win)
  useEffect(() => {
    if (gameState.won && !gameState.keepPlaying && !hasShownWinDialog.current) {
      winDialog.open();
      hasShownWinDialog.current = true;
    }
  }, [gameState.won, gameState.keepPlaying, winDialog]);

  // Reset win dialog tracking when starting a new game
  useEffect(() => {
    if (!gameState.won) {
      hasShownWinDialog.current = false;
    }
  }, [gameState.won]);

  // Show game over dialog when game ends (only once per game)
  useEffect(() => {
    if (gameState.gameOver && !hasShownGameOverDialog.current) {
      gameOverDialog.open();
      hasShownGameOverDialog.current = true;
    }
  }, [gameState.gameOver, gameOverDialog]);

  // Reset game over dialog tracking when starting a new game
  useEffect(() => {
    if (!gameState.gameOver) {
      hasShownGameOverDialog.current = false;
    }
  }, [gameState.gameOver]);

  // Handle continue after win - closes dialog and allows playing
  const handleContinueAfterWin = useCallback(() => {
    gameState.continueAfterWin();
    winDialog.close();
  }, [gameState, winDialog]);

  // Handle new game - closes dialogs and resets
  const handleNewGame = useCallback(() => {
    winDialog.close();
    gameOverDialog.close();
    gameState.startNewGame();
  }, [gameState, winDialog, gameOverDialog]);

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
    startNewGame: handleNewGame,
    handleMove: gameState.handleMove,
    continueAfterWin: handleContinueAfterWin,

    // Dialog state
    showInstructions: instructionsDialog.isOpen,
    openInstructions: instructionsDialog.open,
    closeInstructions: instructionsDialog.close,
    showWinDialog: winDialog.isOpen,
    setShowWinDialog: winDialog.setIsOpen,
    showGameOverDialog: gameOverDialog.isOpen,
    setShowGameOverDialog: gameOverDialog.setIsOpen,
  };
}
