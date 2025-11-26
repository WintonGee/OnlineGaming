/**
 * Bitmask constraint management for Sudoku solver
 * Provides O(1) validity checking instead of O(27)
 */

import { Grid } from "../../types";
import { GRID_SIZE, BOX_SIZE } from "../../constants";

/**
 * Constraint state using bitmasks
 * Each bitmask tracks which numbers (1-9) are used in a row/col/box
 * Bit 0 = unused, Bits 1-9 represent numbers 1-9
 */
export interface ConstraintState {
  rowMask: number[]; // rowMask[r] has bit i set if number i is in row r
  colMask: number[]; // colMask[c] has bit i set if number i is in column c
  boxMask: number[]; // boxMask[b] has bit i set if number i is in box b
}

/**
 * Get box index (0-8) from row and column
 */
export function getBoxIndex(row: number, col: number): number {
  return Math.floor(row / BOX_SIZE) * BOX_SIZE + Math.floor(col / BOX_SIZE);
}

/**
 * Initialize constraint state from a grid
 */
export function initializeConstraints(grid: Grid): ConstraintState {
  const rowMask = new Array(GRID_SIZE).fill(0);
  const colMask = new Array(GRID_SIZE).fill(0);
  const boxMask = new Array(GRID_SIZE).fill(0);

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const val = grid[row][col];
      if (val !== null) {
        const bit = 1 << val;
        rowMask[row] |= bit;
        colMask[col] |= bit;
        boxMask[getBoxIndex(row, col)] |= bit;
      }
    }
  }

  return { rowMask, colMask, boxMask };
}

/**
 * Check if placing a number is valid using bitmasks - O(1)
 */
export function isValidPlacementFast(
  constraints: ConstraintState,
  row: number,
  col: number,
  num: number
): boolean {
  const bit = 1 << num;
  const boxIdx = getBoxIndex(row, col);

  return (
    (constraints.rowMask[row] & bit) === 0 &&
    (constraints.colMask[col] & bit) === 0 &&
    (constraints.boxMask[boxIdx] & bit) === 0
  );
}

/**
 * Place a number and update constraints
 */
export function placeNumber(
  grid: Grid,
  constraints: ConstraintState,
  row: number,
  col: number,
  num: number
): void {
  grid[row][col] = num;
  const bit = 1 << num;
  constraints.rowMask[row] |= bit;
  constraints.colMask[col] |= bit;
  constraints.boxMask[getBoxIndex(row, col)] |= bit;
}

/**
 * Remove a number and update constraints
 */
export function removeNumber(
  grid: Grid,
  constraints: ConstraintState,
  row: number,
  col: number,
  num: number
): void {
  grid[row][col] = null;
  const bit = 1 << num;
  constraints.rowMask[row] &= ~bit;
  constraints.colMask[col] &= ~bit;
  constraints.boxMask[getBoxIndex(row, col)] &= ~bit;
}
