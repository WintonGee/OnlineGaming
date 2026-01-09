"use client";

import { useCallback, useEffect, useRef } from "react";
import { useBoxheadGameState } from "./useBoxheadGameState";
import { useMultiplayerInput } from "./useMultiplayerInput";
import { useDialogState } from "@/lib/hooks/useDialogState";
import { GameMode } from "../types";

export function useGameLogic() {
  const gameStateHook = useBoxheadGameState();
  const { inputState, isPausePressed } = useMultiplayerInput(
    gameStateHook.gameState.phase === "playing",
    gameStateHook.gameState.mode
  );

  const instructionsDialog = useDialogState();
  const gameOverDialog = useDialogState();
  const hasShownGameOver = useRef(false);

  // Update input state
  useEffect(() => {
    gameStateHook.updateInput(inputState);
  }, [inputState, gameStateHook.updateInput]);

  // Handle pause key
  useEffect(() => {
    if (isPausePressed && gameStateHook.gameState.phase === "playing") {
      gameStateHook.togglePause();
    } else if (isPausePressed && gameStateHook.gameState.phase === "paused") {
      gameStateHook.togglePause();
    }
  }, [isPausePressed, gameStateHook.gameState.phase, gameStateHook.togglePause]);

  // Show game over dialog
  useEffect(() => {
    if (
      gameStateHook.gameState.phase === "gameOver" &&
      !hasShownGameOver.current
    ) {
      hasShownGameOver.current = true;

      // Save high score
      if (gameStateHook.gameState.mode !== "deathmatch") {
        gameStateHook.saveHighScore(
          gameStateHook.gameState.totalScore,
          gameStateHook.gameState.mode
        );
      }

      gameOverDialog.open();
    }
  }, [
    gameStateHook.gameState.phase,
    gameStateHook.gameState.mode,
    gameStateHook.gameState.totalScore,
    gameStateHook.saveHighScore,
    gameOverDialog,
  ]);

  // Reset game over flag when starting new game
  const handleStartGame = useCallback(
    (mode: GameMode) => {
      hasShownGameOver.current = false;
      gameOverDialog.close();
      gameStateHook.startGame(mode);
    },
    [gameStateHook, gameOverDialog]
  );

  const handleNewGame = useCallback(() => {
    hasShownGameOver.current = false;
    gameOverDialog.close();
    gameStateHook.startGame(gameStateHook.gameState.mode);
  }, [gameStateHook, gameOverDialog]);

  const handleReturnToMenu = useCallback(() => {
    hasShownGameOver.current = false;
    gameOverDialog.close();
    gameStateHook.returnToMenu();
  }, [gameStateHook, gameOverDialog]);

  return {
    // State
    gameState: gameStateHook.gameState,
    highScores: gameStateHook.highScores,
    explosions: gameStateHook.explosions,

    // Actions
    startGame: handleStartGame,
    newGame: handleNewGame,
    pauseGame: gameStateHook.pauseGame,
    resumeGame: gameStateHook.resumeGame,
    togglePause: gameStateHook.togglePause,
    returnToMenu: handleReturnToMenu,

    // Dialogs
    instructionsDialog,
    gameOverDialog,
  };
}
