"use client";

import { useRef, useCallback, useEffect } from "react";
import { GridCell, CellPosition, PlacedWord } from "../types";

interface WordSearchGridProps {
  grid: GridCell[][];
  words: PlacedWord[];
  selectedCells: CellPosition[];
  onSelectionStart: (row: number, col: number) => void;
  onSelectionMove: (row: number, col: number) => void;
  onSelectionEnd: () => void;
  disabled?: boolean;
}

export default function WordSearchGrid({
  grid,
  words,
  selectedCells,
  onSelectionStart,
  onSelectionMove,
  onSelectionEnd,
  disabled = false,
}: WordSearchGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isSelectingRef = useRef(false);

  // Check if a cell is part of a found word
  const isCellPartOfFoundWord = useCallback(
    (row: number, col: number): boolean => {
      const cell = grid[row]?.[col];
      if (!cell) return false;

      return cell.wordIndices.some((wordIdx) => words[wordIdx]?.found);
    },
    [grid, words]
  );

  // Check if a cell is currently selected
  const isCellSelected = useCallback(
    (row: number, col: number): boolean => {
      return selectedCells.some(
        (cell) => cell.row === row && cell.col === col
      );
    },
    [selectedCells]
  );

  // Get cell position from mouse/touch event
  const getCellFromEvent = useCallback(
    (clientX: number, clientY: number): { row: number; col: number } | null => {
      if (!gridRef.current) return null;

      const gridRect = gridRef.current.getBoundingClientRect();
      const cellSize = gridRect.width / grid.length;

      const col = Math.floor((clientX - gridRect.left) / cellSize);
      const row = Math.floor((clientY - gridRect.top) / cellSize);

      if (row >= 0 && row < grid.length && col >= 0 && col < grid.length) {
        return { row, col };
      }
      return null;
    },
    [grid.length]
  );

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();

      const cell = getCellFromEvent(e.clientX, e.clientY);
      if (cell) {
        isSelectingRef.current = true;
        onSelectionStart(cell.row, cell.col);
      }
    },
    [disabled, getCellFromEvent, onSelectionStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isSelectingRef.current || disabled) return;

      const cell = getCellFromEvent(e.clientX, e.clientY);
      if (cell) {
        onSelectionMove(cell.row, cell.col);
      }
    },
    [disabled, getCellFromEvent, onSelectionMove]
  );

  const handleMouseUp = useCallback(() => {
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      onSelectionEnd();
    }
  }, [onSelectionEnd]);

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      e.preventDefault();

      const touch = e.touches[0];
      const cell = getCellFromEvent(touch.clientX, touch.clientY);
      if (cell) {
        isSelectingRef.current = true;
        onSelectionStart(cell.row, cell.col);
      }
    },
    [disabled, getCellFromEvent, onSelectionStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isSelectingRef.current || disabled) return;
      e.preventDefault();

      const touch = e.touches[0];
      const cell = getCellFromEvent(touch.clientX, touch.clientY);
      if (cell) {
        onSelectionMove(cell.row, cell.col);
      }
    },
    [disabled, getCellFromEvent, onSelectionMove]
  );

  const handleTouchEnd = useCallback(() => {
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      onSelectionEnd();
    }
  }, [onSelectionEnd]);

  // Global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelectingRef.current) {
        isSelectingRef.current = false;
        onSelectionEnd();
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [onSelectionEnd]);

  if (grid.length === 0) return null;

  const gridSize = grid.length;

  return (
    <div
      ref={gridRef}
      className="relative select-none touch-none mx-auto"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gap: "1px",
        maxWidth: "min(100%, 500px)",
        aspectRatio: "1",
        backgroundColor: "#e5e7eb",
        padding: "1px",
        borderRadius: "8px",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected = isCellSelected(rowIndex, colIndex);
          const isFound = isCellPartOfFoundWord(rowIndex, colIndex);

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                flex items-center justify-center font-bold text-sm sm:text-base md:text-lg
                transition-colors duration-150
                ${
                  isFound
                    ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200"
                    : isSelected
                    ? "bg-blue-300 dark:bg-blue-600 text-blue-900 dark:text-blue-100"
                    : "bg-white dark:bg-gray-900 text-black dark:text-white"
                }
                ${disabled ? "opacity-50" : ""}
              `}
              style={{
                aspectRatio: "1",
                fontSize: `clamp(0.75rem, ${2.5 / gridSize}vw + 0.5rem, 1.25rem)`,
              }}
            >
              {cell.letter}
            </div>
          );
        })
      )}
    </div>
  );
}
