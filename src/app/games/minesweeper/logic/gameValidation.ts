import { Board } from '../types';
import { CUSTOM_CONSTRAINTS } from '../constants';

/**
 * Checks if the game is won
 * Win condition: All non-mine cells are revealed
 */
export function checkWinCondition(board: Board, totalMines: number): boolean {
  const height = board.length;
  const width = board[0]?.length || 0;
  const totalCells = height * width;
  const safeCells = totalCells - totalMines;

  let revealedSafeCells = 0;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const cell = board[row][col];
      if (!cell.isMine && cell.isRevealed) {
        revealedSafeCells++;
      }
    }
  }

  return revealedSafeCells === safeCells;
}

/**
 * Checks if the game is lost
 * Lose condition: A mine cell is revealed
 */
export function checkLoseCondition(board: Board): boolean {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < (board[0]?.length || 0); col++) {
      const cell = board[row][col];
      if (cell.isMine && cell.isRevealed) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Validates custom game settings
 */
export function validateCustomSettings(
  width: number,
  height: number,
  mines: number
): { valid: boolean; error?: string } {
  if (isNaN(width) || width < CUSTOM_CONSTRAINTS.minWidth || width > CUSTOM_CONSTRAINTS.maxWidth) {
    return { 
      valid: false, 
      error: `Width must be between ${CUSTOM_CONSTRAINTS.minWidth} and ${CUSTOM_CONSTRAINTS.maxWidth}` 
    };
  }

  if (isNaN(height) || height < CUSTOM_CONSTRAINTS.minHeight || height > CUSTOM_CONSTRAINTS.maxHeight) {
    return { 
      valid: false, 
      error: `Height must be between ${CUSTOM_CONSTRAINTS.minHeight} and ${CUSTOM_CONSTRAINTS.maxHeight}` 
    };
  }

  const totalCells = width * height;
  const maxMines = Math.floor(totalCells * CUSTOM_CONSTRAINTS.maxMinePercentage);
  const minMines = 1;

  if (isNaN(mines) || mines < minMines) {
    return { 
      valid: false, 
      error: `Mines must be between ${minMines} and ${maxMines} for a ${width}x${height} board` 
    };
  }

  if (mines > maxMines) {
    return { 
      valid: false, 
      error: `Mines must be between ${minMines} and ${maxMines} for a ${width}x${height} board (max 80% of cells)` 
    };
  }

  return { valid: true };
}

/**
 * Gets all incorrectly flagged cells (flagged but not a mine)
 */
export function getIncorrectFlags(board: Board): { row: number; col: number }[] {
  const incorrectFlags: { row: number; col: number }[] = [];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < (board[0]?.length || 0); col++) {
      const cell = board[row][col];
      if (cell.isFlagged && !cell.isMine) {
        incorrectFlags.push({ row, col });
      }
    }
  }

  return incorrectFlags;
}
