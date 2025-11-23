import { Grid, CellPosition } from "../types";
import { BOX_SIZE } from "../constants";

/**
 * Box indices for a given cell position
 */
export interface BoxIndices {
  /** The row index of the top-left cell of the box */
  boxStartRow: number;
  /** The column index of the top-left cell of the box */
  boxStartCol: number;
  /** The box row index (0-2) */
  boxRow: number;
  /** The box column index (0-2) */
  boxCol: number;
}

/**
 * Get the box indices for a given cell position
 * 
 * @param row - The row index (0-8)
 * @param col - The column index (0-8)
 * @returns Object containing box indices
 */
export function getBoxIndices(row: number, col: number): BoxIndices {
  const boxRow = Math.floor(row / BOX_SIZE);
  const boxCol = Math.floor(col / BOX_SIZE);
  const boxStartRow = boxRow * BOX_SIZE;
  const boxStartCol = boxCol * BOX_SIZE;

  return {
    boxStartRow,
    boxStartCol,
    boxRow,
    boxCol,
  };
}

/**
 * Check if a cell is part of the initial puzzle (not user-filled)
 * 
 * @param initialGrid - The initial puzzle grid
 * @param row - The row index (0-8)
 * @param col - The column index (0-8)
 * @returns true if the cell is part of the initial puzzle
 */
export function isCellInitial(
  initialGrid: Grid,
  row: number,
  col: number
): boolean {
  return initialGrid[row]?.[col] !== null;
}

/**
 * Generate a unique key for a cell position (useful for React keys)
 * 
 * @param row - The row index (0-8)
 * @param col - The column index (0-8)
 * @returns A unique string key
 */
export function getCellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

/**
 * Deduplicate an array of cell positions
 * 
 * @param cells - Array of cell positions that may contain duplicates
 * @returns Array of unique cell positions
 */
export function dedupeCells(cells: CellPosition[]): CellPosition[] {
  const map = new Map<string, CellPosition>();
  cells.forEach((cell) => {
    const key = getCellKey(cell.row, cell.col);
    if (!map.has(key)) {
      map.set(key, cell);
    }
  });
  return Array.from(map.values());
}

/**
 * Get border classes for a Sudoku cell based on its position
 * 
 * @param rowIndex - The row index (0-8)
 * @param colIndex - The column index (0-8)
 * @returns Object with border class names
 */
export function getCellBorderClasses(
  rowIndex: number,
  colIndex: number
): {
  borderTop: string;
  borderLeft: string;
  borderRight: string;
  borderBottom: string;
} {
  return {
    borderTop: rowIndex % BOX_SIZE === 0 ? "border-t-[1.5px]" : "border-t",
    borderLeft: colIndex % BOX_SIZE === 0 ? "border-l-[1.5px]" : "border-l",
    borderRight: colIndex === 8 ? "border-r-[1.5px]" : "",
    borderBottom: rowIndex === 8 ? "border-b-[1.5px]" : "",
  };
}

