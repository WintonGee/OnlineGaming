/**
 * Shared type definitions used across multiple games
 */

/**
 * Standard difficulty levels used by most games
 * Note: Some games (Snake, Sudoku) use capitalized versions
 * Note: Minesweeper uses different values (Beginner, Intermediate, Expert, Custom)
 */
export type Difficulty = "easy" | "medium" | "hard";

/**
 * Game mode for single or multiplayer games
 */
export type GameMode = "singleplayer" | "multiplayer";

/**
 * Standard game status for turn-based games
 */
export type GameStatus = "playing" | "won" | "draw";

/**
 * Position interface for grid-based games
 * Used for cell positions, coordinates, etc.
 */
export interface Position {
  row: number;
  col: number;
}

/**
 * Alias for Position - some games use CellPosition naming
 */
export type CellPosition = Position;

/**
 * Direction for movement in games like Snake, 2048
 * Note: Already defined in useKeyboardInput hook, re-exported here for convenience
 */
export type Direction = "up" | "down" | "left" | "right";

/**
 * Generic best scores record type
 * Can be used with any difficulty type
 */
export type BestScores<D extends string = Difficulty> = Partial<
  Record<D, number>
>;
