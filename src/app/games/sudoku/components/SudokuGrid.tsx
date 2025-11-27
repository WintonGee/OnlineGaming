"use client";

import { Grid, CellPosition, CandidatesGrid } from "../types";
import { cn } from "@/lib/shared/utils/cn";
import {
  isCellInitial,
  getCellBorderClasses,
  getBoxIndices,
} from "../utils/gridUtils";
import { getCellClassName } from "../utils/styleUtils";
import { GRID_SIZE } from "../constants";

interface SudokuGridProps {
  grid: Grid;
  initialGrid: Grid;
  selectedCell: CellPosition | null;
  onCellSelect: (position: CellPosition) => void;
  onCellChange: (row: number, col: number, value: number | null) => void;
  incorrectCells?: CellPosition[];
  candidates?: CandidatesGrid;
}

export default function SudokuGrid({
  grid,
  initialGrid,
  selectedCell,
  onCellSelect,
  onCellChange,
  incorrectCells = [],
  candidates,
}: SudokuGridProps) {
  const isCellSelected = (row: number, col: number): boolean => {
    return selectedCell?.row === row && selectedCell?.col === col;
  };

  const isCellHighlighted = (row: number, col: number): boolean => {
    if (!selectedCell) return false;

    // Same row or column
    if (selectedCell.row === row || selectedCell.col === col) return true;

    // Same 3x3 box
    const { boxRow, boxCol } = getBoxIndices(
      selectedCell.row,
      selectedCell.col
    );
    const { boxRow: cellBoxRow, boxCol: cellBoxCol } = getBoxIndices(row, col);

    return boxRow === cellBoxRow && boxCol === cellBoxCol;
  };

  const isCellIncorrect = (row: number, col: number): boolean => {
    return incorrectCells.some((cell) => cell.row === row && cell.col === col);
  };

  const handleCellClick = (row: number, col: number) => {
    onCellSelect({ row, col });
  };

  const getCellCandidates = (row: number, col: number): Set<number> => {
    if (!candidates || !candidates[row] || !candidates[row][col]) {
      return new Set();
    }
    return candidates[row][col];
  };

  const selectedValue =
    selectedCell && grid[selectedCell.row]?.[selectedCell.col] !== undefined
      ? grid[selectedCell.row][selectedCell.col]
      : null;

  return (
    <div className="inline-block rounded-2xl bg-white dark:bg-gray-950 p-2 sm:p-3 shadow-lg border border-gray-200 dark:border-gray-800">
      <div
        className={`grid gap-0`}
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isInitial = isCellInitial(initialGrid, rowIndex, colIndex);
            const isSelected = isCellSelected(rowIndex, colIndex);
            const isHighlighted = isCellHighlighted(rowIndex, colIndex);
            const isIncorrect = isCellIncorrect(rowIndex, colIndex);
            const cellCandidates = getCellCandidates(rowIndex, colIndex);
            const hasCandidates = cellCandidates.size > 0 && cell === null;
            const isSameValue =
              selectedValue !== null &&
              cell !== null &&
              cell === selectedValue &&
              !isSelected;

            const borderClasses = getCellBorderClasses(rowIndex, colIndex);
            const cellClassName = getCellClassName({
              isInitial,
              isSelected,
              isHighlighted,
              isIncorrect,
              isSameValue,
              hasValue: cell !== null,
              ...borderClasses,
            });

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={cellClassName}
              >
                {cell !== null ? (
                  <span>{cell}</span>
                ) : hasCandidates ? (
                  <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
                    {Array.from({ length: GRID_SIZE }, (_, i) => i + 1).map(
                      (num) => (
                        <span
                          key={num}
                          className={cn(
                            "text-[0.45rem] sm:text-[0.5rem] md:text-[0.6rem] lg:text-[0.8rem] leading-none flex items-center justify-center",
                            cellCandidates.has(num)
                              ? "text-black dark:text-white"
                              : "text-transparent"
                          )}
                        >
                          {num}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  ""
                )}
                {isIncorrect && (
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
