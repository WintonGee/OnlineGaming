export type Player = 1 | 2;

export type Cell = Player | null;

export type Board = Cell[][];

export type Difficulty = "easy" | "medium" | "hard";

export type GameMode = "singleplayer" | "multiplayer";

export type GameStatus = "playing" | "won" | "draw";

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
