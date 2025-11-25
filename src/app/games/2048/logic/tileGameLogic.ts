// Tile-based game logic for 2048 with animation support
// This file re-exports from focused modules for backward compatibility

export {
  generateTileId,
  createTile,
  initializeTiles,
  addRandomTile,
  getOccupiedPositions,
  getRandomEmptyPosition,
} from "./tileFactory";

export { performTileMove, getTraversalDirections } from "./tileMovement";

export { canMoveTiles, hasWinningTile } from "./tileValidation";
