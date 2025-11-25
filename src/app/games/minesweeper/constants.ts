import { Difficulty } from './types';

export const DIFFICULTY_CONFIG = {
  Beginner: { width: 9, height: 9, mines: 10 },
  Intermediate: { width: 16, height: 16, mines: 40 },
  Expert: { width: 30, height: 16, mines: 99 },
} as const;

export const CUSTOM_CONSTRAINTS = {
  minWidth: 5,
  maxWidth: 50,
  minHeight: 5,
  maxHeight: 50,
  maxMinePercentage: 0.99, // Up to 99% mines (at least 1 safe cell required)
} as const;

export const BEST_TIMES_KEY = 'minesweeper-best-times';

export const LONG_PRESS_DURATION = 500; // milliseconds

export const NUMBER_COLORS = {
  1: 'text-blue-600 dark:text-blue-400',
  2: 'text-green-600 dark:text-green-400',
  3: 'text-red-600 dark:text-red-400',
  4: 'text-purple-600 dark:text-purple-400',
  5: 'text-yellow-700 dark:text-yellow-500',
  6: 'text-cyan-600 dark:text-cyan-400',
  7: 'text-gray-900 dark:text-gray-100',
  8: 'text-gray-600 dark:text-gray-400',
} as const;

export const EMOJI_STATES = {
  playing: '🙂',
  won: '😎',
  lost: '😵',
} as const;

export const DEFAULT_DIFFICULTY: Difficulty = 'Beginner';
