/**
 * Grid utility functions
 * Basic operations for creating and manipulating Sudoku grids
 */

import { Grid } from "../types";
import { GRID_SIZE } from "../constants";

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
