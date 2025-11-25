// Tile validation and game state checks for 2048

import { Tile } from "../types";
import { GRID_SIZE, WINNING_TILE_VALUE } from "../constants";

/**
 * Checks if any moves are possible
 */
export function canMoveTiles(tiles: Tile[]): boolean {
  // Check if there are empty cells
  if (tiles.length < GRID_SIZE * GRID_SIZE) {
    return true;
  }

  // Create a grid for easier adjacency checking
  const grid: (number | null)[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null)
  );

  tiles.forEach((tile) => {
    grid[tile.position.row][tile.position.col] = tile.value;
  });

  // Check for adjacent matching tiles
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const value = grid[row][col];
      if (value === null) continue;

      // Check right
      if (col < GRID_SIZE - 1 && grid[row][col + 1] === value) {
        return true;
      }

      // Check down
      if (row < GRID_SIZE - 1 && grid[row + 1][col] === value) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if the tiles contain a winning tile
 */
export function hasWinningTile(tiles: Tile[]): boolean {
  return tiles.some((tile) => tile.value === WINNING_TILE_VALUE);
}

