import { CandidatesGrid, Grid } from "../types";
import { isValidPlacement } from "./validation";
import { GRID_SIZE, VALID_NUMBERS } from "../constants";

/**
 * Create an empty 9x9 grid of candidate sets
 */
export function createEmptyCandidatesGrid(): CandidatesGrid {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE)
        .fill(null)
        .map(() => new Set<number>())
    );
}

/**
 * Deep clone a candidates grid
 */
export function cloneCandidatesGrid(grid: CandidatesGrid): CandidatesGrid {
  return grid.map((row) => row.map((cell) => new Set(cell)));
}

/**
 * Calculate all valid candidate numbers for a specific cell
 */
export function calculateValidCandidates(
  row: number,
  col: number,
  grid: Grid
): Set<number> {
  const validCandidates = new Set<number>();

  if (grid[row][col] !== null) {
    return validCandidates;
  }

  for (const num of VALID_NUMBERS) {
    if (isValidPlacement(grid, row, col, num)) {
      validCandidates.add(num);
    }
  }

  return validCandidates;
}

/**
 * Generate candidates for all empty cells automatically
 */
export function generateAutoCandidates(
  grid: Grid,
  initialGrid: Grid
): CandidatesGrid {
  const newCandidates = createEmptyCandidatesGrid();

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === null && initialGrid[row][col] === null) {
        newCandidates[row][col] = calculateValidCandidates(row, col, grid);
      }
    }
  }

  return newCandidates;
}
