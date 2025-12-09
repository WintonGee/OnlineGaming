"use client";

import { memo, useRef } from "react";
import { Position, Direction } from "../types";
import { cn } from "@/lib/utils/cn";
import { useSwipeInput } from "@/lib/hooks/useSwipeInput";

interface SnakeGameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
  gameOver: boolean;
  isRunning: boolean;
  onMove: (direction: Direction) => void;
}

function SnakeGameBoard({
  snake,
  food,
  gridSize,
  gameOver,
  isRunning,
  onMove,
}: SnakeGameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  // Handle swipe input for mobile
  useSwipeInput({
    onMove,
    enabled: !gameOver,
    elementRef: boardRef,
    threshold: 30,
  });

  // Create a set for quick snake position lookup
  const snakePositions = new Set(snake.map((p) => `${p.row},${p.col}`));
  const headPosition = snake[0] ? `${snake[0].row},${snake[0].col}` : "";

  // Calculate cell size based on grid size
  const getCellSizeClass = () => {
    if (gridSize <= 10) return "w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10";
    if (gridSize <= 15) return "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7";
    return "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6";
  };

  const cellSizeClass = getCellSizeClass();

  return (
    <div
      ref={boardRef}
      className={cn(
        "relative inline-block p-2 sm:p-3 rounded-lg",
        "bg-gray-100 dark:bg-gray-900",
        "border-2 border-gray-300 dark:border-gray-700",
        "touch-none select-none"
      )}
    >
      {/* Start overlay */}
      {!isRunning && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-10">
          <div className="text-center text-white">
            <p className="text-lg sm:text-xl font-bold mb-2">Press Arrow Keys</p>
            <p className="text-sm sm:text-base opacity-80">or swipe to start</p>
          </div>
        </div>
      )}

      {/* Grid */}
      <div
        className="grid gap-0.5"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;
          const posKey = `${row},${col}`;

          const isSnakeHead = posKey === headPosition;
          const isSnakeBody = !isSnakeHead && snakePositions.has(posKey);
          const isFood = row === food.row && col === food.col;

          return (
            <div
              key={posKey}
              className={cn(
                cellSizeClass,
                "rounded-sm transition-colors duration-75",
                // Default cell
                !isSnakeHead &&
                  !isSnakeBody &&
                  !isFood &&
                  "bg-gray-200 dark:bg-gray-800",
                // Snake head
                isSnakeHead && "bg-green-600 dark:bg-green-500 rounded-md",
                // Snake body
                isSnakeBody && "bg-green-500 dark:bg-green-400",
                // Food
                isFood && "bg-red-500 dark:bg-red-400 rounded-full animate-pulse"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

export default memo(SnakeGameBoard);
