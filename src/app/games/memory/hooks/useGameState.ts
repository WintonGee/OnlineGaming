"use client";

import { useState, useCallback, useEffect } from "react";
import { GameState, Difficulty, BestScores } from "../types";
import { createNewGame } from "../logic/game";
import { createStorage } from "@/lib/utils/storage";
import { BEST_SCORES_KEY, DEFAULT_DIFFICULTY } from "../constants";

const bestScoresStorage = createStorage<BestScores>(BEST_SCORES_KEY);

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createNewGame(DEFAULT_DIFFICULTY)
  );
  const [bestScores, setBestScores] = useState<BestScores>({});

  // Load best scores from localStorage on mount
  useEffect(() => {
    const saved = bestScoresStorage.load();
    if (saved) {
      setBestScores(saved);
    }
  }, []);

  // Update state partially
  const updateState = useCallback((updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Reset the game with current difficulty
  const resetGame = useCallback(() => {
    setGameState(createNewGame(gameState.difficulty));
  }, [gameState.difficulty]);

  // Start a new game with a specific difficulty
  const newGame = useCallback((difficulty: Difficulty) => {
    setGameState(createNewGame(difficulty));
  }, []);

  // Change difficulty and start new game
  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setGameState(createNewGame(difficulty));
  }, []);

  // Update best score if current score is better (fewer moves)
  const updateBestScore = useCallback(
    (moves: number) => {
      const currentBest = bestScores[gameState.difficulty];
      if (currentBest === undefined || moves < currentBest) {
        const newBestScores = {
          ...bestScores,
          [gameState.difficulty]: moves,
        };
        setBestScores(newBestScores);
        bestScoresStorage.save(newBestScores);
        return true; // New best score!
      }
      return false;
    },
    [bestScores, gameState.difficulty]
  );

  return {
    gameState,
    bestScores,
    updateState,
    resetGame,
    newGame,
    setDifficulty,
    updateBestScore,
  };
}
