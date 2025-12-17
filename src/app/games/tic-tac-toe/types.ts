import { Difficulty as SharedDifficulty, GameMode as SharedGameMode, GameStatus as SharedGameStatus } from "@/lib/types/shared";

export type Player = "X" | "O";

export type Cell = Player | null;

export type Board = Cell[];

export type Difficulty = SharedDifficulty;

export type GameMode = SharedGameMode;

export type GameStatus = SharedGameStatus;

export interface WinningLine {
  indices: number[];
  winner: Player;
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winningLine: number[] | null;
  difficulty: Difficulty;
  mode: GameMode;
  playerSymbol: Player;
}
