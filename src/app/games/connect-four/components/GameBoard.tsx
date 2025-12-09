"use client";

import { useState } from "react";
import { Board, Player } from "../types";
import { ROWS, COLS } from "../constants";
import { canDropPiece, getDropRow } from "../logic/gameLogic";

interface GameBoardProps {
  board: Board;
  currentPlayer: Player;
  winningLine: [number, number][] | null;
  disabled: boolean;
  onColumnClick: (col: number) => void;
}

interface CellProps {
  value: Player | null;
  isWinning: boolean;
  isPreview: boolean;
  previewPlayer: Player;
}

function Cell({ value, isWinning, isPreview, previewPlayer }: CellProps) {
  const getDiscColor = () => {
    if (isPreview) {
      return previewPlayer === 1
        ? "bg-red-300 dark:bg-red-400/50"
        : "bg-yellow-300 dark:bg-yellow-400/50";
    }
    if (value === 1) {
      return isWinning
        ? "bg-red-500 ring-4 ring-green-400 dark:ring-green-500"
        : "bg-red-500 dark:bg-red-600";
    }
    if (value === 2) {
      return isWinning
        ? "bg-yellow-400 ring-4 ring-green-400 dark:ring-green-500"
        : "bg-yellow-400 dark:bg-yellow-500";
    }
    return "bg-white dark:bg-gray-900";
  };

  return (
    <div className="aspect-square p-1 sm:p-1.5">
      <div
        className={`
          w-full h-full rounded-full
          ${getDiscColor()}
          ${value || isPreview ? "shadow-inner" : ""}
          transition-all duration-150
        `}
      />
    </div>
  );
}

export default function GameBoard({
  board,
  currentPlayer,
  winningLine,
  disabled,
  onColumnClick,
}: GameBoardProps) {
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const isWinningCell = (row: number, col: number): boolean => {
    if (!winningLine) return false;
    return winningLine.some(([r, c]) => r === row && c === col);
  };

  const getPreviewRow = (col: number): number | null => {
    if (disabled || hoverCol !== col || !canDropPiece(board, col)) {
      return null;
    }
    return getDropRow(board, col);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Board */}
      <div
        className="bg-blue-600 dark:bg-blue-700 p-2 sm:p-3 rounded-lg shadow-lg"
        onMouseLeave={() => setHoverCol(null)}
      >
        {/* Column click areas */}
        <div className="grid grid-cols-7 gap-0">
          {Array.from({ length: COLS }).map((_, col) => (
            <button
              key={`col-${col}`}
              className={`
                flex flex-col gap-0
                ${!disabled && canDropPiece(board, col) ? "cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-600" : "cursor-not-allowed"}
                transition-colors duration-150 rounded
              `}
              onClick={() => !disabled && onColumnClick(col)}
              onMouseEnter={() => !disabled && setHoverCol(col)}
              disabled={disabled || !canDropPiece(board, col)}
              aria-label={`Drop piece in column ${col + 1}`}
            >
              {Array.from({ length: ROWS }).map((_, row) => {
                const previewRow = getPreviewRow(col);
                const isPreview = previewRow === row && hoverCol === col;

                return (
                  <Cell
                    key={`${row}-${col}`}
                    value={board[row][col]}
                    isWinning={isWinningCell(row, col)}
                    isPreview={isPreview}
                    previewPlayer={currentPlayer}
                  />
                );
              })}
            </button>
          ))}
        </div>
      </div>

      {/* Column indicators */}
      <div className="grid grid-cols-7 gap-0 mt-2 w-full max-w-[calc(7*3rem)] sm:max-w-[calc(7*3.5rem)] md:max-w-[calc(7*4rem)]">
        {Array.from({ length: COLS }).map((_, col) => (
          <div
            key={`indicator-${col}`}
            className={`
              text-center text-xs sm:text-sm font-medium
              ${hoverCol === col && !disabled && canDropPiece(board, col)
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-400 dark:text-gray-600"
              }
              transition-colors duration-150
            `}
          >
            {col + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
