"use client";

import { MazeModuleState } from "../types";
import { getWallsForRendering } from "../logic/mazeLogic";
import { cn } from "@/lib/utils/cn";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface MazeModuleProps {
  module: MazeModuleState;
  onMove: (direction: "up" | "down" | "left" | "right") => void;
  disabled?: boolean;
}

export function MazeModule({ module, onMove, disabled }: MazeModuleProps) {
  const isSolved = module.status === "solved";
  const isStrike = module.status === "strike";
  const wallData = getWallsForRendering(module.mazeIndex);

  return (
    <div
      className={cn(
        "bg-gray-100 dark:bg-gray-900 rounded-xl p-4 border-2 transition-colors",
        isSolved
          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
          : isStrike
          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
          : "border-gray-300 dark:border-gray-700"
      )}
    >
      {/* Module header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Maze
        </h3>
        <div
          className={cn(
            "w-3 h-3 rounded-full",
            isSolved ? "bg-green-500" : "bg-gray-400 dark:bg-gray-600"
          )}
        />
      </div>

      {/* Maze grid */}
      <div className="relative">
        <div
          className="grid gap-0 border-2 border-gray-800 dark:border-gray-200"
          style={{ gridTemplateColumns: "repeat(6, 1fr)" }}
        >
          {wallData.map(({ row, col, walls }) => {
            const isPlayer =
              module.playerPosition.row === row &&
              module.playerPosition.col === col;
            const isGoal =
              module.goalPosition.row === row &&
              module.goalPosition.col === col;
            const isIndicator =
              module.indicators.some(
                (ind) => ind.row === row && ind.col === col
              );

            return (
              <div
                key={`${row}-${col}`}
                className={cn(
                  "w-6 h-6 sm:w-7 sm:h-7 relative flex items-center justify-center",
                  "bg-white dark:bg-gray-800"
                )}
                style={{
                  borderTop: walls.up
                    ? "2px solid"
                    : "1px solid transparent",
                  borderRight: walls.right
                    ? "2px solid"
                    : "1px solid transparent",
                  borderBottom: walls.down
                    ? "2px solid"
                    : "1px solid transparent",
                  borderLeft: walls.left
                    ? "2px solid"
                    : "1px solid transparent",
                  borderColor: "rgb(31, 41, 55)",
                }}
              >
                {/* Indicator circle */}
                {isIndicator && !isPlayer && !isGoal && (
                  <div className="absolute w-2 h-2 rounded-full bg-green-500" />
                )}
                {/* Player position - white square */}
                {isPlayer && (
                  <div className="absolute w-3 h-3 bg-white border-2 border-gray-800" />
                )}
                {/* Goal position - red triangle */}
                {isGoal && (
                  <div
                    className="absolute"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderBottom: "10px solid #ef4444",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Direction controls */}
      <div className="mt-3 flex flex-col items-center gap-1">
        <button
          onClick={() => !disabled && onMove("up")}
          disabled={disabled}
          className={cn(
            "w-8 h-8 rounded flex items-center justify-center transition-colors",
            disabled
              ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
              : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
          )}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div className="flex gap-1">
          <button
            onClick={() => !disabled && onMove("left")}
            disabled={disabled}
            className={cn(
              "w-8 h-8 rounded flex items-center justify-center transition-colors",
              disabled
                ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => !disabled && onMove("down")}
            disabled={disabled}
            className={cn(
              "w-8 h-8 rounded flex items-center justify-center transition-colors",
              disabled
                ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
            )}
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => !disabled && onMove("right")}
            disabled={disabled}
            className={cn(
              "w-8 h-8 rounded flex items-center justify-center transition-colors",
              disabled
                ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
            )}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
