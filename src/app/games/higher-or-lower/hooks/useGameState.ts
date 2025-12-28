"use client";

import { useState, useCallback, useEffect } from "react";
import { GameState, BestScores } from "../types";
import { createNewGame, processGuess, advanceGame } from "../logic/game";
import { bestScoresStorage } from "../utils/storage";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => createNewGame());
  const [bestScores, setBestScores] = useState<BestScores>({ bestStreak: 0 });

  // Load best scores on mount
  useEffect(() => {
    const saved = bestScoresStorage.load();
    if (saved) {
      setBestScores(saved);
      setGameState(prev => ({ ...prev, bestStreak: saved.bestStreak }));
    }
  }, []);

  // Save best score when it changes
  useEffect(() => {
    if (gameState.bestStreak > bestScores.bestStreak) {
      const newBest = { bestStreak: gameState.bestStreak };
      setBestScores(newBest);
      bestScoresStorage.save(newBest);
    }
  }, [gameState.bestStreak, bestScores.bestStreak]);

  const makeGuess = useCallback((guess: "higher" | "lower") => {
    setGameState(prev => processGuess(prev, guess));
  }, []);

  const advance = useCallback(() => {
    setGameState(prev => advanceGame(prev));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...createNewGame(),
      bestStreak: prev.bestStreak,
    }));
  }, []);

  return {
    gameState,
    bestScores,
    makeGuess,
    advance,
    resetGame,
  };
}
