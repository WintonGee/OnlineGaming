import { Board } from '../types';

/**
 * Checks if the game is won
 * Win condition: All non-mine cells are revealed
 */
export function checkWinCondition(board: Board, totalMines: number): boolean {
  const height = board.length;
  const width = board[0].length;
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
    for (let col = 0; col < board[0].length; col++) {
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
  if (width < 5 || width > 50) {
    return { valid: false, error: 'Width must be between 5 and 50' };
  }

  if (height < 5 || height > 50) {
    return { valid: false, error: 'Height must be between 5 and 50' };
  }

  const totalCells = width * height;
  const maxMines = Math.floor(totalCells * 0.99); // 99% of cells

  if (mines < 1) {
    return { valid: false, error: 'Must have at least 1 mine' };
  }

  if (mines >= totalCells) {
    return { valid: false, error: 'Must have at least 1 safe cell' };
  }

  if (mines > maxMines) {
    return { valid: false, error: `Maximum ${maxMines} mines for ${width}x${height} board` };
  }

  return { valid: true };
}

/**
 * Gets all incorrectly flagged cells (flagged but not a mine)
 */
export function getIncorrectFlags(board: Board): { row: number; col: number }[] {
  const incorrectFlags: { row: number; col: number }[] = [];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      const cell = board[row][col];
      if (cell.isFlagged && !cell.isMine) {
        incorrectFlags.push({ row, col });
      }
    }
  }

  return incorrectFlags;
}
