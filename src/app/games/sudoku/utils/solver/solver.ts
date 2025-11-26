/**
 * Core Sudoku solving algorithms using bitmasks and MRV heuristic
 * Provides fast solving with constraint propagation
 */

import { Grid } from "../../types";
import {
  ConstraintState,
  initializeConstraints,
  placeNumber,
  removeNumber,
} from "./constraints";
import { findMRVCell, getCandidates } from "./heuristics";

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
  const gridCopy = grid.map((row) => [...row]);
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
  const gridCopy = grid.map((row) => [...row]);
  const constraints = initializeConstraints(gridCopy);
  return countSolutionsFast(gridCopy, constraints, 2) === 1;
}
