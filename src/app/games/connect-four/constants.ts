import { Board, Difficulty, GameMode, GameState, Player } from "./types";
import { DIFFICULTY_LABELS } from "@/lib/constants/difficulty";

// Board dimensions (standard Connect Four is 7 columns x 6 rows)
export const COLS = 7;
export const ROWS = 6;

// Number in a row needed to win
export const WIN_LENGTH = 4;

// Re-export shared constants
export { DIFFICULTY_LABELS };

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
