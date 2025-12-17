import { Difficulty as SharedDifficulty } from "@/lib/types/shared";

// Direction vectors for word placement
export type Direction = {
  dx: number;
  dy: number;
  name: string;
};

// A cell in the grid
export interface GridCell {
  letter: string;
  row: number;
  col: number;
  isPartOfWord: boolean;
  wordIndices: number[]; // Which words this cell belongs to
}

// A word placement in the grid
export interface PlacedWord {
  word: string;
  startRow: number;
  startCol: number;
  direction: Direction;
  found: boolean;
}

// Cell position
export interface CellPosition {
  row: number;
  col: number;
}

// Selection state for dragging
export interface SelectionState {
  isSelecting: boolean;
  startCell: CellPosition | null;
  currentCell: CellPosition | null;
  selectedCells: CellPosition[];
}

// Main game state
export interface GameState {
  grid: GridCell[][];
  words: PlacedWord[];
  foundWords: string[];
  category: string;
  difficulty: Difficulty;
  gameWon: boolean;
  startTime: number | null;
  endTime: number | null;
}

// Difficulty levels affect grid size and word directions
export type Difficulty = SharedDifficulty;

// Difficulty configuration
export interface DifficultyConfig {
  gridSize: number;
  wordCount: number;
  allowBackwards: boolean;
  allowDiagonal: boolean;
}

// Word category
export interface WordCategory {
  name: string;
  displayName: string;
  words: string[];
}

// Saved game state for persistence
export interface SavedGameState {
  grid: GridCell[][];
  words: PlacedWord[];
  foundWords: string[];
  category: string;
  difficulty: Difficulty;
  gameWon: boolean;
  startTime: number | null;
  endTime: number | null;
}
