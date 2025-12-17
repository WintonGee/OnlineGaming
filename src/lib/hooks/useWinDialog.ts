"use client";

import { useEffect, useRef } from "react";
import { useDialogState } from "@/lib/hooks/useDialogState";

/**
 * Hook for managing win dialog state with automatic open on win
 * Prevents the dialog from opening multiple times for the same win
 *
 * @param isWon - Whether the game has been won
 * @returns Object containing dialog state and control functions
 *
 * @example
 * ```ts
 * const { winDialog, resetWinDialog } = useWinDialog(gameState.won);
 *
 * // In handleNewGame
 * const handleNewGame = () => {
 *   resetWinDialog();
 *   resetGame();
 * };
 *
 * // In JSX
 * <WinDialog open={winDialog.isOpen} onOpenChange={winDialog.setIsOpen} ... />
 * ```
 */
export function useWinDialog(isWon: boolean) {
  const winDialog = useDialogState();
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (isWon && !hasShownRef.current) {
      winDialog.open();
      hasShownRef.current = true;
    }
    // Reset tracking when game is no longer won (new game started)
    if (!isWon) {
      hasShownRef.current = false;
    }
  }, [isWon, winDialog]);

  /**
   * Reset the win dialog tracking state
   * Call this when starting a new game
   */
  const resetWinDialog = () => {
    hasShownRef.current = false;
    winDialog.close();
  };

  return {
    winDialog,
    resetWinDialog,
  };
}
