import { Grid, Difficulty, CheckResult, CellPosition } from "../types";
import { shuffleArray } from "../utils/arrayUtils";
import {
  GRID_SIZE,
  BOX_SIZE,
  DIFFICULTY_CONFIG,
  VALID_NUMBERS,
} from "../constants";
import {
  initializeConstraints,
  solveFast,
  countSolutionsFast,
} from "../utils/bitmaskSolver";

/**
 * Create an empty 9x9 grid
 */
export function createEmptyGrid(): Grid {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));
}

/**
 * Deep copy a grid
 */
export function copyGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

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
function countSolutions(grid: Grid, maxCount: number = 2): number {
  const gridCopy = copyGrid(grid);
  const constraints = initializeConstraints(gridCopy);
  return countSolutionsFast(gridCopy, constraints, maxCount);
}

/**
 * Generate a complete, valid Sudoku grid
 * Uses optimized bitmask constraints for faster generation
 */
function generateCompleteGrid(): Grid {
  const grid = createEmptyGrid();
  const constraints = initializeConstraints(grid);

  // Fill diagonal 3x3 boxes first (they don't affect each other)
  function fillDiagonalBoxes() {
    for (let box = 0; box < GRID_SIZE; box += BOX_SIZE) {
      const nums = [...VALID_NUMBERS];
      shuffleArray(nums);

      let idx = 0;
      for (let i = 0; i < BOX_SIZE; i++) {
        for (let j = 0; j < BOX_SIZE; j++) {
          const num = nums[idx++];
          const row = box + i;
          const col = box + j;
          grid[row][col] = num;
          // Update constraints
          const bit = 1 << num;
          constraints.rowMask[row] |= bit;
          constraints.colMask[col] |= bit;
          const boxIdx =
            Math.floor(row / BOX_SIZE) * BOX_SIZE + Math.floor(col / BOX_SIZE);
          constraints.boxMask[boxIdx] |= bit;
        }
      }
    }
  }

  fillDiagonalBoxes();

  // Fill remaining cells using optimized validity checking
  function fillRemaining(row: number, col: number): boolean {
    if (col >= GRID_SIZE && row < GRID_SIZE - 1) {
      row++;
      col = 0;
    }
    if (row >= GRID_SIZE && col >= GRID_SIZE) {
      return true;
    }

    // Skip cells in diagonal boxes that are already filled
    if (row < BOX_SIZE) {
      if (col < BOX_SIZE) col = BOX_SIZE;
    } else if (row < BOX_SIZE * 2) {
      if (col === Math.floor(row / BOX_SIZE) * BOX_SIZE) col += BOX_SIZE;
    } else {
      if (col === BOX_SIZE * 2) {
        row++;
        col = 0;
        if (row >= GRID_SIZE) return true;
      }
    }

    if (grid[row][col] !== null) {
      return fillRemaining(row, col + 1);
    }

    const nums = [...VALID_NUMBERS];
    shuffleArray(nums);

    const boxIdx =
      Math.floor(row / BOX_SIZE) * BOX_SIZE + Math.floor(col / BOX_SIZE);

    for (const num of nums) {
      // Use O(1) bitmask check instead of O(27) isValidPlacement
      const bit = 1 << num;
      if (
        (constraints.rowMask[row] & bit) === 0 &&
        (constraints.colMask[col] & bit) === 0 &&
        (constraints.boxMask[boxIdx] & bit) === 0
      ) {
        // Place number
        grid[row][col] = num;
        constraints.rowMask[row] |= bit;
        constraints.colMask[col] |= bit;
        constraints.boxMask[boxIdx] |= bit;

        if (fillRemaining(row, col + 1)) {
          return true;
        }

        // Remove number (backtrack)
        grid[row][col] = null;
        constraints.rowMask[row] &= ~bit;
        constraints.colMask[col] &= ~bit;
        constraints.boxMask[boxIdx] &= ~bit;
      }
    }

    return false;
  }

  fillRemaining(0, BOX_SIZE);
  return grid;
}

/**
 * Remove cells from a complete grid to create a puzzle
 */
function removeCells(grid: Grid, cellsToRemove: number): Grid {
  const puzzle = copyGrid(grid);
  let removed = 0;
  const attempts = cellsToRemove * 3; // Max attempts to avoid infinite loop

  for (let i = 0; i < attempts && removed < cellsToRemove; i++) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);

    if (puzzle[row][col] !== null) {
      const backup = puzzle[row][col];
      puzzle[row][col] = null;

      // Check if puzzle still has unique solution
      const solutionCount = countSolutions(puzzle);

      if (solutionCount === 1) {
        removed++;
      } else {
        // Restore the cell if puzzle doesn't have unique solution
        puzzle[row][col] = backup;
      }
    }
  }

  return puzzle;
}

/**
 * Generate a Sudoku puzzle based on difficulty
 */
export function generatePuzzle(difficulty: Difficulty): {
  puzzle: Grid;
  solution: Grid;
} {
  const completeGrid = generateCompleteGrid();
  const solution = copyGrid(completeGrid);

  const cellsToRemove = DIFFICULTY_CONFIG[difficulty].cellsToRemove;
  const puzzle = removeCells(completeGrid, cellsToRemove);

  return { puzzle, solution };
}

/**
 * Check if the user's solution is correct
 */
export function checkSolution(userGrid: Grid, solution: Grid): CheckResult {
  const incorrectCells: CellPosition[] = [];
  let filledCells = 0;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (userGrid[row][col] !== null) {
        filledCells++;
        if (userGrid[row][col] !== solution[row][col]) {
          incorrectCells.push({ row, col });
        }
      }
    }
  }

  const isComplete = filledCells === GRID_SIZE * GRID_SIZE;
  const isCorrect = incorrectCells.length === 0 && isComplete;

  return { isComplete, isCorrect, incorrectCells };
}
