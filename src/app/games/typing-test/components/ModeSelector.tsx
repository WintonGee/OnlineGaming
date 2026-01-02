"use client";

import { cn } from "@/lib/utils/cn";
import { TIME_OPTIONS, WORD_COUNT_OPTIONS } from "../constants";
import { TimeOption, WordCountOption } from "../types";

interface ModeSelectorProps {
  mode: "time" | "words";
  timeLimit: number;
  wordCount: number;
  onModeChange: (mode: "time" | "words") => void;
  onTimeLimitChange: (time: number) => void;
  onWordCountChange: (count: number) => void;
  disabled?: boolean;
}

export default function ModeSelector({
  mode,
  timeLimit,
  wordCount,
  onModeChange,
  onTimeLimitChange,
  onWordCountChange,
  disabled = false,
}: ModeSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Mode Toggle Pills */}
      <div className="inline-flex rounded-full bg-gray-200 dark:bg-gray-800 p-1">
        <button
          onClick={() => onModeChange("time")}
          disabled={disabled}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
            mode === "time"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          Time
        </button>
        <button
          onClick={() => onModeChange("words")}
          disabled={disabled}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
            mode === "words"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          Words
        </button>
      </div>

      {/* Option Pills - Time Options */}
      {mode === "time" && (
        <div className="flex flex-wrap justify-center gap-2">
          {TIME_OPTIONS.map((time) => (
            <button
              key={time}
              onClick={() => onTimeLimitChange(time)}
              disabled={disabled}
              className={cn(
                "px-3 py-1 text-sm font-medium rounded-full border transition-all",
                timeLimit === time
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:border-gray-500",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {time}s
            </button>
          ))}
        </div>
      )}

      {/* Option Pills - Word Count Options */}
      {mode === "words" && (
        <div className="flex flex-wrap justify-center gap-2">
          {WORD_COUNT_OPTIONS.map((count) => (
            <button
              key={count}
              onClick={() => onWordCountChange(count)}
              disabled={disabled}
              className={cn(
                "px-3 py-1 text-sm font-medium rounded-full border transition-all",
                wordCount === count
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:border-gray-500",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {count}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
