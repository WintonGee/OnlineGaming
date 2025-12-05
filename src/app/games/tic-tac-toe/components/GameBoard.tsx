"use client";

import { Board, Cell } from "../types";
import { X, Circle } from "lucide-react";

interface GameBoardProps {
  board: Board;
  winningLine: number[] | null;
  disabled: boolean;
  onCellClick: (index: number) => void;
}

interface CellProps {
  value: Cell;
  index: number;
  isWinning: boolean;
  disabled: boolean;
  onClick: () => void;
}

function CellButton({ value, index, isWinning, disabled, onClick }: CellProps) {
  const row = Math.floor(index / 3);
  const col = index % 3;

  // Border classes based on position
  const borderClasses = [
    row < 2 ? "border-b-2" : "",
    col < 2 ? "border-r-2" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={`
        aspect-square w-full
        flex items-center justify-center
        border-gray-400 dark:border-gray-600
        ${borderClasses}
        ${isWinning ? "bg-green-100 dark:bg-green-900/30" : ""}
        ${
          !disabled && value === null
            ? "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            : ""
        }
        ${disabled && value === null ? "cursor-not-allowed" : ""}
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-400
      `}
      aria-label={value ? `Cell ${index + 1}: ${value}` : `Empty cell ${index + 1}`}
    >
      {value === "X" && (
        <X
          className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 stroke-[3] ${
            isWinning
              ? "text-green-600 dark:text-green-400"
              : "text-black dark:text-white"
          }`}
        />
      )}
      {value === "O" && (
        <Circle
          className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 stroke-[3] ${
            isWinning
              ? "text-green-600 dark:text-green-400"
              : "text-black dark:text-white"
          }`}
        />
      )}
    </button>
  );
}

export default function GameBoard({
  board,
  winningLine,
  disabled,
  onCellClick,
}: GameBoardProps) {
  return (
    <div className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] mx-auto">
      <div className="grid grid-cols-3 border-2 border-gray-400 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-black">
        {board.map((cell, index) => (
          <CellButton
            key={index}
            value={cell}
            index={index}
            isWinning={winningLine?.includes(index) ?? false}
            disabled={disabled}
            onClick={() => onCellClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
