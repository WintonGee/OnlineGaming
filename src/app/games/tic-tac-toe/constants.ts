import { Board, Difficulty, GameMode, GameState, Player } from "./types";

// Game constants
export const BOARD_SIZE = 9;
export const GRID_SIZE = 3;

// Winning combinations (indices on a 3x3 grid)
export const WINNING_LINES = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
];

// Initial empty board
export const EMPTY_BOARD: Board = Array(BOARD_SIZE).fill(null);

// Difficulty labels for display
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

// Initial game state factory
export function createInitialState(
  difficulty: Difficulty = "medium",
  mode: GameMode = "singleplayer",
  playerSymbol: Player = "X"
): GameState {
  return {
    board: [...EMPTY_BOARD],
    currentPlayer: "X",
    status: "playing",
    winner: null,
    winningLine: null,
    difficulty,
    mode,
    playerSymbol,
  };
}
