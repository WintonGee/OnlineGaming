"use client";

import { useState, useCallback } from "react";
import { Board, Player } from "../types";
import { ROWS, COLS } from "../constants";

interface GameBoardProps {
  board: Board;
  currentPlayer: Player;
  winningLine: [number, number][] | null;
  lastMove: [number, number] | null;
  disabled: boolean;
  getColumnPreview: (col: number) => number | null;
  onColumnClick: (col: number) => void;
}

export default function GameBoard({
  board,
  currentPlayer,
  winningLine,
  lastMove,
  disabled,
  getColumnPreview,
  onColumnClick,
}: GameBoardProps) {
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const isWinningCell = useCallback(
    (row: number, col: number): boolean => {
      if (!winningLine) return false;
      return winningLine.some(([r, c]) => r === row && c === col);
    },
    [winningLine]
  );

  const isLastMoveCell = useCallback(
    (row: number, col: number): boolean => {
      if (!lastMove) return false;
      return lastMove[0] === row && lastMove[1] === col;
    },
    [lastMove]
  );

  const getPreviewRow = useCallback(
    (col: number): number | null => {
      if (disabled || hoverCol !== col) {
        return null;
      }
      return getColumnPreview(col);
    },
    [disabled, hoverCol, getColumnPreview]
  );

  const handleColumnClick = useCallback(
    (col: number) => {
      if (!disabled && getColumnPreview(col) !== null) {
        onColumnClick(col);
      }
    },
    [disabled, getColumnPreview, onColumnClick]
  );

  const handleMouseEnter = useCallback(
    (col: number) => {
      if (!disabled) {
        setHoverCol(col);
      }
    },
    [disabled]
  );

  const handleMouseLeave = useCallback(() => {
    setHoverCol(null);
  }, []);

  const getDiscStyles = (
    value: Player | null,
    isWinning: boolean,
    isPreview: boolean,
    isLastMove: boolean
  ): string => {
    if (isPreview) {
      return currentPlayer === 1
        ? "bg-red-400/60 dark:bg-red-500/40"
        : "bg-yellow-400/60 dark:bg-yellow-500/40";
    }
    if (value === 1) {
      if (isWinning) {
        return "bg-red-500 ring-4 ring-green-400 dark:ring-green-500 shadow-lg";
      }
      return isLastMove
        ? "bg-red-500 dark:bg-red-600 ring-2 ring-white dark:ring-white/80 shadow-lg"
        : "bg-red-500 dark:bg-red-600 shadow-md";
    }
    if (value === 2) {
      if (isWinning) {
        return "bg-yellow-400 ring-4 ring-green-400 dark:ring-green-500 shadow-lg";
      }
      return isLastMove
        ? "bg-yellow-400 dark:bg-yellow-500 ring-2 ring-white dark:ring-white/80 shadow-lg"
        : "bg-yellow-400 dark:bg-yellow-500 shadow-md";
    }
    return "bg-gray-100 dark:bg-gray-800 shadow-inner";
  };

  return (
    <div className="flex flex-col items-center">
      {/* Board Container */}
      <div
        className="bg-blue-600 dark:bg-blue-700 p-2 sm:p-3 rounded-xl shadow-xl"
        onMouseLeave={handleMouseLeave}
      >
        {/* Grid */}
        <div
          className="grid gap-1 sm:gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${COLS}, auto)`,
          }}
        >
          {Array.from({ length: COLS }).map((_, col) => {
            const isColumnHovered = hoverCol === col;
            const canDrop = getColumnPreview(col) !== null;
            const previewRow = getPreviewRow(col);

            return (
              <button
                key={`col-${col}`}
                className={`
                  flex flex-col gap-1 sm:gap-1.5 p-0 border-0 bg-transparent
                  rounded-lg transition-colors duration-100
                  ${!disabled && canDrop ? "cursor-pointer" : "cursor-not-allowed"}
                  ${isColumnHovered && !disabled && canDrop ? "bg-blue-500/50 dark:bg-blue-600/50" : ""}
                  focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-inset
                `}
                onClick={() => handleColumnClick(col)}
                onMouseEnter={() => handleMouseEnter(col)}
                disabled={disabled || !canDrop}
                aria-label={`Drop piece in column ${col + 1}`}
              >
                {Array.from({ length: ROWS }).map((_, row) => {
                  const value = board[row][col];
                  const isWinning = isWinningCell(row, col);
                  const isPreview = previewRow === row;
                  const isLastMove = isLastMoveCell(row, col);

                  return (
                    <div
                      key={`${row}-${col}`}
                      className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] md:w-[56px] md:h-[56px] p-1 sm:p-1.5"
                    >
                      <div
                        className={`
                          w-full h-full rounded-full
                          ${getDiscStyles(value, isWinning, isPreview, isLastMove)}
                          transition-all duration-150
                        `}
                      />
                    </div>
                  );
                })}
              </button>
            );
          })}
        </div>
      </div>

      {/* Column Numbers */}
      <div
        className="grid gap-1 sm:gap-1.5 mt-2"
        style={{
          gridTemplateColumns: `repeat(${COLS}, auto)`,
        }}
      >
        {Array.from({ length: COLS }).map((_, col) => {
          const isHovered = hoverCol === col && !disabled && getColumnPreview(col) !== null;
          return (
            <div
              key={`num-${col}`}
              className={`
                w-[40px] sm:w-[48px] md:w-[56px]
                text-center text-xs sm:text-sm font-medium
                transition-colors duration-150
                ${isHovered ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-600"}
              `}
            >
              {col + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
