"use client";

import { useState, useCallback } from "react";
import { GameState, Difficulty, GameMode, Player } from "../types";
import { createInitialState, EMPTY_BOARD } from "../constants";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState());

  const updateState = useCallback((updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetBoard = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      board: [...EMPTY_BOARD],
      currentPlayer: "X",
      status: "playing",
      winner: null,
      winningLine: null,
    }));
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setGameState((prev) => ({
      ...createInitialState(difficulty, prev.mode, prev.playerSymbol),
    }));
  }, []);

  const setMode = useCallback((mode: GameMode) => {
    setGameState((prev) => ({
      ...createInitialState(prev.difficulty, mode, prev.playerSymbol),
    }));
  }, []);

  const setPlayerSymbol = useCallback((symbol: Player) => {
    setGameState((prev) => ({
      ...createInitialState(prev.difficulty, prev.mode, symbol),
    }));
  }, []);

  return {
    gameState,
    updateState,
    resetBoard,
    setDifficulty,
    setMode,
    setPlayerSymbol,
  };
}
