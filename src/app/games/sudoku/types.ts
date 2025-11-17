// Type definitions for Sudoku game

export type CellValue = number | null;
export type Grid = CellValue[][];
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type InputMode = 'Normal' | 'Candidate';

// Candidates are stored as a Set of numbers for each cell
export type CandidatesGrid = Set<number>[][];

export interface CellPosition {
  row: number;
  col: number;
}

export interface SudokuGameState {
  initialGrid: Grid;
  currentGrid: Grid;
  solution: Grid;
  selectedCell: CellPosition | null;
  difficulty: Difficulty;
  inputMode: InputMode;
  candidates: CandidatesGrid;
}

export interface CheckResult {
  isComplete: boolean;
  isCorrect: boolean;
  incorrectCells: CellPosition[];
}

// Constants for Sudoku game
export const SUDOKU_GRID_SIZE = 9;
export const SUDOKU_BOX_SIZE = 3;
export const SUDOKU_TOTAL_CELLS = 81;
export const SUDOKU_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

// Difficulty configuration
export const DIFFICULTY_CONFIG = {
  Easy: { cellsToRemove: 35, description: '~39% filled' },
  Medium: { cellsToRemove: 45, description: '~50% filled' },
  Hard: { cellsToRemove: 55, description: '~61% filled' },
} as const;

// Game settings
export const MAX_HISTORY_SIZE = 50;
export const UI_UPDATE_DELAY_MS = 100;
