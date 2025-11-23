import { useEffect } from "react";
import { CellPosition, Grid, InputMode } from "../types";
import { GRID_SIZE } from "../constants";
import { isCellInitial } from "../utils/gridUtils";

interface UseKeyboardNavigationProps {
  selectedCell: CellPosition | null;
  setSelectedCell: (cell: CellPosition) => void;
  initialGrid: Grid;
  inputMode: InputMode;
  onCandidateToggle: (row: number, col: number, value: number) => void;
  onCellChange: (row: number, col: number, value: number) => void;
  onClearCell: (row: number, col: number) => void;
  canUndo: boolean;
  onUndo: () => void;
}

/**
 * Custom hook that handles keyboard navigation and input for the Sudoku game
 */
export function useKeyboardNavigation({
  selectedCell,
  setSelectedCell,
  initialGrid,
  inputMode,
  onCandidateToggle,
  onCellChange,
  onClearCell,
  canUndo,
  onUndo,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Ctrl+Z (Windows/Linux) or Cmd+Z (Mac) for undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (canUndo) {
          onUndo();
          e.preventDefault();
        }
        return;
      }

      if (!selectedCell) return;

      const { row, col } = selectedCell;

      // Arrow key navigation
      if (e.key === "ArrowUp" && row > 0) {
        setSelectedCell({ row: row - 1, col });
        e.preventDefault();
      } else if (e.key === "ArrowDown" && row < GRID_SIZE - 1) {
        setSelectedCell({ row: row + 1, col });
        e.preventDefault();
      } else if (e.key === "ArrowLeft" && col > 0) {
        setSelectedCell({ row, col: col - 1 });
        e.preventDefault();
      } else if (e.key === "ArrowRight" && col < GRID_SIZE - 1) {
        setSelectedCell({ row, col: col + 1 });
        e.preventDefault();
      }
      // Number input (1-9)
      else if (e.key >= "1" && e.key <= "9") {
        if (!isCellInitial(initialGrid, row, col)) {
          const numericValue = parseInt(e.key, 10);
          if (inputMode === "Candidate") {
            onCandidateToggle(row, col, numericValue);
          } else {
            onCellChange(row, col, numericValue);
          }
        }
      }
      // Backspace or Delete to clear cell
      else if (e.key === "Backspace" || e.key === "Delete") {
        if (!isCellInitial(initialGrid, row, col)) {
          onClearCell(row, col);
        }
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedCell,
    setSelectedCell,
    initialGrid,
    inputMode,
    onCandidateToggle,
    onCellChange,
    onClearCell,
    canUndo,
    onUndo,
  ]);
}

