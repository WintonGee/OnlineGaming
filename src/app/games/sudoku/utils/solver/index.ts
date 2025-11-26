/**
 * Optimized Sudoku solver using bitmask constraints and MRV heuristic
 *
 * Key optimizations:
 * 1. Bitmask constraints - O(1) validity checking instead of O(27)
 * 2. MRV (Minimum Remaining Values) heuristic - solve cells with fewest candidates first
 * 3. Constraint propagation - eliminate candidates when placing numbers
 *
 * Performance improvement: ~10-100x faster than naive backtracking
 */

// Re-export all solver components
export type { ConstraintState } from "./constraints";

export {
  initializeConstraints,
  isValidPlacementFast,
  placeNumber,
  removeNumber,
  getBoxIndex,
} from "./constraints";

export { getCandidates, countCandidates, findMRVCell } from "./heuristics";

export {
  solveFast,
  countSolutionsFast,
  solvePuzzleFast,
  hasUniqueSolution,
} from "./solver";
