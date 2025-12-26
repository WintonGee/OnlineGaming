/**
 * Constants for Reaction Timer game
 */

// Storage keys
export const BEST_TIME_KEY = "reaction-timer-best-time";

// Timing configuration
export const MIN_WAIT_TIME = 1000; // Minimum wait before green (1s)
export const MAX_WAIT_TIME = 5000; // Maximum wait before green (5s)

// UI configuration
export const RESULT_DISPLAY_DURATION = 2000; // How long to show result before allowing restart

// Performance thresholds (in ms) for feedback messages
export const THRESHOLDS = {
  EXCELLENT: 200,
  GOOD: 250,
  AVERAGE: 300,
  SLOW: 400,
} as const;

// Colors for different phases
export const PHASE_COLORS = {
  idle: "bg-blue-500 dark:bg-blue-600",
  waiting: "bg-red-500 dark:bg-red-600",
  ready: "bg-green-500 dark:bg-green-600",
  too_early: "bg-yellow-500 dark:bg-yellow-600",
  result: "bg-blue-500 dark:bg-blue-600",
} as const;

// Messages for different phases
export const PHASE_MESSAGES = {
  idle: "Click to Start",
  waiting: "Wait for Green...",
  ready: "Click Now!",
  too_early: "Too Early!",
  result: "Click to Try Again",
} as const;
