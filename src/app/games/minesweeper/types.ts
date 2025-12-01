export type Difficulty = "Beginner" | "Intermediate" | "Expert" | "Custom";

export interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  isClickedMine?: boolean; // The mine that was clicked to end the game
}

export type Board = Cell[][];

export interface CellPosition {
  row: number;
  col: number;
}

export interface GameState {
  board: Board;
  gameOver: boolean;
  won: boolean;
  flagsUsed: number;
  totalMines: number;
  revealedCells: number;
  difficulty: Difficulty;
  customSettings?: CustomSettings;
}

export interface CustomSettings {
  width: number;
  height: number;
  mines: number;
}

export interface BestTimes {
  Beginner?: number;
  Intermediate?: number;
  Expert?: number;
  Custom?: number;
  [key: string]: number | undefined;
}

export type InputMode = "reveal" | "flag";
