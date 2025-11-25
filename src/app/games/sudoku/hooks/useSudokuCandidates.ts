import { useCallback, useEffect, useState } from "react";
import { CandidatesGrid, Grid } from "../types";
import {
  createEmptyCandidatesGrid,
  cloneCandidatesGrid,
  generateAutoCandidates,
} from "../utils/candidateUtils";

/**
 * Candidate management hook
 * Handles candidate notes (pencil marks) and auto-candidate mode
 */
export function useSudokuCandidates(
  currentGrid: Grid,
  initialGrid: Grid
) {
  const [candidates, setCandidates] = useState<CandidatesGrid>(
    createEmptyCandidatesGrid()
  );
  const [autoCandidateMode, setAutoCandidateMode] = useState(false);

  // Update candidates when auto-candidate mode changes
  useEffect(() => {
    if (!currentGrid.length) {
      return;
    }

    if (autoCandidateMode) {
      setCandidates(generateAutoCandidates(currentGrid, initialGrid));
    } else {
      setCandidates(createEmptyCandidatesGrid());
    }
  }, [autoCandidateMode, currentGrid, initialGrid]);

  const handleCandidateToggle = useCallback(
    (row: number, col: number, value: number): boolean => {
      if (initialGrid[row][col] !== null || currentGrid[row][col] !== null) {
        return false;
      }

      if (autoCandidateMode) {
        return false;
      }

      setCandidates((prev) => {
        const next = cloneCandidatesGrid(prev);
        const cellCandidates = next[row][col];

        if (cellCandidates.has(value)) {
          cellCandidates.delete(value);
        } else {
          cellCandidates.add(value);
        }

        return next;
      });

      return true;
    },
    [autoCandidateMode, currentGrid, initialGrid]
  );

  const clearCellCandidates = useCallback(
    (row: number, col: number) => {
      if (autoCandidateMode) {
        return;
      }

      setCandidates((prev) => {
        const next = cloneCandidatesGrid(prev);
        next[row][col].clear();
        return next;
      });
    },
    [autoCandidateMode]
  );

  const resetCandidates = useCallback(() => {
    setCandidates(
      autoCandidateMode
        ? generateAutoCandidates(initialGrid, initialGrid)
        : createEmptyCandidatesGrid()
    );
  }, [autoCandidateMode, initialGrid]);

  return {
    candidates,
    autoCandidateMode,
    setAutoCandidateMode,
    setCandidates,
    handleCandidateToggle,
    clearCellCandidates,
    resetCandidates,
  };
}
