import { Cell } from "../types";
import { NUMBER_COLORS } from "../constants";
import { cn } from "@/lib/utils/cn";

/**
 * Gets the appropriate font size class based on cell size
 * Numbers should be large, bold, and fill most of the cell
 */
export function getFontSizeClass(cellSize: number): string {
  if (cellSize >= 32) {
    return "text-2xl sm:text-3xl";
  }
  if (cellSize >= 24) {
    return "text-xl sm:text-2xl";
  }
  return "text-lg sm:text-xl";
}

/**
 * Gets the className for a cell based on its state (Classic Windows Minesweeper style)
 */
export function getCellClassName(cell: Cell, isIncorrectFlag: boolean): string {
  const baseClasses = "flex items-center justify-center font-black select-none";

  // Revealed cell
  if (cell.isRevealed) {
    if (cell.isMine) {
      // Clicked mine (red background)
      if (cell.isClickedMine) {
        return cn(baseClasses, "ms-cell-mine-clicked cursor-default");
      }
      // Regular mine (revealed after game over)
      return cn(baseClasses, "ms-cell-revealed cursor-default");
    }

    // Empty revealed cell with number
    return cn(
      baseClasses,
      "ms-cell-revealed cursor-default",
      cell.adjacentMines > 0 && getNumberColor(cell.adjacentMines)
    );
  }

  // Flagged cell with incorrect flag (shown after game over)
  if (isIncorrectFlag) {
    return cn(baseClasses, "ms-cell-incorrect-flag");
  }

  // Unrevealed cell (raised 3D button look)
  return cn(baseClasses, "ms-cell-unrevealed");
}

/**
 * Gets the color class for a number based on adjacent mine count
 */
export function getNumberColor(adjacentMines: number): string {
  return NUMBER_COLORS[adjacentMines as keyof typeof NUMBER_COLORS] || "";
}

/**
 * Gets the content to display in a cell
 */
export function getCellContent(cell: Cell): string {
  if (cell.isFlagged) {
    return "🚩";
  }

  if (cell.isRevealed) {
    if (cell.isMine) {
      return "💣";
    }
    if (cell.adjacentMines > 0) {
      return cell.adjacentMines.toString();
    }
  }

  return "";
}

// Re-export formatTime from shared utilities
export { formatTimeClassic as formatTime } from "@/lib/utils/formatTime";
