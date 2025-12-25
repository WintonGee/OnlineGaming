"use client";

import { PasswordModuleState } from "../types";
import { ChevronUp, ChevronDown } from "lucide-react";

interface PasswordModuleProps {
  module: PasswordModuleState;
  onCycleUp: (columnIndex: number) => void;
  onCycleDown: (columnIndex: number) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export function PasswordModule({
  module,
  onCycleUp,
  onCycleDown,
  onSubmit,
  disabled,
}: PasswordModuleProps) {
  const currentWord = module.currentIndices.map((idx, col) => module.columns[col][idx]).join("");

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-full max-w-xs">
      <h3 className="text-white text-center font-bold mb-4">PASSWORD</h3>

      {/* Letter columns */}
      <div className="flex justify-center gap-1 mb-4">
        {module.columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col items-center">
            {/* Up button */}
            <button
              onClick={() => !disabled && onCycleUp(colIndex)}
              disabled={disabled || module.status !== "unsolved"}
              className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
            >
              <ChevronUp size={20} />
            </button>

            {/* Letter display */}
            <div className="w-10 h-12 bg-gray-900 rounded flex items-center justify-center border border-gray-600">
              <span className="text-2xl font-mono font-bold text-green-400">
                {column[module.currentIndices[colIndex]]}
              </span>
            </div>

            {/* Down button */}
            <button
              onClick={() => !disabled && onCycleDown(colIndex)}
              disabled={disabled || module.status !== "unsolved"}
              className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Submit button */}
      <button
        onClick={() => !disabled && onSubmit()}
        disabled={disabled || module.status !== "unsolved"}
        className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        SUBMIT
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
