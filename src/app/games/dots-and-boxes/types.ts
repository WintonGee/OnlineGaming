import { Difficulty as SharedDifficulty, GameMode as SharedGameMode } from "@/lib/types/shared";

export type Player = 1 | 2;

export type Difficulty = SharedDifficulty;

export type GameMode = SharedGameMode;

export type GameStatus = "playing" | "finished";

export type GridSize = 3 | 4 | 5 | 6;

// A line can be horizontal or vertical
export type LineType = "horizontal" | "vertical";

// Represents a single line on the board
export interface Line {
  row: number;
  col: number;
  type: LineType;
  owner: Player | null; // Which player drew this line
}

// Represents a box that can be claimed
export interface Box {
  row: number;
  col: number;
  owner: Player | null;
}

// The board state contains all lines and boxes
export interface BoardState {
  // For an NxN grid of boxes:
  // - Horizontal lines: (N+1) rows, N columns each
  // - Vertical lines: N rows, (N+1) columns each
  horizontalLines: (Player | null)[][];
  verticalLines: (Player | null)[][];
  boxes: (Player | null)[][];
}

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  status: GameStatus;
  scores: { 1: number; 2: number };
  gridSize: GridSize;
  difficulty: Difficulty;
  mode: GameMode;
  lastMove: { row: number; col: number; type: LineType } | null;
}
