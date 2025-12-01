// Tile creation and initialization for 2048

import { nanoid } from "nanoid";
import { Tile, CellPosition } from "../types";
import { GRID_SIZE } from "../constants";
import { getPositionKey, getRandomItem } from "../utils/arrayUtils";

/**
 * Generates a unique ID for a tile using nanoid
 */
export function generateTileId(): string {
  return nanoid();
}

/**
 * Creates a new tile at the specified position
 */
export function createTile(
  row: number,
  col: number,
  value: number,
  isNew: boolean = false
): Tile {
  return {
    id: generateTileId(),
    value,
    position: { row, col },
    isNew,
  };
}

/**
 * Gets all occupied positions from the current tiles
 */
export function getOccupiedPositions(tiles: Tile[]): Set<string> {
  const occupied = new Set<string>();
  tiles.forEach((tile) => {
    occupied.add(getPositionKey(tile.position.row, tile.position.col));
  });
  return occupied;
}

/**
 * Gets a random empty position on the board
 */
export function getRandomEmptyPosition(tiles: Tile[]): CellPosition {
  const occupied = getOccupiedPositions(tiles);
  const empty: CellPosition[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!occupied.has(getPositionKey(row, col))) {
        empty.push({ row, col });
      }
    }
  }

  if (empty.length === 0) {
    throw new Error("No empty positions available");
  }

  const randomPosition = getRandomItem(empty);
  if (!randomPosition) {
    throw new Error("No empty positions available");
  }
  return randomPosition;
}

/**
 * Adds a new random tile to the board
 * Returns null if no empty positions available
 */
export function addRandomTile(tiles: Tile[]): Tile | null {
  try {
    const position = getRandomEmptyPosition(tiles);
    return createTile(
      position.row,
      position.col,
      Math.random() < 0.9 ? 2 : 4,
      true
    );
  } catch {
    // No empty positions available
    return null;
  }
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

