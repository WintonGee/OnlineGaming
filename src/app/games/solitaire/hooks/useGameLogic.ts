"use client";

import { useCallback, useEffect, useRef } from "react";
import { useGameState } from "./useGameState";
import { useDialogState } from "@/lib/hooks/useDialogState";
import { useWinDialog } from "@/lib/hooks/useWinDialog";

export function useGameLogic() {
  const gameState = useGameState();
  const instructionsDialog = useDialogState();
  const { winDialog, resetWinDialog } = useWinDialog(gameState.gameState.won);
  const hasShownWinDialog = useRef(false);

  // Auto-show win dialog
  useEffect(() => {
    if (gameState.gameState.won && !hasShownWinDialog.current) {
      hasShownWinDialog.current = true;
      winDialog.open();
    }
  }, [gameState.gameState.won, winDialog]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if typing in an input or dialog is open
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        instructionsDialog.isOpen ||
        winDialog.isOpen
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "d":
          // Draw from stock
          e.preventDefault();
          gameState.handleDraw();
          break;
        case "a":
          // Auto-complete if available
          if (gameState.canAutoComplete && !gameState.isAutoCompleting) {
            e.preventDefault();
            gameState.startAutoComplete();
          }
          break;
        case "n":
          // New game
          e.preventDefault();
          hasShownWinDialog.current = false;
          resetWinDialog();
          gameState.handleNewGame();
          break;
        case "escape":
          // Clear selection
          if (gameState.selectedCard) {
            e.preventDefault();
            gameState.clearSelection();
          }
          break;
        case "?":
          // Show help
          e.preventDefault();
          instructionsDialog.open();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    gameState,
    instructionsDialog,
    winDialog.isOpen,
    resetWinDialog,
  ]);

  // New game handler
  const handleNewGame = useCallback((drawCount?: 1 | 3) => {
    hasShownWinDialog.current = false;
    resetWinDialog();
    gameState.handleNewGame(drawCount);
  }, [resetWinDialog, gameState]);

  return {
    // State
    tableau: gameState.gameState.tableau,
    foundation: gameState.gameState.foundation,
    stock: gameState.gameState.stock,
    waste: gameState.gameState.waste,
    moves: gameState.gameState.moves,
    won: gameState.gameState.won,
    drawCount: gameState.gameState.drawCount,
    selectedCard: gameState.selectedCard,
    isAutoCompleting: gameState.isAutoCompleting,
    isInitialized: gameState.isInitialized,
    canAutoComplete: gameState.canAutoComplete,
    stats: gameState.stats,

    // Actions
    handleDraw: gameState.handleDraw,
    handleMove: gameState.handleMove,
    handleAutoMove: gameState.handleAutoMove,
    handleCardClick: gameState.handleCardClick,
    handleEmptyClick: gameState.handleEmptyClick,
    handleNewGame,
    handleChangeDrawCount: gameState.handleChangeDrawCount,
    startAutoComplete: gameState.startAutoComplete,

    // Dialogs
    instructionsDialog,
    winDialog,
  };
}
