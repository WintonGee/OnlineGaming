// Pure game logic for Sliding Puzzle (no React dependencies)

import { GridSize, Direction } from "../types";
import { createSolvedState } from "../constants";

/**
 * Get the index of the empty tile (value 0) in the tiles array
 */
export function getEmptyTileIndex(tiles: number[]): number {
  return tiles.indexOf(0);
}

/**
 * Get the row and column of a tile at a given index
 */
export function getPosition(index: number, gridSize: GridSize): { row: number; col: number } {
  return {
    row: Math.floor(index / gridSize),
    col: index % gridSize,
  };
}

/**
 * Get the index from row and column
 */
export function getIndex(row: number, col: number, gridSize: GridSize): number {
  return row * gridSize + col;
}

/**
 * Check if a tile at the given index can be moved (is adjacent to empty tile)
 */
export function canMoveTile(tiles: number[], tileIndex: number, gridSize: GridSize): boolean {
  const emptyIndex = getEmptyTileIndex(tiles);
  const tilePos = getPosition(tileIndex, gridSize);
  const emptyPos = getPosition(emptyIndex, gridSize);

  // Tile must be in same row or column as empty space
  const sameRow = tilePos.row === emptyPos.row;
  const sameCol = tilePos.col === emptyPos.col;

  if (!sameRow && !sameCol) return false;

  // Tile must be adjacent (distance of 1)
  const rowDiff = Math.abs(tilePos.row - emptyPos.row);
  const colDiff = Math.abs(tilePos.col - emptyPos.col);

  return (sameRow && colDiff === 1) || (sameCol && rowDiff === 1);
}

/**
 * Move a tile at the given index (swap with empty tile)
 * Returns new tiles array or null if move is invalid
 */
export function moveTile(tiles: number[], tileIndex: number, gridSize: GridSize): number[] | null {
  if (!canMoveTile(tiles, tileIndex, gridSize)) {
    return null;
  }

  const emptyIndex = getEmptyTileIndex(tiles);
  const newTiles = [...tiles];

  // Swap the tile with the empty space
  newTiles[emptyIndex] = newTiles[tileIndex];
  newTiles[tileIndex] = 0;

  return newTiles;
}

/**
 * Move tiles based on arrow key direction
 * The tile that moves INTO the empty space is determined by the direction
 *
 * Arrow UP: Move the tile BELOW the empty space up
 * Arrow DOWN: Move the tile ABOVE the empty space down
 * Arrow LEFT: Move the tile to the RIGHT of empty space left
 * Arrow RIGHT: Move the tile to the LEFT of empty space right
 */
export function moveByDirection(tiles: number[], direction: Direction, gridSize: GridSize): number[] | null {
  const emptyIndex = getEmptyTileIndex(tiles);
  const emptyPos = getPosition(emptyIndex, gridSize);

  let targetRow = emptyPos.row;
  let targetCol = emptyPos.col;

  // Determine which tile should move into the empty space
  switch (direction) {
    case "up":
      targetRow = emptyPos.row + 1; // Tile below moves up
      break;
    case "down":
      targetRow = emptyPos.row - 1; // Tile above moves down
      break;
    case "left":
      targetCol = emptyPos.col + 1; // Tile to the right moves left
      break;
    case "right":
      targetCol = emptyPos.col - 1; // Tile to the left moves right
      break;
  }

  // Check bounds
  if (targetRow < 0 || targetRow >= gridSize || targetCol < 0 || targetCol >= gridSize) {
    return null;
  }

  const targetIndex = getIndex(targetRow, targetCol, gridSize);
  return moveTile(tiles, targetIndex, gridSize);
}

/**
 * Check if the puzzle is solved
 */
export function isSolved(tiles: number[]): boolean {
  const gridSize = Math.sqrt(tiles.length) as GridSize;
  const solved = createSolvedState(gridSize);

  return tiles.every((tile, index) => tile === solved[index]);
}

/**
 * Count inversions in the puzzle
 * An inversion is when a higher numbered tile precedes a lower numbered tile
 */
export function countInversions(tiles: number[]): number {
  let inversions = 0;
  const nonEmptyTiles = tiles.filter(t => t !== 0);

  for (let i = 0; i < nonEmptyTiles.length; i++) {
    for (let j = i + 1; j < nonEmptyTiles.length; j++) {
      if (nonEmptyTiles[i] > nonEmptyTiles[j]) {
        inversions++;
      }
    }
  }

  return inversions;
}

/**
 * Check if a puzzle configuration is solvable
 *
 * For odd grid sizes (3x3, 5x5):
 *   - Puzzle is solvable if number of inversions is even
 *
 * For even grid sizes (4x4):
 *   - Puzzle is solvable if:
 *     - (blank on odd row from bottom) AND (inversions is even), OR
 *     - (blank on even row from bottom) AND (inversions is odd)
 */
export function isSolvable(tiles: number[], gridSize: GridSize): boolean {
  const inversions = countInversions(tiles);
  const emptyIndex = getEmptyTileIndex(tiles);
  const emptyPos = getPosition(emptyIndex, gridSize);

  // Row from bottom (1-indexed)
  const rowFromBottom = gridSize - emptyPos.row;

  if (gridSize % 2 === 1) {
    // Odd grid: solvable if inversions is even
    return inversions % 2 === 0;
  } else {
    // Even grid: more complex rule
    if (rowFromBottom % 2 === 1) {
      // Blank on odd row from bottom
      return inversions % 2 === 0;
    } else {
      // Blank on even row from bottom
      return inversions % 2 === 1;
    }
  }
}

/**
 * Shuffle tiles using Fisher-Yates algorithm and ensure solvability
 */
export function shuffleTiles(gridSize: GridSize): number[] {
  const totalTiles = gridSize * gridSize;
  let tiles: number[];

  do {
    // Create array [1, 2, 3, ..., n-1, 0]
    tiles = [];
    for (let i = 1; i < totalTiles; i++) {
      tiles.push(i);
    }
    tiles.push(0);

    // Fisher-Yates shuffle
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (!isSolvable(tiles, gridSize) || isSolved(tiles));

  return tiles;
}

/**
 * Get all tiles that can currently be moved
 */
export function getMovableTiles(tiles: number[], gridSize: GridSize): number[] {
  return tiles
    .map((_, index) => index)
    .filter(index => tiles[index] !== 0 && canMoveTile(tiles, index, gridSize));
}
