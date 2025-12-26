/**
 * Pure game logic for Rock Paper Scissors
 * No React dependencies - just pure functions
 */

import { Choice, RoundResult, GameStats, GameState, RoundRecord } from "../types";
import { CHOICES, WINS_AGAINST, CONFETTI_MILESTONE } from "../constants";

/**
 * Create initial game state
 */
export function createInitialState(savedStats?: GameStats): GameState {
  return {
    phase: "idle",
    playerChoice: null,
    aiChoice: null,
    currentResult: null,
    stats: savedStats ?? createInitialStats(),
    history: [],
    showConfetti: false,
  };
}

/**
 * Create initial stats object
 */
export function createInitialStats(): GameStats {
  return {
    wins: 0,
    losses: 0,
    ties: 0,
    currentStreak: 0,
    bestStreak: 0,
  };
}

/**
 * Generate random AI choice
 */
export function generateAIChoice(): Choice {
  const randomIndex = Math.floor(Math.random() * CHOICES.length);
  return CHOICES[randomIndex];
}

/**
 * Determine the result of a round from player's perspective
 */
export function determineWinner(playerChoice: Choice, aiChoice: Choice): RoundResult {
  if (playerChoice === aiChoice) {
    return "tie";
  }

  if (WINS_AGAINST[playerChoice] === aiChoice) {
    return "win";
  }

  return "lose";
}

/**
 * Update stats based on round result
 */
export function updateStats(stats: GameStats, result: RoundResult): GameStats {
  const newStats = { ...stats };

  switch (result) {
    case "win":
      newStats.wins += 1;
      newStats.currentStreak += 1;
      if (newStats.currentStreak > newStats.bestStreak) {
        newStats.bestStreak = newStats.currentStreak;
      }
      break;
    case "lose":
      newStats.losses += 1;
      newStats.currentStreak = 0;
      break;
    case "tie":
      newStats.ties += 1;
      // Ties don't break the streak
      break;
  }

  return newStats;
}

/**
 * Check if confetti should be triggered
 * Triggers on every CONFETTI_MILESTONE wins in current streak
 */
export function shouldShowConfetti(currentStreak: number): boolean {
  return currentStreak > 0 && currentStreak % CONFETTI_MILESTONE === 0;
}

/**
 * Calculate win percentage
 */
export function calculateWinPercentage(stats: GameStats): number {
  const totalGames = stats.wins + stats.losses + stats.ties;
  if (totalGames === 0) return 0;

  // Win percentage excludes ties (standard RPS calculation)
  const decisiveGames = stats.wins + stats.losses;
  if (decisiveGames === 0) return 0;

  return Math.round((stats.wins / decisiveGames) * 100);
}

/**
 * Create a round record
 */
export function createRoundRecord(
  playerChoice: Choice,
  aiChoice: Choice,
  result: RoundResult
): RoundRecord {
  return {
    playerChoice,
    aiChoice,
    result,
    timestamp: Date.now(),
  };
}

/**
 * Process a complete round and return updated state
 */
export function processRound(
  state: GameState,
  playerChoice: Choice
): GameState {
  const aiChoice = generateAIChoice();
  const result = determineWinner(playerChoice, aiChoice);
  const newStats = updateStats(state.stats, result);
  const roundRecord = createRoundRecord(playerChoice, aiChoice, result);

  return {
    ...state,
    playerChoice,
    aiChoice,
    currentResult: result,
    stats: newStats,
    history: [roundRecord, ...state.history],
    showConfetti: shouldShowConfetti(newStats.currentStreak),
  };
}

/**
 * Reset state for new round while preserving stats and history
 */
export function resetForNewRound(state: GameState): GameState {
  return {
    ...state,
    phase: "idle",
    playerChoice: null,
    aiChoice: null,
    currentResult: null,
    showConfetti: false,
  };
}

/**
 * Reset all stats (for "New Game" functionality)
 */
export function resetAllStats(state: GameState): GameState {
  return {
    ...createInitialState(),
    stats: {
      ...createInitialStats(),
      bestStreak: state.stats.bestStreak, // Preserve all-time best
    },
  };
}
