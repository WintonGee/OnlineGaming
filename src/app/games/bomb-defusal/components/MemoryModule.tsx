"use client";

import { MemoryModuleState } from "../types";
import { cn } from "@/lib/utils/cn";

interface MemoryModuleProps {
  module: MemoryModuleState;
  onButtonPress: (position: 1 | 2 | 3 | 4) => void;
  disabled: boolean;
}

export function MemoryModule({ module, onButtonPress, disabled }: MemoryModuleProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 border-2 border-gray-300 dark:border-gray-700">
      <h3 className="text-black dark:text-white text-center font-semibold text-sm uppercase tracking-wide mb-2">
        Memory
      </h3>

      <p className="text-gray-500 dark:text-gray-400 text-center text-xs mb-4">
        Stage {module.currentStage} of 5
      </p>

      {/* Display number */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
          <span className="text-3xl font-bold text-black dark:text-white font-mono">
            {module.displayNumber}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        {module.buttonLabels.map((label, index) => (
          <button
            key={index}
            onClick={() => !disabled && onButtonPress((index + 1) as 1 | 2 | 3 | 4)}
            disabled={disabled || module.status !== "unsolved"}
            className={cn(
              "h-12 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg",
              "font-bold text-black dark:text-white text-lg transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Position labels */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-400 dark:text-gray-500 mb-4">
        <span>Pos 1</span>
        <span>Pos 2</span>
        <span>Pos 3</span>
        <span>Pos 4</span>
      </div>

      {/* Stage progress */}
      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((stage) => (
          <div
            key={stage}
            className={cn(
              "w-3 h-3 rounded-full",
              stage < module.currentStage
                ? "bg-green-500"
                : stage === module.currentStage
                ? "bg-yellow-500"
                : "bg-gray-300 dark:bg-gray-600"
            )}
          />
        ))}
      </div>

      {module.status === "solved" && (
        <div className="mt-3 text-green-600 dark:text-green-400 text-center text-sm font-semibold uppercase tracking-wide">
          Defused
        </div>
      )}
      {module.status === "strike" && (
        <div className="mt-3 text-red-600 dark:text-red-400 text-center text-sm font-semibold uppercase tracking-wide">
          Strike!
        </div>
      )}
    </div>
  );
}
