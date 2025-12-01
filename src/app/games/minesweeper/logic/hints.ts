import { Board } from '../types';
import { revealCell } from './cellReveal';
import { toggleFlag } from './cellReveal';
import { getRandomItem } from '../utils/arrayUtils';

/**
 * Reveals a random unrevealed safe cell (not a mine)
 * Prioritizes cells with numbers over empty cells for better gameplay
 * @returns The new board state, or null if no safe cells available
 */
export function revealRandomNumber(board: Board): Board | null {
  const height = board.length;
  const width = board[0]?.length || 0;

  // Find all unrevealed, unflagged, non-mine cells
  const safeCells: { row: number; col: number; hasNumber: boolean }[] = [];

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const cell = board[row][col];
      if (!cell.isRevealed && !cell.isFlagged && !cell.isMine) {
        safeCells.push({
          row,
          col,
          hasNumber: cell.adjacentMines > 0
        });
      }
    }
  }

  // No safe cells available
  if (safeCells.length === 0) {
    return null;
  }

  // Separate cells with numbers from empty cells
  const cellsWithNumbers = safeCells.filter(c => c.hasNumber);
  const emptyCells = safeCells.filter(c => !c.hasNumber);

  // Prefer cells with numbers (70% chance if available)
  let selectedCell;
  if (cellsWithNumbers.length > 0 && (emptyCells.length === 0 || Math.random() < 0.7)) {
    selectedCell = getRandomItem(cellsWithNumbers);
  } else if (emptyCells.length > 0) {
    selectedCell = getRandomItem(emptyCells);
  } else {
    selectedCell = getRandomItem(cellsWithNumbers);
  }

  // Handle null case (shouldn't happen due to earlier check, but TypeScript safety)
  if (!selectedCell) {
    return null;
  }

  // Reveal the selected cell
  return revealCell(board, selectedCell.row, selectedCell.col);
}

/**
 * Flags a random unflagged mine
 * @returns The new board state, or null if no unflagged mines available
 */
export function flagRandomMine(board: Board): Board | null {
  const height = board.length;
  const width = board[0]?.length || 0;

  // Find all unflagged, unrevealed mines
  const unflaggedMines: { row: number; col: number }[] = [];

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const cell = board[row][col];
      if (cell.isMine && !cell.isFlagged && !cell.isRevealed) {
        unflaggedMines.push({ row, col });
      }
    }
  }

  // No unflagged mines available
  if (unflaggedMines.length === 0) {
    return null;
  }

  // Randomly select one mine to flag
  const selectedMine = getRandomItem(unflaggedMines);

  // Handle null case (shouldn't happen due to earlier check, but TypeScript safety)
  if (!selectedMine) {
    return null;
  }

  // Flag the selected mine
  return toggleFlag(board, selectedMine.row, selectedMine.col);
}
