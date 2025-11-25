import { useCallback, useEffect, useState } from "react";
import { checkSolution } from "../logic/sudokuLogic";
import { CellPosition, Grid, HelperActionResult } from "../types";
import { computeIncorrectCells } from "../utils/validation";
import { dedupeCells } from "../utils/gridUtils";

/**
 * Validation logic hook
 * Handles error checking, solution validation, and incorrect cell tracking
 */
export function useSudokuValidation(
  currentGrid: Grid,
  initialGrid: Grid,
  solution: Grid,
  selectedCell: CellPosition | null,
  hasCompleted: boolean
) {
  const [incorrectCells, setIncorrectCells] = useState<CellPosition[]>([]);

  // Update incorrect cells whenever the grid changes
  useEffect(() => {
    if (!currentGrid.length || hasCompleted) {
      return;
    }
    setIncorrectCells(computeIncorrectCells(currentGrid));
  }, [currentGrid, hasCompleted]);

  const handleCheckCell = useCallback((): HelperActionResult => {
    if (!selectedCell) {
      return { status: "info", message: "Select a cell to check." };
    }

    if (!solution.length || !currentGrid.length) {
      return { status: "info", message: "Puzzle is still loading." };
    }

    const { row, col } = selectedCell;

    if (initialGrid[row]?.[col] !== null) {
      return {
        status: "info",
        message: "Given cells are already correct.",
      };
    }

    const currentValue = currentGrid[row]?.[col] ?? null;

    if (currentValue === null) {
      return {
        status: "info",
        message: "Enter a value before checking the cell.",
      };
    }

    const duplicates = computeIncorrectCells(currentGrid);

    if (currentValue === solution[row][col]) {
      setIncorrectCells(dedupeCells(duplicates));
      return {
        status: "success",
        message: "Nice work! That cell is correct.",
      };
    }

    setIncorrectCells(dedupeCells([...duplicates, { row, col }]));
    return {
      status: "error",
      message: "That cell is incorrect. Try a different value.",
    };
  }, [currentGrid, initialGrid, selectedCell, solution]);

  const handleCheckPuzzle = useCallback((): HelperActionResult => {
    if (!solution.length || !currentGrid.length) {
      return { status: "info", message: "Puzzle is still loading." };
    }

    const result = checkSolution(currentGrid, solution);
    const duplicates = computeIncorrectCells(currentGrid);
    const highlighted = dedupeCells([...duplicates, ...result.incorrectCells]);
    setIncorrectCells(highlighted);

    if (result.isCorrect) {
      return { status: "success", message: "Everything looks perfect!" };
    }

    if (result.isComplete) {
      return {
        status: "error",
        message: `${result.incorrectCells.length} cell${
          result.incorrectCells.length === 1 ? "" : "s"
        } need attention.`,
      };
    }

    if (result.incorrectCells.length === 0) {
      return {
        status: "info",
        message: "No mistakes detected yet. Keep solving!",
      };
    }

    return {
      status: "info",
      message: `${result.incorrectCells.length} incorrect cell${
        result.incorrectCells.length === 1 ? "" : "s"
      } highlighted.`,
    };
  }, [currentGrid, solution]);

  const clearIncorrectCells = useCallback(() => {
    setIncorrectCells([]);
  }, []);

  return {
    incorrectCells,
    handleCheckCell,
    handleCheckPuzzle,
    clearIncorrectCells,
    setIncorrectCells,
  };
}
