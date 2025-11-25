// Tile-based game logic for 2048 with animation support

import { nanoid } from "nanoid";
import { Tile, Direction, CellPosition } from "../types";
import { GRID_SIZE, WINNING_TILE_VALUE } from "../constants";

/**
 * Generates a unique ID for a tile using nanoid
 */
export function generateTileId(): string {
  return nanoid();
}

/**
 * Creates a new tile at the specified position
 */
export function createTile(row: number, col: number, value: number, isNew: boolean = false): Tile {
  return {
    id: generateTileId(),
    value,
    position: { row, col },
    isNew,
  };
}

/**
 * Initializes the game with two random tiles
 */
export function initializeTiles(): Tile[] {
  const tiles: Tile[] = [];

  // Add first tile
  const pos1 = getRandomEmptyPosition([]);
  tiles.push(createTile(pos1.row, pos1.col, Math.random() < 0.9 ? 2 : 4, true));

  // Add second tile
  const pos2 = getRandomEmptyPosition(tiles);
  tiles.push(createTile(pos2.row, pos2.col, Math.random() < 0.9 ? 2 : 4, true));

  return tiles;
}

/**
 * Gets all occupied positions from the current tiles
 */
function getOccupiedPositions(tiles: Tile[]): Set<string> {
  const occupied = new Set<string>();
  tiles.forEach(tile => {
    occupied.add(`${tile.position.row},${tile.position.col}`);
  });
  return occupied;
}

/**
 * Gets a random empty position on the board
 */
function getRandomEmptyPosition(tiles: Tile[]): CellPosition {
  const occupied = getOccupiedPositions(tiles);
  const empty: CellPosition[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!occupied.has(`${row},${col}`)) {
        empty.push({ row, col });
      }
    }
  }

  if (empty.length === 0) {
    throw new Error("No empty positions available");
  }

  return empty[Math.floor(Math.random() * empty.length)];
}

/**
 * Adds a new random tile to the board
 */
function addRandomTile(tiles: Tile[]): Tile {
  try {
    const position = getRandomEmptyPosition(tiles);
    return createTile(position.row, position.col, Math.random() < 0.9 ? 2 : 4, true);
  } catch {
    // No empty positions, game might be over
    return createTile(0, 0, 2, true); // This won't actually be used
  }
}

/**
 * Performs a move in the specified direction
 */
export function performTileMove(
  currentTiles: Tile[],
  direction: Direction
): {
  tiles: Tile[];
  scoreGained: number;
  moved: boolean;
  won: boolean;
} {
  // Convert direction to traversal order
  const { rowOrder, colOrder, rowDir, colDir } = getTraversalDirections(direction);

  const newTiles: Tile[] = [];
  const mergedPositions = new Set<string>();
  let scoreGained = 0;
  let moved = false;
  let won = false;

  // Create a map of current tile positions
  const tileMap = new Map<string, Tile>();
  currentTiles.forEach(tile => {
    tileMap.set(`${tile.position.row},${tile.position.col}`, { ...tile, previousPosition: tile.position });
  });

  // Process tiles in the correct order
  for (const row of rowOrder) {
    for (const col of colOrder) {
      const key = `${row},${col}`;
      const tile = tileMap.get(key);

      if (!tile) continue;

      // Find the farthest position this tile can move to
      let farthestPos = { row, col };
      let nextPos = { row: row + rowDir, col: col + colDir };

      while (
        nextPos.row >= 0 && nextPos.row < GRID_SIZE &&
        nextPos.col >= 0 && nextPos.col < GRID_SIZE
      ) {
        const nextKey = `${nextPos.row},${nextPos.col}`;
        const nextTile = newTiles.find(t =>
          t.position.row === nextPos.row && t.position.col === nextPos.col
        );

        if (nextTile) {
          // Check if we can merge
          if (
            nextTile.value === tile.value &&
            !mergedPositions.has(nextKey)
          ) {
            // Merge!
            const mergedValue = tile.value * 2;
            scoreGained += mergedValue;
            moved = true;

            if (mergedValue === WINNING_TILE_VALUE) {
              won = true;
            }

            // Remove the tile we're merging into
            const index = newTiles.indexOf(nextTile);
            newTiles.splice(index, 1);

            // Create merged tile
            const mergedTile: Tile = {
              id: generateTileId(),
              value: mergedValue,
              position: nextPos,
              previousPosition: tile.position,
              mergedFrom: [tile.id, nextTile.id],
            };

            newTiles.push(mergedTile);
            mergedPositions.add(nextKey);
            farthestPos = nextPos;
          }
          break;
        } else {
          farthestPos = nextPos;
          nextPos = { row: nextPos.row + rowDir, col: nextPos.col + colDir };
        }
      }

      // Only add the tile if it didn't merge
      if (!mergedPositions.has(`${farthestPos.row},${farthestPos.col}`)) {
        const movedTile: Tile = {
          id: tile.id,
          value: tile.value,
          position: farthestPos,
          previousPosition: tile.position,
          // Clear animation flags - don't carry them over from previous moves
          isNew: false,
          mergedFrom: undefined,
        };

        if (farthestPos.row !== row || farthestPos.col !== col) {
          moved = true;
        }

        newTiles.push(movedTile);
      }
    }
  }

  // Add a new random tile if the move was valid
  if (moved) {
    const newTile = addRandomTile(newTiles);
    if (newTile) {
      newTiles.push(newTile);
    }
  }

  return {
    tiles: moved ? newTiles : currentTiles,
    scoreGained,
    moved,
    won,
  };
}

/**
 * Gets the traversal directions based on move direction
 */
function getTraversalDirections(direction: Direction): {
  rowOrder: number[];
  colOrder: number[];
  rowDir: number;
  colDir: number;
} {
  const rows = [0, 1, 2, 3];
  const cols = [0, 1, 2, 3];

  switch (direction) {
    case "up":
      return { rowOrder: rows, colOrder: cols, rowDir: -1, colDir: 0 };
    case "down":
      return { rowOrder: [...rows].reverse(), colOrder: cols, rowDir: 1, colDir: 0 };
    case "left":
      return { rowOrder: rows, colOrder: cols, rowDir: 0, colDir: -1 };
    case "right":
      return { rowOrder: rows, colOrder: [...cols].reverse(), rowDir: 0, colDir: 1 };
  }
}

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

  tiles.forEach(tile => {
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
  return tiles.some(tile => tile.value === WINNING_TILE_VALUE);
}
