import { Grid, Difficulty, CheckResult, CellPosition } from '../types';
import { isValidPlacement } from '../utils/validation';
import { shuffleArray } from '../utils/arrayUtils';
import { GRID_SIZE, BOX_SIZE, DIFFICULTY_CONFIG, VALID_NUMBERS } from '../constants';

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
 * Internal solver that uses a callback pattern for flexibility
 * This eliminates duplication between solvePuzzle and countSolutions
 * 
 * @param grid - The grid to solve (will be modified)
 * @param onSolutionFound - Callback when a solution is found, return false to stop
 * @returns true if solving should continue, false if stopped
 */
function solveWithCallback(
  grid: Grid,
  onSolutionFound: () => boolean
): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= GRID_SIZE; num++) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;

            if (solveWithCallback(grid, onSolutionFound)) {
              return true;
            }

            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  // Found a complete solution
  return !onSolutionFound();
}

/**
 * Solve a Sudoku puzzle using backtracking
 */
export function solvePuzzle(grid: Grid): Grid | null {
  const gridCopy = copyGrid(grid);
  let solved = false;

  solveWithCallback(gridCopy, () => {
    solved = true;
    return false; // Stop after first solution
  });

  return solved ? gridCopy : null;
}

/**
 * Count the number of solutions for a given puzzle (max 2)
 */
function countSolutions(grid: Grid, maxCount: number = 2): number {
  const gridCopy = copyGrid(grid);
  let count = 0;

  solveWithCallback(gridCopy, () => {
    count++;
    return count < maxCount; // Continue until maxCount reached
  });

  return count;
}

/**
 * Generate a complete, valid Sudoku grid
 */
function generateCompleteGrid(): Grid {
  const grid = createEmptyGrid();

  // Fill diagonal 3x3 boxes first (they don't affect each other)
  function fillDiagonalBoxes() {
    for (let box = 0; box < GRID_SIZE; box += BOX_SIZE) {
      const nums = [...VALID_NUMBERS];
      shuffleArray(nums);

      let idx = 0;
      for (let i = 0; i < BOX_SIZE; i++) {
        for (let j = 0; j < BOX_SIZE; j++) {
          grid[box + i][box + j] = nums[idx++];
        }
      }
    }
  }

  fillDiagonalBoxes();

  // Fill remaining cells
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

    for (const num of nums) {
      if (isValidPlacement(grid, row, col, num)) {
        grid[row][col] = num;
        if (fillRemaining(row, col + 1)) {
          return true;
        }
        grid[row][col] = null;
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
export function generatePuzzle(difficulty: Difficulty): { puzzle: Grid; solution: Grid } {
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
