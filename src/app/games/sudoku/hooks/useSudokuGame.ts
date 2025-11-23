import { useCallback, useEffect, useState } from "react";
import { checkSolution, copyGrid, generatePuzzle } from "../logic/sudokuLogic";
import {
  CandidatesGrid,
  CellPosition,
  Difficulty,
  Grid,
  HistoryState,
  InputMode,
  HelperActionResult,
} from "../types";
import {
  cloneCandidatesGrid,
  computeIncorrectCells,
  createEmptyCandidatesGrid,
  generateAutoCandidates,
} from "../utils/gameUtils";
import { dedupeCells } from "../utils/gridUtils";
import { HISTORY_LIMIT } from "../constants";

export function useSudokuGame() {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("Medium");
  const [initialGrid, setInitialGrid] = useState<Grid>([]);
  const [currentGrid, setCurrentGrid] = useState<Grid>([]);
  const [solution, setSolution] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [incorrectCells, setIncorrectCells] = useState<CellPosition[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("Normal");
  const [candidates, setCandidates] = useState<CandidatesGrid>(
    createEmptyCandidatesGrid()
  );
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [autoCandidateMode, setAutoCandidateMode] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);

  const saveToHistory = useCallback(() => {
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
  }, [candidates, currentGrid]);

  const initializeGame = useCallback((difficulty: Difficulty) => {
    setIsGenerating(true);
    setIncorrectCells([]);
    setSelectedCell(null);
    setCandidates(createEmptyCandidatesGrid());
    setHasCompleted(false);
    setShowWinDialog(false);

    setTimeout(() => {
      const { puzzle, solution: sol } = generatePuzzle(difficulty);
      setInitialGrid(puzzle);
      setCurrentGrid(copyGrid(puzzle));
      setSolution(sol);
      setIsGenerating(false);
    }, 100);
  }, []);

  const handleNewGame = useCallback(() => {
    initializeGame(selectedDifficulty);
  }, [initializeGame, selectedDifficulty]);

  const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  }, []);

  const handleCellChange = useCallback(
    (row: number, col: number, value: number | null) => {
      saveToHistory();
      setCurrentGrid((prevGrid) => {
        const updatedGrid = copyGrid(prevGrid);
        updatedGrid[row][col] = value;
        setIncorrectCells(computeIncorrectCells(updatedGrid));

        if (!autoCandidateMode) {
          setCandidates((prevCandidates) => {
            const updatedCandidates = cloneCandidatesGrid(prevCandidates);
            if (value !== null) {
              updatedCandidates[row][col].clear();
            }
            return updatedCandidates;
          });
        }

        return updatedGrid;
      });
    },
    [autoCandidateMode, saveToHistory]
  );

  const handleCandidateToggle = useCallback(
    (row: number, col: number, value: number) => {
      if (initialGrid[row][col] !== null || currentGrid[row][col] !== null) {
        return;
      }

      if (autoCandidateMode) {
        return;
      }

      saveToHistory();
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
    },
    [autoCandidateMode, currentGrid, initialGrid, saveToHistory]
  );

  const handleUndo = useCallback(() => {
    setHistory((prev) => {
      if (!prev.length) {
        return prev;
      }

      const previousState = prev[prev.length - 1];
      setCurrentGrid(previousState.grid);
      setCandidates(previousState.candidates);
      setIncorrectCells(computeIncorrectCells(previousState.grid));
      return prev.slice(0, -1);
    });
  }, []);

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

      saveToHistory();
      setCurrentGrid((prevGrid) => {
        const updatedGrid = copyGrid(prevGrid);
        updatedGrid[row][col] = null;
        setIncorrectCells(computeIncorrectCells(updatedGrid));
        return updatedGrid;
      });

      if (!autoCandidateMode) {
        setCandidates((prev) => {
          const next = cloneCandidatesGrid(prev);
          next[row][col].clear();
          return next;
        });
      }
    },
    [autoCandidateMode, candidates, currentGrid, initialGrid, saveToHistory]
  );

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

  const handleRevealPuzzle = useCallback((): HelperActionResult => {
    if (!solution.length || !currentGrid.length) {
      return { status: "info", message: "Puzzle is still loading." };
    }

    saveToHistory();
    setCurrentGrid(copyGrid(solution));
    setCandidates(createEmptyCandidatesGrid());
    setIncorrectCells([]);
    setHasCompleted(true);
    setShowWinDialog(false);
    setSelectedCell(null);

    return {
      status: "warning",
      message: "Puzzle revealed.",
    };
  }, [currentGrid, saveToHistory, solution]);

  const handleResetPuzzle = useCallback((): HelperActionResult => {
    if (!initialGrid.length) {
      return { status: "info", message: "Puzzle is still loading." };
    }

    setHistory([]);
    setCurrentGrid(copyGrid(initialGrid));
    setIncorrectCells([]);
    setSelectedCell(null);
    setHasCompleted(false);
    setShowWinDialog(false);
    setCandidates(
      autoCandidateMode
        ? generateAutoCandidates(initialGrid, initialGrid)
        : createEmptyCandidatesGrid()
    );

    return {
      status: "success",
      message: "Puzzle reset to its initial state.",
    };
  }, [autoCandidateMode, initialGrid]);

  useEffect(() => {
    initializeGame(selectedDifficulty);
  }, [initializeGame]);

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

  useEffect(() => {
    if (hasCompleted || !currentGrid.length || !solution.length) {
      return;
    }

    const result = checkSolution(currentGrid, solution);

    if (!result.isComplete) {
      return;
    }

    if (result.isCorrect) {
      setShowWinDialog(true);
      setHasCompleted(true);
      setIncorrectCells([]);
    } else {
      setIncorrectCells(computeIncorrectCells(currentGrid));
    }
  }, [currentGrid, solution, hasCompleted]);

  const canUndo = history.length > 0;
  const hasSolution = solution.length > 0;

  return {
    autoCandidateMode,
    candidates,
    canUndo,
    currentGrid,
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
    handleUndo,
    hasSolution,
    incorrectCells,
    initialGrid,
    inputMode,
    isGenerating,
    selectedCell,
    selectedDifficulty,
    setAutoCandidateMode,
    setInputMode,
    setSelectedCell,
    setShowWinDialog,
    showWinDialog,
  };
}

