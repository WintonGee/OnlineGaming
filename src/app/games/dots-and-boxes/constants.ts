import { BoardState, Difficulty, GameMode, GameState, GridSize } from "./types";
import { DIFFICULTY_LABELS } from "@/lib/constants/difficulty";

// Grid size options
export const GRID_SIZES: GridSize[] = [3, 4, 5, 6];

export const GRID_SIZE_LABELS: Record<GridSize, string> = {
  3: "3x3",
  4: "4x4",
  5: "5x5",
  6: "6x6",
};

// Difficulty labels for display
export { DIFFICULTY_LABELS };

// Player colors
export const PLAYER_COLORS = {
  1: {
    primary: "rgb(239, 68, 68)", // red-500
    light: "rgb(254, 202, 202)", // red-200
    dark: "rgb(185, 28, 28)", // red-700
    bg: "bg-red-500",
    bgLight: "bg-red-200 dark:bg-red-900/50",
    text: "text-red-600 dark:text-red-400",
  },
  2: {
    primary: "rgb(59, 130, 246)", // blue-500
    light: "rgb(191, 219, 254)", // blue-200
    dark: "rgb(29, 78, 216)", // blue-700
    bg: "bg-blue-500",
    bgLight: "bg-blue-200 dark:bg-blue-900/50",
    text: "text-blue-600 dark:text-blue-400",
  },
};

// Create an empty board state for a given grid size
export function createEmptyBoard(size: GridSize): BoardState {
  return {
    horizontalLines: Array(size + 1)
      .fill(null)
      .map(() => Array(size).fill(null)),
    verticalLines: Array(size)
      .fill(null)
      .map(() => Array(size + 1).fill(null)),
    boxes: Array(size)
      .fill(null)
      .map(() => Array(size).fill(null)),
  };
}

// Initial game state factory
export function createInitialState(
  gridSize: GridSize = 4,
  difficulty: Difficulty = "medium",
  mode: GameMode = "singleplayer"
): GameState {
  return {
    board: createEmptyBoard(gridSize),
    currentPlayer: 1,
    status: "playing",
    scores: { 1: 0, 2: 0 },
    gridSize,
    difficulty,
    mode,
    lastMove: null,
  };
}
