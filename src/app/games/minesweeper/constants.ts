import { Difficulty } from './types';

export const DIFFICULTY_CONFIG = {
  Beginner: { width: 9, height: 9, mines: 10 },
  Intermediate: { width: 16, height: 16, mines: 40 },
  Expert: { width: 16, height: 30, mines: 99 },
} as const;

export const CUSTOM_CONSTRAINTS = {
  minWidth: 5,
  maxWidth: 50,
  minHeight: 5,
  maxHeight: 50,
  maxMinePercentage: 0.80, // Up to 80% mines (20% safe tiles minimum)
} as const;

export const BEST_TIMES_KEY = 'minesweeper-best-times';

export const LONG_PRESS_DURATION = 500; // milliseconds

// Classic Windows Minesweeper number colors
export const NUMBER_COLORS = {
  1: 'ms-num-1', // Blue (#0000ff)
  2: 'ms-num-2', // Green (#008000)
  3: 'ms-num-3', // Red (#ff0000)
  4: 'ms-num-4', // Navy (#000080)
  5: 'ms-num-5', // Maroon (#800000)
  6: 'ms-num-6', // Teal (#008080)
  7: 'ms-num-7', // Black (#000000)
  8: 'ms-num-8', // Gray (#808080)
} as const;

export const EMOJI_STATES = {
  playing: '🙂',
  won: '😎',
  lost: '😵',
} as const;

export const DEFAULT_DIFFICULTY: Difficulty = 'Beginner';
