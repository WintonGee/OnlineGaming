"use client";

import { SimonSaysModuleState, SimonColor } from "../types";

const SIMON_COLORS: Record<SimonColor, { base: string; active: string; flash: string }> = {
  red: {
    base: "bg-red-800",
    active: "bg-red-500",
    flash: "bg-red-400 shadow-[0_0_20px_rgba(239,68,68,0.8)]",
  },
  blue: {
    base: "bg-blue-800",
    active: "bg-blue-500",
    flash: "bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.8)]",
  },
  green: {
    base: "bg-green-800",
    active: "bg-green-500",
    flash: "bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.8)]",
  },
  yellow: {
    base: "bg-yellow-700",
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
    <div className="bg-gray-800 rounded-lg p-4 w-full max-w-xs">
      <h3 className="text-white text-center font-bold mb-2">SIMON SAYS</h3>

      <p className="text-gray-400 text-center text-xs mb-4">
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
              className={`
                h-16 rounded-lg transition-all duration-100
                ${isFlashingThis ? colors.flash : colors.base}
                ${canInput && !disabled ? `hover:${colors.active} cursor-pointer` : "cursor-not-allowed"}
                ${disabled ? "opacity-50" : ""}
              `}
            />
          );
        })}
      </div>

      {/* Start button */}
      {!isFlashing && module.playerInput.length === 0 && module.status === "unsolved" && (
        <button
          onClick={onStartSequence}
          disabled={disabled}
          className="w-full py-2 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm disabled:opacity-50"
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
              className={`w-2 h-2 rounded-full ${
                i < module.playerInput.length ? "bg-green-400" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      )}

      {module.status === "solved" && (
        <div className="mt-2 text-green-400 text-center text-sm font-bold">
          DEFUSED
        </div>
      )}
      {module.status === "strike" && (
        <div className="mt-2 text-red-400 text-center text-sm font-bold">
          STRIKE!
        </div>
      )}
    </div>
  );
}
