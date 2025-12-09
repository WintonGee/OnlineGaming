import { Board, Difficulty, GameMode, GameState, Player } from "./types";

// Board dimensions (standard Connect Four is 7 columns x 6 rows)
export const COLS = 7;
export const ROWS = 6;

// Number in a row needed to win
export const WIN_LENGTH = 4;

// Difficulty labels for display
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

// Create empty board
export function createEmptyBoard(): Board {
  return Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null));
}

// Initial game state factory
export function createInitialState(
  difficulty: Difficulty = "medium",
  mode: GameMode = "singleplayer",
  playerNumber: Player = 1
): GameState {
  return {
    board: createEmptyBoard(),
    currentPlayer: 1,
    status: "playing",
    winner: null,
    winningLine: null,
    lastMove: null,
    difficulty,
    mode,
    playerNumber,
  };
}
