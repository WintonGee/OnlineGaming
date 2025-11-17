// Type definitions for Sudoku game

export type CellValue = number | null;
export type Grid = CellValue[][];
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

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
}

export interface CheckResult {
  isComplete: boolean;
  isCorrect: boolean;
  incorrectCells: CellPosition[];
}
