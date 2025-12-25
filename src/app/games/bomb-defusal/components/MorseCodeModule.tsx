"use client";

import { MorseCodeModuleState } from "../types";
import { formatFrequency } from "../logic/morseCodeLogic";
import { MORSE_FREQUENCY_STEP } from "../constants";

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
    <div className="bg-gray-800 rounded-lg p-4 w-full max-w-xs">
      <h3 className="text-white text-center font-bold mb-4">MORSE CODE</h3>

      {/* Light indicator */}
      <div className="flex justify-center mb-4">
        <div
          className={`
            w-8 h-8 rounded-full transition-all duration-75
            ${isLightOn
              ? "bg-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.9)]"
              : "bg-gray-700 border border-gray-600"
            }
          `}
        />
      </div>

      {/* Frequency display */}
      <div className="bg-gray-900 rounded p-3 mb-4">
        <p className="text-gray-400 text-xs text-center mb-2">TX Frequency</p>
        <div className="text-center">
          <span className="text-xl font-mono font-bold text-green-400">
            {formatFrequency(module.currentFrequency)}
          </span>
        </div>
      </div>

      {/* Frequency controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={onFrequencyDown}
          disabled={disabled || module.status !== "unsolved"}
          className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded font-bold disabled:opacity-50"
        >
          - {MORSE_FREQUENCY_STEP * 1000} kHz
        </button>
        <button
          onClick={onFrequencyUp}
          disabled={disabled || module.status !== "unsolved"}
          className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded font-bold disabled:opacity-50"
        >
          + {MORSE_FREQUENCY_STEP * 1000} kHz
        </button>
      </div>

      {/* Submit button */}
      <button
        onClick={onSubmit}
        disabled={disabled || module.status !== "unsolved"}
        className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        TX
      </button>

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
