import { Difficulty as SharedDifficulty, GameMode as SharedGameMode, GameStatus as SharedGameStatus } from "@/lib/types/shared";

export type Player = 1 | 2;

export type Cell = Player | null;

export type Board = Cell[][];

export type Difficulty = SharedDifficulty;

export type GameMode = SharedGameMode;

export type GameStatus = SharedGameStatus;

export interface WinningLine {
  cells: [number, number][];
  winner: Player;
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winningLine: [number, number][] | null;
  lastMove: [number, number] | null;
  difficulty: Difficulty;
  mode: GameMode;
  playerNumber: Player;
}
