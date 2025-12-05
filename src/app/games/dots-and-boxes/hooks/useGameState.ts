"use client";

import { useState, useCallback } from "react";
import { GameState, Difficulty, GameMode, GridSize } from "../types";
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
      board: createEmptyBoard(prev.gridSize),
      currentPlayer: 1,
      status: "playing",
      scores: { 1: 0, 2: 0 },
      lastMove: null,
    }));
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setGameState((prev) => ({
      ...createInitialState(prev.gridSize, difficulty, prev.mode),
    }));
  }, []);

  const setMode = useCallback((mode: GameMode) => {
    setGameState((prev) => ({
      ...createInitialState(prev.gridSize, prev.difficulty, mode),
    }));
  }, []);

  const setGridSize = useCallback((gridSize: GridSize) => {
    setGameState((prev) => ({
      ...createInitialState(gridSize, prev.difficulty, prev.mode),
    }));
  }, []);

  return {
    gameState,
    updateState,
    resetBoard,
    setDifficulty,
    setMode,
    setGridSize,
  };
}
