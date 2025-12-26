"use client";

import { cn } from "@/lib/utils/cn";
import { RoundRecord, RoundResult } from "../types";
import { ChoiceIcon } from "./ChoiceButton";
import { HISTORY_DISPLAY_COUNT } from "../constants";

interface HistoryStripProps {
  history: RoundRecord[];
}

const RESULT_COLORS: Record<RoundResult, string> = {
  win: "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700",
  lose: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700",
  tie: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700",
};

const RESULT_TEXT_COLORS: Record<RoundResult, string> = {
  win: "text-green-600 dark:text-green-400",
  lose: "text-red-600 dark:text-red-400",
  tie: "text-yellow-600 dark:text-yellow-400",
};

export default function HistoryStrip({ history }: HistoryStripProps) {
  // Take only the most recent rounds
  const displayHistory = history.slice(0, HISTORY_DISPLAY_COUNT);

  if (displayHistory.length === 0) {
    return (
      <div className="flex items-center justify-center h-16 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No rounds played yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-hide">
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium shrink-0 mr-1">
        Recent:
      </span>
      {displayHistory.map((round, index) => (
        <div
          key={round.timestamp}
          className={cn(
            "flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-all duration-300",
            RESULT_COLORS[round.result],
            index === 0 && "animate-slide-in"
          )}
          style={{
            opacity: 1 - index * 0.1,
          }}
        >
          {/* Player choice icon */}
          <div className={cn("w-5 h-5", RESULT_TEXT_COLORS[round.result])}>
            <ChoiceIcon choice={round.playerChoice} />
          </div>

          {/* VS indicator */}
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
            vs
          </span>

          {/* AI choice icon */}
          <div className="w-5 h-5 text-gray-500 dark:text-gray-400">
            <ChoiceIcon choice={round.aiChoice} />
          </div>
        </div>
      ))}
    </div>
  );
}
