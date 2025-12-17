import { Direction, Difficulty, DifficultyConfig, GameState } from "./types";
import { DIFFICULTY_LABELS } from "@/lib/constants/difficulty";

// Storage key for saved games
export const GAME_STATE_KEY = "word-search-game-state";

// All possible directions for word placement
export const ALL_DIRECTIONS: Direction[] = [
  { dx: 1, dy: 0, name: "right" },
  { dx: -1, dy: 0, name: "left" },
  { dx: 0, dy: 1, name: "down" },
  { dx: 0, dy: -1, name: "up" },
  { dx: 1, dy: 1, name: "down-right" },
  { dx: -1, dy: -1, name: "up-left" },
  { dx: 1, dy: -1, name: "up-right" },
  { dx: -1, dy: 1, name: "down-left" },
];

// Forward-only directions (easier)
export const FORWARD_DIRECTIONS: Direction[] = [
  { dx: 1, dy: 0, name: "right" },
  { dx: 0, dy: 1, name: "down" },
];

// Forward + diagonal (medium)
export const FORWARD_DIAGONAL_DIRECTIONS: Direction[] = [
  { dx: 1, dy: 0, name: "right" },
  { dx: 0, dy: 1, name: "down" },
  { dx: 1, dy: 1, name: "down-right" },
];

// Difficulty configurations
export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    gridSize: 10,
    wordCount: 6,
    allowBackwards: false,
    allowDiagonal: false,
  },
  medium: {
    gridSize: 12,
    wordCount: 8,
    allowBackwards: false,
    allowDiagonal: true,
  },
  hard: {
    gridSize: 14,
    wordCount: 10,
    allowBackwards: true,
    allowDiagonal: true,
  },
};

// Re-export shared difficulty labels
export { DIFFICULTY_LABELS };

// Get directions based on difficulty
export function getDirectionsForDifficulty(difficulty: Difficulty): Direction[] {
  const config = DIFFICULTY_CONFIG[difficulty];

  if (config.allowBackwards && config.allowDiagonal) {
    return ALL_DIRECTIONS;
  }
  if (config.allowDiagonal) {
    return FORWARD_DIAGONAL_DIRECTIONS;
  }
  return FORWARD_DIRECTIONS;
}

// Create initial empty game state
export function createInitialGameState(): GameState {
  return {
    grid: [],
    words: [],
    foundWords: [],
    category: "animals",
    difficulty: "medium",
    gameWon: false,
    startTime: null,
    endTime: null,
  };
}

// Alphabet for filling empty cells
export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
