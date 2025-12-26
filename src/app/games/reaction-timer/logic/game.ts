/**
 * Pure game logic functions for Reaction Timer
 * No React dependencies - just pure functions
 */

import { GameState, AttemptResult, GameStats } from "../types";
import { MIN_WAIT_TIME, MAX_WAIT_TIME, THRESHOLDS } from "../constants";

/**
 * Create initial game state
 */
export function createInitialState(bestTime: number | null = null): GameState {
  return {
    phase: "idle",
    currentTime: null,
    attempts: [],
    bestTime,
    startTimestamp: null,
  };
}

/**
 * Generate a random wait time between min and max
 */
export function generateRandomWaitTime(): number {
  return Math.floor(Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME + 1)) + MIN_WAIT_TIME;
}

/**
 * Calculate reaction time from start timestamp
 */
export function calculateReactionTime(startTimestamp: number): number {
  return Math.round(performance.now() - startTimestamp);
}

/**
 * Get performance feedback message based on reaction time
 */
export function getPerformanceFeedback(time: number): string {
  if (time < THRESHOLDS.EXCELLENT) {
    return "Excellent!";
  } else if (time < THRESHOLDS.GOOD) {
    return "Great!";
  } else if (time < THRESHOLDS.AVERAGE) {
    return "Good";
  } else if (time < THRESHOLDS.SLOW) {
    return "Average";
  } else {
    return "Keep practicing!";
  }
}

/**
 * Calculate statistics from attempts
 */
export function calculateStats(attempts: AttemptResult[]): GameStats {
  if (attempts.length === 0) {
    return {
      averageTime: null,
      bestSessionTime: null,
      attemptCount: 0,
    };
  }

  const times = attempts.map((a) => a.time);
  const averageTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  const bestSessionTime = Math.min(...times);

  return {
    averageTime,
    bestSessionTime,
    attemptCount: attempts.length,
  };
}

/**
 * Check if a new time is a personal best
 */
export function isNewBestTime(time: number, bestTime: number | null): boolean {
  return bestTime === null || time < bestTime;
}

/**
 * Create an attempt result
 */
export function createAttemptResult(time: number): AttemptResult {
  return {
    time,
    timestamp: Date.now(),
  };
}
