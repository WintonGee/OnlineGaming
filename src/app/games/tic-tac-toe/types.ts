export type Player = "X" | "O";

export type Cell = Player | null;

export type Board = Cell[];

export type Difficulty = "easy" | "medium" | "hard";

export type GameMode = "singleplayer" | "multiplayer";

export type GameStatus = "playing" | "won" | "draw";

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
