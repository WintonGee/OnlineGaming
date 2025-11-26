/**
 * Heuristic functions for Sudoku solver
 * MRV (Minimum Remaining Values) and candidate finding
 */

import { Grid, CellPosition } from "../../types";
import { GRID_SIZE } from "../../constants";
import { ConstraintState, getBoxIndex } from "./constraints";

/**
 * Efficient bit count (popcount) using bit manipulation
 */
function popcount(n: number): number {
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  n = (n + (n >> 4)) & 0x0f0f0f0f;
  n = n + (n >> 8);
  n = n + (n >> 16);
  return n & 0x3f;
}

/**
 * Get available candidates for a cell using bitmasks - O(1) + O(9) to enumerate
 */
export function getCandidates(
  constraints: ConstraintState,
  row: number,
  col: number
): number[] {
  const boxIdx = getBoxIndex(row, col);
  // Combined used numbers from row, col, and box
  const used =
    constraints.rowMask[row] |
    constraints.colMask[col] |
    constraints.boxMask[boxIdx];

  const candidates: number[] = [];
  for (let num = 1; num <= GRID_SIZE; num++) {
    if ((used & (1 << num)) === 0) {
      candidates.push(num);
    }
  }
  return candidates;
}

/**
 * Count available candidates for a cell - O(1) using popcount
 */
export function countCandidates(
  constraints: ConstraintState,
  row: number,
  col: number
): number {
  const boxIdx = getBoxIndex(row, col);
  const used =
    constraints.rowMask[row] |
    constraints.colMask[col] |
    constraints.boxMask[boxIdx];
  // Count available slots (bits 1-9 that are NOT set)
  // 0x3FE = binary 1111111110 (bits 1-9)
  const available = ~used & 0x3fe;
  // Count set bits (popcount)
  return popcount(available);
}

/**
 * Find the empty cell with minimum remaining values (MRV heuristic)
 * This dramatically improves solver performance by reducing branching factor
 */
export function findMRVCell(
  grid: Grid,
  constraints: ConstraintState
): CellPosition | null {
  let minCount = GRID_SIZE + 1;
  let bestCell: CellPosition | null = null;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === null) {
        const count = countCandidates(constraints, row, col);

        // If a cell has 0 candidates, the puzzle is unsolvable from here
        if (count === 0) {
          return { row, col }; // Return immediately to trigger backtrack
        }

        if (count < minCount) {
          minCount = count;
          bestCell = { row, col };

          // If we find a cell with only 1 candidate, use it immediately
          if (count === 1) {
            return bestCell;
          }
        }
      }
    }
  }

  return bestCell;
}
