import { Grid } from "../types";
import { GRID_SIZE, BOX_SIZE } from "../constants";

/**
 * Check if a number can be placed at a given position according to Sudoku rules
 * 
 * @param grid - The current Sudoku grid
 * @param row - The row index (0-8)
 * @param col - The column index (0-8)
 * @param num - The number to validate (1-9)
 * @returns true if the placement is valid, false otherwise
 */
export function isValidPlacement(
  grid: Grid,
  row: number,
  col: number,
  num: number
): boolean {
  // Check row - ensure number doesn't already exist in the row
  for (let x = 0; x < GRID_SIZE; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column - ensure number doesn't already exist in the column
  for (let x = 0; x < GRID_SIZE; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 box - ensure number doesn't already exist in the box
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
}

