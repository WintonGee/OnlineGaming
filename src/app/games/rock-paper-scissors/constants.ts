/**
 * Constants for Rock Paper Scissors game
 */

import { Choice } from "./types";

// Storage keys
export const STATS_STORAGE_KEY = "rock-paper-scissors-stats";

// All possible choices
export const CHOICES: Choice[] = ["rock", "paper", "scissors"];

// Winning combinations: key beats value
export const WINS_AGAINST: Record<Choice, Choice> = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

// Animation timing (in milliseconds)
export const COUNTDOWN_DURATION = 1500; // Total shake animation time
export const REVEAL_DURATION = 800; // Clash animation time
export const RESULT_DISPLAY_TIME = 1500; // Time before returning to idle

// Confetti milestone - celebrate every N wins in a streak
export const CONFETTI_MILESTONE = 5;

// History display limit
export const HISTORY_DISPLAY_COUNT = 7;

// Choice display names
export const CHOICE_LABELS: Record<Choice, string> = {
  rock: "Rock",
  paper: "Paper",
  scissors: "Scissors",
};

// Choice emojis for history display
export const CHOICE_EMOJIS: Record<Choice, string> = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};
