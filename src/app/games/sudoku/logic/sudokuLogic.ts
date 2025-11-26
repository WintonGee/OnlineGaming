/**
 * Sudoku game logic - Main entry point
 * Re-exports all logic functions for backward compatibility
 *
 * This file maintains the original API while delegating to
 * focused modules for better organization and maintainability
 */

// Re-export grid utilities
export { createEmptyGrid, copyGrid } from "./grid";

// Re-export solver functions
export { solvePuzzle } from "./solver";

// Re-export generator functions
export { generatePuzzle } from "./generator";

// Re-export validation functions
export { checkSolution } from "./validation";
