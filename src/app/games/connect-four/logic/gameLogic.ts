import { Board, Player, WinningLine } from "../types";
import { ROWS, COLS, WIN_LENGTH } from "../constants";

/**
 * Check if a column is valid for dropping a piece
 */
export function canDropPiece(board: Board, col: number): boolean {
  return col >= 0 && col < COLS && board[0][col] === null;
}

/**
 * Get the row where a piece would land in a column
 */
export function getDropRow(board: Board, col: number): number {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      return row;
    }
  }
  return -1;
}

/**
 * Drop a piece in a column (returns new board, doesn't mutate)
 */
export function dropPiece(
  board: Board,
  col: number,
  player: Player
): Board | null {
  if (!canDropPiece(board, col)) {
    return null;
  }

  const row = getDropRow(board, col);
  if (row === -1) {
    return null;
  }

  const newBoard = board.map((r) => [...r]);
  newBoard[row][col] = player;
  return newBoard;
}

/**
 * Get all available columns for dropping pieces
 */
export function getAvailableColumns(board: Board): number[] {
  const available: number[] = [];
  for (let col = 0; col < COLS; col++) {
    if (canDropPiece(board, col)) {
      available.push(col);
    }
  }
  return available;
}

/**
 * Check for a winner in all directions from a position
 */
function checkDirection(
  board: Board,
  startRow: number,
  startCol: number,
  deltaRow: number,
  deltaCol: number
): WinningLine | null {
  const player = board[startRow][startCol];
  if (player === null) return null;

  const cells: [number, number][] = [[startRow, startCol]];

  // Check in positive direction
  let row = startRow + deltaRow;
  let col = startCol + deltaCol;
  while (
    row >= 0 &&
    row < ROWS &&
    col >= 0 &&
    col < COLS &&
    board[row][col] === player
  ) {
    cells.push([row, col]);
    row += deltaRow;
    col += deltaCol;
  }

  // Check in negative direction
  row = startRow - deltaRow;
  col = startCol - deltaCol;
  while (
    row >= 0 &&
    row < ROWS &&
    col >= 0 &&
    col < COLS &&
    board[row][col] === player
  ) {
    cells.unshift([row, col]);
    row -= deltaRow;
    col -= deltaCol;
  }

  if (cells.length >= WIN_LENGTH) {
    return { cells: cells.slice(0, WIN_LENGTH) as [number, number][], winner: player };
  }

  return null;
}

/**
 * Check for a winner on the entire board
 */
export function checkWinner(board: Board): Player | null {
  const winningLine = getWinningLine(board);
  return winningLine?.winner ?? null;
}

/**
 * Get the winning line if there is one
 */
export function getWinningLine(board: Board): WinningLine | null {
  // Direction vectors: horizontal, vertical, diagonal down-right, diagonal up-right
  const directions: [number, number][] = [
    [0, 1],  // horizontal
    [1, 0],  // vertical
    [1, 1],  // diagonal down-right
    [1, -1], // diagonal up-right
  ];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === null) continue;

      for (const [deltaRow, deltaCol] of directions) {
        const result = checkDirection(board, row, col, deltaRow, deltaCol);
        if (result) {
          return result;
        }
      }
    }
  }

  return null;
}

/**
 * Check if the game is a draw (board is full with no winner)
 */
export function isDraw(board: Board): boolean {
  return checkWinner(board) === null && getAvailableColumns(board).length === 0;
}

/**
 * Check if the game is over (win or draw)
 */
export function isGameOver(board: Board): boolean {
  return checkWinner(board) !== null || isDraw(board);
}

/**
 * Get the next player
 */
export function getNextPlayer(currentPlayer: Player): Player {
  return currentPlayer === 1 ? 2 : 1;
}

/**
 * Count pieces of a player on the board
 */
export function countPieces(board: Board, player: Player): number {
  let count = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === player) {
        count++;
      }
    }
  }
  return count;
}
