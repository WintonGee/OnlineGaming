import { CellPosition, Grid } from "../types";
import { GRID_SIZE, BOX_SIZE } from "../constants";
import { getBoxIndices } from "./gridUtils";

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

/**
 * Find all cells that violate Sudoku rules (duplicates in row, column, or box)
 *
 * @param grid - The current Sudoku grid
 * @returns Array of cell positions that have rule violations
 */
export function computeIncorrectCells(grid: Grid): CellPosition[] {
  if (!grid.length) {
    return [];
  }

  const incorrect: CellPosition[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const current = grid[row]?.[col];

      if (current === null) {
        continue;
      }

      let hasViolation = false;

      // Check row for duplicates
      for (let c = 0; c < GRID_SIZE; c++) {
        if (c !== col && grid[row][c] === current) {
          hasViolation = true;
          break;
        }
      }

      // Check column for duplicates
      if (!hasViolation) {
        for (let r = 0; r < GRID_SIZE; r++) {
          if (r !== row && grid[r][col] === current) {
            hasViolation = true;
            break;
          }
        }
      }

      // Check 3x3 box for duplicates
      if (!hasViolation) {
        const { boxStartRow, boxStartCol } = getBoxIndices(row, col);
        for (let r = boxStartRow; r < boxStartRow + 3; r++) {
          for (let c = boxStartCol; c < boxStartCol + 3; c++) {
            if ((r !== row || c !== col) && grid[r][c] === current) {
              hasViolation = true;
              break;
            }
          }
          if (hasViolation) break;
        }
      }

      if (hasViolation) {
        incorrect.push({ row, col });
      }
    }
  }

  return incorrect;
}

