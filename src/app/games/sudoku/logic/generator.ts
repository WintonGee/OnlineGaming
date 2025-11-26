/**
 * Sudoku puzzle generation
 * Creates complete grids and removes cells to create puzzles
 */

import { Grid, Difficulty } from "../types";
import { GRID_SIZE, BOX_SIZE, DIFFICULTY_CONFIG, VALID_NUMBERS } from "../constants";
import { shuffleArray } from "../utils/arrayUtils";
import { initializeConstraints } from "../utils/solver";
import { copyGrid, createEmptyGrid } from "./grid";
import { countSolutions } from "./solver";

/**
 * Generate a complete, valid Sudoku grid
 * Uses optimized bitmask constraints for faster generation
 */
export function generateCompleteGrid(): Grid {
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
