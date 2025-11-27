// Core game types for 2048

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

// Re-export Direction type from shared utilities
export type { Direction } from "@/lib/games/hooks/useKeyboardInput";
