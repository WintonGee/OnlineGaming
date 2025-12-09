"use client";

import { useState, useCallback } from "react";
import { GameState, Difficulty, GameMode, Player } from "../types";
import { createInitialState, createEmptyBoard } from "../constants";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialState()
  );

  const updateState = useCallback((updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetBoard = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      board: createEmptyBoard(),
      currentPlayer: 1,
      status: "playing",
      winner: null,
      winningLine: null,
    }));
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setGameState((prev) => ({
      ...createInitialState(difficulty, prev.mode, prev.playerNumber),
    }));
  }, []);

  const setMode = useCallback((mode: GameMode) => {
    setGameState((prev) => ({
      ...createInitialState(prev.difficulty, mode, prev.playerNumber),
    }));
  }, []);

  const setPlayerNumber = useCallback((playerNumber: Player) => {
    setGameState((prev) => ({
      ...createInitialState(prev.difficulty, prev.mode, playerNumber),
    }));
  }, []);

  return {
    gameState,
    updateState,
    resetBoard,
    setDifficulty,
    setMode,
    setPlayerNumber,
  };
}
