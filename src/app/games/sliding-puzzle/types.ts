// Core game types for Sliding Puzzle

export type GridSize = 3 | 4 | 5;

export type Difficulty = "easy" | "medium" | "hard";

export interface Position {
  row: number;
  col: number;
}

export interface Tile {
  value: number; // 0 represents the empty tile
  position: Position;
}

export interface GameState {
  tiles: number[]; // Flat array representing the grid (0 = empty)
  gridSize: GridSize;
  moves: number;
  time: number;
  gameStarted: boolean;
  won: boolean;
  difficulty: Difficulty;
}

export interface SavedGameState extends GameState {
  savedAt: number;
}

export interface BestRecord {
  moves: number;
  time: number;
}

export type BestRecords = Partial<Record<Difficulty, BestRecord>>;

// Re-export Direction type from shared hooks
export type { Direction } from "@/lib/hooks/useKeyboardInput";
