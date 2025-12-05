import { Board, Player, WinningLine } from "../types";
import { WINNING_LINES } from "../constants";

/**
 * Get all empty cell indices on the board
 */
export function getEmptyCells(board: Board): number[] {
  return board.reduce<number[]>((acc, cell, index) => {
    if (cell === null) acc.push(index);
    return acc;
  }, []);
}

/**
 * Check if a move is valid (cell is empty)
 */
export function isValidMove(board: Board, index: number): boolean {
  return index >= 0 && index < board.length && board[index] === null;
}

/**
 * Check if there's a winner and return the winner or null
 */
export function checkWinner(board: Board): Player | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

/**
 * Get the winning line if there is one
 */
export function getWinningLine(board: Board): WinningLine | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        indices: line,
        winner: board[a]!,
      };
    }
  }
  return null;
}

/**
 * Check if the game is a draw (no winner and no empty cells)
 */
export function isDraw(board: Board): boolean {
  return checkWinner(board) === null && getEmptyCells(board).length === 0;
}

/**
 * Check if the game is over (win or draw)
 */
export function isGameOver(board: Board): boolean {
  return checkWinner(board) !== null || isDraw(board);
}

/**
 * Make a move on the board (returns new board, doesn't mutate)
 */
export function makeMove(
  board: Board,
  index: number,
  player: Player
): Board | null {
  if (!isValidMove(board, index)) {
    return null;
  }

  const newBoard = [...board];
  newBoard[index] = player;
  return newBoard;
}

/**
 * Get the next player
 */
export function getNextPlayer(currentPlayer: Player): Player {
  return currentPlayer === "X" ? "O" : "X";
}
