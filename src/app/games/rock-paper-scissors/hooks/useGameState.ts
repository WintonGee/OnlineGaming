"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GameState, Choice, GamePhase } from "../types";
import {
  createInitialState,
  processRound,
  resetForNewRound,
  resetAllStats,
} from "../logic/game";
import { statsStorage } from "../utils/storage";
import {
  COUNTDOWN_DURATION,
  REVEAL_DURATION,
  RESULT_DISPLAY_TIME,
} from "../constants";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved stats on mount
  useEffect(() => {
    const saved = statsStorage.load();
    if (saved) {
      setGameState((prev) => ({
        ...prev,
        stats: saved.stats,
      }));
    }
  }, []);

  // Save stats whenever they change
  useEffect(() => {
    if (gameState.stats.wins > 0 || gameState.stats.losses > 0 || gameState.stats.ties > 0) {
      statsStorage.save({
        stats: gameState.stats,
        lastPlayed: new Date().toISOString(),
      });
    }
  }, [gameState.stats]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Update phase helper
  const setPhase = useCallback((phase: GamePhase) => {
    setGameState((prev) => ({ ...prev, phase }));
  }, []);

  // Handle player making a choice
  const makeChoice = useCallback((choice: Choice) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set player choice and start countdown
    setGameState((prev) => ({
      ...prev,
      phase: "countdown",
      playerChoice: choice,
      aiChoice: null,
      currentResult: null,
      showConfetti: false,
    }));

    // After countdown, reveal both choices
    timeoutRef.current = setTimeout(() => {
      setGameState((prev) => {
        // Process the round now (generates AI choice and determines winner)
        const processed = processRound(prev, choice);
        return {
          ...processed,
          phase: "reveal",
        };
      });

      // After reveal animation, show result
      timeoutRef.current = setTimeout(() => {
        setPhase("result");

        // After showing result, auto-reset to idle for next round
        timeoutRef.current = setTimeout(() => {
          setGameState((prev) => resetForNewRound(prev));
        }, RESULT_DISPLAY_TIME);
      }, REVEAL_DURATION);
    }, COUNTDOWN_DURATION);
  }, [setPhase]);

  // Reset stats and start fresh
  const resetGame = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setGameState((prev) => resetAllStats(prev));
  }, []);

  // Dismiss confetti
  const dismissConfetti = useCallback(() => {
    setGameState((prev) => ({ ...prev, showConfetti: false }));
  }, []);

  return {
    gameState,
    makeChoice,
    resetGame,
    dismissConfetti,
  };
}
