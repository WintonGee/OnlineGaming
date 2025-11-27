import { Board } from '../types';
import { getAdjacentPositions } from './boardGeneration';
import { getPositionKey } from '@/lib/shared/utils/arrayUtils';

/**
 * Reveals a cell and recursively reveals adjacent cells if it's empty (flood-fill)
 */
export function revealCell(board: Board, row: number, col: number): Board {
  const height = board.length;
  const width = board[0].length;
  const newBoard = board.map(r => r.map(cell => ({ ...cell })));

  // If cell is already revealed or flagged, do nothing
  if (newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) {
    return newBoard;
  }

  // Reveal the cell
  newBoard[row][col].isRevealed = true;

  // If it's a mine, mark it as the clicked mine and return
  if (newBoard[row][col].isMine) {
    newBoard[row][col].isClickedMine = true;
    return newBoard;
  }

  // If it has adjacent mines, stop here (don't flood-fill)
  if (newBoard[row][col].adjacentMines > 0) {
    return newBoard;
  }

  // Flood-fill: reveal all adjacent cells recursively
  const queue: { row: number; col: number }[] = [{ row, col }];
  const visited = new Set<string>();
  visited.add(getPositionKey(row, col));

  while (queue.length > 0) {
    const current = queue.shift()!;
    const adjacentPositions = getAdjacentPositions(current.row, current.col, height, width);

    for (const pos of adjacentPositions) {
      const key = getPositionKey(pos.row, pos.col);
      const cell = newBoard[pos.row][pos.col];

      // Skip if already visited, revealed, flagged, or is a mine
      if (visited.has(key) || cell.isRevealed || cell.isFlagged || cell.isMine) {
        continue;
      }

      // Reveal the cell
      newBoard[pos.row][pos.col].isRevealed = true;
      visited.add(key);

      // If it's empty (no adjacent mines), add to queue for further exploration
      if (cell.adjacentMines === 0) {
        queue.push(pos);
      }
    }
  }

  return newBoard;
}

/**
 * Reveals all mines on the board (called when game is lost)
 */
export function revealAllMines(board: Board): Board {
  return board.map(row =>
    row.map(cell => ({
      ...cell,
      isRevealed: cell.isMine ? true : cell.isRevealed,
    }))
  );
}

/**
 * Flags all remaining mines (called when game is won)
 */
export function flagAllMines(board: Board): Board {
  return board.map(row =>
    row.map(cell => ({
      ...cell,
      isFlagged: cell.isMine && !cell.isRevealed ? true : cell.isFlagged,
    }))
  );
}

/**
 * Toggles flag on a cell
 */
export function toggleFlag(board: Board, row: number, col: number): Board {
  const newBoard = board.map(r => r.map(cell => ({ ...cell })));

  // Can't flag a revealed cell
  if (newBoard[row][col].isRevealed) {
    return newBoard;
  }

  newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
  return newBoard;
}

/**
 * Counts the number of revealed cells
 */
export function countRevealedCells(board: Board): number {
  return board.reduce(
    (count, row) => count + row.filter(cell => cell.isRevealed).length,
    0
  );
}

/**
 * Counts the number of flagged cells
 */
export function countFlaggedCells(board: Board): number {
  return board.reduce(
    (count, row) => count + row.filter(cell => cell.isFlagged).length,
    0
  );
}
