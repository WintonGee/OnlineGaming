"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGameState } from "./useGameState";
import { Player } from "../types";
import {
  makeMove,
  checkWinner,
  getWinningLine,
  isDraw,
  getNextPlayer,
  isValidMove,
} from "../logic/game";
import { getAIMove } from "../logic/ai";
import { useDialogState } from "@/hooks/useDialogState";

const AI_DELAY = 400; // ms delay before AI moves

export function useGameLogic() {
  const {
    gameState,
    updateState,
    resetBoard,
    setDifficulty,
    setMode,
    setPlayerSymbol,
  } = useGameState();

  const instructionsDialog = useDialogState();
  const [isAIThinking, setIsAIThinking] = useState(false);
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if it's the AI's turn
  const isAITurn =
    gameState.mode === "singleplayer" &&
    gameState.status === "playing" &&
    gameState.currentPlayer !== gameState.playerSymbol;

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

    const aiPlayer = gameState.playerSymbol === "X" ? "O" : "X";
    const moveIndex = getAIMove(
      gameState.board,
      aiPlayer,
      gameState.difficulty
    );

    if (moveIndex === -1) {
      setIsAIThinking(false);
      return;
    }

    // Add a delay so the AI move feels more natural
    aiTimeoutRef.current = setTimeout(() => {
      const newBoard = makeMove(gameState.board, moveIndex, aiPlayer);
      if (!newBoard) {
        setIsAIThinking(false);
        return;
      }

      const winner = checkWinner(newBoard);
      const winningLine = getWinningLine(newBoard);
      const draw = isDraw(newBoard);

      if (winner) {
        updateState({
          board: newBoard,
          status: "won",
          winner,
          winningLine: winningLine?.indices || null,
        });
      } else if (draw) {
        updateState({
          board: newBoard,
          status: "draw",
          currentPlayer: getNextPlayer(aiPlayer),
        });
      } else {
        updateState({
          board: newBoard,
          currentPlayer: getNextPlayer(aiPlayer),
        });
      }

      setIsAIThinking(false);
    }, AI_DELAY);

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
    };
  }, [isAITurn, gameState.board, gameState.difficulty, gameState.playerSymbol, updateState]);

  const handleCellClick = useCallback(
    (index: number) => {
      // Ignore clicks if game is over, AI is thinking, or it's AI's turn
      if (
        gameState.status !== "playing" ||
        isAIThinking ||
        (gameState.mode === "singleplayer" && gameState.currentPlayer !== gameState.playerSymbol) ||
        !isValidMove(gameState.board, index)
      ) {
        return;
      }

      const currentPlayer = gameState.currentPlayer;
      const newBoard = makeMove(gameState.board, index, currentPlayer);

      if (!newBoard) return;

      const winner = checkWinner(newBoard);
      const winningLine = getWinningLine(newBoard);
      const draw = isDraw(newBoard);

      if (winner) {
        updateState({
          board: newBoard,
          status: "won",
          winner,
          winningLine: winningLine?.indices || null,
        });
      } else if (draw) {
        updateState({
          board: newBoard,
          status: "draw",
          currentPlayer: getNextPlayer(currentPlayer),
        });
      } else {
        updateState({
          board: newBoard,
          currentPlayer: getNextPlayer(currentPlayer),
        });
      }
    },
    [
      gameState.status,
      gameState.board,
      gameState.currentPlayer,
      gameState.mode,
      gameState.playerSymbol,
      isAIThinking,
      updateState,
    ]
  );

  const handleNewGame = useCallback(() => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    resetBoard();
    setIsAIThinking(false);
  }, [resetBoard]);

  const handleDifficultyChange = useCallback(
    (difficulty: "easy" | "medium" | "hard") => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
      setDifficulty(difficulty);
      setIsAIThinking(false);
    },
    [setDifficulty]
  );

  const handleModeChange = useCallback(
    (mode: "singleplayer" | "multiplayer") => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
      setMode(mode);
      setIsAIThinking(false);
    },
    [setMode]
  );

  const handlePlayerSymbolChange = useCallback(
    (symbol: Player) => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
      setPlayerSymbol(symbol);
      setIsAIThinking(false);
    },
    [setPlayerSymbol]
  );

  // Get status message
  const getStatusMessage = (): string => {
    if (gameState.status === "won") {
      if (gameState.mode === "singleplayer") {
        return gameState.winner === gameState.playerSymbol
          ? "You win!"
          : "Computer wins!";
      }
      return `Player ${gameState.winner} wins!`;
    }
    if (gameState.status === "draw") {
      return "It's a draw!";
    }
    if (isAIThinking) {
      return "Computer is thinking...";
    }
    if (gameState.mode === "singleplayer") {
      return gameState.currentPlayer === gameState.playerSymbol
        ? "Your turn"
        : "Computer's turn";
    }
    return `Player ${gameState.currentPlayer}'s turn`;
  };

  return {
    gameState,
    isAIThinking,
    statusMessage: getStatusMessage(),
    handleCellClick,
    handleNewGame,
    handleDifficultyChange,
    handleModeChange,
    handlePlayerSymbolChange,
    instructionsDialog,
  };
}
