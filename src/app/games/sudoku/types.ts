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

export interface HistoryState {
  grid: Grid;
  candidates: CandidatesGrid;
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

export type HelperActionStatus = "success" | "info" | "warning" | "error";

export interface HelperActionResult {
  status: HelperActionStatus;
  message: string;
}

export type ConfirmationType = "reveal" | "reset";
