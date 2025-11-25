import { useCallback, useEffect } from "react";
import { checkSolution } from "../logic/sudokuLogic";
import { HelperActionResult } from "../types";
import { useSudokuState } from "./useSudokuState";
import { useSudokuValidation } from "./useSudokuValidation";
import { useSudokuHistory } from "./useSudokuHistory";
import { useSudokuCandidates } from "./useSudokuCandidates";

/**
 * Main Sudoku game hook - orchestrates all game functionality
 * Composes state, validation, history, and candidate management
 */
export function useSudokuGame() {
  // Core game state
  const {
    selectedDifficulty,
    initialGrid,
    currentGrid,
    solution,
    selectedCell,
    isGenerating,
    inputMode,
    hasCompleted,
    showWinDialog,
    hasSolution,
    setSelectedCell,
    setInputMode,
    setCurrentGrid,
    setHasCompleted,
    setShowWinDialog,
    handleNewGame,
    handleDifficultyChange,
    handleCellChange: baseCellChange,
    resetToInitialGrid,
    revealSolution,
  } = useSudokuState();

  // Validation logic
  const {
    incorrectCells,
    handleCheckCell,
    handleCheckPuzzle,
    clearIncorrectCells,
    setIncorrectCells,
  } = useSudokuValidation(
    currentGrid,
    initialGrid,
    solution,
    selectedCell,
    hasCompleted
  );

  // History management
  const { canUndo, saveToHistory, handleUndo, clearHistory } =
    useSudokuHistory();

  // Candidate management
  const {
    candidates,
    autoCandidateMode,
    setAutoCandidateMode,
    setCandidates,
    handleCandidateToggle: baseCandidateToggle,
    clearCellCandidates,
    resetCandidates,
  } = useSudokuCandidates(currentGrid, initialGrid);

  // Wrapped cell change handler that saves to history and clears candidates
  const handleCellChange = useCallback(
    (row: number, col: number, value: number | null) => {
      saveToHistory(currentGrid, candidates);
      baseCellChange(row, col, value);

      if (!autoCandidateMode && value !== null) {
        clearCellCandidates(row, col);
      }
    },
    [
      saveToHistory,
      currentGrid,
      candidates,
      baseCellChange,
      autoCandidateMode,
      clearCellCandidates,
    ]
  );

  // Wrapped candidate toggle that saves to history
  const handleCandidateToggle = useCallback(
    (row: number, col: number, value: number) => {
      const toggled = baseCandidateToggle(row, col, value);
      if (toggled) {
        saveToHistory(currentGrid, candidates);
      }
    },
    [baseCandidateToggle, saveToHistory, currentGrid, candidates]
  );

  // Undo handler that restores both grid and candidates
  const handleUndoAction = useCallback(() => {
    handleUndo((grid, restoredCandidates) => {
      setCurrentGrid(grid);
      setCandidates(restoredCandidates);
    });
  }, [handleUndo, setCurrentGrid, setCandidates]);

  // Clear cell handler
  const handleClearCell = useCallback(
    (row: number, col: number) => {
      if (initialGrid[row][col] !== null) {
        return;
      }

      const cellValue = currentGrid[row]?.[col] ?? null;
      const cellCandidates = candidates[row]?.[col] ?? new Set<number>();
      const hasValue = cellValue !== null;
      const hasCandidates = cellCandidates.size > 0;

      if (!hasValue && !hasCandidates) {
        return;
      }

      saveToHistory(currentGrid, candidates);
      baseCellChange(row, col, null);

      if (!autoCandidateMode) {
        clearCellCandidates(row, col);
      }
    },
    [
      autoCandidateMode,
      candidates,
      currentGrid,
      initialGrid,
      saveToHistory,
      baseCellChange,
      clearCellCandidates,
    ]
  );

  // Reveal single cell
  const handleRevealCell = useCallback((): HelperActionResult => {
    if (!selectedCell) {
      return { status: "info", message: "Select a cell to reveal." };
    }

    if (!solution.length || !currentGrid.length) {
      return { status: "info", message: "Puzzle is still loading." };
    }

    const { row, col } = selectedCell;

    if (initialGrid[row]?.[col] !== null) {
      return {
        status: "info",
        message: "Cannot reveal a given cell.",
      };
    }

    handleCellChange(row, col, solution[row][col]);
    return {
      status: "success",
      message: "Cell revealed.",
    };
  }, [currentGrid, handleCellChange, initialGrid, selectedCell, solution]);

  // Reveal entire puzzle
  const handleRevealPuzzle = useCallback((): HelperActionResult => {
    if (!solution.length || !currentGrid.length) {
      return { status: "info", message: "Puzzle is still loading." };
    }

    saveToHistory(currentGrid, candidates);
    revealSolution();
    resetCandidates();

    return {
      status: "warning",
      message: "Puzzle revealed.",
    };
  }, [
    currentGrid,
    saveToHistory,
    solution,
    candidates,
    revealSolution,
    resetCandidates,
  ]);

  // Reset puzzle to initial state
  const handleResetPuzzle = useCallback((): HelperActionResult => {
    if (!initialGrid.length) {
      return { status: "info", message: "Puzzle is still loading." };
    }

    clearHistory();
    resetToInitialGrid();
    clearIncorrectCells();
    resetCandidates();

    return {
      status: "success",
      message: "Puzzle reset to its initial state.",
    };
  }, [
    initialGrid,
    clearHistory,
    resetToInitialGrid,
    clearIncorrectCells,
    resetCandidates,
  ]);

  // Check for puzzle completion
  useEffect(() => {
    if (
      hasCompleted ||
      !currentGrid.length ||
      !solution.length ||
      isGenerating
    ) {
      return;
    }

    const result = checkSolution(currentGrid, solution);

    if (!result.isComplete) {
      return;
    }

    if (result.isCorrect) {
      setShowWinDialog(true);
      setHasCompleted(true);
      clearIncorrectCells();
    }
  }, [
    currentGrid,
    solution,
    hasCompleted,
    isGenerating,
    setShowWinDialog,
    setHasCompleted,
    clearIncorrectCells,
  ]);

  return {
    // State
    autoCandidateMode,
    candidates,
    canUndo,
    currentGrid,
    hasSolution,
    incorrectCells,
    initialGrid,
    inputMode,
    isGenerating,
    selectedCell,
    selectedDifficulty,
    showWinDialog,

    // Setters
    setAutoCandidateMode,
    setInputMode,
    setSelectedCell,
    setShowWinDialog,

    // Actions
    handleCheckCell,
    handleCheckPuzzle,
    handleCandidateToggle,
    handleCellChange,
    handleClearCell,
    handleDifficultyChange,
    handleNewGame,
    handleResetPuzzle,
    handleRevealCell,
    handleRevealPuzzle,
    handleUndo: handleUndoAction,
  };
}
