"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGameState } from "./useGameState";
import { Player } from "../types";
import {
  dropPiece,
  checkWinner,
  getWinningLine,
  isDraw,
  getNextPlayer,
  canDropPiece,
  getDropRow,
} from "../logic/gameLogic";
import { getAIMove } from "../logic/ai";
import { useDialogState } from "@/hooks/useDialogState";

const AI_DELAY = 500; // ms delay before AI moves

export function useGameLogic() {
  const {
    gameState,
    updateState,
    resetBoard,
    setDifficulty,
    setMode,
    setPlayerNumber,
  } = useGameState();

  const instructionsDialog = useDialogState();
  const [isAIThinking, setIsAIThinking] = useState(false);
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if it's the AI's turn
  const isAITurn =
    gameState.mode === "singleplayer" &&
    gameState.status === "playing" &&
    gameState.currentPlayer !== gameState.playerNumber;

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

    const aiPlayer = gameState.playerNumber === 1 ? 2 : 1;
    const moveCol = getAIMove(
      gameState.board,
      aiPlayer,
      gameState.difficulty
    );

    if (moveCol === -1) {
      setIsAIThinking(false);
      return;
    }

    // Add a delay so the AI move feels more natural
    aiTimeoutRef.current = setTimeout(() => {
      const dropRow = getDropRow(gameState.board, moveCol);
      const newBoard = dropPiece(gameState.board, moveCol, aiPlayer);
      if (!newBoard || dropRow === -1) {
        setIsAIThinking(false);
        return;
      }

      const winner = checkWinner(newBoard);
      const winningLine = getWinningLine(newBoard);
      const draw = isDraw(newBoard);
      const lastMove: [number, number] = [dropRow, moveCol];

      if (winner) {
        updateState({
          board: newBoard,
          status: "won",
          winner,
          winningLine: winningLine?.cells || null,
          lastMove,
        });
      } else if (draw) {
        updateState({
          board: newBoard,
          status: "draw",
          currentPlayer: getNextPlayer(aiPlayer),
          lastMove,
        });
      } else {
        updateState({
          board: newBoard,
          currentPlayer: getNextPlayer(aiPlayer),
          lastMove,
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
  }, [
    isAITurn,
    gameState.board,
    gameState.difficulty,
    gameState.playerNumber,
    updateState,
  ]);

  const handleColumnClick = useCallback(
    (col: number) => {
      // Ignore clicks if game is over, AI is thinking, or it's AI's turn
      if (
        gameState.status !== "playing" ||
        isAIThinking ||
        (gameState.mode === "singleplayer" &&
          gameState.currentPlayer !== gameState.playerNumber) ||
        !canDropPiece(gameState.board, col)
      ) {
        return;
      }

      const currentPlayer = gameState.currentPlayer;
      const dropRow = getDropRow(gameState.board, col);
      const newBoard = dropPiece(gameState.board, col, currentPlayer);

      if (!newBoard || dropRow === -1) return;

      const winner = checkWinner(newBoard);
      const winningLine = getWinningLine(newBoard);
      const draw = isDraw(newBoard);
      const lastMove: [number, number] = [dropRow, col];

      if (winner) {
        updateState({
          board: newBoard,
          status: "won",
          winner,
          winningLine: winningLine?.cells || null,
          lastMove,
        });
      } else if (draw) {
        updateState({
          board: newBoard,
          status: "draw",
          currentPlayer: getNextPlayer(currentPlayer),
          lastMove,
        });
      } else {
        updateState({
          board: newBoard,
          currentPlayer: getNextPlayer(currentPlayer),
          lastMove,
        });
      }
    },
    [
      gameState.status,
      gameState.board,
      gameState.currentPlayer,
      gameState.mode,
      gameState.playerNumber,
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

  const handlePlayerNumberChange = useCallback(
    (playerNumber: Player) => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
      setPlayerNumber(playerNumber);
      setIsAIThinking(false);
    },
    [setPlayerNumber]
  );

  // Get status message
  const getStatusMessage = (): string => {
    if (gameState.status === "won") {
      if (gameState.mode === "singleplayer") {
        return gameState.winner === gameState.playerNumber
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
      return gameState.currentPlayer === gameState.playerNumber
        ? "Your turn"
        : "Computer's turn";
    }
    return `Player ${gameState.currentPlayer}'s turn`;
  };

  return {
    gameState,
    isAIThinking,
    statusMessage: getStatusMessage(),
    handleColumnClick,
    handleNewGame,
    handleDifficultyChange,
    handleModeChange,
    handlePlayerNumberChange,
    instructionsDialog,
  };
}
