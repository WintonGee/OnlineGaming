// Game configuration constants for Sliding Puzzle

import { Difficulty, GridSize, GameState } from "./types";

// Grid sizes for each difficulty
export const DIFFICULTY_GRID_SIZE: Record<Difficulty, GridSize> = {
  easy: 3,    // 3x3 = 8 tiles + 1 empty
  medium: 4,  // 4x4 = 15 tiles + 1 empty (classic 15-puzzle)
  hard: 5,    // 5x5 = 24 tiles + 1 empty
};

// Difficulty labels for UI
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy (3×3)",
  medium: "Medium (4×4)",
  hard: "Hard (5×5)",
};

// Animation durations in milliseconds
export const TILE_MOVE_DURATION = 150;

// Local storage keys
export const GAME_STATE_KEY = "sliding-puzzle-game-state";
export const BEST_RECORDS_KEY = "sliding-puzzle-best-records";

// Swipe gesture thresholds
export const SWIPE_THRESHOLD = 30; // minimum distance in pixels
export const SWIPE_VELOCITY_THRESHOLD = 0.2; // minimum velocity

// Create initial solved state for a given grid size
export function createSolvedState(gridSize: GridSize): number[] {
  const totalTiles = gridSize * gridSize;
  const tiles: number[] = [];

  // Create array [1, 2, 3, ..., n-1, 0]
  for (let i = 1; i < totalTiles; i++) {
    tiles.push(i);
  }
  tiles.push(0); // Empty tile at the end

  return tiles;
}

// Create initial game state
export function createInitialGameState(difficulty: Difficulty = "medium"): GameState {
  const gridSize = DIFFICULTY_GRID_SIZE[difficulty];

  return {
    tiles: createSolvedState(gridSize),
    gridSize,
    moves: 0,
    time: 0,
    gameStarted: false,
    won: false,
    difficulty,
  };
}
