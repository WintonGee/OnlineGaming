import { CandidatesGrid, CellPosition, Grid } from "../types";
import { isValidPlacement } from "./validation";
import { getBoxIndices } from "./gridUtils";
import { GRID_SIZE, VALID_NUMBERS } from "../constants";

export function createEmptyCandidatesGrid(): CandidatesGrid {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE)
        .fill(null)
        .map(() => new Set<number>())
    );
}

export function cloneCandidatesGrid(grid: CandidatesGrid): CandidatesGrid {
  return grid.map((row) => row.map((cell) => new Set(cell)));
}

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
