/**
 * Sudoku Game Constants
 * Centralized configuration for game rules and settings
 */

/** Standard Sudoku grid size (9x9) */
export const GRID_SIZE = 9;

/** Size of each box in the grid (3x3) */
export const BOX_SIZE = 3;

/** Total number of cells in a Sudoku grid */
export const TOTAL_CELLS = 81;

/** Valid numbers that can be placed in a Sudoku cell */
export const VALID_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

/** Difficulty configuration for puzzle generation */
export const DIFFICULTY_CONFIG = {
  Easy: {
    cellsToRemove: 35,
    percentFilled: 0.57,
  },
  Medium: {
    cellsToRemove: 45,
    percentFilled: 0.44,
  },
  Hard: {
    cellsToRemove: 55,
    percentFilled: 0.32,
  },
} as const;

/** Maximum number of moves to keep in history for undo functionality */
export const HISTORY_LIMIT = 50;

/** Toast notification duration in milliseconds */
export const TOAST_DURATION = 3500;

