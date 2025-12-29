"use client";

import { useCallback, useEffect, useRef } from "react";
import { useGameState } from "./useGameState";
import { useDialogState } from "@/lib/hooks/useDialogState";
import { RESULT_DISPLAY_DURATION } from "../constants";

export function useGameLogic() {
  const { gameState, bestScores, makeGuess, advance, resetGame } = useGameState();
  const instructionsDialog = useDialogState();
  const gameOverDialog = useDialogState();
  const hasShownGameOver = useRef(false);
  const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle revealing phase - auto-advance after showing result
  useEffect(() => {
    if (!gameState) return;
    if (gameState.gamePhase === "revealing") {
      advanceTimeoutRef.current = setTimeout(() => {
        advance();
      }, RESULT_DISPLAY_DURATION);

      return () => {
        if (advanceTimeoutRef.current) {
          clearTimeout(advanceTimeoutRef.current);
        }
      };
    }
  }, [gameState?.gamePhase, advance]);

  // Show game over dialog
  useEffect(() => {
    if (!gameState) return;
    if (gameState.gamePhase === "gameOver" && !hasShownGameOver.current) {
      hasShownGameOver.current = true;
      setTimeout(() => {
        gameOverDialog.open();
      }, 300);
    }
  }, [gameState?.gamePhase, gameOverDialog]);

  const handleGuess = useCallback((guess: "higher" | "lower") => {
    if (!gameState || gameState.gamePhase !== "playing") return;
    makeGuess(guess);
  }, [gameState?.gamePhase, makeGuess]);

  const handleNewGame = useCallback(() => {
    hasShownGameOver.current = false;
    gameOverDialog.close();
    resetGame();
  }, [gameOverDialog, resetGame]);

  return {
    gameState,
    bestScores,
    isLoading: !gameState,
    handleGuess,
    handleNewGame,
    instructionsDialog,
    gameOverDialog,
  };
}
