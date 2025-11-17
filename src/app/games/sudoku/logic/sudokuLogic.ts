import { Grid, Difficulty, CheckResult, CellPosition } from '../types';

/**
 * Create an empty 9x9 grid
 */
export function createEmptyGrid(): Grid {
  return Array(9).fill(null).map(() => Array(9).fill(null));
}

/**
 * Check if a number can be placed at a given position
 */
function isValid(grid: Grid, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
}

/**
 * Solve a Sudoku puzzle using backtracking
 */
export function solvePuzzle(grid: Grid): Grid | null {
  const gridCopy = grid.map(row => [...row]);

  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (gridCopy[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(gridCopy, row, col, num)) {
              gridCopy[row][col] = num;

              if (solve()) {
                return true;
              }

              gridCopy[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  if (solve()) {
    return gridCopy;
  }
  return null;
}

/**
 * Generate a complete, valid Sudoku grid
 */
function generateCompleteGrid(): Grid {
  const grid = createEmptyGrid();

  // Fill diagonal 3x3 boxes first (they don't affect each other)
  function fillDiagonalBoxes() {
    for (let box = 0; box < 9; box += 3) {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      // Shuffle array
      for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
      }

      let idx = 0;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          grid[box + i][box + j] = nums[idx++];
        }
      }
    }
  }

  fillDiagonalBoxes();

  // Fill remaining cells
  function fillRemaining(row: number, col: number): boolean {
    if (col >= 9 && row < 8) {
      row++;
      col = 0;
    }
    if (row >= 9 && col >= 9) {
      return true;
    }

    if (row < 3) {
      if (col < 3) col = 3;
    } else if (row < 6) {
      if (col === Math.floor(row / 3) * 3) col += 3;
    } else {
      if (col === 6) {
        row++;
        col = 0;
        if (row >= 9) return true;
      }
    }

    if (grid[row][col] !== null) {
      return fillRemaining(row, col + 1);
    }

    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // Shuffle
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    for (const num of nums) {
      if (isValid(grid, row, col, num)) {
        grid[row][col] = num;
        if (fillRemaining(row, col + 1)) {
          return true;
        }
        grid[row][col] = null;
      }
    }

    return false;
  }

  fillRemaining(0, 3);
  return grid;
}

/**
 * Count the number of solutions for a given puzzle (max 2)
 */
function countSolutions(grid: Grid, maxCount: number = 2): number {
  const gridCopy = grid.map(row => [...row]);
  let count = 0;

  function solve(): void {
    if (count >= maxCount) return;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (gridCopy[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(gridCopy, row, col, num)) {
              gridCopy[row][col] = num;
              solve();
              gridCopy[row][col] = null;

              if (count >= maxCount) return;
            }
          }
          return;
        }
      }
    }
    count++;
  }

  solve();
  return count;
}

/**
 * Remove cells from a complete grid to create a puzzle
 */
function removeCells(grid: Grid, cellsToRemove: number): Grid {
  const puzzle = grid.map(row => [...row]);
  let removed = 0;
  const attempts = cellsToRemove * 3; // Max attempts to avoid infinite loop

  for (let i = 0; i < attempts && removed < cellsToRemove; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

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
  const solution = completeGrid.map(row => [...row]);

  // Difficulty determines number of cells to remove
  const cellsToRemove = {
    Easy: 35,      // ~39% filled
    Medium: 45,    // ~50% filled
    Hard: 55,      // ~61% filled
  }[difficulty];

  const puzzle = removeCells(completeGrid, cellsToRemove);

  return { puzzle, solution };
}

/**
 * Check if the user's solution is correct
 */
export function checkSolution(userGrid: Grid, solution: Grid): CheckResult {
  const incorrectCells: CellPosition[] = [];
  let filledCells = 0;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (userGrid[row][col] !== null) {
        filledCells++;
        if (userGrid[row][col] !== solution[row][col]) {
          incorrectCells.push({ row, col });
        }
      }
    }
  }

  const isComplete = filledCells === 81;
  const isCorrect = incorrectCells.length === 0 && isComplete;

  return { isComplete, isCorrect, incorrectCells };
}

/**
 * Deep copy a grid
 */
export function copyGrid(grid: Grid): Grid {
  return grid.map(row => [...row]);
}
