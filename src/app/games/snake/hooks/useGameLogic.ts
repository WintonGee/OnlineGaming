"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSnakeGameState } from "./useSnakeGameState";
import { useKeyboardInput, Direction } from "@/lib/hooks/useKeyboardInput";
import { useDialogState } from "@/hooks/useDialogState";

/**
 * Main orchestrator hook that composes all game logic hooks
 */
export function useGameLogic() {
  const gameState = useSnakeGameState();
  const instructionsDialog = useDialogState();
  const winDialog = useDialogState();
  const gameOverDialog = useDialogState();

  const hasShownEndDialog = useRef(false);

  // Handle move from keyboard/swipe
  const handleMove = useCallback(
    (direction: Direction) => {
      // Start game on first input if not running
      if (!gameState.isRunning && !gameState.gameOver) {
        gameState.startGame();
      }
      gameState.changeDirection(direction);
    },
    [gameState]
  );

  // Enable keyboard input
  useKeyboardInput({
    onMove: handleMove,
    enabled: !gameState.gameOver,
  });

  // Show win/game over dialog when game ends
  useEffect(() => {
    if (gameState.gameOver && gameState.isRunning && !hasShownEndDialog.current) {
      hasShownEndDialog.current = true;
      if (gameState.won) {
        winDialog.open();
      } else {
        gameOverDialog.open();
      }
    }
  }, [gameState.gameOver, gameState.won, gameState.isRunning, winDialog, gameOverDialog]);

  // Reset dialog flag when starting new game
  useEffect(() => {
    if (!gameState.gameOver) {
      hasShownEndDialog.current = false;
    }
  }, [gameState.gameOver]);

  // Handle new game from dialogs
  const handleNewGame = useCallback(() => {
    winDialog.close();
    gameOverDialog.close();
    gameState.startNewGame();
  }, [winDialog, gameOverDialog, gameState]);

  // Handle difficulty change
  const handleDifficultyChange = useCallback(
    (difficulty: "Easy" | "Medium" | "Hard") => {
      gameState.changeDifficulty(difficulty);
    },
    [gameState]
  );

  return {
    // Game state
    snake: gameState.snake,
    food: gameState.food,
    direction: gameState.direction,
    score: gameState.score,
    gameOver: gameState.gameOver,
    won: gameState.won,
    isPaused: gameState.isPaused,
    isRunning: gameState.isRunning,
    difficulty: gameState.difficulty,
    gridSize: gameState.gridSize,
    highScore: gameState.highScore,
    highScores: gameState.highScores,

    // Game actions
    handleMove,
    startGame: gameState.startGame,
    togglePause: gameState.togglePause,
    startNewGame: handleNewGame,
    changeDifficulty: handleDifficultyChange,

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
