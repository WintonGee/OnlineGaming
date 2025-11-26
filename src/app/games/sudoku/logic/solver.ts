/**
 * Solver wrapper functions
 * High-level API for solving Sudoku puzzles
 */

import { Grid } from "../types";
import {
  initializeConstraints,
  solveFast,
  countSolutionsFast,
} from "../utils/solver";
import { copyGrid } from "./grid";

/**
 * Solve a Sudoku puzzle using optimized backtracking with:
 * - Bitmask constraints for O(1) validity checking
 * - MRV (Minimum Remaining Values) heuristic for cell selection
 *
 * Performance improvement: ~10-100x faster than naive backtracking
 */
export function solvePuzzle(grid: Grid): Grid | null {
  const gridCopy = copyGrid(grid);
  const constraints = initializeConstraints(gridCopy);

  if (solveFast(gridCopy, constraints)) {
    return gridCopy;
  }

  return null;
}

/**
 * Count the number of solutions for a given puzzle (max 2)
 * Uses optimized solver with bitmasks and MRV heuristic
 */
export function countSolutions(grid: Grid, maxCount: number = 2): number {
  const gridCopy = copyGrid(grid);
  const constraints = initializeConstraints(gridCopy);
  return countSolutionsFast(gridCopy, constraints, maxCount);
}
