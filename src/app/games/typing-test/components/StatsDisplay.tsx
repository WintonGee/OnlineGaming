"use client";

import { cn } from "@/lib/utils/cn";

interface StatsDisplayProps {
  wpm: number;
  accuracy: number;
  elapsedTime: number;
  isActive: boolean;
  mode: "time" | "words";
  timeLimit?: number;
  wordCount?: number;
  currentWordIndex?: number;
}

function StatBox({
  label,
  value,
  unit,
  large = false,
  color,
}: {
  label: string;
  value: string | number;
  unit?: string;
  large?: boolean;
  color?: "green" | "red" | "yellow" | "blue";
}) {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-3 py-2 text-center min-w-[70px] sm:min-w-[80px]">
      <div className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </div>
      <div
        className={cn(
          "font-bold font-mono",
          large ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
          color === "green" && "text-green-500",
          color === "red" && "text-red-500",
          color === "yellow" && "text-yellow-500",
          color === "blue" && "text-blue-500",
          !color && "text-black dark:text-white"
        )}
      >
        {value}
        {unit && (
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-0.5">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function StatsDisplay({
  wpm,
  accuracy,
  elapsedTime,
  isActive,
  mode,
  timeLimit,
  wordCount,
  currentWordIndex = 0,
}: StatsDisplayProps) {
  // Calculate time remaining for time mode
  const timeRemaining =
    mode === "time" && timeLimit ? Math.max(0, timeLimit - elapsedTime) : 0;

  // Calculate words remaining for words mode
  const wordsRemaining =
    mode === "words" && wordCount
      ? Math.max(0, wordCount - currentWordIndex)
      : 0;

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return `${secs}`;
  };

  // Determine accuracy color
  const getAccuracyColor = (): "green" | "yellow" | "red" | undefined => {
    if (!isActive && accuracy === 100) return undefined;
    if (accuracy >= 95) return "green";
    if (accuracy >= 85) return "yellow";
    if (accuracy < 85) return "red";
    return undefined;
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-end">
      {/* WPM - Primary stat, larger */}
      <StatBox
        label="WPM"
        value={Math.round(wpm)}
        large
        color={isActive && wpm > 0 ? "blue" : undefined}
      />

      {/* Accuracy */}
      <StatBox
        label="Accuracy"
        value={`${Math.round(accuracy)}%`}
        color={getAccuracyColor()}
      />

      {/* Time or Words remaining based on mode */}
      {mode === "time" ? (
        <StatBox
          label="Time"
          value={formatTime(isActive ? timeRemaining : timeLimit || 0)}
          unit={timeRemaining < 60 && isActive ? "s" : ""}
          color={isActive && timeRemaining <= 10 ? "red" : undefined}
        />
      ) : (
        <StatBox
          label="Words"
          value={isActive ? wordsRemaining : wordCount || 0}
          color={isActive && wordsRemaining <= 5 ? "yellow" : undefined}
        />
      )}

      {/* Elapsed time - only show during active test */}
      {isActive && mode === "words" && (
        <StatBox label="Elapsed" value={formatTime(elapsedTime)} />
      )}
    </div>
  );
}
