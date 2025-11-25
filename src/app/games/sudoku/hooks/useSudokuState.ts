import { useCallback, useEffect, useState } from "react";
import { generatePuzzle, copyGrid } from "../logic/sudokuLogic";
import { CellPosition, Difficulty, Grid, InputMode } from "../types";

/**
 * Core game state management hook
 * Handles grid state, puzzle generation, and basic game settings
 */
export function useSudokuState() {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("Easy");
  const [initialGrid, setInitialGrid] = useState<Grid>([]);
  const [currentGrid, setCurrentGrid] = useState<Grid>([]);
  const [solution, setSolution] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("Normal");
  const [hasCompleted, setHasCompleted] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);

  const initializeGame = useCallback((difficulty: Difficulty) => {
    setIsGenerating(true);
    setSelectedCell(null);
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
      setCurrentGrid((prevGrid) => {
        const updatedGrid = copyGrid(prevGrid);
        updatedGrid[row][col] = value;
        return updatedGrid;
      });
    },
    []
  );

  const resetToInitialGrid = useCallback(() => {
    setCurrentGrid(copyGrid(initialGrid));
    setSelectedCell(null);
    setHasCompleted(false);
    setShowWinDialog(false);
  }, [initialGrid]);

  const revealSolution = useCallback(() => {
    setCurrentGrid(copyGrid(solution));
    setSelectedCell(null);
  }, [solution]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame(selectedDifficulty);
  }, [initializeGame]);

  const hasSolution = solution.length > 0;

  return {
    // State
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

    // Setters
    setSelectedCell,
    setInputMode,
    setCurrentGrid,
    setHasCompleted,
    setShowWinDialog,

    // Actions
    handleNewGame,
    handleDifficultyChange,
    handleCellChange,
    resetToInitialGrid,
    revealSolution,
    initializeGame,
  };
}
