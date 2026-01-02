"use client";

import { cn } from "@/lib/utils/cn";
import { TestStats, TestResult } from "../types";
import { RESULT_ANIMATION_DURATION } from "../constants";

interface ResultsDisplayProps {
  stats: TestStats;
  personalBest?: TestResult;
  isNewRecord: boolean;
}

function StatCard({
  label,
  value,
  unit,
  color,
  large = false,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color?: "green" | "red" | "yellow" | "blue";
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center",
        large && "col-span-2 sm:col-span-1"
      )}
    >
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </div>
      <div
        className={cn(
          "font-bold font-mono",
          large ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl",
          color === "green" && "text-green-500 dark:text-green-400",
          color === "red" && "text-red-500 dark:text-red-400",
          color === "yellow" && "text-yellow-500 dark:text-yellow-400",
          color === "blue" && "text-blue-500 dark:text-blue-400",
          !color && "text-black dark:text-white"
        )}
      >
        {value}
        {unit && (
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function CharBreakdownItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "green" | "red" | "yellow" | "gray";
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span
        className={cn(
          "font-mono font-medium",
          color === "green" && "text-green-500 dark:text-green-400",
          color === "red" && "text-red-500 dark:text-red-400",
          color === "yellow" && "text-yellow-500 dark:text-yellow-400",
          color === "gray" && "text-gray-500 dark:text-gray-400"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function ResultsDisplay({
  stats,
  personalBest,
  isNewRecord,
}: ResultsDisplayProps) {
  const getAccuracyColor = (): "green" | "yellow" | "red" => {
    if (stats.accuracy >= 95) return "green";
    if (stats.accuracy >= 85) return "yellow";
    return "red";
  };

  const getConsistencyColor = (): "green" | "yellow" | "red" => {
    if (stats.consistency >= 90) return "green";
    if (stats.consistency >= 75) return "yellow";
    return "red";
  };

  return (
    <div
      className="w-full max-w-md mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDuration: `${RESULT_ANIMATION_DURATION}ms` }}
    >
      {/* New Record Banner */}
      {isNewRecord && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 text-white rounded-lg px-4 py-2 text-center font-bold shadow-lg animate-pulse">
          New Personal Best!
        </div>
      )}

      {/* Primary Stats - WPM prominent */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="WPM" value={Math.round(stats.wpm)} large color="blue" />
        <StatCard
          label="Raw WPM"
          value={Math.round(stats.rawWpm)}
          color={stats.rawWpm > stats.wpm ? "yellow" : undefined}
        />
        <StatCard
          label="Accuracy"
          value={`${stats.accuracy.toFixed(1)}%`}
          color={getAccuracyColor()}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Consistency"
          value={`${stats.consistency.toFixed(0)}%`}
          color={getConsistencyColor()}
        />
        <StatCard
          label="Characters"
          value={stats.totalChars}
        />
      </div>

      {/* Character Breakdown */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Character Breakdown
        </h4>
        <div className="space-y-2">
          <CharBreakdownItem
            label="Correct"
            value={stats.correctChars}
            color="green"
          />
          <CharBreakdownItem
            label="Incorrect"
            value={stats.incorrectChars}
            color="red"
          />
          <CharBreakdownItem
            label="Extra"
            value={stats.extraChars}
            color="yellow"
          />
          <CharBreakdownItem
            label="Missed"
            value={stats.missedChars}
            color="gray"
          />
        </div>
      </div>

      {/* Word Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Correct Words"
          value={stats.correctWords}
          color="green"
        />
        <StatCard
          label="Incorrect Words"
          value={stats.incorrectWords}
          color={stats.incorrectWords > 0 ? "red" : undefined}
        />
      </div>

      {/* Personal Best Comparison */}
      {personalBest && !isNewRecord && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Personal Best
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold font-mono text-black dark:text-white">
                {Math.round(personalBest.wpm)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                WPM
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {personalBest.accuracy.toFixed(1)}% accuracy
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            {stats.wpm < personalBest.wpm
              ? `${Math.round(personalBest.wpm - stats.wpm)} WPM below your best`
              : "Matched your personal best!"}
          </div>
        </div>
      )}

      {/* Restart Hint */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Press <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">Tab</kbd> or click to restart
      </p>
    </div>
  );
}
