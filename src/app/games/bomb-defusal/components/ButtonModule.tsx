"use client";

import { ButtonModuleState, ButtonColor, StripColor } from "../types";
import { getReleaseDigit } from "../utils/display";
import { cn } from "@/lib/utils/cn";

const BUTTON_COLORS: Record<ButtonColor, string> = {
  red: "bg-red-500 hover:bg-red-600 text-white",
  blue: "bg-blue-500 hover:bg-blue-600 text-white",
  yellow: "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
  white: "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300",
};

const STRIP_COLORS: Record<StripColor, string> = {
  blue: "bg-blue-500",
  yellow: "bg-yellow-400",
  white: "bg-white border border-gray-300",
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
    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 border-2 border-gray-300 dark:border-gray-700">
      <h3 className="text-black dark:text-white text-center font-semibold text-sm uppercase tracking-wide mb-4">
        The Button
      </h3>

      <div className="flex flex-col items-center gap-4">
        {/* Main button */}
        <button
          onMouseDown={() => !disabled && onPress()}
          onMouseUp={() => !disabled && onRelease()}
          onMouseLeave={() => module.isHolding && !disabled && onRelease()}
          onTouchStart={() => !disabled && onPress()}
          onTouchEnd={() => !disabled && onRelease()}
          disabled={disabled}
          className={cn(
            "w-24 h-24 rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95",
            BUTTON_COLORS[module.buttonColor],
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            module.isHolding && "scale-95"
          )}
        >
          {module.buttonText}
        </button>

        {/* Strip indicator (shows when holding) */}
        {module.isHolding && module.stripColor && (
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn("w-16 h-4 rounded animate-pulse", STRIP_COLORS[module.stripColor])}
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Release when timer has a{" "}
              <span className="text-black dark:text-white font-bold">{releaseDigit}</span>
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs font-mono">
              Current: {currentTime}
            </p>
          </div>
        )}
      </div>

      {module.status === "solved" && (
        <div className="mt-4 text-green-600 dark:text-green-400 text-center text-sm font-semibold uppercase tracking-wide">
          Defused
        </div>
      )}
      {module.status === "strike" && (
        <div className="mt-4 text-red-600 dark:text-red-400 text-center text-sm font-semibold uppercase tracking-wide">
          Strike!
        </div>
      )}
    </div>
  );
}
