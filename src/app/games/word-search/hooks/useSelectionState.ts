"use client";

import { useState, useCallback } from "react";
import { SelectionState, CellPosition } from "../types";
import { getCellsBetween, isValidSelection } from "../logic/gridGenerator";

const initialSelectionState: SelectionState = {
  isSelecting: false,
  startCell: null,
  currentCell: null,
  selectedCells: [],
};

/**
 * Hook for managing word selection state
 */
export function useSelectionState(gridSize: number) {
  const [selectionState, setSelectionState] =
    useState<SelectionState>(initialSelectionState);

  /**
   * Start a new selection
   */
  const handleSelectionStart = useCallback((row: number, col: number) => {
    const startCell = { row, col };
    setSelectionState({
      isSelecting: true,
      startCell,
      currentCell: startCell,
      selectedCells: [startCell],
    });
  }, []);

  /**
   * Update selection as user drags
   */
  const handleSelectionMove = useCallback(
    (row: number, col: number) => {
      setSelectionState((prev) => {
        if (!prev.isSelecting || !prev.startCell) return prev;

        const currentCell = { row, col };

        // Check if it's a valid selection (straight line)
        if (!isValidSelection(prev.startCell, currentCell)) {
          return prev;
        }

        const selectedCells = getCellsBetween(
          prev.startCell,
          currentCell,
          gridSize
        );

        return {
          ...prev,
          currentCell,
          selectedCells,
        };
      });
    },
    [gridSize]
  );

  /**
   * End selection
   */
  const handleSelectionEnd = useCallback(() => {
    setSelectionState((prev) => ({
      ...prev,
      isSelecting: false,
    }));
  }, []);

  /**
   * Clear selection completely
   */
  const clearSelection = useCallback(() => {
    setSelectionState(initialSelectionState);
  }, []);

  /**
   * Check if a cell is currently selected
   */
  const isCellSelected = useCallback(
    (row: number, col: number): boolean => {
      return selectionState.selectedCells.some(
        (cell) => cell.row === row && cell.col === col
      );
    },
    [selectionState.selectedCells]
  );

  return {
    selectionState,
    handleSelectionStart,
    handleSelectionMove,
    handleSelectionEnd,
    clearSelection,
    isCellSelected,
  };
}
