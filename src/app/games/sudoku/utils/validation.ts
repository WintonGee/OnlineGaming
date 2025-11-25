import { CellPosition, Grid } from "../types";
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

/**
 * Find all cells that violate Sudoku rules (duplicates in row, column, or box)
 * 
 * OPTIMIZED: Single-pass algorithm using Maps to track positions per value
 * Previous: O(81 × 27) = O(2187) - checked 27 cells for each of 81 cells
 * Current: O(81 × 3) = O(243) - single pass to collect, then mark duplicates
 *
 * @param grid - The current Sudoku grid
 * @returns Array of cell positions that have rule violations
 */
export function computeIncorrectCells(grid: Grid): CellPosition[] {
  if (!grid.length) {
    return [];
  }

  // Track positions for each value in each row, column, and box
  // Using number arrays is faster than Map for small fixed ranges
  const rowPositions: number[][][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: 10 }, () => [])
  );
  const colPositions: number[][][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: 10 }, () => [])
  );
  const boxPositions: number[][][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: 10 }, () => [])
  );

  // Single pass: collect all positions by value for each unit
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const val = grid[row]?.[col];
      if (val === null || val < 1 || val > 9) continue;

      const boxIdx = Math.floor(row / BOX_SIZE) * BOX_SIZE + Math.floor(col / BOX_SIZE);
      const cellIdx = row * GRID_SIZE + col; // Encode position as single number

      rowPositions[row][val].push(cellIdx);
      colPositions[col][val].push(cellIdx);
      boxPositions[boxIdx][val].push(cellIdx);
    }
  }

  // Use a Set for O(1) deduplication of incorrect cells
  const incorrectSet = new Set<number>();

  // Mark all cells that appear in duplicate groups
  const markDuplicates = (positions: number[][][]) => {
    for (let unit = 0; unit < GRID_SIZE; unit++) {
      for (let val = 1; val <= 9; val++) {
        const cells = positions[unit][val];
        if (cells.length > 1) {
          // All cells with this value in this unit are violations
          for (const cellIdx of cells) {
            incorrectSet.add(cellIdx);
          }
        }
      }
    }
  };

  markDuplicates(rowPositions);
  markDuplicates(colPositions);
  markDuplicates(boxPositions);

  // Convert back to CellPosition array
  return Array.from(incorrectSet).map(cellIdx => ({
    row: Math.floor(cellIdx / GRID_SIZE),
    col: cellIdx % GRID_SIZE,
  }));
}

