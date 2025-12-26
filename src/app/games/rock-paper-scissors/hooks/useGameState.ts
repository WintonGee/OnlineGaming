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
  // Use array to track all active timeouts
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Helper to clear all pending timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);

  // Helper to add a timeout and track it
  const addTimeout = useCallback((callback: () => void, delay: number) => {
    const timeout = setTimeout(() => {
      // Remove this timeout from tracking after it fires
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== timeout);
      callback();
    }, delay);
    timeoutsRef.current.push(timeout);
    return timeout;
  }, []);

  // Load saved stats on mount
  useEffect(() => {
    try {
      const saved = statsStorage.load();
      if (saved) {
        setGameState((prev) => ({
          ...prev,
          stats: saved.stats,
        }));
      }
    } catch {
      // localStorage might be unavailable (private browsing, etc.)
      // Continue with default stats
    }
  }, []);

  // Save stats whenever they change
  useEffect(() => {
    if (gameState.stats.wins > 0 || gameState.stats.losses > 0 || gameState.stats.ties > 0) {
      try {
        statsStorage.save({
          stats: gameState.stats,
          lastPlayed: new Date().toISOString(),
        });
      } catch {
        // localStorage might be unavailable - silently fail
      }
    }
  }, [gameState.stats]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  // Update phase helper
  const setPhase = useCallback((phase: GamePhase) => {
    setGameState((prev) => ({ ...prev, phase }));
  }, []);

  // Handle player making a choice
  const makeChoice = useCallback((choice: Choice) => {
    // Clear any existing timeouts from previous rounds
    clearAllTimeouts();

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
    addTimeout(() => {
      setGameState((prev) => {
        // Process the round now (generates AI choice and determines winner)
        const processed = processRound(prev, choice);
        return {
          ...processed,
          phase: "reveal",
        };
      });

      // After reveal animation, show result
      addTimeout(() => {
        setPhase("result");

        // After showing result, auto-reset to idle for next round
        addTimeout(() => {
          setGameState((prev) => resetForNewRound(prev));
        }, RESULT_DISPLAY_TIME);
      }, REVEAL_DURATION);
    }, COUNTDOWN_DURATION);
  }, [setPhase, clearAllTimeouts, addTimeout]);

  // Reset stats and start fresh
  const resetGame = useCallback(() => {
    clearAllTimeouts();
    setGameState((prev) => resetAllStats(prev));
  }, [clearAllTimeouts]);

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
