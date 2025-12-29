"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GameState, BestScores } from "../types";
import { createNewGame, processGuess, advanceGame } from "../logic/game";
import { bestScoresStorage } from "../utils/storage";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [bestScores, setBestScores] = useState<BestScores>({ bestStreak: 0 });
  const initializedRef = useRef(false);

  // Initialize game on mount (client-side only to avoid hydration mismatch)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const saved = bestScoresStorage.load();
    const newGame = createNewGame();

    if (saved) {
      setBestScores(saved);
      setGameState({ ...newGame, bestStreak: saved.bestStreak });
    } else {
      setGameState(newGame);
    }
  }, []);

  // Save best score when it changes
  useEffect(() => {
    if (!gameState) return;
    if (gameState.bestStreak > bestScores.bestStreak) {
      const newBest = { bestStreak: gameState.bestStreak };
      setBestScores(newBest);
      bestScoresStorage.save(newBest);
    }
  }, [gameState?.bestStreak, bestScores.bestStreak]);

  const makeGuess = useCallback((guess: "higher" | "lower") => {
    setGameState((prev) => (prev ? processGuess(prev, guess) : prev));
  }, []);

  const advance = useCallback(() => {
    setGameState((prev) => (prev ? advanceGame(prev) : prev));
  }, []);

  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...createNewGame(),
      bestStreak: prev?.bestStreak ?? 0,
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
