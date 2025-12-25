"use client";

import { MemoryModuleState } from "../types";

interface MemoryModuleProps {
  module: MemoryModuleState;
  onButtonPress: (position: 1 | 2 | 3 | 4) => void;
  disabled: boolean;
}

export function MemoryModule({ module, onButtonPress, disabled }: MemoryModuleProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 w-full max-w-xs">
      <h3 className="text-white text-center font-bold mb-2">MEMORY</h3>

      <p className="text-gray-400 text-center text-xs mb-4">
        Stage {module.currentStage} of 5
      </p>

      {/* Display number */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center border-2 border-gray-600">
          <span className="text-3xl font-bold text-green-400 font-mono">
            {module.displayNumber}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {module.buttonLabels.map((label, index) => (
          <button
            key={index}
            onClick={() => !disabled && onButtonPress((index + 1) as 1 | 2 | 3 | 4)}
            disabled={disabled || module.status !== "unsolved"}
            className={`
              h-12 bg-gray-600 hover:bg-gray-500 rounded-lg
              font-bold text-white text-lg transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Position labels */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-500">
        <span>Pos 1</span>
        <span>Pos 2</span>
        <span>Pos 3</span>
        <span>Pos 4</span>
      </div>

      {/* Stage progress */}
      <div className="flex justify-center gap-1 mt-4">
        {[1, 2, 3, 4, 5].map((stage) => (
          <div
            key={stage}
            className={`w-3 h-3 rounded-full ${
              stage < module.currentStage
                ? "bg-green-400"
                : stage === module.currentStage
                ? "bg-yellow-400"
                : "bg-gray-600"
            }`}
          />
        ))}
      </div>

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
