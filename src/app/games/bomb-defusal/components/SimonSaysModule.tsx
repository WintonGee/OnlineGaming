"use client";

import { SimonSaysModuleState, SimonColor } from "../types";
import { cn } from "@/lib/utils/cn";

const SIMON_COLORS: Record<SimonColor, { base: string; active: string; flash: string }> = {
  red: {
    base: "bg-red-800 dark:bg-red-900",
    active: "bg-red-500",
    flash: "bg-red-400 shadow-[0_0_20px_rgba(239,68,68,0.8)]",
  },
  blue: {
    base: "bg-blue-800 dark:bg-blue-900",
    active: "bg-blue-500",
    flash: "bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.8)]",
  },
  green: {
    base: "bg-green-800 dark:bg-green-900",
    active: "bg-green-500",
    flash: "bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.8)]",
  },
  yellow: {
    base: "bg-yellow-700 dark:bg-yellow-800",
    active: "bg-yellow-400",
    flash: "bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.8)]",
  },
};

const BUTTON_ORDER: SimonColor[] = ["red", "blue", "green", "yellow"];

interface SimonSaysModuleProps {
  module: SimonSaysModuleState;
  onColorPress: (color: SimonColor) => void;
  onStartSequence: () => void;
  disabled: boolean;
}

export function SimonSaysModule({
  module,
  onColorPress,
  onStartSequence,
  disabled,
}: SimonSaysModuleProps) {
  const isFlashing = module.isFlashing;
  const canInput = !isFlashing && module.status === "unsolved";

  // Get the current flashing color
  const flashingColor =
    isFlashing && module.currentFlashIndex >= 0
      ? module.sequence[module.currentFlashIndex]
      : null;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 border-2 border-gray-300 dark:border-gray-700">
      <h3 className="text-black dark:text-white text-center font-semibold text-sm uppercase tracking-wide mb-2">
        Simon Says
      </h3>

      <p className="text-gray-500 dark:text-gray-400 text-center text-xs mb-4">
        Stage {module.currentStage + 1} of {module.totalStages}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {BUTTON_ORDER.map((color) => {
          const isFlashingThis = flashingColor === color;
          const colors = SIMON_COLORS[color];

          return (
            <button
              key={color}
              onClick={() => canInput && onColorPress(color)}
              disabled={disabled || !canInput}
              className={cn(
                "h-16 rounded-lg transition-all duration-100",
                isFlashingThis ? colors.flash : colors.base,
                canInput && !disabled && "hover:brightness-125 cursor-pointer",
                (disabled || !canInput) && "cursor-not-allowed",
                disabled && "opacity-50"
              )}
            />
          );
        })}
      </div>

      {/* Start button */}
      {!isFlashing && module.playerInput.length === 0 && module.status === "unsolved" && (
        <button
          onClick={onStartSequence}
          disabled={disabled}
          className="w-full py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-black dark:text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
        >
          Start Sequence
        </button>
      )}

      {/* Progress indicator */}
      {!isFlashing && module.playerInput.length > 0 && (
        <div className="flex justify-center gap-1 mt-2">
          {Array.from({ length: module.currentStage + 1 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                i < module.playerInput.length ? "bg-green-500" : "bg-gray-400 dark:bg-gray-600"
              )}
            />
          ))}
        </div>
      )}

      {module.status === "solved" && (
        <div className="mt-2 text-green-600 dark:text-green-400 text-center text-sm font-semibold uppercase tracking-wide">
          Defused
        </div>
      )}
      {module.status === "strike" && (
        <div className="mt-2 text-red-600 dark:text-red-400 text-center text-sm font-semibold uppercase tracking-wide">
          Strike!
        </div>
      )}
    </div>
  );
}
