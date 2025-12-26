"use client";

import { cn } from "@/lib/utils/cn";
import { RoundRecord, RoundResult } from "../types";
import { ChoiceIcon } from "./ChoiceButton";
import { HISTORY_DISPLAY_COUNT, CHOICE_LABELS } from "../constants";

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

const RESULT_LABELS: Record<RoundResult, string> = {
  win: "Won",
  lose: "Lost",
  tie: "Tied",
};

export default function HistoryStrip({ history }: HistoryStripProps) {
  // Take only the most recent rounds
  const displayHistory = history.slice(0, HISTORY_DISPLAY_COUNT);

  if (displayHistory.length === 0) {
    return null;
  }

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-hide"
      role="list"
      aria-label="Recent game history"
    >
      <span
        className="text-xs text-gray-500 dark:text-gray-400 font-medium shrink-0 mr-1"
        aria-hidden="true"
      >
        Recent:
      </span>
      {displayHistory.map((round, index) => (
        <div
          key={`${round.timestamp}-${index}`}
          role="listitem"
          aria-label={`${RESULT_LABELS[round.result]}: You played ${CHOICE_LABELS[round.playerChoice]}, AI played ${CHOICE_LABELS[round.aiChoice]}`}
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
          <div
            className={cn("w-5 h-5", RESULT_TEXT_COLORS[round.result])}
            aria-hidden="true"
          >
            <ChoiceIcon choice={round.playerChoice} />
          </div>

          {/* VS indicator */}
          <span
            className="text-[10px] text-gray-400 dark:text-gray-500 font-medium"
            aria-hidden="true"
          >
            vs
          </span>

          {/* AI choice icon */}
          <div className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true">
            <ChoiceIcon choice={round.aiChoice} />
          </div>
        </div>
      ))}
    </div>
  );
}
