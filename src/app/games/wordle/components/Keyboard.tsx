"use client";

import { LetterStatus } from "../types";
import { KEYBOARD_ROWS } from "../constants";
import { Delete } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  keyStatuses: Map<string, LetterStatus>;
  disabled?: boolean;
}

export default function Keyboard({
  onKeyPress,
  onEnter,
  onBackspace,
  keyStatuses,
  disabled = false,
}: KeyboardProps) {
  const getKeyClassName = (key: string): string => {
    if (key === "ENTER" || key === "BACKSPACE") {
      return cn(
        "flex-[1.5] min-w-0 max-w-[66px] py-4 rounded font-semibold text-xs sm:text-sm flex items-center justify-center",
        "bg-gray-300 dark:bg-gray-600",
        "hover:bg-gray-400 dark:hover:bg-gray-500",
        "transition-colors duration-150",
        disabled && "opacity-50 cursor-not-allowed"
      );
    }

    const status = keyStatuses.get(key) || "unused";

    const baseClasses = "flex-1 min-w-0 max-w-[44px] py-4 rounded font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center";

    const statusClasses = {
      correct: "bg-green-500 dark:bg-green-600 text-white",
      present: "bg-yellow-500 dark:bg-yellow-600 text-white",
      absent: "bg-gray-400 dark:bg-gray-700 text-white",
      unused: "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500",
    };

    return cn(
      baseClasses,
      statusClasses[status],
      disabled && "opacity-50 cursor-not-allowed"
    );
  };

  const handleClick = (key: string) => {
    if (disabled) return;

    if (key === "ENTER") {
      onEnter();
    } else if (key === "BACKSPACE") {
      onBackspace();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="space-y-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleClick(key)}
                className={getKeyClassName(key)}
                disabled={disabled}
                aria-label={key === "BACKSPACE" ? "Delete" : key === "ENTER" ? "Enter" : key}
              >
                {key === "BACKSPACE" ? (
                  <Delete className="w-5 h-5" />
                ) : key === "ENTER" ? (
                  "ENTER"
                ) : (
                  key
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
