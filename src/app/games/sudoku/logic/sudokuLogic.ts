import {
  Grid,
  Difficulty,
  CheckResult,
  CellPosition,
  SUDOKU_GRID_SIZE,
  SUDOKU_BOX_SIZE,
  SUDOKU_TOTAL_CELLS,
  SUDOKU_NUMBERS,
  DIFFICULTY_CONFIG
} from '../types';

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Create an empty 9x9 grid
 */
function createEmptyGrid(): Grid {
  return Array(SUDOKU_GRID_SIZE).fill(null).map(() => Array(SUDOKU_GRID_SIZE).fill(null));
}

/**
 * Check if a number can be placed at a given position
 */
export function isValid(grid: Grid, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < SUDOKU_GRID_SIZE; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < SUDOKU_GRID_SIZE; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / SUDOKU_BOX_SIZE) * SUDOKU_BOX_SIZE;
  const boxCol = Math.floor(col / SUDOKU_BOX_SIZE) * SUDOKU_BOX_SIZE;
  for (let i = 0; i < SUDOKU_BOX_SIZE; i++) {
    for (let j = 0; j < SUDOKU_BOX_SIZE; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
}

/**
 * Solve a Sudoku puzzle using backtracking (internal use only)
 */
function solvePuzzle(grid: Grid): Grid | null {
  const gridCopy = copyGrid(grid);

  function solve(): boolean {
    for (let row = 0; row < SUDOKU_GRID_SIZE; row++) {
      for (let col = 0; col < SUDOKU_GRID_SIZE; col++) {
        if (gridCopy[row][col] === null) {
          for (let num = 1; num <= SUDOKU_GRID_SIZE; num++) {
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
    for (let box = 0; box < SUDOKU_GRID_SIZE; box += SUDOKU_BOX_SIZE) {
      const nums = [...SUDOKU_NUMBERS];
      shuffleArray(nums);

      let idx = 0;
      for (let i = 0; i < SUDOKU_BOX_SIZE; i++) {
        for (let j = 0; j < SUDOKU_BOX_SIZE; j++) {
          grid[box + i][box + j] = nums[idx++];
        }
      }
    }
  }

  fillDiagonalBoxes();

  // Fill remaining cells
  function fillRemaining(row: number, col: number): boolean {
    if (col >= SUDOKU_GRID_SIZE && row < SUDOKU_GRID_SIZE - 1) {
      row++;
      col = 0;
    }
    if (row >= SUDOKU_GRID_SIZE && col >= SUDOKU_GRID_SIZE) {
      return true;
    }

    if (row < SUDOKU_BOX_SIZE) {
      if (col < SUDOKU_BOX_SIZE) col = SUDOKU_BOX_SIZE;
    } else if (row < SUDOKU_BOX_SIZE * 2) {
      if (col === Math.floor(row / SUDOKU_BOX_SIZE) * SUDOKU_BOX_SIZE) col += SUDOKU_BOX_SIZE;
    } else {
      if (col === SUDOKU_BOX_SIZE * 2) {
        row++;
        col = 0;
        if (row >= SUDOKU_GRID_SIZE) return true;
      }
    }

    if (grid[row][col] !== null) {
      return fillRemaining(row, col + 1);
    }

    const nums = [...SUDOKU_NUMBERS];
    shuffleArray(nums);

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

  fillRemaining(0, SUDOKU_BOX_SIZE);
  return grid;
}

/**
 * Count the number of solutions for a given puzzle (max 2)
 */
function countSolutions(grid: Grid, maxCount: number = 2): number {
  const gridCopy = copyGrid(grid);
  let count = 0;

  function solve(): void {
    if (count >= maxCount) return;

    for (let row = 0; row < SUDOKU_GRID_SIZE; row++) {
      for (let col = 0; col < SUDOKU_GRID_SIZE; col++) {
        if (gridCopy[row][col] === null) {
          for (let num = 1; num <= SUDOKU_GRID_SIZE; num++) {
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
  const puzzle = copyGrid(grid);
  let removed = 0;
  const attempts = cellsToRemove * 3; // Max attempts to avoid infinite loop

  for (let i = 0; i < attempts && removed < cellsToRemove; i++) {
    const row = Math.floor(Math.random() * SUDOKU_GRID_SIZE);
    const col = Math.floor(Math.random() * SUDOKU_GRID_SIZE);

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

  // Difficulty determines number of cells to remove
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

  for (let row = 0; row < SUDOKU_GRID_SIZE; row++) {
    for (let col = 0; col < SUDOKU_GRID_SIZE; col++) {
      if (userGrid[row][col] !== null) {
        filledCells++;
        if (userGrid[row][col] !== solution[row][col]) {
          incorrectCells.push({ row, col });
        }
      }
    }
  }

  const isComplete = filledCells === SUDOKU_TOTAL_CELLS;
  const isCorrect = incorrectCells.length === 0 && isComplete;

  return { isComplete, isCorrect, incorrectCells };
}

/**
 * Deep copy a grid
 */
export function copyGrid(grid: Grid): Grid {
  return grid.map(row => [...row]);
}
