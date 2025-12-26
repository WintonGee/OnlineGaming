/**
 * Type definitions for Rock Paper Scissors game
 */

/**
 * The three possible choices
 */
export type Choice = "rock" | "paper" | "scissors";

/**
 * Result of a round from player's perspective
 */
export type RoundResult = "win" | "lose" | "tie";

/**
 * Game phase states
 * - idle: Waiting for player to make a choice
 * - countdown: Shaking hands animation countdown
 * - reveal: Showing both choices with clash animation
 * - result: Displaying the round result
 */
export type GamePhase = "idle" | "countdown" | "reveal" | "result";

/**
 * Single round record
 */
export interface RoundRecord {
  playerChoice: Choice;
  aiChoice: Choice;
  result: RoundResult;
  timestamp: number;
}

/**
 * Cumulative game statistics
 */
export interface GameStats {
  wins: number;
  losses: number;
  ties: number;
  currentStreak: number;
  bestStreak: number;
}

/**
 * Main game state
 */
export interface GameState {
  phase: GamePhase;
  playerChoice: Choice | null;
  aiChoice: Choice | null;
  currentResult: RoundResult | null;
  stats: GameStats;
  history: RoundRecord[];
  showConfetti: boolean;
}

/**
 * Saved data for localStorage
 */
export interface SavedStats {
  stats: GameStats;
  lastPlayed: string;
}
