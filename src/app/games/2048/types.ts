// Core game types for 2048

export type CellValue = number | null;
export type Board = CellValue[][];

export interface CellPosition {
  row: number;
  col: number;
}

export interface Tile {
  id: string;
  value: number;
  position: CellPosition;
  previousPosition?: CellPosition;
  mergedFrom?: string[]; // IDs of tiles that merged to create this one
  isNew?: boolean;
}

export type Direction = "up" | "down" | "left" | "right";

export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
  keepPlaying: boolean;
}

export interface MoveResult {
  newBoard: Board;
  tiles: Tile[];
  score: number;
  moved: boolean;
  won: boolean;
}
