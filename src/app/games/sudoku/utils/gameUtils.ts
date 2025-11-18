import { CandidatesGrid, CellPosition, Grid } from "../types";

export function createEmptyCandidatesGrid(): CandidatesGrid {
  return Array(9)
    .fill(null)
    .map(() =>
      Array(9)
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

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const current = grid[row]?.[col];

      if (current === null) {
        continue;
      }

      let hasViolation = false;

      for (let c = 0; c < 9; c++) {
        if (c !== col && grid[row][c] === current) {
          hasViolation = true;
          break;
        }
      }

      if (!hasViolation) {
        for (let r = 0; r < 9; r++) {
          if (r !== row && grid[r][col] === current) {
            hasViolation = true;
            break;
          }
        }
      }

      if (!hasViolation) {
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
          for (let c = boxCol; c < boxCol + 3; c++) {
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

  for (let num = 1; num <= 9; num++) {
    let isValid = true;

    for (let c = 0; c < 9; c++) {
      if (grid[row][c] === num) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      for (let r = 0; r < 9; r++) {
        if (grid[r][col] === num) {
          isValid = false;
          break;
        }
      }
    }

    if (isValid) {
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if (grid[r][c] === num) {
            isValid = false;
            break;
          }
        }
        if (!isValid) break;
      }
    }

    if (isValid) {
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

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null && initialGrid[row][col] === null) {
        newCandidates[row][col] = calculateValidCandidates(row, col, grid);
      }
    }
  }

  return newCandidates;
}

