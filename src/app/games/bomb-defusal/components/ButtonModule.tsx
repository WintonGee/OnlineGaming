"use client";

import { ButtonModuleState, ButtonColor, StripColor } from "../types";
import { getReleaseDigit } from "../logic/buttonLogic";

const BUTTON_COLORS: Record<ButtonColor, string> = {
  red: "bg-red-500 hover:bg-red-600",
  blue: "bg-blue-500 hover:bg-blue-600",
  yellow: "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
  white: "bg-white hover:bg-gray-100 text-gray-900",
};

const STRIP_COLORS: Record<StripColor, string> = {
  blue: "bg-blue-500",
  yellow: "bg-yellow-400",
  white: "bg-white",
  red: "bg-red-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
};

interface ButtonModuleProps {
  module: ButtonModuleState;
  onPress: () => void;
  onRelease: () => void;
  disabled: boolean;
  currentTime: string;
}

export function ButtonModule({ module, onPress, onRelease, disabled, currentTime }: ButtonModuleProps) {
  const releaseDigit = module.stripColor ? getReleaseDigit(module.stripColor) : null;

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-full max-w-xs">
      <h3 className="text-white text-center font-bold mb-4">THE BUTTON</h3>

      <div className="flex flex-col items-center gap-4">
        {/* Main button */}
        <button
          onMouseDown={() => !disabled && onPress()}
          onMouseUp={() => !disabled && onRelease()}
          onMouseLeave={() => module.isHolding && !disabled && onRelease()}
          onTouchStart={() => !disabled && onPress()}
          onTouchEnd={() => !disabled && onRelease()}
          disabled={disabled}
          className={`
            w-24 h-24 rounded-full font-bold text-lg shadow-lg
            transition-transform active:scale-95
            ${BUTTON_COLORS[module.buttonColor]}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${module.isHolding ? "scale-95" : ""}
          `}
        >
          {module.buttonText}
        </button>

        {/* Strip indicator (shows when holding) */}
        {module.isHolding && module.stripColor && (
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-16 h-4 rounded ${STRIP_COLORS[module.stripColor]} animate-pulse`}
            />
            <p className="text-gray-400 text-xs">
              Release when timer has a{" "}
              <span className="text-white font-bold">{releaseDigit}</span>
            </p>
            <p className="text-gray-500 text-xs">Current: {currentTime}</p>
          </div>
        )}
      </div>

      {module.status === "solved" && (
        <div className="mt-4 text-green-400 text-center text-sm font-bold">
          DEFUSED
        </div>
      )}
      {module.status === "strike" && (
        <div className="mt-4 text-red-400 text-center text-sm font-bold">
          STRIKE!
        </div>
      )}
    </div>
  );
}
