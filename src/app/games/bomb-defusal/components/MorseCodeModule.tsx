"use client";

import { MorseCodeModuleState } from "../types";
import { formatFrequency } from "../logic/morseCodeLogic";
import { MORSE_FREQUENCY_STEP } from "../constants";
import { cn } from "@/lib/utils/cn";

interface MorseCodeModuleProps {
  module: MorseCodeModuleState;
  isLightOn: boolean;
  onFrequencyUp: () => void;
  onFrequencyDown: () => void;
  onSubmit: () => void;
  disabled: boolean;
}

export function MorseCodeModule({
  module,
  isLightOn,
  onFrequencyUp,
  onFrequencyDown,
  onSubmit,
  disabled,
}: MorseCodeModuleProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 border-2 border-gray-300 dark:border-gray-700">
      <h3 className="text-black dark:text-white text-center font-semibold text-sm uppercase tracking-wide mb-4">
        Morse Code
      </h3>

      {/* Light indicator */}
      <div className="flex justify-center mb-4">
        <div
          className={cn(
            "w-8 h-8 rounded-full transition-all duration-75",
            isLightOn
              ? "bg-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.9)]"
              : "bg-gray-300 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600"
          )}
        />
      </div>

      {/* Frequency display */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-3 mb-4 border border-gray-300 dark:border-gray-600">
        <p className="text-gray-500 dark:text-gray-400 text-xs text-center mb-2 uppercase tracking-wide">
          TX Frequency
        </p>
        <div className="text-center">
          <span className="text-xl font-mono font-bold text-black dark:text-white">
            {formatFrequency(module.currentFrequency)}
          </span>
        </div>
      </div>

      {/* Frequency controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={onFrequencyDown}
          disabled={disabled || module.status !== "unsolved"}
          className={cn(
            "flex-1 py-2 rounded-lg font-medium text-sm transition-colors",
            "bg-gray-200 dark:bg-gray-800 text-black dark:text-white",
            "hover:bg-gray-300 dark:hover:bg-gray-700",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          - {MORSE_FREQUENCY_STEP * 1000} kHz
        </button>
        <button
          onClick={onFrequencyUp}
          disabled={disabled || module.status !== "unsolved"}
          className={cn(
            "flex-1 py-2 rounded-lg font-medium text-sm transition-colors",
            "bg-gray-200 dark:bg-gray-800 text-black dark:text-white",
            "hover:bg-gray-300 dark:hover:bg-gray-700",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          + {MORSE_FREQUENCY_STEP * 1000} kHz
        </button>
      </div>

      {/* Submit button */}
      <button
        onClick={onSubmit}
        disabled={disabled || module.status !== "unsolved"}
        className={cn(
          "w-full py-2 rounded-full font-semibold text-sm uppercase tracking-wide transition-colors",
          "bg-black dark:bg-white text-white dark:text-black",
          "hover:bg-gray-800 dark:hover:bg-gray-200",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        TX
      </button>

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
