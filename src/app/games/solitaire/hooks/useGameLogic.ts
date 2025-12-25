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
