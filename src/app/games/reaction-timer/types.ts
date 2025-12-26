/**
 * Type definitions for Reaction Timer game
 */

/**
 * Game phase states
 * - idle: Initial state, waiting to start
 * - waiting: Red/yellow - wait for green
 * - ready: Green - click now!
 * - too_early: Clicked before green
 * - result: Showing reaction time
 */
export type GamePhase = "idle" | "waiting" | "ready" | "too_early" | "result";

/**
 * Single attempt result
 */
export interface AttemptResult {
  time: number; // Reaction time in milliseconds
  timestamp: number; // When the attempt was made
}

/**
 * Main game state
 */
export interface GameState {
  phase: GamePhase;
  currentTime: number | null; // Current reaction time in ms
  attempts: AttemptResult[]; // History of attempts this session
  bestTime: number | null; // Best time ever (persisted)
  startTimestamp: number | null; // When "ready" phase started
}

/**
 * Statistics for display
 */
export interface GameStats {
  averageTime: number | null;
  bestSessionTime: number | null;
  attemptCount: number;
}

/**
 * Saved data for localStorage
 */
export interface SavedBestTime {
  time: number;
  date: string;
}
