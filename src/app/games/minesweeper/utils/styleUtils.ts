import { Cell } from '../types';
import { NUMBER_COLORS } from '../constants';
import { cn } from '@/lib/utils';

/**
 * Gets the className for a cell based on its state
 */
export function getCellClassName(
  cell: Cell,
  isIncorrectFlag: boolean
): string {
  const baseClasses = 'flex items-center justify-center font-bold cursor-pointer select-none transition-colors';

  // Revealed cell
  if (cell.isRevealed) {
    if (cell.isMine) {
      // Clicked mine (red background)
      if (cell.isClickedMine) {
        return cn(
          baseClasses,
          'bg-red-500 dark:bg-red-600 text-white cursor-default'
        );
      }
      // Regular mine
      return cn(
        baseClasses,
        'bg-gray-200 dark:bg-gray-700 cursor-default'
      );
    }

    // Empty revealed cell
    return cn(
      baseClasses,
      'bg-gray-100 dark:bg-gray-800 cursor-default',
      cell.adjacentMines > 0 && getNumberColor(cell.adjacentMines)
    );
  }

  // Flagged cell with incorrect flag (red background)
  if (isIncorrectFlag) {
    return cn(
      baseClasses,
      'bg-red-500 dark:bg-red-600 text-white'
    );
  }

  // Unrevealed cell
  return cn(
    baseClasses,
    'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
  );
}

/**
 * Gets the color class for a number based on adjacent mine count
 */
export function getNumberColor(adjacentMines: number): string {
  return NUMBER_COLORS[adjacentMines as keyof typeof NUMBER_COLORS] || '';
}

/**
 * Gets the content to display in a cell
 */
export function getCellContent(cell: Cell): string {
  if (cell.isFlagged) {
    return '🚩';
  }

  if (cell.isRevealed) {
    if (cell.isMine) {
      return '💣';
    }
    if (cell.adjacentMines > 0) {
      return cell.adjacentMines.toString();
    }
  }

  return '';
}

/**
 * Formats time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
