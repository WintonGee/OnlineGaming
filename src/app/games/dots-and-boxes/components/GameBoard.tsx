"use client";

import React from "react";
import { BoardState, GridSize, LineType, Player } from "../types";
import { PLAYER_COLORS } from "../constants";

interface GameBoardProps {
  board: BoardState;
  gridSize: GridSize;
  disabled: boolean;
  lastMove: { row: number; col: number; type: LineType } | null;
  onLineClick: (row: number, col: number, type: LineType) => void;
}

interface DotProps {
  size: "sm" | "md";
}

function Dot({ size }: DotProps) {
  const sizeClasses = size === "sm" ? "w-2 h-2" : "w-3 h-3";
  return (
    <div
      className={`${sizeClasses} rounded-full bg-gray-800 dark:bg-gray-200 flex-shrink-0`}
    />
  );
}

interface LineButtonProps {
  type: LineType;
  owner: Player | null;
  isLastMove: boolean;
  disabled: boolean;
  onClick: () => void;
  gridSize: GridSize;
}

function LineButton({
  type,
  owner,
  isLastMove,
  disabled,
  onClick,
  gridSize,
}: LineButtonProps) {
  const isHorizontal = type === "horizontal";

  // Calculate sizes based on grid size
  const getLineSize = () => {
    switch (gridSize) {
      case 3:
        return isHorizontal ? "w-16 sm:w-20 h-2" : "w-2 h-16 sm:h-20";
      case 4:
        return isHorizontal ? "w-12 sm:w-16 h-2" : "w-2 h-12 sm:h-16";
      case 5:
        return isHorizontal ? "w-10 sm:w-12 h-1.5" : "w-1.5 h-10 sm:h-12";
      case 6:
        return isHorizontal ? "w-8 sm:w-10 h-1.5" : "w-1.5 h-8 sm:h-10";
      default:
        return isHorizontal ? "w-12 sm:w-16 h-2" : "w-2 h-12 sm:h-16";
    }
  };

  const sizeClasses = getLineSize();

  // Determine the background color
  let bgClass = "bg-gray-200 dark:bg-gray-700";
  if (owner !== null) {
    bgClass = PLAYER_COLORS[owner].bg;
  }

  // Hover effect for undrawn lines
  const hoverClass =
    owner === null && !disabled
      ? "hover:bg-gray-400 dark:hover:bg-gray-500 cursor-pointer"
      : "";

  // Pulse animation for last move
  const lastMoveClass = isLastMove ? "animate-pulse" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled || owner !== null}
      className={`
        ${sizeClasses}
        ${bgClass}
        ${hoverClass}
        ${lastMoveClass}
        rounded-full
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400
        disabled:cursor-default
      `}
      aria-label={
        owner !== null
          ? `Line drawn by ${owner === 1 ? "red" : "blue"}`
          : "Empty line"
      }
    />
  );
}

interface BoxCellProps {
  owner: Player | null;
  gridSize: GridSize;
}

function BoxCell({ owner, gridSize }: BoxCellProps) {
  // Calculate sizes based on grid size
  const getBoxSize = () => {
    switch (gridSize) {
      case 3:
        return "w-16 sm:w-20 h-16 sm:h-20";
      case 4:
        return "w-12 sm:w-16 h-12 sm:h-16";
      case 5:
        return "w-10 sm:w-12 h-10 sm:h-12";
      case 6:
        return "w-8 sm:w-10 h-8 sm:h-10";
      default:
        return "w-12 sm:w-16 h-12 sm:h-16";
    }
  };

  const sizeClasses = getBoxSize();
  const bgClass = owner !== null ? PLAYER_COLORS[owner].bgLight : "";

  return (
    <div
      className={`
        ${sizeClasses}
        ${bgClass}
        transition-colors duration-300
      `}
    />
  );
}

export default function GameBoard({
  board,
  gridSize,
  disabled,
  lastMove,
  onLineClick,
}: GameBoardProps) {
  const isLastMove = (
    row: number,
    col: number,
    type: LineType
  ): boolean => {
    if (!lastMove) return false;
    return (
      lastMove.row === row && lastMove.col === col && lastMove.type === type
    );
  };

  // Render the board as a grid of rows
  // Each "double row" consists of:
  // 1. A horizontal line row (dots and horizontal lines)
  // 2. A vertical line row (vertical lines and box cells)

  const rows: React.ReactNode[] = [];

  for (let row = 0; row <= gridSize; row++) {
    // Horizontal line row
    const horizontalRow: React.ReactNode[] = [];
    for (let col = 0; col < gridSize; col++) {
      // Dot
      horizontalRow.push(
        <Dot key={`dot-${row}-${col}`} size={gridSize >= 5 ? "sm" : "md"} />
      );
      // Horizontal line
      horizontalRow.push(
        <LineButton
          key={`h-${row}-${col}`}
          type="horizontal"
          owner={board.horizontalLines[row][col]}
          isLastMove={isLastMove(row, col, "horizontal")}
          disabled={disabled}
          onClick={() => onLineClick(row, col, "horizontal")}
          gridSize={gridSize}
        />
      );
    }
    // Last dot in the row
    horizontalRow.push(
      <Dot
        key={`dot-${row}-${gridSize}`}
        size={gridSize >= 5 ? "sm" : "md"}
      />
    );

    rows.push(
      <div
        key={`h-row-${row}`}
        className="flex items-center justify-center gap-0"
      >
        {horizontalRow}
      </div>
    );

    // Vertical line row (except after the last horizontal row)
    if (row < gridSize) {
      const verticalRow: React.ReactNode[] = [];
      for (let col = 0; col <= gridSize; col++) {
        // Vertical line
        verticalRow.push(
          <LineButton
            key={`v-${row}-${col}`}
            type="vertical"
            owner={board.verticalLines[row][col]}
            isLastMove={isLastMove(row, col, "vertical")}
            disabled={disabled}
            onClick={() => onLineClick(row, col, "vertical")}
            gridSize={gridSize}
          />
        );
        // Box cell (except after the last vertical line)
        if (col < gridSize) {
          verticalRow.push(
            <BoxCell
              key={`box-${row}-${col}`}
              owner={board.boxes[row][col]}
              gridSize={gridSize}
            />
          );
        }
      }

      rows.push(
        <div
          key={`v-row-${row}`}
          className="flex items-center justify-center gap-0"
        >
          {verticalRow}
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-0">
      {rows}
    </div>
  );
}
