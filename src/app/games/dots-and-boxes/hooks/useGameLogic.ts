"use client";

import { useCallback, useEffect } from "react";
import { useGameState } from "./useGameState";
import { LineType, Player } from "../types";
import {
  makeMove,
  isGameOver,
  calculateScores,
  getWinner,
  getNextPlayer,
  isValidMove,
} from "../logic/game";
import { getAIMove } from "../logic/ai";
import { useAIGameCore } from "@/lib/hooks/useAIGameCore";

const AI_DELAY = 400; // ms delay before AI moves

export function useGameLogic() {
  const {
    gameState,
    updateState,
    resetBoard,
    setDifficulty,
    setMode,
    setGridSize,
  } = useGameState();

  const {
    isAIThinking,
    setIsAIThinking,
    aiTimeoutRef,
    clearAITimeout,
    instructionsDialog,
  } = useAIGameCore();

  // Determine if it's the AI's turn (AI is always player 2)
  const isAITurn =
    gameState.mode === "singleplayer" &&
    gameState.status === "playing" &&
    gameState.currentPlayer === 2;

  // Handle AI moves
  useEffect(() => {
    // Clear any existing timeout
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }

    if (!isAITurn) {
      setIsAIThinking(false);
      return;
    }

    setIsAIThinking(true);

    const aiPlayer: Player = 2;
    const move = getAIMove(
      gameState.board,
      gameState.gridSize,
      aiPlayer,
      gameState.difficulty
    );

    if (!move) {
      setIsAIThinking(false);
      return;
    }

    // Add a delay so the AI move feels more natural
    aiTimeoutRef.current = setTimeout(() => {
      const result = makeMove(
        gameState.board,
        gameState.gridSize,
        move.row,
        move.col,
        move.type,
        aiPlayer
      );

      if (!result) {
        setIsAIThinking(false);
        return;
      }

      const { newBoard, boxesCompleted } = result;
      const newScores = calculateScores(newBoard);
      const gameOver = isGameOver(newBoard, gameState.gridSize);

      // If AI completed a box, it gets another turn
      const nextPlayer = boxesCompleted > 0 ? aiPlayer : getNextPlayer(aiPlayer);

      updateState({
        board: newBoard,
        currentPlayer: nextPlayer,
        status: gameOver ? "finished" : "playing",
        scores: newScores,
        lastMove: { row: move.row, col: move.col, type: move.type },
      });

      setIsAIThinking(false);
    }, AI_DELAY);

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
    };
  }, [
    isAITurn,
    gameState.board,
    gameState.gridSize,
    gameState.difficulty,
    updateState,
  ]);

  const handleLineClick = useCallback(
    (row: number, col: number, type: LineType) => {
      // Ignore clicks if game is over, AI is thinking, or it's AI's turn
      if (
        gameState.status !== "playing" ||
        isAIThinking ||
        (gameState.mode === "singleplayer" && gameState.currentPlayer === 2) ||
        !isValidMove(gameState.board, gameState.gridSize, row, col, type)
      ) {
        return;
      }

      const currentPlayer = gameState.currentPlayer;
      const result = makeMove(
        gameState.board,
        gameState.gridSize,
        row,
        col,
        type,
        currentPlayer
      );

      if (!result) return;

      const { newBoard, boxesCompleted } = result;
      const newScores = calculateScores(newBoard);
      const gameOver = isGameOver(newBoard, gameState.gridSize);

      // If player completed a box, they get another turn
      const nextPlayer =
        boxesCompleted > 0 ? currentPlayer : getNextPlayer(currentPlayer);

      updateState({
        board: newBoard,
        currentPlayer: nextPlayer,
        status: gameOver ? "finished" : "playing",
        scores: newScores,
        lastMove: { row, col, type },
      });
    },
    [
      gameState.status,
      gameState.board,
      gameState.gridSize,
      gameState.currentPlayer,
      gameState.mode,
      isAIThinking,
      updateState,
    ]
  );

  const handleNewGame = useCallback(() => {
    clearAITimeout();
    resetBoard();
  }, [clearAITimeout, resetBoard]);

  const handleDifficultyChange = useCallback(
    (difficulty: "easy" | "medium" | "hard") => {
      clearAITimeout();
      setDifficulty(difficulty);
    },
    [clearAITimeout, setDifficulty]
  );

  const handleModeChange = useCallback(
    (mode: "singleplayer" | "multiplayer") => {
      clearAITimeout();
      setMode(mode);
    },
    [clearAITimeout, setMode]
  );

  const handleGridSizeChange = useCallback(
    (size: 3 | 4 | 5 | 6) => {
      clearAITimeout();
      setGridSize(size);
    },
    [clearAITimeout, setGridSize]
  );

  // Get status message
  const getStatusMessage = (): string => {
    if (gameState.status === "finished") {
      const winner = getWinner(gameState.scores);
      if (winner === null) {
        return "It's a tie!";
      }
      if (gameState.mode === "singleplayer") {
        return winner === 1 ? "You win!" : "Computer wins!";
      }
      return winner === 1 ? "Red wins!" : "Blue wins!";
    }

    if (isAIThinking) {
      return "Computer is thinking...";
    }

    if (gameState.mode === "singleplayer") {
      return gameState.currentPlayer === 1 ? "Your turn" : "Computer's turn";
    }

    return gameState.currentPlayer === 1 ? "Red's turn" : "Blue's turn";
  };

  return {
    gameState,
    isAIThinking,
    statusMessage: getStatusMessage(),
    handleLineClick,
    handleNewGame,
    handleDifficultyChange,
    handleModeChange,
    handleGridSizeChange,
    instructionsDialog,
  };
}
