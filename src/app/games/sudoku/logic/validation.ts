/**
 * Solution validation
 * Checks if user's solution is correct
 */

import { Grid, CheckResult, CellPosition } from "../types";
import { GRID_SIZE } from "../constants";

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
