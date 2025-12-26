"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GameState, GamePhase } from "../types";
import {
  createInitialState,
  generateRandomWaitTime,
  calculateReactionTime,
  createAttemptResult,
  isNewBestTime,
  calculateStats,
} from "../logic/game";
import { bestTimeStorage } from "../utils/storage";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load best time from storage on mount
  useEffect(() => {
    const saved = bestTimeStorage.load();
    if (saved) {
      setGameState((prev) => ({ ...prev, bestTime: saved.time }));
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Start the game - begin waiting phase
  const startGame = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Enter waiting phase
    setGameState((prev) => ({
      ...prev,
      phase: "waiting",
      currentTime: null,
      startTimestamp: null,
    }));

    // Schedule transition to ready phase
    const waitTime = generateRandomWaitTime();
    timeoutRef.current = setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        phase: "ready",
        startTimestamp: performance.now(),
      }));
    }, waitTime);
  }, []);

  // Handle click during game
  const handleClick = useCallback(() => {
    setGameState((prev) => {
      switch (prev.phase) {
        case "idle":
        case "result":
        case "too_early":
          // These phases transition via startGame, not here
          return prev;

        case "waiting":
          // Clicked too early - cancel the timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          return {
            ...prev,
            phase: "too_early" as GamePhase,
            currentTime: null,
          };

        case "ready":
          // Calculate reaction time
          if (prev.startTimestamp === null) return prev;

          const reactionTime = calculateReactionTime(prev.startTimestamp);
          const attempt = createAttemptResult(reactionTime);
          const newAttempts = [...prev.attempts, attempt];

          // Check for new best time
          let newBestTime = prev.bestTime;
          if (isNewBestTime(reactionTime, prev.bestTime)) {
            newBestTime = reactionTime;
            // Save to storage
            bestTimeStorage.save({
              time: reactionTime,
              date: new Date().toISOString(),
            });
          }

          return {
            ...prev,
            phase: "result" as GamePhase,
            currentTime: reactionTime,
            attempts: newAttempts,
            bestTime: newBestTime,
            startTimestamp: null,
          };

        default:
          return prev;
      }
    });
  }, []);

  // Reset game to initial state
  const resetGame = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setGameState((prev) => ({
      ...createInitialState(prev.bestTime),
      attempts: [], // Clear session attempts
    }));
  }, []);

  // Calculate current session stats
  const stats = calculateStats(gameState.attempts);

  return {
    gameState,
    stats,
    startGame,
    handleClick,
    resetGame,
  };
}
