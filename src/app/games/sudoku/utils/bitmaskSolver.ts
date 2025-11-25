/**
 * Optimized Sudoku solver using bitmask constraints and MRV heuristic
 * 
 * Key optimizations:
 * 1. Bitmask constraints - O(1) validity checking instead of O(27)
 * 2. MRV (Minimum Remaining Values) heuristic - solve cells with fewest candidates first
 * 3. Constraint propagation - eliminate candidates when placing numbers
 */

import { Grid, CellPosition } from "../types";
import { GRID_SIZE, BOX_SIZE } from "../constants";

/**
 * Constraint state using bitmasks
 * Each bitmask tracks which numbers (1-9) are used in a row/col/box
 * Bit 0 = unused, Bits 1-9 represent numbers 1-9
 */
export interface ConstraintState {
  rowMask: number[];   // rowMask[r] has bit i set if number i is in row r
  colMask: number[];   // colMask[c] has bit i set if number i is in column c
  boxMask: number[];   // boxMask[b] has bit i set if number i is in box b
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
  const used = constraints.rowMask[row] | constraints.colMask[col] | constraints.boxMask[boxIdx];
  
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
  const used = constraints.rowMask[row] | constraints.colMask[col] | constraints.boxMask[boxIdx];
  // Count available slots (bits 1-9 that are NOT set)
  // 0x3FE = binary 1111111110 (bits 1-9)
  const available = (~used) & 0x3FE;
  // Count set bits (popcount)
  return popcount(available);
}

/**
 * Efficient bit count (popcount) using bit manipulation
 */
function popcount(n: number): number {
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  n = (n + (n >> 4)) & 0x0F0F0F0F;
  n = n + (n >> 8);
  n = n + (n >> 16);
  return n & 0x3F;
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

/**
 * Optimized Sudoku solver using bitmasks and MRV heuristic
 * Returns true if solved, false if unsolvable
 */
export function solveFast(grid: Grid, constraints: ConstraintState): boolean {
  const cell = findMRVCell(grid, constraints);
  
  // No empty cells - puzzle is solved
  if (cell === null) {
    return true;
  }

  const { row, col } = cell;
  const candidates = getCandidates(constraints, row, col);

  // No candidates - need to backtrack
  if (candidates.length === 0) {
    return false;
  }

  for (const num of candidates) {
    placeNumber(grid, constraints, row, col, num);
    
    if (solveFast(grid, constraints)) {
      return true;
    }
    
    removeNumber(grid, constraints, row, col, num);
  }

  return false;
}

/**
 * Count solutions up to a maximum (for unique solution checking)
 */
export function countSolutionsFast(
  grid: Grid,
  constraints: ConstraintState,
  maxCount: number = 2
): number {
  const cell = findMRVCell(grid, constraints);
  
  if (cell === null) {
    return 1; // Found a solution
  }

  const { row, col } = cell;
  const candidates = getCandidates(constraints, row, col);

  if (candidates.length === 0) {
    return 0;
  }

  let count = 0;
  for (const num of candidates) {
    placeNumber(grid, constraints, row, col, num);
    count += countSolutionsFast(grid, constraints, maxCount - count);
    removeNumber(grid, constraints, row, col, num);
    
    if (count >= maxCount) {
      break;
    }
  }

  return count;
}

/**
 * Solve a puzzle and return the solution (convenience wrapper)
 */
export function solvePuzzleFast(grid: Grid): Grid | null {
  const gridCopy = grid.map(row => [...row]);
  const constraints = initializeConstraints(gridCopy);
  
  if (solveFast(gridCopy, constraints)) {
    return gridCopy;
  }
  
  return null;
}

/**
 * Check if a puzzle has exactly one solution
 */
export function hasUniqueSolution(grid: Grid): boolean {
  const gridCopy = grid.map(row => [...row]);
  const constraints = initializeConstraints(gridCopy);
  return countSolutionsFast(gridCopy, constraints, 2) === 1;
}

