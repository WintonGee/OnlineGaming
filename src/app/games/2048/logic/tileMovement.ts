// Tile movement logic for 2048

import { Tile, Direction } from "../types";
import { GRID_SIZE, WINNING_TILE_VALUE } from "../constants";
import { generateTileId, addRandomTile } from "./tileFactory";

interface MoveResult {
  tiles: Tile[];
  scoreGained: number;
  moved: boolean;
  won: boolean;
}

interface TraversalDirections {
  rowOrder: number[];
  colOrder: number[];
  rowDir: number;
  colDir: number;
}

/**
 * Gets the traversal directions based on move direction
 */
export function getTraversalDirections(direction: Direction): TraversalDirections {
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
 * Performs a move in the specified direction
 */
export function performTileMove(
  currentTiles: Tile[],
  direction: Direction
): MoveResult {
  // Convert direction to traversal order
  const { rowOrder, colOrder, rowDir, colDir } = getTraversalDirections(direction);

  const newTiles: Tile[] = [];
  const mergedPositions = new Set<string>();
  let scoreGained = 0;
  let moved = false;
  let won = false;

  // Create a map of current tile positions
  const tileMap = new Map<string, Tile>();
  currentTiles.forEach((tile) => {
    tileMap.set(`${tile.position.row},${tile.position.col}`, {
      ...tile,
      previousPosition: tile.position,
    });
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
        nextPos.row >= 0 &&
        nextPos.row < GRID_SIZE &&
        nextPos.col >= 0 &&
        nextPos.col < GRID_SIZE
      ) {
        const nextKey = `${nextPos.row},${nextPos.col}`;
        const nextTile = newTiles.find(
          (t) => t.position.row === nextPos.row && t.position.col === nextPos.col
        );

        if (nextTile) {
          // Check if we can merge
          if (nextTile.value === tile.value && !mergedPositions.has(nextKey)) {
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

