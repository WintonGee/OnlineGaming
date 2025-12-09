import { Difficulty, DifficultyConfig } from "./types";

// Difficulty configurations
export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  Easy: { gridSize: 10, speed: 200, label: "Easy" },
  Medium: { gridSize: 15, speed: 150, label: "Medium" },
  Hard: { gridSize: 20, speed: 100, label: "Hard" },
} as const;

// Default difficulty
export const DEFAULT_DIFFICULTY: Difficulty = "Medium";

// Local storage keys
export const HIGH_SCORES_KEY = "snake-high-scores";
export const GAME_STATE_KEY = "snake-game-state";

// Initial snake length
export const INITIAL_SNAKE_LENGTH = 3;

// Directions mapping for opposite direction check
export const OPPOSITE_DIRECTIONS: Record<string, string> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
} as const;

// Direction to delta mapping
export const DIRECTION_DELTAS: Record<string, { row: number; col: number }> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
} as const;

// Cell types for styling
export const CELL_TYPES = {
  EMPTY: "empty",
  SNAKE_HEAD: "snake-head",
  SNAKE_BODY: "snake-body",
  FOOD: "food",
} as const;
