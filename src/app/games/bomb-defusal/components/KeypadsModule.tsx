"use client";

import { KeypadsModuleState } from "../types";
import { getSymbolDisplay } from "../utils/display";
import { cn } from "@/lib/utils/cn";

interface KeypadsModuleProps {
  module: KeypadsModuleState;
  onPress: (position: number) => void;
  disabled?: boolean;
}

export function KeypadsModule({ module, onPress, disabled }: KeypadsModuleProps) {
  const isSolved = module.status === "solved";
  const isStrike = module.status === "strike";

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
          Keypads
        </h3>
        <div
          className={cn(
            "w-3 h-3 rounded-full",
            isSolved ? "bg-green-500" : "bg-gray-400 dark:bg-gray-600"
          )}
        />
      </div>

      {/* Keypad grid - 2x2 */}
      <div className="grid grid-cols-2 gap-2">
        {module.buttons.map((button) => (
          <button
            key={button.position}
            onClick={() => !disabled && !button.pressed && onPress(button.position)}
            disabled={disabled || button.pressed}
            className={cn(
              "aspect-square rounded-lg flex items-center justify-center text-3xl font-bold transition-all",
              "border-2 hover:scale-105 active:scale-95",
              button.pressed
                ? "bg-green-500 border-green-600 text-white cursor-default"
                : disabled
                ? "bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 dark:bg-gray-800 border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer"
            )}
          >
            {getSymbolDisplay(button.symbol)}
          </button>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="mt-3 flex justify-center gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              i < module.currentPressIndex
                ? "bg-green-500"
                : "bg-gray-300 dark:bg-gray-600"
            )}
          />
        ))}
      </div>
    </div>
  );
}
