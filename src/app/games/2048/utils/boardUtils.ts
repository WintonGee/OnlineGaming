// Board utility functions for 2048

import { Board, CellPosition, CellValue } from "../types";
import { GRID_SIZE, SPAWN_VALUE_2_PROBABILITY } from "../constants";

/**
 * Creates an empty board (4x4 grid filled with nulls)
 */
export function createEmptyBoard(): Board {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );
}

/**
 * Creates a deep copy of a board
 */
export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

/**
 * Gets all empty cell positions on the board
 */
export function getEmptyCells(board: Board): CellPosition[] {
  const emptyCells: CellPosition[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === null) {
        emptyCells.push({ row, col });
      }
    }
  }

  return emptyCells;
}

/**
 * Adds a random tile (2 or 4) to an empty position on the board
 * Returns the new board and the position where the tile was added
 */
export function addRandomTile(board: Board): {
  newBoard: Board;
  position: CellPosition | null;
} {
  const emptyCells = getEmptyCells(board);

  if (emptyCells.length === 0) {
    return { newBoard: board, position: null };
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const position = emptyCells[randomIndex];
  const value = Math.random() < SPAWN_VALUE_2_PROBABILITY ? 2 : 4;

  const newBoard = cloneBoard(board);
  newBoard[position.row][position.col] = value;

  return { newBoard, position };
}

/**
 * Initializes a new game board with two random tiles
 */
export function initializeBoard(): Board {
  let board = createEmptyBoard();

  // Add first tile
  const firstTile = addRandomTile(board);
  board = firstTile.newBoard;

  // Add second tile
  const secondTile = addRandomTile(board);
  board = secondTile.newBoard;

  return board;
}

/**
 * Checks if two boards are equal
 */
export function areBoardsEqual(board1: Board, board2: Board): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board1[row][col] !== board2[row][col]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Checks if the board has a winning tile (2048)
 */
export function hasWinningTile(board: Board): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === 2048) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Gets the value at a specific position, with bounds checking
 */
export function getCellValue(
  board: Board,
  row: number,
  col: number
): CellValue {
  if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
    return null;
  }
  return board[row][col];
}

/**
 * Sets the value at a specific position
 */
export function setCellValue(
  board: Board,
  row: number,
  col: number,
  value: CellValue
): Board {
  const newBoard = cloneBoard(board);
  newBoard[row][col] = value;
  return newBoard;
}
