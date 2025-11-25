import { useCallback, useState } from "react";
import { copyGrid } from "../logic/sudokuLogic";
import { CandidatesGrid, Grid, HistoryState } from "../types";
import { cloneCandidatesGrid } from "../utils/candidateUtils";
import { HISTORY_LIMIT } from "../constants";

/**
 * History and undo/redo functionality hook
 * Manages the history stack for undo operations
 */
export function useSudokuHistory() {
  const [history, setHistory] = useState<HistoryState[]>([]);

  const saveToHistory = useCallback(
    (currentGrid: Grid, candidates: CandidatesGrid) => {
      setHistory((prev) => {
        const nextHistory = [
          ...prev,
          {
            grid: copyGrid(currentGrid),
            candidates: cloneCandidatesGrid(candidates),
          },
        ];
        if (nextHistory.length > HISTORY_LIMIT) {
          nextHistory.shift();
        }
        return nextHistory;
      });
    },
    []
  );

  const handleUndo = useCallback(
    (
      onRestore: (grid: Grid, candidates: CandidatesGrid) => void
    ): boolean => {
      if (!history.length) {
        return false;
      }

      const previousState = history[history.length - 1];
      onRestore(previousState.grid, previousState.candidates);
      setHistory((prev) => prev.slice(0, -1));
      return true;
    },
    [history]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const canUndo = history.length > 0;

  return {
    history,
    canUndo,
    saveToHistory,
    handleUndo,
    clearHistory,
  };
}
