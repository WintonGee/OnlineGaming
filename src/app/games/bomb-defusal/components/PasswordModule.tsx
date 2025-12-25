"use client";

import { PasswordModuleState } from "../types";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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
  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 border-2 border-gray-300 dark:border-gray-700">
      <h3 className="text-black dark:text-white text-center font-semibold text-sm uppercase tracking-wide mb-4">
        Password
      </h3>

      {/* Letter columns */}
      <div className="flex justify-center gap-1 mb-4">
        {module.columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col items-center">
            {/* Up button */}
            <button
              onClick={() => !disabled && onCycleUp(colIndex)}
              disabled={disabled || module.status !== "unsolved"}
              className="p-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-50 transition-colors"
            >
              <ChevronUp size={20} />
            </button>

            {/* Letter display */}
            <div className="w-10 h-12 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
              <span className="text-2xl font-mono font-bold text-black dark:text-white">
                {column[module.currentIndices[colIndex]]}
              </span>
            </div>

            {/* Down button */}
            <button
              onClick={() => !disabled && onCycleDown(colIndex)}
              disabled={disabled || module.status !== "unsolved"}
              className="p-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-50 transition-colors"
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
        className={cn(
          "w-full py-2 rounded-full font-semibold text-sm uppercase tracking-wide transition-colors",
          "bg-black dark:bg-white text-white dark:text-black",
          "hover:bg-gray-800 dark:hover:bg-gray-200",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        Submit
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
